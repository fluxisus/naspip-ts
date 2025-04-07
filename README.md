# NASPIP - Network-Agnostic Secure Payment Instructions Protocol (TypeScript)

[![npm version](https://img.shields.io/npm/v/naspip-ts.svg)](https://www.npmjs.com/package/naspip-ts)
[![License](https://img.shields.io/npm/l/naspip-ts.svg)](LICENSE)

TypeScript library implementing the Network-Agnostic Secure Payment Instructions Protocol (NASPIP). This library enables the creation and validation of standardized payment instructions for cryptocurrencies and other digital assets.

## Overview

NASPIP proposes a secure and standardized format for sharing payment instructions.

It uses [**PASETO V4 Token**](https://paseto.io/) technology with asymmetric signature (`private/public key pair`) as a standard to validate the information, and establishes the data structure for payment instructions.

This protocol enables secure interoperability between payment/collection platforms and facilitates the generation of a user-friendly UI/UX for the adoption of cryptocurrency payment methods.

## Installation

```bash
npm install @fluxisus/naspip-ts
```

## Usage Examples

### Create a Payment Instruction

```typescript
import { PasetoV4Handler } from 'naspip-ts/utils';
import { PaymentInstructionsBuilder } from 'naspip-ts/payment-instruction';
import { InstructionPayload, TokenCreateOptions } from 'naspip-ts/types';

async function main() {
  // Create a PASETO handler
  const pasetoHandler = new PasetoV4Handler();

  // Generate a key pair (for example purposes)
  const keys = await PasetoV4Handler.generateKey('public', { format: "paserk" });

  // Create a payment instructions builder
  const builder = new PaymentInstructionsBuilder(pasetoHandler);

  // Create a payment instruction
  const paymentInstruction: InstructionPayload = {
    payment: {
      id: "payment123",
      address: "TRjE1H8dxypKM1NZRdysbs9wo7huR4bdNz",
      unique_asset_id: "ntrc20_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      is_open: false,
      amount: "10.52",
      expires_at: Date.now() + 3600000, // 1 hour
    },
    order: {
      total: "10.52",
      coin_code: "USD",
      description: "Payment for XYZ service",
      merchant: {
        name: "My Store",
      },
    },
  };

  // Options for token creation
  const options: TokenCreateOptions = {
    issuer: "my-company-name",
    expiresIn: "3h",
    assertion: keys.publicKey,
    keyId: "my-key-id",
    keyIssuer: "my-key-issuer",
    keyExpiration: new Date(
      Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 10 years
  };

  // Create the signed payment instruction
  const token = await builder.create(paymentInstruction, keys.secretKey, options);

  // Print the NASPIP token
  console.log(`QR Token: ${token}`);
}

main().catch(console.error);
```

### Read and Verify a Payment Instruction

```typescript
import { PasetoV4Handler } from 'naspip-ts/utils';
import { PaymentInstructionsReader } from 'naspip-ts/payment-instruction';

async function main() {
  // NASPIP token (obtained from a QR or link)
  const naspipToken = "naspip;my-key-issuer;my-key-id;v4.public.eyJkYXRhIjp7..."; // Token truncated for brevity

  // Issuer's public key
  const publicKey = "issuer-public-key"; // Could be paserk format

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
  const result = await builder.read({ naspipToken, publicKey, options });

  // Process the result
  console.log("Verified payment instruction:", result);
}

main().catch(console.error);
```

### Create a Payment Link

```typescript
import { PasetoV4Handler } from 'naspip-ts/utils';
import { PaymentInstructionsBuilder } from 'naspip-ts/payment-instruction';
import { UrlPayload, TokenCreateOptions } from 'naspip-ts/types';

async function main() {
  // Create a PASETO handler
  const pasetoHandler = new PasetoV4Handler();

  // Generate a key pair (for example purposes)
  const keys = await PasetoV4Handler.generateKey('public', { format: "paserk" });

  // Create a payment instructions builder
  const builder = new PaymentInstructionsBuilder(pasetoHandler);

  // Create a URL payload
  const urlPayload: UrlPayload = {
    url: "https://mystore.com/payments/123",
    payment_options: [
      "narbitrum_t0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      "navalanche_t0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    ],
    order: {
      total: "100",
      coin_code: "USD",
      description: "Purchase from My Store",
    },
  };

  // Options for token creation
  const options = {
    keyId: "key1",
    assertion: keys.publicKey,
    keyIssuer: "mycompany",
    keyExpiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
  };

  // Create the URL token
  const token = await builder.create(urlPayload, keys.secretKey, options);

  // Print the NASPIP token
  console.log(`QR Token: ${token}`);
}

main().catch(console.error);
```

## NASPIP Protocol Implementation

### Key Components

NASPIP is built on the following technologies:

1. **PASETO v4**: Platform-Agnostic Security Tokens for the signing and verification of tokens.
2. **Protocol Buffers**: For efficient data serialization.
3. **Asymmetric Cryptography**: Public/private key pairs to ensure authenticity and integrity.

### NASPIP Token Structure

A NASPIP token has the format:

```
naspip;[key-issuer];[key-id];[paseto-token]
```

Where:

* `naspip`: Fixed prefix that identifies the protocol
* `[key-issuer]`: Identifies who issued the key
* `[key-id]`: Unique identifier of the key used
* `[paseto-token]`: PASETO v4 token containing the signed data

### Payload Types

The protocol supports two main payload types:

1. **InstructionPayload**: Contains complete payment instructions  
   * Payment information (address, amount, asset, etc.)  
   * Optional order information (total, merchant, description, etc.)
2. **UrlPayload**: Contains a URL that directs to a service that will generate the instructions  
   * Destination URL  
   * Available payment options  
   * Optional order information

### Security

* **Asymmetric Signatures**: Ensures that only the private key holder can generate valid tokens
* **Date Validation**: Tokens have expiration dates to limit their validity
* **Key Identifiers**: Allow for key rotation and identifiers

### Protocol Advantages

1. **Standardization**: Single format for sharing payment instructions
2. **Security**: Cryptographic verification of instruction authenticity
3. **Flexibility**: Supports various asset types and variable amounts
4. **Interoperability**: Facilitates communication between different platforms and wallets
5. **Enhanced User Experience**: Enables the creation of user-friendly interfaces for cryptocurrency payments/transfers

## Features

* **Secure:** NASPIP implements an asymmetric encryption scheme, so that the payer can verify/validate the information generated by the collector.
* **Agnostic:** Can be used for any network and currency/token.
* **Interoperable:** Anyone can implement the protocol for reading and writing.
* **Easy to implement:** The implementation to read/write NASPIP Tokens is completely independent of who wants to use it.
* **Flexible:** Supports typical open/closed amount payment flows and dynamic/static payment data.

## Protocol Buffers Setup

### Installation

1. Install the protocol buffer compiler (protoc):

```bash
# Ubuntu/Debian
sudo apt install -y protobuf-compiler

# MacOS
brew install protobuf

# Verify installation
protoc --version
```

2. Install Node libraries:

```bash
npm install
```

### Usage

1. The protocol buffer definitions are in `src/encoding/protobuf/model.proto`

2. To compile the protocol buffer definitions:

```bash
# From the project root
npm run protoc
```

3. The generated code will be placed in the same directory as the .proto file

### Development

When modifying the protocol buffer definitions:
1. Edit `src/encoding/protobuf/model.proto`
2. Recompile using the protoc command above
3. The generated TypeScript code will be updated automatically

## Contributing

We welcome contributions to the NASPIP TypeScript implementation! Here's how you can help:

### Reporting Issues

* Use the GitHub issue tracker to report bugs
* Describe what you expected to happen and what actually happened
* Include Node.js version, OS, and steps to reproduce the issue

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests and ensure they pass
5. Push to your fork: `git push origin feature/your-feature-name`
6. Submit a pull request

### Development Guidelines

* Follow TypeScript best practices and style conventions
* Write tests for new code
* Document new methods and types
* Keep the API backward compatible when possible
* Run `npm run lint` and `npm run test` before committing

### Code of Conduct

* Be respectful in your interactions
* Focus on what is best for the community
* Welcome newcomers and encourage new contributors

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for more details.