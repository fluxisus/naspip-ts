// src/utils/paseto.ts
import { decode, V4 } from "paseto";
var PasetoV4Handler = class {
  /*
  Claims reserved
  +-----+------------+--------+-------------------------------------+
  | Key |    Name    |  Type  |               Example               |
  +-----+------------+--------+-------------------------------------+
  | iss |   Issuer   | string |       {"iss":"paragonie.com"}       |
  | sub |  Subject   | string |            {"sub":"test"}           |
  | aud |  Audience  | string |       {"aud":"pie-hosted.com"}      |
  | exp | Expiration | DtTime | {"exp":"2039-01-01T00:00:00+00:00"} |
  | nbf | Not Before | DtTime | {"nbf":"2038-04-01T00:00:00+00:00"} |
  | iat | Issued At  | DtTime | {"iat":"2038-03-17T00:00:00+00:00"} |
  | jti |  Token ID  | string |  {"jti":"87IFSGFgPNtQNNuw0AtuLttP"} |
  | kid |   Key-ID   | string |    {"kid":"stored-in-the-footer"}   |
  +-----+------------+--------+-------------------------------------+
  */
  generateKey(purpose, options) {
    return V4.generateKey(purpose, options);
  }
  decode(token) {
    const data = decode(token);
    try {
      const footer = JSON.parse(data.footer?.toString() ?? "");
      return { ...data, footer };
    } catch {
    }
    return { ...data, footer: data.footer?.toString() };
  }
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
