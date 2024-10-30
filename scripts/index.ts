import {
  PaymentInstructionsBuilder,
  PaymentInstructionsReader,
} from "../src/payment-instruction";
import { CoinCode, InstructionPayload, NetworkCode } from "../src/types";
import { PasetoV4Handler } from "../src/utils";

async function main() {
  console.log("start script");

  const issuer = "https://example.com";

  const reader = new PaymentInstructionsReader();

  const { publicKey, secretKey } = await PasetoV4Handler.generateKey("public", {
    format: "paserk",
  });

  console.log({ publicKey, secretKey });

  const builder = new PaymentInstructionsBuilder(issuer);
  const payload: InstructionPayload = {
    payment: {
      id: "id",
      address: "string",
      network_code: NetworkCode.TRON,
      coin_code: CoinCode.TRON_USDT,
      is_open: false,
      amount: "1",
    },
    order: {
      total_amount: "1",
      coin_code: CoinCode.TRON_USDT,
      items: [
        {
          title: "itemName",
          coin_code: CoinCode.TRON_USDT,
          amount: "1",
          quantity: 1,
        },
      ],
      merchant: {
        name: "merchantName",
      },
    },
  };
  const qrCrypto = await builder.create({
    payload,
    secretKey,
    keyId: "key-id-one",
  });
  console.log("payload valid and token created:", { qrCrypto });

  const data = await reader.read({
    qrCrypto,
    publicKey,
    issuerDomain: issuer,
  });

  console.log(JSON.stringify(data, null, 2));
}

void main()
  .catch((error) => console.error(error))
  .then(() => process.exit());
