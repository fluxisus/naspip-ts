import { ConsumeOptions, decode, ProduceOptions, V4 } from "paseto";

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

  public decode(token: string) {
    const data = decode(token);

    try {
      const footer = JSON.parse(data.footer?.toString() ?? "");
      return { ...data, footer };
    } catch {
      //
    }

    return { ...data, footer: data.footer?.toString() };
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
    payload: Record<string, any>,
    privateKey: string,
    options?: ProduceOptions,
  ) {
    return V4.sign(payload, privateKey, options);
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
  public async verify<Payload>(
    token: string,
    publicKey: string,
    options?: ConsumeOptions<true>,
  ) {
    return V4.verify<Payload>(token, publicKey, options);
  }
}
