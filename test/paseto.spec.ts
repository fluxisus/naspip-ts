import { PaymentInstructionsBuilder } from "../src/payment-instruction";
import { CoinCode, NetworkCode } from "../src/types";
import { PasetoV4Handler } from "../src/utils";

let paseto: PasetoV4Handler;
let builder: PaymentInstructionsBuilder;
let commonKeys: {
  publicKey: string;
  secretKey: string;
};

let pasetoToken: string;

beforeAll(async () => {
  paseto = new PasetoV4Handler();
  builder = new PaymentInstructionsBuilder("qrCrypto.com");
  commonKeys = await PasetoV4Handler.generateKey("public", {
    format: "paserk",
  });

  pasetoToken = await createTestToken();
});

describe("Paseto Test", () => {
  test("Should create private/public key pair", async () => {
    const keys = await PasetoV4Handler.generateKey("public", {
      format: "paserk",
    });

    expect(keys.publicKey).toBeDefined();
    expect(keys.secretKey).toBeDefined();
  });

  test("Should decode token", async () => {
    const decoded = paseto.decode(pasetoToken);

    expect(decoded).toBeDefined();
    expect(decoded.version).toBe("v4");
    expect(decoded.purpose).toBe("public");
    expect(decoded.footer).toBeUndefined();
    expect(decoded.payload?.iat).toBeDefined();
  });

  test("Should sign token and verify it", async () => {
    const signed = await paseto.sign(
      {
        payload: "test",
      },
      commonKeys.secretKey,
    );

    const verified = await paseto.verify(signed, commonKeys.publicKey);

    expect(signed).toBeDefined();
    expect(verified).toBeDefined();
    expect(verified.payload).toBe("test");
  });

  test("Should fail to sign and retrieve a token", async () => {
    expect(async () => {
      await paseto.sign(
        {
          payload: "test",
        },
        "not-secret-key",
      );
    }).rejects.toThrow("invalid key provided");
  });

  test("Should not verify a token with wrong public key", async () => {
    expect(async () => {
      await paseto.verify(pasetoToken, "not-public-key");
    }).rejects.toThrow("invalid key provided");
  });

  test("Should not verify a token with wrong token format", async () => {
    expect(async () => {
      await paseto.verify("not-token", commonKeys.publicKey);
    }).rejects.toThrow("token is not a v4.public PASETO");
  });

  test("Should not verify a token with expired time", async () => {
    const expiredToken = await paseto.sign(
      {
        payload: "test",
      },
      commonKeys.secretKey,
      { expiresIn: "0s" },
    );

    expect(async () => {
      await paseto.verify(expiredToken, commonKeys.publicKey);
    }).rejects.toThrow("token is expired");
  });

  test("Should not verify a token with wrong issuer domain", async () => {
    expect(async () => {
      await paseto.verify(pasetoToken, commonKeys.publicKey, {
        issuer: "not-issuer-domain",
      });
    }).rejects.toThrow("issuer mismatch");
  });
});

async function createTestToken() {
  const keyId = "key-id-one";

  const qrCryptoToken = await builder.create({
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

  return qrCryptoToken.slice(10);
}
