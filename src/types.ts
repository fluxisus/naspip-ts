import { ConsumeOptions } from "paseto";

export interface UrlPayload {
  url: string;
  payment_options?: string[];
  order?: InstructionOrder;
}

export interface InstructionPayload {
  payment: InstructionPayment;
  order?: InstructionOrder;
}

export interface InstructionPayment {
  id: string;
  address: string;
  address_tag?: string;
  network_token: string;
  is_open: boolean;
  amount?: string;
  min_amount?: string;
  max_amount?: string;
  expires_at: number;
}

export interface InstructionMerchant {
  name: string;
  description?: string;
  tax_id?: string;
  image?: string; // url, data-uri scheme i.e. data:image/[type];base64,[base_64_encoded_file_contents]
  mcc?: string; // merchant category code. ISO 18245
}

export interface InstructionOrder {
  total_amount: string;
  coin_code: string;
  description?: string;
  merchant?: InstructionMerchant;
  items?: InstructionItem[];
}

export interface InstructionItem {
  description: string;
  amount: string;
  coin_code: string;
  unit_price?: string;
  quantity?: number;
}

export interface TokenPayload {
  iss: string;
  sub?: string;
  aud?: string;
  iat: string;
  exp: string;
  nbf?: string;
  jti?: string;
  kid: string;
  kep: string;
  kis: string;
  payload: InstructionPayload | UrlPayload;
}

export interface TokenCreateOptions extends TokenPublicKeyOptions {
  issuer?: string;
  expiresIn: string;
  subject?: string;
  audience?: string;
  assertion?: string;
}

export interface TokenPublicKeyOptions {
  keyId: string;
  keyExpiration: string;
  keyIssuer: string;
}

export interface ReadOptions extends ConsumeOptions<true> {
  keyId?: string;
  keyIssuer?: string;
  ignoreKeyExp?: boolean;
}
