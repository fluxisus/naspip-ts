import { PasetoV4Handler } from "../src/utils";
import { PaymentInstructionsReader } from "../src/payment-instruction";
//import { InstructionPayload, TokenCreateOptions } from "../src/types";

async function main() {
  // Create a PASETO handler
  const naspipToken =
    "naspip;my-key-issuer;my-key-id;v4.public.Cg9teS1jb21wYW55LW5hbWUiGDIwMjUtMDQtMDdUMjM6NTM6NDUuOTUxWjIYMjAyNS0wNC0wN1QyMDo1Mzo0NS45NTFaQglteS1rZXktaWRKGDIwMzUtMDQtMDVUMjA6NTM6NDUuOTQ5WlINbXkta2V5LWlzc3VlclqfAQpqCgpwYXltZW50MTIzEiJUUmpFMUg4ZHh5cEtNMU5aUmR5c2JzOXdvN2h1UjRiZE56IipudHJjMjBfdFRSN05IcWplS1F4R1RDaThxOFpZNHBMOG90U3pnakxqNnQyBTEwLjUySN2L-5HhMhIxCgUxMC41MhIDVVNEGhdQYXltZW50IGZvciBYWVogc2VydmljZSIKCghNeSBTdG9yZSJr_pMJrWKqwdmjBL9Y8VV7vNKuue9rOFKVeByeUBmgC7Yf0S4scULu01Wh7cyWub-MQZrb7rfy_fvIPdzEJwo"; // Token truncated for brevity

  // Issuer's public key
  const publicKey = "k4.public.vReOu5eFs0HYCYndN_fKrJM6e_VoidRcDAyIFLAtOEg"; // Could be paserk format

  // Create a PASETO handler
  const pasetoHandler = new PasetoV4Handler();

  // Create a payment instructions builder
  const builder = new PaymentInstructionsReader(pasetoHandler);

  // Reading options
  const options = {
    keyId: "my-key-id",
    keyIssuer: "my-key-issuer",
  };

  // Read and verify the token
  const result = await builder.read({
    naspipToken,
    publicKey,
    options,
  });

  // Process the result
  console.log(
    "Verified payment instruction:",
    (result.payload.data as any).payment,
  );
}

main().catch(console.error);
