import {
  PaymentInstructionsBuilder,
  PaymentInstructionsReader,
} from "../src/payment-instruction";
import { CoinCode, NetworkCode } from "../src/types";
import { PasetoV4Handler } from "../src/utils";

let commonKeys: {
  publicKey: string;
  secretKey: string;
};

beforeAll(async () => {
  commonKeys = await PasetoV4Handler.generateKey("public", {
    format: "paserk",
  });
});

describe("Payment Instructions Classes Test", () => {
  test("Should create payment instruction token with valid payload: is_open: true", async () => {
    const builder = new PaymentInstructionsBuilder();

    const token = await builder.create(
      {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          network: NetworkCode.TRON,
          coin: CoinCode.TRON_USDT,
          is_open: true,
        },
      },
      commonKeys.secretKey,
      {
        keyId: "key-id-one",
        keyIssuer: "payment-processor.com",
        keyExpiration: "2025-11-11",
        issuer: "qrCrypto.com",
        expiresIn: "5m",
      },
    );

    expect(token).toBeDefined();
  });

  test("Should create payment instruction token with valid payload: is_open: false", async () => {
    const builder = new PaymentInstructionsBuilder();

    const token = await builder.create(
      {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          network: NetworkCode.TRON,
          coin: CoinCode.TRON_USDT,
          is_open: false,
          amount: "100",
        },
      },
      commonKeys.secretKey,
      {
        keyId: "key-id-one",
        keyIssuer: "payment-processor.com",
        keyExpiration: "2025-11-11",
        issuer: "qrCrypto.com",
        expiresIn: "5m",
      },
    );

    expect(token).toBeDefined();
  });

  test("Should create url payload token", async () => {
    const builder = new PaymentInstructionsBuilder();

    const token = await builder.create(
      {
        url: "https://www.my-ecommerce.com/checkout?id=lasdh-asdlsa-ads",
      },
      commonKeys.secretKey,
      {
        keyId: "key-id-one",
        keyIssuer: "payment-processor.com",
        keyExpiration: "2025-11-11",
        issuer: "qrCrypto.com",
        subject: "my-ecommerce.com",
        expiresIn: "5m",
      },
    );

    expect(token).toBeDefined();
  });

  test("Should read payment instruction token", async () => {
    const builder = new PaymentInstructionsBuilder();

    const token = await builder.create(
      {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          network: NetworkCode.TRON,
          coin: CoinCode.TRON_USDT,
          is_open: false,
          amount: "100",
        },
      },
      commonKeys.secretKey,
      {
        keyId: "key-id-one",
        keyIssuer: "payment-processor.com",
        keyExpiration: "2025-11-11",
        issuer: "qrCrypto.com",
        subject: "my-ecommerce.com",
        expiresIn: "5m",
        assertion: commonKeys.publicKey,
      },
    );

    const reader = new PaymentInstructionsReader();

    const data = await reader.read({
      qrPayment: token,
      publicKey: commonKeys.publicKey,
      options: {
        keyId: "key-id-one",
        keyIssuer: "payment-processor.com",
        issuer: "qrCrypto.com",
      },
    });

    expect(data).toBeDefined();
  });

  test("Should read payment instruction token with invalid issuer domain and fail", async () => {
    const builder = new PaymentInstructionsBuilder();

    const token = await builder.create(
      {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          network: NetworkCode.TRON,
          coin: CoinCode.TRON_USDT,
          is_open: false,
          amount: "100",
        },
      },
      commonKeys.secretKey,
      {
        keyId: "key-id-one",
        keyIssuer: "payment-processor.com",
        keyExpiration: "2025-11-11",
        issuer: "qrCrypto.com",
        subject: "my-ecommerce.com",
        expiresIn: "5m",
        assertion: commonKeys.publicKey,
      },
    );

    const reader = new PaymentInstructionsReader();

    expect(async () => {
      await reader.read({
        qrPayment: token,
        publicKey: commonKeys.publicKey,
        options: {
          keyId: "key-id-one",
          keyIssuer: "payment-processor.com",
          issuer: "invalid-issuer-domain.com",
        },
      });
    }).rejects.toThrow("issuer mismatch");
  });

  test("Should read url payload token with invalid keyIssuer and fail", async () => {
    const builder = new PaymentInstructionsBuilder();

    const token = await builder.create(
      {
        url: "http://test.com/checkout?id=test-id",
      },
      commonKeys.secretKey,
      {
        keyId: "key-id-one",
        keyIssuer: "payment-processor.com",
        keyExpiration: "2025-11-11",
        issuer: "qrCrypto.com",
        subject: "my-ecommerce.com",
        expiresIn: "5m",
        assertion: commonKeys.publicKey,
      },
    );

    const reader = new PaymentInstructionsReader();

    expect(async () => {
      await reader.read({
        qrPayment: token,
        publicKey: commonKeys.publicKey,
        options: {
          keyIssuer: "other-issuer.com",
        },
      });
    }).rejects.toThrow("Invalid Key Issuer");
  });
});
