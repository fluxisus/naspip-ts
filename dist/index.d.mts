import * as paseto from 'paseto';
import { ConsumeOptions, ProduceOptions } from 'paseto';

declare enum NetworkCode {
    BSC = "BSC",
    BITCOIN = "BITCOIN",
    ERC20 = "ERC20",
    LIGHTNING = "LIGHTNING",
    LITECOIN = "LITECOIN",
    POLYGON = "POLYGON",
    SOLANA = "SOLANA",
    TRON = "TRON",
    STELLAR = "STELLAR"
}
declare enum CoinCode {
    TRON_USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    POLYGON_USDT = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    POLYGON_USDC = "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"
}
interface InstructionPayload {
    payment: InstructionPayment;
    order?: InstructionOrder;
}
interface InstructionPayment {
    id: string;
    address: string;
    address_tag?: string;
    network_code: NetworkCode;
    coin_code: CoinCode;
    is_open: boolean;
    amount?: string;
    min_amount?: string;
    max_amount?: string;
}
interface InstructionMerchant {
    name: string;
    description?: string;
    tax_id?: string;
    image_url?: string;
}
interface InstructionOrder {
    total_amount: string;
    coin_code: string;
    description?: string;
    items: InstructionItem[];
    merchant: InstructionMerchant;
}
interface InstructionItem {
    title: string;
    description?: string;
    amount: string;
    unit_price?: string;
    quantity: number;
    coin_code: string;
    image_url?: string;
}

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
declare class PaymentInstructionsBuilder {
    private issuerDomain;
    private pasetoHandler;
    constructor(issuerDomain: string);
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
    create(parameters: {
        payload: InstructionPayload;
        secretKey: string;
        keyId: string;
        options?: {
            expiresIn?: string;
            subject?: string;
            audience?: string;
        };
    }, warnings?: boolean): Promise<string>;
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
    validatePayload(payload: InstructionPayload): void;
    private validateParameters;
    /**
     * Payload schema
     *
     * @private
     *
     */
    private payloadSchema;
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
declare class PaymentInstructionsReader {
    private pasetoHandler;
    constructor();
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
    read(parameters: {
        qrCrypto: string;
        publicKey: string;
        issuerDomain: string;
        options?: ConsumeOptions<true>;
    }): Promise<paseto.CompleteResult<InstructionPayload>>;
}

declare function getNetworkData(network: string | NetworkCode): any;

type AsymetricKey = "paserk";
type PasetoTokenContext = "public";
declare class PasetoV4Handler {
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
    static generateKey(purpose: PasetoTokenContext, options: {
        format: AsymetricKey;
    }): Promise<{
        secretKey: string;
        publicKey: string;
    }>;
    decode(token: string): {
        footer: any;
        payload?: Record<string, unknown> | undefined;
        purpose: "local" | "public";
        version: string;
    };
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
    sign(payload: Record<string, any>, privateKey: string, options?: ProduceOptions): Promise<string>;
    verify<Payload>(token: string, publicKey: string, options?: ConsumeOptions<true>): Promise<paseto.CompleteResult<Payload>>;
}

declare function biggerThanZero(value: string): boolean;

export { PasetoV4Handler, PaymentInstructionsBuilder, PaymentInstructionsReader, biggerThanZero, getNetworkData };
