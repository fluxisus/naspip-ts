"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  PasetoV4Handler: () => PasetoV4Handler
});
module.exports = __toCommonJS(src_exports);

// src/utils/paseto.ts
var import_paseto = require("paseto");
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
    return import_paseto.V4.generateKey(purpose, options);
  }
  decode(token) {
    const data = (0, import_paseto.decode)(token);
    try {
      const footer = JSON.parse(data.footer?.toString() ?? "");
      return { ...data, footer };
    } catch {
    }
    return { ...data, footer: data.footer?.toString() };
  }
  async sign(payload, privateKey, options) {
    return import_paseto.V4.sign(payload, privateKey, options);
  }
  async verify(token, publicKey, options) {
    return import_paseto.V4.verify(token, publicKey, options);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PasetoV4Handler
});
