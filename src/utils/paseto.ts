import { ConsumeOptions, decode, ProduceOptions, V4 } from "paseto";

type AssymetricKey = "paserk";
type PasetoTokenContext = "public";

export class PasetoV4Handler {
  /*
Claims reserved
+-----+------------+--------+-------------------------------------+
| Key |    Name    |  Type  |               Example               |
+-----+------------+--------+-------------------------------------+
| iss |   Issuer   | string |       {"iss":"paragonie.com"}       |
| sub |  Subject   | string |            {"sub":"test"}           |
| aud |  Audience  | string |       {"aud":"pie-hosted.com"}      |
| exp | Expiration | DtTime | {"exp":"2039-01-01T00:00:00+00:00"} |
| nbf | Not Before | DtTime | {"nbf":"2038-04-01T00:00:00+00:00"} |
| iat | Issued At  | DtTime | {"iat":"2038-03-17T00:00:00+00:00"} |
| jti |  Token ID  | string |  {"jti":"87IFSGFgPNtQNNuw0AtuLttP"} |
| kid |   Key-ID   | string |    {"kid":"stored-in-the-footer"}   |
+-----+------------+--------+-------------------------------------+
*/
  public generateKey(
    purpose: PasetoTokenContext,
    options: { format: AssymetricKey },
  ) {
    return V4.generateKey(purpose, options);
  }

  public decode(token: string) {
    const data = decode(token);

    try {
      const footer = JSON.parse(data.footer?.toString() ?? "");
      return { ...data, footer };
    } catch {
      //
    }

    return { ...data, footer: data.footer?.toString() };
  }

  public async sign(
    payload: Record<string, any>,
    privateKey: string,
    options?: ProduceOptions,
  ) {
    return V4.sign(payload, privateKey, options);
  }

  public async verify(
    token: string,
    publicKey: string,
    options?: ConsumeOptions<true>,
  ) {
    return V4.verify(token, publicKey, options);
  }
}
