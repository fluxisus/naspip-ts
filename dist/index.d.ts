import * as paseto from 'paseto';
import { ProduceOptions, ConsumeOptions } from 'paseto';

type AssymetricKey = "paserk";
type PasetoTokenContext = "public";
declare class PasetoV4Handler {
    generateKey(purpose: PasetoTokenContext, options: {
        format: AssymetricKey;
    }): Promise<{
        secretKey: string;
        publicKey: string;
    }>;
    decode(token: string): {
        footer: any;
        payload?: Record<string, unknown> | undefined;
        purpose: "local" | "public";
        version: string;
    };
    sign(payload: Record<string, any>, privateKey: string, options?: ProduceOptions): Promise<string>;
    verify(token: string, publicKey: string, options?: ConsumeOptions<true>): Promise<paseto.CompleteResult<Record<string, unknown>>>;
}

export { PasetoV4Handler };
