import * as superstruct from "superstruct";

import {
  InstructionPayload,
  NetworkCode,
  ReadOptions,
  TokenCreateOptions,
  TokenPayload,
  TokenPublicKeyOptions,
  UrlPayload,
} from "./types";
import {
  biggerThanOrEqualZero,
  biggerThanZero,
  InvalidKepExpired,
  InvalidPayload,
  InvalidQrCryptoKeyId,
  InvalidQrCryptoKeyIssuer,
  InvalidQrCryptoToken,
  isAfterDate,
  MissingKid,
  MissingKis,
  MissingSecretKey,
  PasetoV4Handler,
} from "./utils";

/**
 * Class to handle payment instruction token (qr-crypto token) creation with payload validation
 *
 * @returns
 * `PaymentInstructionsBuilder`
 *
 * @example
 * ```ts
 * const builder = new PaymentInstructionsBuilder();
 * ```
 */

export class PaymentInstructionsBuilder {
  private pasetoHandler: PasetoV4Handler;

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
  public async create(
    data: InstructionPayload | UrlPayload,
    secretKey: string,
    options: TokenCreateOptions,
    warnings = true,
  ) {
    this.validateParameters({
      payload: data,
      secretKey,
      optionsKey: {
        keyId: options.keyId,
        keyIssuer: options.keyIssuer,
        keyExpiration: options.keyExpiration,
      },
    });

    if (warnings && !options?.expiresIn) {
      console.warn(
        `\x1b[33m[WARNING]\x1b[0m: Field 'expiresIn' not provided in QR-Crypto token creation.
         It is recommended to set an expiration time.
         Use default of 10 minutes.`,
      );
    }

    const payload = {
      payload: data,
      kid: options.keyId,
      kis: options.keyIssuer,
      kep: options.keyExpiration,
    };

    const pasetoToken = await this.pasetoHandler.sign(payload, secretKey, {
      issuer: options.issuer ?? options.keyIssuer,
      expiresIn: options?.expiresIn || "10m",
      kid: options.keyId,
      subject: options?.subject,
      audience: options?.audience,
      assertion: options?.assertion,
    });

    return `qr-crypto.${pasetoToken}`;
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
  public validatePayload(payload: InstructionPayload | UrlPayload) {
    if ("url" in payload) {
      return this.validateUrlPayload(payload);
    }

    this.validatePaymentInstructionPayload(payload);
  }

  private validateParameters({
    payload,
    secretKey,
    optionsKey,
  }: {
    payload: InstructionPayload | UrlPayload;
    secretKey: string;
    optionsKey: TokenPublicKeyOptions;
  }) {
    if (!secretKey) {
      throw new MissingSecretKey("secretKey is required for token creation");
    }

    if (!optionsKey.keyId) {
      throw new MissingKid("kid is required for token creation");
    }

    if (!optionsKey.keyIssuer) {
      throw new MissingKis("kis is required for token creation");
    }

    const isKeyExpired = isAfterDate(
      new Date().toISOString(),
      optionsKey.keyExpiration,
    );

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
  private payloadSchema = superstruct.object({
    payment: superstruct.object({
      id: superstruct.string(),
      address: superstruct.string(),
      address_tag: superstruct.optional(superstruct.string()),
      network: superstruct.enums(Object.values(NetworkCode)),
      coin: superstruct.string(),
      is_open: superstruct.boolean(),
      amount: superstruct.optional(
        superstruct.refine(superstruct.string(), "amount", biggerThanZero),
      ),
      min_amount: superstruct.optional(
        superstruct.refine(superstruct.string(), "min_amount", biggerThanZero),
      ),
      max_amount: superstruct.optional(
        superstruct.refine(superstruct.string(), "max_amount", biggerThanZero),
      ),
    }),
    order: superstruct.optional(
      superstruct.object({
        total_amount: superstruct.refine(
          superstruct.string(),
          "total_amount",
          biggerThanZero,
        ),
        coin_code: superstruct.string(),
        description: superstruct.optional(superstruct.string()),
        merchant: superstruct.object({
          name: superstruct.string(),
          description: superstruct.optional(superstruct.string()),
          tax_id: superstruct.optional(superstruct.string()),
          image_url: superstruct.optional(superstruct.string()),
        }),
        items: superstruct.refine(
          superstruct.array(
            superstruct.object({
              title: superstruct.string(),
              description: superstruct.optional(superstruct.string()),
              amount: superstruct.refine(
                superstruct.string(),
                "amount",
                biggerThanOrEqualZero,
              ),
              unit_price: superstruct.optional(
                superstruct.refine(
                  superstruct.string(),
                  "unit_price",
                  biggerThanOrEqualZero,
                ),
              ),
              quantity: superstruct.refine(
                superstruct.number(),
                "quantity",
                biggerThanZero,
              ),
              coin_code: superstruct.string(),
              image_url: superstruct.optional(superstruct.string()),
            }),
          ),
          "items",
          (value) => value.length > 0,
        ),
      }),
    ),
  });

  /**
   * URL Payload Schema
   *
   * @private
   *
   */
  private payloadUrlSchema = superstruct.object({
    url: superstruct.string(),
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
  private validatePaymentInstructionPayload(payload: InstructionPayload) {
    const [errors] = superstruct.validate(payload, this.payloadSchema);

    if (errors) {
      const [failure] = errors.failures();
      throw new InvalidPayload(
        failure?.message ?? "Payload does not match the expected schema",
      );
    }

    if (!payload.payment.is_open && !payload.payment.amount) {
      throw new InvalidPayload(
        "payment.amount is required when 'is_open' is false",
      );
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
  private validateUrlPayload(payload: UrlPayload) {
    const [errors] = superstruct.validate(payload, this.payloadUrlSchema);

    if (errors) {
      const [failure] = errors.failures();
      throw new InvalidPayload(
        failure?.message ?? "Payload does not match the expected schema",
      );
    }
  }
}

/**
 * Class to handle payment instruction token (qr-crypto token) reading
 *
 * @returns PaymentInstructionsReader
 *
 * @example
 * ```ts
 * const reader = new PaymentInstructionsReader();
 * ```
 */
export class PaymentInstructionsReader {
  private pasetoHandler: PasetoV4Handler;

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
  public async read({
    qrCrypto,
    publicKey,
    options,
  }: {
    qrCrypto: string;
    publicKey: string;
    options?: ReadOptions;
  }) {
    const isValidQr = qrCrypto.startsWith("qr-crypto.");
    if (!isValidQr) {
      throw new InvalidQrCryptoToken("Invalid 'qr-crypto' token prefix");
    }

    const token = qrCrypto.slice(10);

    const data = await this.pasetoHandler.verify<TokenPayload>(
      token,
      publicKey,
      {
        ...options,
        complete: true,
        ignoreExp: false,
        ignoreIat: false,
        assertion: publicKey,
      },
    );

    if (options?.keyId && options.keyId !== data.payload.kid) {
      throw new InvalidQrCryptoKeyId("Invalid Key ID");
    }

    if (options?.keyIssuer && options.keyIssuer !== data.payload.kis) {
      throw new InvalidQrCryptoKeyIssuer("Invalid Key Issuer");
    }

    if (
      !options?.ignoreKeyExp &&
      isAfterDate(new Date().toISOString(), data.payload.kep)
    ) {
      throw new InvalidQrCryptoKeyIssuer("Invalid Key Issuer");
    }

    return data;
  }
}
