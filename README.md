# crypto-payments-standard
Crypto payments standard TypeScript library


## Summary

This protocol proposes a security and standard format to share payment instructions.

It is proposed to use **PASETO V4 Token** technology with asymmetric signature (`private/public key pair`) as a standard to validate the information, and the data structure for payment instructions is established.

This protocol allows interoperability between collector/payer platforms in a secure manner, and allows for the generation of a friendly UI/UX for the adoption of crypto payment methods.


## Motivation
To date, there is no a ***standard protocol*** that allows sharing the information needed to make a payment in a **simple and secure format**, such as a **QR code** or **payment link**.

Many payment platforms present the information directly to the user, who has to copy and paste it into their wallet (or platforms), which is a bad experience for users who are not familiar with blockchain technology, especially considering that some blockchains require a `MEMO`.

Also, some platforms generate QR codes or links with non-standard formats, and each wallet (or platform) has to adapt to each format, which makes adoption slow and not massive. In addition, there is no way to validate the information, so the responsibility falls on the user and the platform/wallet cannot guarantee security to its user. The latter is the biggest blocker for the integration between wallets/platforms.

This **protocol** seeks to solve the two problems mentioned above, **standardized and secure information** transfer. The standardization of information facilitates integration between platforms/wallets and allows validation of the information. The security of the information is the most important, it allows both parties to validate/verify the origin of the information.

This protocol proposes a standard format of the information to be shared between collector/payer and an asymmetric signature (`private/public key pair`) that allows validating the information.

This protocol will facilitate and speed up the integration of new platforms to use crypto assets as payment methods.