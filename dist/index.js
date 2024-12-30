"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CoinCode: () => CoinCode,
  InvalidKepExpired: () => InvalidKepExpired,
  InvalidPayload: () => InvalidPayload,
  InvalidQrPaymentKeyExpired: () => InvalidQrPaymentKeyExpired,
  InvalidQrPaymentKeyId: () => InvalidQrPaymentKeyId,
  InvalidQrPaymentKeyIssuer: () => InvalidQrPaymentKeyIssuer,
  InvalidQrPaymentToken: () => InvalidQrPaymentToken,
  MissingKid: () => MissingKid,
  MissingKis: () => MissingKis,
  MissingSecretKey: () => MissingSecretKey,
  NetworkCode: () => NetworkCode,
  PasetoV4Handler: () => PasetoV4Handler,
  PayInsError: () => PayInsError,
  PaymentInstructionsBuilder: () => PaymentInstructionsBuilder,
  PaymentInstructionsReader: () => PaymentInstructionsReader,
  biggerThanOrEqualZero: () => biggerThanOrEqualZero,
  biggerThanZero: () => biggerThanZero,
  getNetworkData: () => getNetworkData,
  isAfterDate: () => isAfterDate
});
module.exports = __toCommonJS(src_exports);

// src/payment-instruction.ts
var superstruct = __toESM(require("superstruct"));

// src/types.ts
var NetworkCode = /* @__PURE__ */ function(NetworkCode2) {
  NetworkCode2["BSC"] = "BSC";
  NetworkCode2["BITCOIN"] = "BITCOIN";
  NetworkCode2["ERC20"] = "ERC20";
  NetworkCode2["LIGHTNING"] = "LIGHTNING";
  NetworkCode2["LITECOIN"] = "LITECOIN";
  NetworkCode2["POLYGON"] = "POLYGON";
  NetworkCode2["SOLANA"] = "SOLANA";
  NetworkCode2["TRON"] = "TRON";
  NetworkCode2["STELLAR"] = "STELLAR";
  return NetworkCode2;
}({});
var CoinCode = /* @__PURE__ */ function(CoinCode2) {
  CoinCode2["TRON_USDT"] = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
  CoinCode2["POLYGON_USDT"] = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
  CoinCode2["POLYGON_USDC"] = "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359";
  return CoinCode2;
}({});

// src/utils/errors.ts
var CODES = {
  InvalidPayload: "ERR_INVALID_PAYLOAD",
  MissingSecretKey: "ERR_MISSING_SECRET_KEY",
  MissingKid: "ERR_MISSING_KEY_ID",
  MissingKis: "ERR_MISSING_KEY_ISSUER",
  InvalidKepExpired: "ERR_KEY_ID_IS_EXPIRED",
  InvalidQrPaymentToken: "ERR_INVALID_QR_PAYMENT_TOKEN",
  InvalidQrPaymentKeyId: "ERR_INVALID_QR_PAYMENT_KID",
  InvalidQrPaymentKeyIssuer: "ERR_INVALID_QR_PAYMENT_KIS",
  InvalidQrPaymentKeyExpired: "ERR_INVALID_QR_PAYMENT_KEP"
};
var PayInsError = class extends Error {
  static {
    __name(this, "PayInsError");
  }
  code;
  constructor(message, noColor = false) {
    super(message);
    this.name = noColor ? "[ERROR] " + this.constructor.name : "\x1B[31m[ERROR]\x1B[0m " + this.constructor.name;
    this.code = CODES[this.constructor.name];
    Error.captureStackTrace(this, this.constructor);
  }
};
var InvalidPayload = class extends PayInsError {
  static {
    __name(this, "InvalidPayload");
  }
};
var MissingSecretKey = class extends PayInsError {
  static {
    __name(this, "MissingSecretKey");
  }
};
var MissingKid = class extends PayInsError {
  static {
    __name(this, "MissingKid");
  }
};
var MissingKis = class extends PayInsError {
  static {
    __name(this, "MissingKis");
  }
};
var InvalidKepExpired = class extends PayInsError {
  static {
    __name(this, "InvalidKepExpired");
  }
};
var InvalidQrPaymentToken = class extends PayInsError {
  static {
    __name(this, "InvalidQrPaymentToken");
  }
};
var InvalidQrPaymentKeyId = class extends PayInsError {
  static {
    __name(this, "InvalidQrPaymentKeyId");
  }
};
var InvalidQrPaymentKeyIssuer = class extends PayInsError {
  static {
    __name(this, "InvalidQrPaymentKeyIssuer");
  }
};
var InvalidQrPaymentKeyExpired = class extends PayInsError {
  static {
    __name(this, "InvalidQrPaymentKeyExpired");
  }
};

// src/data/networks.ts
var networkDataMap = {
  BSC: {
    network: "BSC",
    name: "BNB Smart Chain (BEP20)"
  },
  BITCOIN: {
    network: "BITCOIN",
    name: "Bitcoin"
  },
  ERC20: {
    network: "ERC20",
    name: "Ethereum (ERC20)"
  },
  LIGHTNING: {
    network: "LIGHTNING",
    name: "Lightning Network"
  },
  LITECOIN: {
    network: "LITECOIN",
    name: "Litecoin"
  },
  POLYGON: {
    network: "POLYGON",
    name: "Polygon POS"
  },
  SOLANA: {
    network: "SOLANA",
    name: "Solana"
  },
  TRON: {
    network: "TRON",
    name: "Tron (TRC20)"
  },
  STELLAR: {
    network: "STELLAR",
    name: "Stellar Network"
  }
};

// src/utils/format.ts
function getNetworkData(network) {
  return networkDataMap[network] ?? {
    network,
    name: network
  };
}
__name(getNetworkData, "getNetworkData");
function isAfterDate(date1, date2) {
  return new Date(date1) > new Date(date2);
}
__name(isAfterDate, "isAfterDate");

// src/utils/paseto.ts
var import_paseto = require("paseto");
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
    return import_paseto.V4.generateKey(purpose, options);
  }
  /**
  * Decode paseto token
  *
  * @param token - paseto token
  * @returns
  * `{ ...data, footer: string | Record<string, any> }`
  */
  decode(token) {
    const data = (0, import_paseto.decode)(token);
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
  async sign(payload, privateKey, options) {
    return import_paseto.V4.sign(payload, privateKey, options);
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
  async verify(token, publicKey, options) {
    return import_paseto.V4.verify(token, publicKey, options);
  }
};

// src/utils/validate.ts
function biggerThanZero(value) {
  return parseFloat(value.toString()) > 0;
}
__name(biggerThanZero, "biggerThanZero");
function biggerThanOrEqualZero(value) {
  return parseFloat(value) >= 0;
}
__name(biggerThanOrEqualZero, "biggerThanOrEqualZero");

// src/payment-instruction.ts
var PaymentInstructionsBuilder = class {
  static {
    __name(this, "PaymentInstructionsBuilder");
  }
  pasetoHandler;
  constructor() {
    this.pasetoHandler = new PasetoV4Handler();
  }
  /**
  * Create a QR-Crypto token
  *
  * @param data - InstructionPayload | UrlPayload;
  * @param secretKey - string;
  * @param options - TokenCreateOptions;
  * @param [warnings=true]
  *
  * @returns
  * `string`
  *
  *
  * @example
  * ```ts
  * const builder = new PaymentInstructionsBuilder();
  *
  * await builder.create(
  *   {
  *     payment: {
  *       id: "payment-id",
  *       address: "crypto-address",
  *       network: NetworkCode.TRON,
  *       coin: CoinCode.TRON_USDT,
  *       is_open: true,
  *     },
  *   },
  *   secretKey: "some-private-secret",
  *   {
  *     issuer: "client.com",
  *     expiresIn: "1h",
  *     keyId: "key-id-one",
  *     keyExpiration: "2025-12-12T01:00:00.000Z",
  *     keyIssuer: "my-bussines.com",
  *   }
  * });
  *
  * returns
  * ```ts
  * "qr-crypto.v4.public...."
  * ```
  */
  async create(data, secretKey, options, warnings = true) {
    this.validateParameters({
      payload: data,
      secretKey,
      optionsKey: {
        keyId: options.keyId,
        keyIssuer: options.keyIssuer,
        keyExpiration: options.keyExpiration
      }
    });
    if (warnings && !options?.expiresIn) {
      console.warn(`\x1B[33m[WARNING]\x1B[0m: Field 'expiresIn' not provided in QR-Crypto token creation.
         It is recommended to set an expiration time.
         Use default of 10 minutes.`);
    }
    const payload = {
      payload: data,
      kid: options.keyId,
      kis: options.keyIssuer,
      kep: options.keyExpiration
    };
    const pasetoToken = await this.pasetoHandler.sign(payload, secretKey, {
      issuer: options.issuer ?? options.keyIssuer,
      expiresIn: options?.expiresIn || "10m",
      kid: options.keyId,
      subject: options?.subject,
      audience: options?.audience,
      assertion: options?.assertion
    });
    return [
      "qr-payment",
      options.keyIssuer,
      options.keyId,
      pasetoToken
    ].join(";");
  }
  /**
  * Validate the payload of the payment instruction or url
  *
  * @param payload - InstructionPayload | UrlPayload
  *
  * @returns
  * `void` | `Error`
  *
  * @example
  * ```ts
  * const builder = new PaymentInstructionsBuilder();
  *
  * builder.validatePayload({
  *   payment: {
  *     id: "payment-id",
  *     address: "crypto-address",
  *     network: NetworkCode.TRON,
  *     coin: CoinCode.TRON_USDT,
  *     is_open: true,
  *   },
  * });
  * ```
  */
  validatePayload(payload) {
    if ("url" in payload) {
      return this.validateUrlPayload(payload);
    }
    this.validatePaymentInstructionPayload(payload);
  }
  validateParameters({ payload, secretKey, optionsKey }) {
    if (!secretKey) {
      throw new MissingSecretKey("secretKey is required for token creation");
    }
    if (!optionsKey.keyId) {
      throw new MissingKid("kid is required for token creation");
    }
    if (!optionsKey.keyIssuer) {
      throw new MissingKis("kis is required for token creation");
    }
    const isKeyExpired = isAfterDate((/* @__PURE__ */ new Date()).toISOString(), optionsKey.keyExpiration);
    if (isKeyExpired) {
      throw new InvalidKepExpired("kid is expired for token creation");
    }
    this.validatePayload(payload);
  }
  /**
  * Payment Instruction Payload Schema
  *
  * @private
  *
  */
  payloadSchema = superstruct.object({
    payment: superstruct.object({
      id: superstruct.string(),
      address: superstruct.string(),
      address_tag: superstruct.optional(superstruct.string()),
      network: superstruct.enums(Object.values(NetworkCode)),
      coin: superstruct.string(),
      is_open: superstruct.boolean(),
      amount: superstruct.optional(superstruct.refine(superstruct.string(), "amount", biggerThanZero)),
      min_amount: superstruct.optional(superstruct.refine(superstruct.string(), "min_amount", biggerThanZero)),
      max_amount: superstruct.optional(superstruct.refine(superstruct.string(), "max_amount", biggerThanZero))
    }),
    order: superstruct.optional(superstruct.object({
      total_amount: superstruct.refine(superstruct.string(), "total_amount", biggerThanZero),
      coin_code: superstruct.string(),
      description: superstruct.optional(superstruct.string()),
      merchant: superstruct.object({
        name: superstruct.string(),
        description: superstruct.optional(superstruct.string()),
        tax_id: superstruct.optional(superstruct.string()),
        image_url: superstruct.optional(superstruct.string())
      }),
      items: superstruct.refine(superstruct.array(superstruct.object({
        title: superstruct.string(),
        description: superstruct.optional(superstruct.string()),
        amount: superstruct.refine(superstruct.string(), "amount", biggerThanOrEqualZero),
        unit_price: superstruct.optional(superstruct.refine(superstruct.string(), "unit_price", biggerThanOrEqualZero)),
        quantity: superstruct.refine(superstruct.number(), "quantity", biggerThanZero),
        coin_code: superstruct.string(),
        image_url: superstruct.optional(superstruct.string())
      })), "items", (value) => value.length > 0)
    }))
  });
  /**
  * URL Payload Schema
  *
  * @private
  *
  */
  payloadUrlSchema = superstruct.object({
    url: superstruct.string()
  });
  /**
  * Validate payload of the payment instruction
  *
  * @private
  * @param payload - InstructionPayload
  *
  * @returns
  * `void` | `Error`
  */
  validatePaymentInstructionPayload(payload) {
    const [errors] = superstruct.validate(payload, this.payloadSchema);
    if (errors) {
      const [failure] = errors.failures();
      throw new InvalidPayload(failure?.message ?? "Payload does not match the expected schema");
    }
    if (!payload.payment.is_open && !payload.payment.amount) {
      throw new InvalidPayload("payment.amount is required when 'is_open' is false");
    }
  }
  /**
  * Validate URL Payload
  *
  * @private
  * @param payload - UrlPayload
  *
  * @returns
  * `void` | `Error`
  */
  validateUrlPayload(payload) {
    const [errors] = superstruct.validate(payload, this.payloadUrlSchema);
    if (errors) {
      const [failure] = errors.failures();
      throw new InvalidPayload(failure?.message ?? "Payload does not match the expected schema");
    }
  }
};
var PaymentInstructionsReader = class {
  static {
    __name(this, "PaymentInstructionsReader");
  }
  pasetoHandler;
  constructor() {
    this.pasetoHandler = new PasetoV4Handler();
  }
  decode(qrPayment) {
    const decoded = qrPayment.split(";");
    const isValidQr = decoded.length == 4 && decoded[0] == "qr-payment";
    if (!isValidQr) {
      throw new InvalidQrPaymentToken("Invalid 'qr-payment' token prefix");
    }
    const [prefix, keyIssuer, keyId, token] = decoded;
    if (!token) {
      throw new InvalidQrPaymentToken("Invalid 'qr-payment' token");
    }
    return {
      prefix,
      keyIssuer,
      keyId,
      token
    };
  }
  /**
  * Read a QR payment instruction
  *
  * @param qrPayment - QR-Crypto token string
  * @param publicKey - string
  * @param options - ConsumeOptions<true> (optional)
  *
  * @returns
  * ```json{
  *    payload: CompleteResult<InstructionPayload>;
  *    footer?: Buffer | Record<string, any>;
  *    version: "v4";
  *    purpose: "public";
  *  }```
  *
  *
  * @example
  * ```ts
  * const reader = new PaymentInstructionsReader();
  *
  * reader.read({
  *    qrPayment: "qr-payment;keyIssuer;keyId;v4.public....",
  *    publicKey: "some-public-key",
  *    issuerDomain: "qrCrypto.com",
  *    options: { subject: "customer@qrCrypto.com", audience: "payer-crypto.com"}
  * });
  *
  * returns
  * ```ts
  * {
  *   version: "v4",
  *   purpose: "public",
  *   payload: {
  *    payload: {
  *      payment: {...},
  *      order: {....}
  *    },
  *    iss: "qrCrypto.com",
  *    iat: "2024-10-29T21:17:00.000Z",
  *    exp: "2024-10-29T21:25:00.000Z",
  *    kid: "some-kid",
  *    kep: "2025-12-31T00:00:00.000Z"
  *    kis: "some-business.com"
  *    sub: "customer@qrCrypto.com",
  *    aud: "payer-crypto.com"
  *   }
  * }
  * ```
  */
  async read({ qrPayment, publicKey, options }) {
    const decodedQr = this.decode(qrPayment);
    const data = await this.pasetoHandler.verify(decodedQr.token, publicKey, {
      ...options,
      complete: true,
      ignoreExp: false,
      ignoreIat: false,
      assertion: publicKey
    });
    if (options?.keyId && options.keyId !== data.payload.kid) {
      throw new InvalidQrPaymentKeyId("Invalid Key ID");
    }
    if (options?.keyIssuer && options.keyIssuer !== data.payload.kis) {
      throw new InvalidQrPaymentKeyIssuer("Invalid Key Issuer");
    }
    if (!options?.ignoreKeyExp && isAfterDate((/* @__PURE__ */ new Date()).toISOString(), data.payload.kep)) {
      throw new InvalidQrPaymentKeyIssuer("Invalid Key Issuer");
    }
    return data;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CoinCode,
  InvalidKepExpired,
  InvalidPayload,
  InvalidQrPaymentKeyExpired,
  InvalidQrPaymentKeyId,
  InvalidQrPaymentKeyIssuer,
  InvalidQrPaymentToken,
  MissingKid,
  MissingKis,
  MissingSecretKey,
  NetworkCode,
  PasetoV4Handler,
  PayInsError,
  PaymentInstructionsBuilder,
  PaymentInstructionsReader,
  biggerThanOrEqualZero,
  biggerThanZero,
  getNetworkData,
  isAfterDate
});
//# sourceMappingURL=index.js.map