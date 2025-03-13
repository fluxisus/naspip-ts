import ms from "ms";
import { CompleteResult, ConsumeOptions, ProduceOptions, V4 } from "paseto";

import { PasetoTokenData } from "../encoding/protobuf/model";
import { PasetoDecodeResult, TokenPayload } from "../types";
import {
  InvalidPasetoClaim,
  InvalidPasetoPurpose,
  InvalidPasetoToken,
  InvalidPasetoVersion,
} from "./errors";

type AsymetricKey = "paserk";
type PasetoTokenContext = "public";

export class PasetoV4Handler {
  /*

*/

  /**
   * Generate asymetric public/private key
   *
   * @param purpose - Only support "public"
   * @param options - Only support { format: "paserk" }
   *
   * @returns
   * `{ secretKey: string; publicKey: string; }`
   *
   *
   * @example
   * ```ts
   * PasetoV4Handler.generateKey("public", { format: "paserk" });
   *
   * returns
   * {
   *   secretKey: 'k4.secret.ICXpik-1FLvjjvspZuFpzudF2WMkjsmBECOkjlNR6lb7C_pYpZkYoB6wW0RTVQTSKNO2kYrL55lxnctEY6fabw',
   *   publicKey: 'k4.public.-wv6WKWZGKAesFtEU1UE0ijTtpGKy-eZcZ3LRGOn2m8'
   * }
   *
   * ```
   */
  public static async generateKey(
    purpose: PasetoTokenContext,
    options: { format: AsymetricKey },
  ) {
    return V4.generateKey(purpose, options);
  }

  /**
   * Decode paseto token
   *
   * @param token - paseto token
   * @returns
   * `{ ...data, footer: string | Record<string, any> }`
   */

  public decode(token: string): PasetoDecodeResult<TokenPayload> {
    const data = token.split(".");

    if (data.length !== 3 && data.length !== 4) {
      throw new InvalidPasetoToken("token is not a PASETO formatted value");
    }

    const [version, purpose, payload, encodedFooter] = data;

    if (version !== "v4") {
      throw new InvalidPasetoVersion("unsupported PASETO version");
    }

    if (purpose !== "local" && purpose !== "public") {
      throw new InvalidPasetoPurpose("unsupported PASETO purpose");
    }

    const footer = encodedFooter
      ? Buffer.from(encodedFooter, "base64")
      : undefined;

    if (purpose === "local") {
      return {
        footer,
        version,
        purpose,
      };
    }

    let raw;
    try {
      raw = Buffer.from(payload as string, "base64").subarray(0, -64);
    } catch {
      throw new InvalidPasetoToken("token is not a PASETO formatted value");
    }

    const payloadDecoded = PasetoTokenData.decode(raw);

    const payloadToken = PasetoTokenData.toJSON(payloadDecoded) as TokenPayload;

    return {
      footer,
      version,
      purpose,
      payload: payloadToken,
    };
  }

  /**
   *
   * @remarks
   * Claims reserved
   *
   * | Key |    Name        |  Type  |             Example                 |
   *
   * | iss |   Issuer       | string |       {"iss":"paragonie.com"}       |
   *
   * | sub |  Subject       | string |            {"sub":"test"}           |
   *
   * | aud |  Audience      | string |       {"aud":"pie-hosted.com"}      |
   *
   * | exp | Expiration     | DtTime | {"exp":"2039-01-01T00:00:00+00:00"} |
   *
   * | nbf | Not Before     | DtTime | {"nbf":"2038-04-01T00:00:00+00:00"} |
   *
   * | iat | Issued At      | DtTime | {"iat":"2038-03-17T00:00:00+00:00"} |
   *
   * | jti |  Token ID      | string |  {"jti":"87IFSGFgPNtQNNuw0AtuLttP"} |
   *
   * | kid |   Key-ID       | string |    {"kid":"stored-in-the-footer"}   |
   *
   * | kis | Key-Issuer     | string |    {"kis":"my-issuer.com"}          |
   *
   * | kep | Key-Expiration | DtTime | {"kep":"2038-03-17T00:00:00+00:00"} |
   *
   *
   * @param payload - a Record with data to sign
   * @param privateKey - private key as string
   * @param options - options for paseto v4 algorimth
   * @returns
   * Paseto V4 public token format.
   */
  public async sign(
    payload: TokenPayload,
    privateKey: string,
    options?: ProduceOptions,
  ) {
    const isUrl = "url" in payload.data;

    const payloadWithOptions = this.applyOptions(
      {
        kid: payload.kid,
        kis: payload.kis,
        kep: payload.kep,
        data: payload.data,
      },
      options,
    );
    const payloadProtobuf = PasetoTokenData.fromJSON({
      ...payloadWithOptions,
    });

    if (isUrl) {
      delete payloadProtobuf.instructionPayload;
    } else {
      delete payloadProtobuf.urlPayload;
    }

    const payloadProtobufBinary =
      PasetoTokenData.encode(payloadProtobuf).finish();

    return V4.sign(Buffer.from(payloadProtobufBinary), privateKey, {
      footer: options?.footer,
      assertion: options?.assertion,
    });
  }

  /**
   * Verify paseto token
   *
   * @param token - paseto token
   * @param publicKey - public key as string
   * @param options - options for paseto v4 algorimth
   * @returns
   * Paseto V4 public token format.
   */
  public async verify(
    token: string,
    publicKey: string,
    options?: ConsumeOptions<true>,
  ): Promise<CompleteResult<TokenPayload>> {
    const result = await V4.verify(token, publicKey, {
      assertion: options?.assertion,
      buffer: true,
      complete: true,
    });

    const payloadDecoded = PasetoTokenData.decode(result.payload);

    const payload: TokenPayload = PasetoTokenData.toJSON(
      payloadDecoded,
    ) as TokenPayload;

    this.assertPayload(payload, options);

    return { ...result, payload };
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private applyOptions(
    payload: Partial<TokenPayload>,
    options?: ProduceOptions,
  ) {
    const now = new Date();
    const unix = now.getTime();

    payload.iat = new Date(unix).toISOString();

    if (options?.expiresIn) {
      if (typeof options.expiresIn !== "string") {
        throw new TypeError("options.expiresIn must be a string");
      }

      payload.exp = new Date(unix + ms(options.expiresIn)).toISOString();
    }

    if (options?.notBefore) {
      if (typeof options.notBefore !== "string") {
        throw new TypeError("options.notBefore must be a string");
      }

      payload.nbf = new Date(unix + ms(options.notBefore)).toISOString();
    }

    if (options?.audience) {
      if (typeof options.audience !== "string") {
        throw new TypeError("options.audience must be a string");
      }

      payload.aud = options.audience;
    }

    if (options?.issuer) {
      if (typeof options.issuer !== "string") {
        throw new TypeError("options.issuer must be a string");
      }

      payload.iss = options.issuer;
    }

    if (options?.subject) {
      if (typeof options.subject !== "string") {
        throw new TypeError("options.subject must be a string");
      }

      payload.sub = options.subject;
    }

    if (options?.kid) {
      if (typeof options.kid !== "string") {
        throw new TypeError("options.kid must be a string");
      }

      payload.kid = options.kid;
    }

    if (options?.jti) {
      if (typeof options.jti !== "string") {
        throw new TypeError("options.jti must be a string");
      }

      payload.jti = options.jti;
    }

    if (options?.kid) {
      if (typeof options.kid !== "string") {
        throw new TypeError("options.kid must be a string");
      }

      payload.kid = options.kid;
    }

    return payload;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private assertPayload(payload: TokenPayload, options?: ConsumeOptions<true>) {
    const nowUnix = new Date().getTime();

    // iss
    if ("iss" in payload && typeof payload.iss !== "string") {
      throw new InvalidPasetoClaim("payload.iss must be a string");
    }

    if (options?.issuer && payload.iss !== options.issuer) {
      throw new InvalidPasetoClaim("issuer mismatch");
    }

    // sub
    if ("sub" in payload && typeof payload.sub !== "string") {
      throw new InvalidPasetoClaim("payload.sub must be a string");
    }

    if (options?.subject && payload.sub !== options.subject) {
      throw new InvalidPasetoClaim("subject mismatch");
    }

    // aud
    if ("aud" in payload && typeof payload.aud !== "string") {
      throw new InvalidPasetoClaim("payload.aud must be a string");
    }

    if (options?.audience && payload.aud !== options.audience) {
      throw new InvalidPasetoClaim("audience mismatch");
    }

    // iat
    if (!options?.ignoreIat) {
      if (!payload.iat) {
        throw new InvalidPasetoClaim("payload.iat is required");
      }

      const iat = new Date(payload.iat).getTime();
      if (!iat) {
        throw new InvalidPasetoClaim(
          "payload.iat must be a valid ISO8601 string",
        );
      }

      if (iat > nowUnix) {
        throw new InvalidPasetoClaim("token issued in the future");
      }
    }
    // nbf
    if (!options?.ignoreNbf && payload.nbf) {
      const nbf = new Date(payload.nbf).getTime();

      if (!nbf) {
        throw new InvalidPasetoClaim(
          "payload.nbf must be a valid ISO8601 string",
        );
      }

      if (nbf > nowUnix) {
        throw new InvalidPasetoClaim("token is not active yet");
      }
    }

    // exp
    if (!options?.ignoreExp) {
      if (!payload.exp) {
        throw new InvalidPasetoClaim("payload.exp is required");
      }

      const exp = new Date(payload.exp).getTime();
      if (!exp) {
        throw new InvalidPasetoClaim(
          "payload.exp must be a valid ISO8601 string",
        );
      }

      if (exp <= nowUnix) {
        throw new InvalidPasetoClaim("token is expired");
      }
    }

    // maxTokenAge
    if (!options?.ignoreIat && options?.maxTokenAge) {
      const iat = new Date(payload.iat as string).getTime();
      if (iat + ms(options.maxTokenAge) < nowUnix) {
        throw new InvalidPasetoClaim("maxTokenAge exceeded");
      }
    }
  }
}
