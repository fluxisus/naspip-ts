import {
  PaymentInstructionsBuilder,
  PaymentInstructionsReader,
} from "../src/payment-instruction";
import { InstructionPayload } from "../src/types";
//import { PasetoV4Handler } from "../src/utils";

async function main() {
  console.log("start script");

  //const issuer = "https://example.com";

  const reader = new PaymentInstructionsReader();

  //const { publicKey, secretKey } = await PasetoV4Handler.generateKey("public", {
  //  format: "paserk",
  //});
  const publicKey = "k4.public.64FidaOnFd6IIW1jijNMq3oYjxMaKl-VEsTdceofHzA";
  const secretKey =
    "k4.secret.UMJH8KZZPYkR2LL-D0PpnhpQ7zAEWjjdL-wlJJWkNRPrgWJ1o6cV3oghbWOKM0yrehiPExoqX5USxN1x6h8fMA";

  console.log({ publicKey, secretKey });

  const builder = new PaymentInstructionsBuilder();
  const payload: InstructionPayload = {
    payment: {
      id: "6b56f488-5b35-42b7-86ed-fbd6345a72c0",
      address: "TErQ1LTzFjNfswtHcgBrQw8vd4qXDTZrNP",
      unique_asset_id: "ntrc20_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      is_open: false,
      amount: "100.50",
      expires_at: new Date().valueOf() + 60 * 60 * 1000,
    },
    order: {
      total: "100500.00",
      coin_code: "ARS",
      description: "Test payment",
      items: [
        {
          description: "itemName",
          coin_code: "ARS",
          amount: "100500.00",
          quantity: 1,
        },
      ],
      merchant: {
        name: "Test Merchant",
      },
    },
  };
  //const payload: UrlPayload = {
  //  url: "https://example.com",
  //};

  const qrCrypto = await builder.create(payload, secretKey, {
    keyId: "test-key-1",
    keyIssuer: "test-issuer",
    expiresIn: "1h",
    keyExpiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    assertion: publicKey,
  });
  console.log("payload valid and token created:", {
    qrCrypto,
    length: qrCrypto.length,
  });

  const data = await reader.read({
    qrPayment: qrCrypto,
    publicKey,
    //options: { issuer },
  });

  console.log(JSON.stringify(data, null, 2));
}

void main()
  .catch((error) => console.error(error))
  .then(() => process.exit());
