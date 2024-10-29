import { ConsumeOptions } from "paseto";
import * as superstruct from "superstruct";

import { CoinCode, InstructionPayload, NetworkCode } from "./types";
import { biggerThanZero, PasetoV4Handler } from "./utils";

/**
 * Valida el payload de la instrucción de pago
 *
 * @param privateKey - string
 *
 * @returns
 * `PaymentInstructionsBuilder`
 *
 * @example
 * ```ts
 * const privateKey = "your_private_key_here";
 * const builder = new PaymentInstructionsBuilder({ privateKey });
 * ```
 */

export class PaymentInstructionsBuilder {
  /*

*/
  private pasetoHandler: PasetoV4Handler;

  constructor() {
    this.pasetoHandler = new PasetoV4Handler();
  }

  /**
   * Create a payment instruction
   *
   * @param params - { payload: InstructionPayload; secretKey: string; issuerDomain: string; }
   *
   * @returns
   * `{ token: string; }`
   *
   *
   * @example
   * ```ts
   * const builder = new PaymentInstructionsBuilder({ privateKey: "..." });
   *
   * builder.createPaymentInstructionToken({
   *   payment: {
   *     id: "id",
   *     address: "string",
   *     network_code: NetworkCode.TRON,
   *     coin_code: CoinCode.TRON_USDT,
   *     is_open: true,
   *   },
   * });
   *
   * returns
   * {
   *   token: "string",
   * }
   *
   * ```
   */
  public async createPaymentInstructionToken(parameters: {
    payload: InstructionPayload;
    secretKey: string;
    issuerDomain: string;
    keyId: string;
    options?: {
      expiresIn?: string;
      subject?: string;
      audience?: string;
    };
  }) {
    this.validateParams(parameters);

    if (!parameters.options?.expiresIn) {
      console.warn("expiresIn not provided. Using default '10 minutes' value");
    }

    const pasetoToken = await this.pasetoHandler.sign(
      parameters.payload,
      parameters.secretKey,
      {
        issuer: parameters.issuerDomain,
        expiresIn: parameters.options?.expiresIn ?? "10m",
        kid: parameters.keyId,
        subject: parameters.options?.subject,
        audience: parameters.options?.audience,
      }
    );

    return `qr-crypto.${pasetoToken}`;
  }

  /**
   * Validate the payload of the payment instruction
   *
   * @param payload - InstructionPayload
   *
   * @returns
   * `void`
   *
   * @example
   * ```ts
   * const builder = new PaymentInstructionsBuilder({ privateKey: "..." });
   *
   * builder.validatePayload({
   *   payment: {
   *     id: "id",
   *     address: "string",
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
      throw new Error("Invalid payload:", { cause: errors });
    }
  }

  /**
   * Validate the parameters of the payment instruction
   *
   * @param params - { secretKey: string; issuerDomain: string; payload: InstructionPayload; }
   *
   * @returns
   * `void`
   */
  private validateParams(parameters: {
    secretKey: string;
    issuerDomain: string;
    keyId: string;
    payload: InstructionPayload;
  }) {
    if (!parameters.secretKey) {
      throw new Error("secretKey is required");
    }
    if (!parameters.issuerDomain) {
      throw new Error("issuerDomain is required");
    }
    if (!parameters.keyId) {
      throw new Error("keyId is required");
    }
    this.validatePayload(parameters.payload);
  }

  private payloadSchema = superstruct.object({
    payment: superstruct.object({
      id: superstruct.string(),
      address: superstruct.string(),
      address_tag: superstruct.optional(superstruct.string()),
      network_code: superstruct.enums(Object.values(NetworkCode)),
      coin_code: superstruct.enums(Object.values(CoinCode)),
      is_open: superstruct.boolean(),
      amount: superstruct.optional(
        superstruct.refine(superstruct.string(), "amount", biggerThanZero)
      ),
      min_amount: superstruct.optional(
        superstruct.refine(superstruct.string(), "min_amount", biggerThanZero)
      ),
      max_amount: superstruct.optional(
        superstruct.refine(superstruct.string(), "max_amount", biggerThanZero)
      ),
    }),
    order: superstruct.optional(
      superstruct.object({
        total_amount: superstruct.refine(
          superstruct.string(),
          "total_amount",
          biggerThanZero
        ),
        coin_code: superstruct.enums(Object.values(CoinCode)),
        description: superstruct.optional(superstruct.string()),
        items: superstruct.refine(
          superstruct.array(
            superstruct.object({
              title: superstruct.string(),
              description: superstruct.optional(superstruct.string()),
              amount: superstruct.refine(
                superstruct.string(),
                "amount",
                biggerThanZero
              ),
              unit_price: superstruct.optional(
                superstruct.refine(
                  superstruct.string(),
                  "unit_price",
                  biggerThanZero
                )
              ),
              quantity: superstruct.refine(
                superstruct.number(),
                "quantity",
                (value) => value > 0
              ),
              coin_code: superstruct.enums(Object.values(CoinCode)),
              image_url: superstruct.optional(superstruct.string()),
            })
          ),
          "items",
          (value) => value.length > 0
        ),
        merchant: superstruct.object({
          name: superstruct.string(),
          description: superstruct.optional(superstruct.string()),
          tax_id: superstruct.optional(superstruct.string()),
          image_url: superstruct.optional(superstruct.string()),
        }),
      })
    ),
  });
}

export class PaymentInstructionsReader {
  private pasetoHandler: PasetoV4Handler;

  constructor(private issuerDomain: string) {
    this.pasetoHandler = new PasetoV4Handler();
  }

  /**
   * Read a qr crypto payment instruction
   *
   * @param qrCrypto - QR Crypto string
   * @param publicKey - string
   * @param options - ConsumeOptions<true> (optional)
   *
   * @returns
   * `{
   *    payload: CompleteResult<InstructionPayload>;
   *    footer?: Buffer | Record<string, any>;
   *    version: "v4";
   *    purpose: "public";
   *  }`
   *
   *
   * @example
   * ```ts
   * const reader = new PaymentInstructionsReader("qrCrypto.com");
   *
   * reader.read(
   *    "qr-crypto.v4.public....",
   *    "some-public-key",
   *    { subject: "customer@qrCrypto.com", audience: "payer-crypto.com"}
   * );
   *
   * returns
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
   *
   * ```
   */
  public read(
    qrCrypto: string,
    publicKey: string,
    options?: ConsumeOptions<true>
  ) {
    const isValidQr = qrCrypto.startsWith("qr-crypto.");
    if (!isValidQr) {
      throw new Error("Invalid QR Crypto");
    }

    const token = qrCrypto.slice(10);

    return this.pasetoHandler.verify<InstructionPayload>(token, publicKey, {
      ...options,
      complete: true,
      ignoreExp: false,
      issuer: this.issuerDomain,
    });
  }
}
