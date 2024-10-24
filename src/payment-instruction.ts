import { PasetoV4Handler } from "./utils";
import { InstructionPayload, CoinCode, NetworkCode } from "./types";
import * as superstruct from "superstruct";

const biggerThanZero = (value: string) => parseFloat(value) > 0;

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
  private privateKey: string;
  private issuerDomain: string;
  private keyId: string;

  constructor(data: {
    privateKey: string;
    issuerDomain: string;
    keyId: string;
  }) {
    this.pasetoHandler = new PasetoV4Handler();
    this.privateKey = data.privateKey;
    this.issuerDomain = data.issuerDomain;
    this.keyId = data.keyId;
  }

  /**
   * Create a payment instruction
   *
   * @param payload - InstructionPayload
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
  public async createPaymentInstructionToken(
    payload: InstructionPayload,
    options?: {
      expiresIn?: string;
    }
  ) {
    this.validatePayload(payload);
    return this.pasetoHandler.sign(payload, this.privateKey, {
      issuer: this.issuerDomain,
      expiresIn: options?.expiresIn ?? "10m",
      footer: {
        key_id: this.keyId,
      },
    });
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
