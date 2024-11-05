const CODES = {
  InvalidPayload: "ERR_INVALID_PAYLOAD",
  MissingSecretKey: "ERR_MISSING_SECRET_KEY",
  MissingKeyId: "ERR_MISSING_KEY_ID",
  InvalidQrCryptoToken: "ERR_INVALID_QR_CRYPTO_TOKEN",
} as const;

export class PayInsError extends Error {
  public code: string;

  constructor(message: string, noColor = false) {
    super(message);
    this.name = noColor
      ? "[ERROR] " + this.constructor.name
      : "\x1b[31m[ERROR]\x1b[0m " + this.constructor.name;
    this.code = CODES[this.constructor.name as keyof typeof CODES];
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidPayload extends PayInsError {}
export class MissingSecretKey extends PayInsError {}
export class MissingKeyId extends PayInsError {}
export class InvalidQrCryptoToken extends PayInsError {}
