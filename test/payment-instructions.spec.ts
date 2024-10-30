import { PaymentInstructionsBuilder, PaymentInstructionsReader } from "../src";
import { CoinCode, NetworkCode } from "../src/types";
import { PasetoV4Handler } from "../src/utils";

let builder: PaymentInstructionsBuilder;
let reader: PaymentInstructionsReader;
let commonKeys: {
  publicKey: string;
  secretKey: string;
};

beforeAll(async () => {
  builder = new PaymentInstructionsBuilder("qrCrypto.com");
  reader = new PaymentInstructionsReader();
  commonKeys = await PasetoV4Handler.generateKey("public", {
    format: "paserk",
  });
});

describe("Payment Instructions Classes Test", () => {
  test("Should create payment instruction token with valid payload: is_open: true", async () => {
    const keyId = "key-id-one";

    const token = await builder.create({
      payload: {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          network_code: NetworkCode.TRON,
          coin_code: CoinCode.TRON_USDT,
          is_open: true,
        },
      },
      secretKey: commonKeys.secretKey,
      keyId,
      options: {
        expiresIn: "5m",
      },
    });

    expect(token).toBeDefined();
  });

  test("Should create payment instruction token with valid payload: is_open: false", async () => {
    const keyId = "key-id-one";

    const token = await builder.create({
      payload: {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          network_code: NetworkCode.TRON,
          coin_code: CoinCode.TRON_USDT,
          is_open: false,
          amount: "100",
        },
      },
      secretKey: commonKeys.secretKey,
      keyId,
      options: {
        expiresIn: "5m",
      },
    });

    expect(token).toBeDefined();
  });

  test("Should read payment instruction token", async () => {
    const issuerDomain = "qrCrypto.com";
    const keyId = "key-id-one";

    const token = await builder.create({
      payload: {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          network_code: NetworkCode.TRON,
          coin_code: CoinCode.TRON_USDT,
          is_open: false,
          amount: "100",
        },
      },
      secretKey: commonKeys.secretKey,
      keyId,
      options: {
        expiresIn: "5m",
      },
    });

    const data = await reader.read({
      qrCrypto: token,
      publicKey: commonKeys.publicKey,
      issuerDomain,
    });

    expect(data).toBeDefined();
  });

  test("Should read payment instruction token with invalid issuer domain and fail", async () => {
    const keyId = "key-id-one";

    const token = await builder.create({
      payload: {
        payment: {
          id: "payment-id",
          address: "crypto-address",
          network_code: NetworkCode.TRON,
          coin_code: CoinCode.TRON_USDT,
          is_open: false,
          amount: "100",
        },
      },
      secretKey: commonKeys.secretKey,
      keyId,
      options: {
        expiresIn: "5m",
      },
    });

    expect(async () => {
      await reader.read({
        qrCrypto: token,
        publicKey: commonKeys.publicKey,
        issuerDomain: "invalid-issuer-domain.com",
      });
    }).rejects.toThrow("issuer mismatch");
  });
});
