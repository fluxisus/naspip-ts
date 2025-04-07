import {
  PaymentInstructionsBuilder,
  PaymentInstructionsReader,
} from "../src/payment-instruction";
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
    const builder = new PaymentInstructionsBuilder(new PasetoV4Handler());

    const token = await builder.create(
      {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          unique_asset_id: "ntrc20_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          is_open: true,
          expires_at: new Date().valueOf() + 5 * 60 * 1000,
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
    const builder = new PaymentInstructionsBuilder(new PasetoV4Handler());

    const token = await builder.create(
      {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          unique_asset_id: "ntrc20_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          is_open: false,
          amount: "100",
          expires_at: new Date().valueOf() + 5 * 60 * 1000,
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
    const builder = new PaymentInstructionsBuilder(new PasetoV4Handler());

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

  test("Should create url payload token with options", async () => {
    const builder = new PaymentInstructionsBuilder(new PasetoV4Handler());

    const token = await builder.create(
      {
        url: "https://www.my-ecommerce.com/checkout?id=lasdh-asdlsa-ads",
        payment_options: [
          "ntrc20_tcontract-token-1",
          "npolygon_tcontract_address_usdt",
        ],
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

  test("Should create url payload token with options and order", async () => {
    const builder = new PaymentInstructionsBuilder(new PasetoV4Handler());

    const token = await builder.create(
      {
        url: "https://www.my-ecommerce.com/checkout?id=lasdh-asdlsa-ads",
        payment_options: [
          "ntrc20_tcontract-token-1",
          "npolygon_tcontract_address_usdt",
        ],
        order: {
          total: "1000",
          coin_code: "USD",
          description: "T-Shirt",
          merchant: { name: "Ecommerce" },
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
      },
    );

    expect(token).toBeDefined();
  });

  test("Should read payment instruction token", async () => {
    const builder = new PaymentInstructionsBuilder(new PasetoV4Handler());

    const token = await builder.create(
      {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          unique_asset_id: "ntrc20_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          is_open: false,
          amount: "100",
          expires_at: new Date().valueOf() + 5 * 60 * 1000,
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

    const reader = new PaymentInstructionsReader(new PasetoV4Handler());

    const data = await reader.read({
      naspipToken: token,
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
    const builder = new PaymentInstructionsBuilder(new PasetoV4Handler());

    const token = await builder.create(
      {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          unique_asset_id: "ntrc20_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          is_open: false,
          amount: "100",
          expires_at: new Date().valueOf() + 5 * 60 * 1000,
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

    const reader = new PaymentInstructionsReader(new PasetoV4Handler());

    expect(async () => {
      await reader.read({
        naspipToken: token,
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
    const builder = new PaymentInstructionsBuilder(new PasetoV4Handler());

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

    const reader = new PaymentInstructionsReader(new PasetoV4Handler());

    expect(async () => {
      await reader.read({
        naspipToken: token,
        publicKey: commonKeys.publicKey,
        options: {
          keyIssuer: "other-issuer.com",
        },
      });
    }).rejects.toThrow("Invalid Key Issuer");
  });
});
