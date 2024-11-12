import { ConsumeOptions } from "paseto";
import * as superstruct from "superstruct";

import { CoinCode, InstructionPayload, NetworkCode } from "./types";
import {
  biggerThanOrEqualZero,
  biggerThanZero,
  InvalidPayload,
  InvalidQrCryptoToken,
  MissingKeyId,
  MissingSecretKey,
  PasetoV4Handler,
} from "./utils";

/**
 * Class to handle payment instruction token (qr-crypto token) creation with payload validation
 *
 * @param issuerDomain - string
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

  constructor(private issuerDomain: string) {
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
  public async create(
    parameters: {
      payload: InstructionPayload;
      secretKey: string;
      keyId: string;
      options?: {
        expiresIn?: string;
        subject?: string;
        audience?: string;
      };
    },
    warnings = true,
  ) {
    this.validateParameters(parameters);

    if (warnings && !parameters.options?.expiresIn) {
      console.warn(
        "\x1b[33m[WARNING]\x1b[0m: Field 'expiresIn' not provided in QR-Crypto token creation. It is recommended to set an expiration time.",
      );
    }

    const pasetoToken = await this.pasetoHandler.sign(
      parameters.payload,
      parameters.secretKey,
      {
        issuer: this.issuerDomain,
        expiresIn: parameters.options?.expiresIn,
        kid: parameters.keyId,
        subject: parameters.options?.subject,
        audience: parameters.options?.audience,
      },
    );

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
  public validatePayload(payload: InstructionPayload) {
    const [errors] = superstruct.validate(payload, this.payloadSchema);

    if (errors) {
      const [failure] = errors.failures();
      throw new InvalidPayload(
        failure?.message ?? "Payload does not match the expected schema",
      );
    }

    if (!payload.payment.is_open && !payload.payment.amount) {
      throw new InvalidPayload(
        "payment.amount is required when 'is_open' is true",
      );
    }
  }

  private validateParameters({ payload, secretKey, keyId }) {
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
  private payloadSchema = superstruct.object({
    payment: superstruct.object({
      id: superstruct.string(),
      address: superstruct.string(),
      address_tag: superstruct.optional(superstruct.string()),
      network_code: superstruct.enums(Object.values(NetworkCode)),
      coin_code: superstruct.string(),
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
              coin_code: superstruct.enums(Object.values(CoinCode)),
              image_url: superstruct.optional(superstruct.string()),
            }),
          ),
          "items",
          (value) => value.length > 0,
        ),
        merchant: superstruct.object({
          name: superstruct.string(),
          description: superstruct.optional(superstruct.string()),
          tax_id: superstruct.optional(superstruct.string()),
          image_url: superstruct.optional(superstruct.string()),
        }),
      }),
    ),
  });
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
  public async read(parameters: {
    qrCrypto: string;
    publicKey: string;
    issuerDomain: string;
    options?: ConsumeOptions<true>;
  }) {
    const isValidQr = parameters.qrCrypto.startsWith("qr-crypto.");
    if (!isValidQr) {
      throw new InvalidQrCryptoToken("invalid 'qr-crypto' token prefix");
    }

    const token = parameters.qrCrypto.slice(10);

    return this.pasetoHandler.verify<InstructionPayload>(
      token,
      parameters.publicKey,
      {
        ...parameters.options,
        complete: true,
        ignoreExp: false,
        issuer: parameters.issuerDomain,
      },
    );
  }
}
