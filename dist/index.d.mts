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
interface UrlPayload {
    url: string;
}
interface InstructionPayload {
    payment: InstructionPayment;
    order?: InstructionOrder;
}
interface InstructionPayment {
    id: string;
    address: string;
    address_tag?: string;
    network: NetworkCode;
    coin: CoinCode;
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
    items?: InstructionItem[];
    merchant?: InstructionMerchant;
}
interface InstructionItem {
    title: string;
    description?: string;
    amount: string;
    unit_price?: string;
    quantity?: number;
    coin_code: string;
    image_url?: string;
}
interface TokenPayload {
    iss: string;
    sub?: string;
    aud?: string;
    iat: string;
    exp: string;
    nbf?: string;
    jti?: string;
    kid: string;
    kep: string;
    kis: string;
    payload: InstructionPayload | UrlPayload;
}
interface TokenCreateOptions extends TokenPublicKeyOptions {
    issuer?: string;
    expiresIn: string;
    subject?: string;
    audience?: string;
    assertion?: string;
}
interface TokenPublicKeyOptions {
    keyId: string;
    keyExpiration: string;
    keyIssuer: string;
}
interface ReadOptions extends ConsumeOptions<true> {
    keyId?: string;
    keyIssuer?: string;
    ignoreKeyExp?: boolean;
}

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
declare class PaymentInstructionsBuilder {
    private pasetoHandler;
    constructor();
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
    create(data: InstructionPayload | UrlPayload, secretKey: string, options: TokenCreateOptions, warnings?: boolean): Promise<string>;
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
    validatePayload(payload: InstructionPayload | UrlPayload): void;
    private validateParameters;
    /**
     * Payment Instruction Payload Schema
     *
     * @private
     *
     */
    private payloadSchema;
    /**
     * URL Payload Schema
     *
     * @private
     *
     */
    private payloadUrlSchema;
    /**
     * Validate payload of the payment instruction
     *
     * @private
     * @param payload - InstructionPayload
     *
     * @returns
     * `void` | `Error`
     */
    private validatePaymentInstructionPayload;
    /**
     * Validate URL Payload
     *
     * @private
     * @param payload - UrlPayload
     *
     * @returns
     * `void` | `Error`
     */
    private validateUrlPayload;
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
    decode(qrPayment: string): {
        prefix: string | undefined;
        keyIssuer: string | undefined;
        keyId: string | undefined;
        token: string;
    };
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
    read({ qrPayment, publicKey, options, }: {
        qrPayment: string;
        publicKey: string;
        options?: ReadOptions;
    }): Promise<paseto.CompleteResult<TokenPayload>>;
}

declare class PayInsError extends Error {
    code: string;
    constructor(message: string, noColor?: boolean);
}
declare class InvalidPayload extends PayInsError {
}
declare class MissingSecretKey extends PayInsError {
}
declare class MissingKid extends PayInsError {
}
declare class MissingKis extends PayInsError {
}
declare class InvalidKepExpired extends PayInsError {
}
declare class InvalidQrPaymentToken extends PayInsError {
}
declare class InvalidQrPaymentKeyId extends PayInsError {
}
declare class InvalidQrPaymentKeyIssuer extends PayInsError {
}
declare class InvalidQrPaymentKeyExpired extends PayInsError {
}

declare function getNetworkData(network: string | NetworkCode): any;
declare function isAfterDate(date1: string, date2: string): boolean;

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
    /**
     * Decode paseto token
     *
     * @param token - paseto token
     * @returns
     * `{ ...data, footer: string | Record<string, any> }`
     */
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
    sign(payload: Record<string, any>, privateKey: string, options?: ProduceOptions): Promise<string>;
    /**
     * Verify paseto token
     *
     * @param token - paseto token
     * @param publicKey - public key as string
     * @param options - options for paseto v4 algorimth
     * @returns
     * Paseto V4 public token format.
     */
    verify<Payload>(token: string, publicKey: string, options?: ConsumeOptions<true>): Promise<paseto.CompleteResult<Payload>>;
}

declare function biggerThanZero(value: string | number): boolean;
declare function biggerThanOrEqualZero(value: string): boolean;

export { CoinCode, type InstructionItem, type InstructionMerchant, type InstructionOrder, type InstructionPayload, type InstructionPayment, InvalidKepExpired, InvalidPayload, InvalidQrPaymentKeyExpired, InvalidQrPaymentKeyId, InvalidQrPaymentKeyIssuer, InvalidQrPaymentToken, MissingKid, MissingKis, MissingSecretKey, NetworkCode, PasetoV4Handler, PayInsError, PaymentInstructionsBuilder, PaymentInstructionsReader, type ReadOptions, type TokenCreateOptions, type TokenPayload, type TokenPublicKeyOptions, type UrlPayload, biggerThanOrEqualZero, biggerThanZero, getNetworkData, isAfterDate };
