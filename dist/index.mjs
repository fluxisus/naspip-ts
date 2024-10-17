var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/utils/paseto.ts
import { decode, V4 } from "paseto";
var PasetoV4Handler = class {
  static {
    __name(this, "PasetoV4Handler");
  }
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
  static async generateKey(purpose, options) {
    return V4.generateKey(purpose, options);
  }
  decode(token) {
    const data = decode(token);
    try {
      const footer = JSON.parse(data.footer?.toString() ?? "");
      return {
        ...data,
        footer
      };
    } catch {
    }
    return {
      ...data,
      footer: data.footer?.toString()
    };
  }
  /**
  *
  * @remarks
  * Claims reserved
  *
  * | Key |    Name    |  Type  |             Example                 |
  *
  * | iss |   Issuer   | string |       {"iss":"paragonie.com"}       |
  *
  * | sub |  Subject   | string |            {"sub":"test"}           |
  *
  * | aud |  Audience  | string |       {"aud":"pie-hosted.com"}      |
  *
  * | exp | Expiration | DtTime | {"exp":"2039-01-01T00:00:00+00:00"} |
  *
  * | nbf | Not Before | DtTime | {"nbf":"2038-04-01T00:00:00+00:00"} |
  *
  * | iat | Issued At  | DtTime | {"iat":"2038-03-17T00:00:00+00:00"} |
  *
  * | jti |  Token ID  | string |  {"jti":"87IFSGFgPNtQNNuw0AtuLttP"} |
  *
  * | kid |   Key-ID   | string |    {"kid":"stored-in-the-footer"}   |
  *
  *
  *
  * @param payload - a Record with data to sign
  * @param privateKey - private key as string
  * @param options - options for paseto v4 algorimth
  * @returns
  * Paseto V4 public token format.
  */
  async sign(payload, privateKey, options) {
    return V4.sign(payload, privateKey, options);
  }
  async verify(token, publicKey, options) {
    return V4.verify(token, publicKey, options);
  }
};
export {
  PasetoV4Handler
};
