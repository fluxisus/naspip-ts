var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/payment-instruction.ts
import * as superstruct from "superstruct";

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
  MissingKeyId: "ERR_MISSING_KEY_ID",
  InvalidQrCryptoToken: "ERR_INVALID_QR_CRYPTO_TOKEN"
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
var MissingKeyId = class extends PayInsError {
  static {
    __name(this, "MissingKeyId");
  }
};
var InvalidQrCryptoToken = class extends PayInsError {
  static {
    __name(this, "InvalidQrCryptoToken");
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
  /**
  * Decode paseto token
  *
  * @param token - paseto token
  * @returns
  * `{ ...data, footer: string | Record<string, any> }`
  */
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
    return V4.verify(token, publicKey, options);
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
  issuerDomain;
  pasetoHandler;
  constructor(issuerDomain) {
    this.issuerDomain = issuerDomain;
    this.payloadSchema = superstruct.object({
      payment: superstruct.object({
        id: superstruct.string(),
        address: superstruct.string(),
        address_tag: superstruct.optional(superstruct.string()),
        network_code: superstruct.enums(Object.values(NetworkCode)),
        coin_code: superstruct.string(),
        is_open: superstruct.boolean(),
        amount: superstruct.optional(superstruct.refine(superstruct.string(), "amount", biggerThanZero)),
        min_amount: superstruct.optional(superstruct.refine(superstruct.string(), "min_amount", biggerThanZero)),
        max_amount: superstruct.optional(superstruct.refine(superstruct.string(), "max_amount", biggerThanZero))
      }),
      order: superstruct.optional(superstruct.object({
        total_amount: superstruct.refine(superstruct.string(), "total_amount", biggerThanZero),
        coin_code: superstruct.string(),
        description: superstruct.optional(superstruct.string()),
        items: superstruct.refine(superstruct.array(superstruct.object({
          title: superstruct.string(),
          description: superstruct.optional(superstruct.string()),
          amount: superstruct.refine(superstruct.string(), "amount", biggerThanOrEqualZero),
          unit_price: superstruct.optional(superstruct.refine(superstruct.string(), "unit_price", biggerThanOrEqualZero)),
          quantity: superstruct.refine(superstruct.number(), "quantity", biggerThanZero),
          coin_code: superstruct.enums(Object.values(CoinCode)),
          image_url: superstruct.optional(superstruct.string())
        })), "items", (value) => value.length > 0),
        merchant: superstruct.object({
          name: superstruct.string(),
          description: superstruct.optional(superstruct.string()),
          tax_id: superstruct.optional(superstruct.string()),
          image_url: superstruct.optional(superstruct.string())
        })
      }))
    });
    this.pasetoHandler = new PasetoV4Handler();
  }
  /**
  * Create a QR-Crypto payment instruction token
  *
  * @param parameters - { payload: InstructionPayload; secretKey: string; }
  *
  * @returns
  * `string`
  *
  *
  * @example
  * ```ts
  * const issuerDomain = "qrCrypto.com";
  * const builder = new PaymentInstructionsBuilder(issuerDomain);
  *
  * const secretKey = "...";
  * const keyId = "key-id-one";
  *
  * builder.create({
  *   payload: {
  *     payment: {
  *       id: "payment-id",
  *       address: "crypto-address",
  *       network_code: NetworkCode.TRON,
  *       coin_code: CoinCode.TRON_USDT,
  *       is_open: true,
  *     },
  *   },
  *   secretKey,
  *   issuerDomain,
  *   keyId,
  * });
  *
  * returns
  * ```ts
  * "qr-crypto.v4.public...."
  * ```
  */
  async create(parameters, warnings = true) {
    this.validateParameters(parameters);
    if (warnings && !parameters.options?.expiresIn) {
      console.warn("\x1B[33m[WARNING]\x1B[0m: Field 'expiresIn' not provided in QR-Crypto token creation. It is recommended to set an expiration time.");
    }
    const pasetoToken = await this.pasetoHandler.sign(parameters.payload, parameters.secretKey, {
      issuer: this.issuerDomain,
      expiresIn: parameters.options?.expiresIn,
      kid: parameters.keyId,
      subject: parameters.options?.subject,
      audience: parameters.options?.audience
    });
    return `qr-crypto.${pasetoToken}`;
  }
  /**
  * Validate the payload of the payment instruction
  *
  * @param payload - InstructionPayload
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
  *     network_code: NetworkCode.TRON,
  *     coin_code: CoinCode.TRON_USDT,
  *     is_open: true,
  *   },
  * });
  * ```
  */
  validatePayload(payload) {
    const [errors] = superstruct.validate(payload, this.payloadSchema);
    if (errors) {
      const [failure] = errors.failures();
      throw new InvalidPayload(failure?.message ?? "Payload does not match the expected schema");
    }
    if (!payload.payment.is_open && !payload.payment.amount) {
      throw new InvalidPayload("payment.amount is required when 'is_open' is true");
    }
  }
  validateParameters({ payload, secretKey, keyId }) {
    if (!secretKey) {
      throw new MissingSecretKey("secretKey is required for token creation");
    }
    if (!keyId) {
      throw new MissingKeyId("keyId is required for token creation");
    }
    this.validatePayload(payload);
  }
  /**
  * Payload schema
  *
  * @private
  *
  */
  payloadSchema;
};
var PaymentInstructionsReader = class {
  static {
    __name(this, "PaymentInstructionsReader");
  }
  pasetoHandler;
  constructor() {
    this.pasetoHandler = new PasetoV4Handler();
  }
  /**
  * Read a QR-Crypto payment instruction
  *
  * @param qrCrypto - QR-Crypto token string
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
  *    qrCrypto: "qr-crypto.v4.public....",
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
  *    data: {
  *      payment: {...},
  *      order: {....}
  *    },
  *    iss: "qrCrypto.com",
  *    iat: "2024-10-29T21:17:00.000Z",
  *    exp: "2024-10-29T21:25:00.000Z",
  *    kid: "some-kid",
  *    sub: "customer@qrCrypto.com",
  *    aud: "payer-crypto.com"
  *   }
  * }
  * ```
  */
  async read(parameters) {
    const isValidQr = parameters.qrCrypto.startsWith("qr-crypto.");
    if (!isValidQr) {
      throw new InvalidQrCryptoToken("invalid 'qr-crypto' token prefix");
    }
    const token = parameters.qrCrypto.slice(10);
    return this.pasetoHandler.verify(token, parameters.publicKey, {
      ...parameters.options,
      complete: true,
      ignoreExp: false,
      issuer: parameters.issuerDomain
    });
  }
};
export {
  CoinCode,
  InvalidPayload,
  InvalidQrCryptoToken,
  MissingKeyId,
  MissingSecretKey,
  NetworkCode,
  PasetoV4Handler,
  PayInsError,
  PaymentInstructionsBuilder,
  PaymentInstructionsReader,
  biggerThanOrEqualZero,
  biggerThanZero,
  getNetworkData
};
//# sourceMappingURL=index.mjs.map