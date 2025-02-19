import {
  PaymentInstructionsBuilder,
  PaymentInstructionsReader,
} from "../src/payment-instruction";
import { InstructionPayload } from "../src/types";
import { PasetoV4Handler } from "../src/utils";

async function main() {
  console.log("start script");

  const issuer = "https://example.com";

  const reader = new PaymentInstructionsReader();

  const { publicKey, secretKey } = await PasetoV4Handler.generateKey("public", {
    format: "paserk",
  });

  console.log({ publicKey, secretKey });

  const builder = new PaymentInstructionsBuilder();
  const payload: InstructionPayload = {
    payment: {
      id: "id",
      address: "string",
      network_token: "ntrc20_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      is_open: false,
      amount: "1",
      expires_at: new Date().valueOf() + 5 * 60 * 1000,
    },
    order: {
      total_amount: "1",
      coin_code: "USDT",
      items: [
        {
          description: "itemName",
          coin_code: "USDT",
          amount: "1",
          quantity: 1,
        },
      ],
      merchant: {
        name: "merchantName",
      },
    },
  };
  const qrCrypto = await builder.create(payload, secretKey, {
    keyId: "key-id-one",
    keyIssuer: "testing.com",
    expiresIn: "1h",
    keyExpiration: "1h",
    issuer,
    assertion: publicKey,
  });
  console.log("payload valid and token created:", { qrCrypto });

  const data = await reader.read({
    qrPayment: qrCrypto,
    publicKey,
    options: { issuer },
  });

  console.log(JSON.stringify(data, null, 2));
}

void main()
  .catch((error) => console.error(error))
  .then(() => process.exit());
