const CODES = {
  InvalidPayload: "ERR_INVALID_PAYLOAD",
  MissingSecretKey: "ERR_MISSING_SECRET_KEY",
  MissingKid: "ERR_MISSING_KEY_ID",
  MissingKis: "ERR_MISSING_KEY_ISSUER",
  InvalidKepExpired: "ERR_KEY_ID_IS_EXPIRED",
  InvalidQrPaymentToken: "ERR_INVALID_QR_PAYMENT_TOKEN",
  InvalidQrPaymentKeyId: "ERR_INVALID_QR_PAYMENT_KID",
  InvalidQrPaymentKeyIssuer: "ERR_INVALID_QR_PAYMENT_KIS",
  InvalidQrPaymentKeyExpired: "ERR_INVALID_QR_PAYMENT_KEP",
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
export class MissingKid extends PayInsError {}
export class MissingKis extends PayInsError {}
export class InvalidKepExpired extends PayInsError {}
export class InvalidQrPaymentToken extends PayInsError {}
export class InvalidQrPaymentKeyId extends PayInsError {}
export class InvalidQrPaymentKeyIssuer extends PayInsError {}
export class InvalidQrPaymentKeyExpired extends PayInsError {}
