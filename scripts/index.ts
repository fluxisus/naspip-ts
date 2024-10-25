import { PaymentInstructionsBuilder } from "../src/payment-instruction";
import { CoinCode, InstructionPayload, NetworkCode } from "../src/types";
import { PasetoV4Handler } from "../src/utils";
async function main() {
  console.log("start script");

  const cpsp = new PasetoV4Handler();

  const { publicKey, secretKey } = await PasetoV4Handler.generateKey("public", {
    format: "paserk",
  });

  console.log({ publicKey, secretKey });

  const builder = new PaymentInstructionsBuilder({
    privateKey: secretKey,
    issuerDomain: "https://example.com",
    keyId: "key-id-one",
  });
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
  const pasetoToken = await builder.createPaymentInstructionToken(payload);
  console.log("payload valid and token created:", { pasetoToken });

  const decodedToken = cpsp.decode(pasetoToken);

  console.log(JSON.stringify(decodedToken, null, 2));

  const tokenVerification = await cpsp.verify(pasetoToken, publicKey);

  console.log({ tokenVerification });
}

void main()
  .catch((error) => console.error(error))
  .then(() => process.exit());
