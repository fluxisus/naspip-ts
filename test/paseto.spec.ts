import { PasetoV4Handler } from "../src/utils";

describe("Paseto Test", () => {
  test("Should create private/public key pair", async () => {
    const keys = await PasetoV4Handler.generateKey("public", {
      format: "paserk",
    });

    expect(keys.publicKey).toBeDefined();
    expect(keys.secretKey).toBeDefined();
  });
});
