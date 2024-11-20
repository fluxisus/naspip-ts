import { ConsumeOptions } from "paseto";

export enum NetworkCode {
  BSC = "BSC",
  BITCOIN = "BITCOIN",
  ERC20 = "ERC20",
  LIGHTNING = "LIGHTNING",
  LITECOIN = "LITECOIN",
  POLYGON = "POLYGON",
  SOLANA = "SOLANA",
  TRON = "TRON",
  STELLAR = "STELLAR",
}

export enum CoinCode {
  TRON_USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  POLYGON_USDT = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  POLYGON_USDC = "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
}

export interface UrlPayload {
  url: string;
}

export interface InstructionPayload {
  payment: InstructionPayment;
  order?: InstructionOrder;
}

export interface InstructionPayment {
  id: string;
  address: string;
  address_tag?: string;
  network: NetworkCode;
  coin: CoinCode; // [token SC/address, ISO 4217]
  is_open: boolean;
  amount?: string;
  min_amount?: string;
  max_amount?: string;
}

export interface InstructionMerchant {
  name: string;
  description?: string;
  tax_id?: string;
  image_url?: string;
}

export interface InstructionOrder {
  total_amount: string;
  coin_code: string; // [token SC/address, ISO 4217]
  description?: string;
  items?: InstructionItem[];
  merchant?: InstructionMerchant;
}

export interface InstructionItem {
  title: string;
  description?: string;
  amount: string;
  unit_price?: string;
  quantity?: number;
  coin_code: string;
  image_url?: string;
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
