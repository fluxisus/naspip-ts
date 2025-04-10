// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v3.12.4
// source: src/encoding/protobuf/model.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "protobuf";

export interface PaymentInstruction {
  id: string;
  address: string;
  addressTag: string;
  uniqueAssetId: string;
  isOpen: boolean;
  amount: string;
  minAmount: string;
  maxAmount: string;
  expiresAt: number;
}

export interface InstructionMerchant {
  name: string;
  description: string;
  taxId: string;
  image: string;
  mcc: string;
}

export interface InstructionItem {
  description: string;
  amount: string;
  coinCode: string;
  unitPrice: string;
  quantity: number;
}

export interface InstructionOrder {
  total: string;
  coinCode: string;
  description: string;
  merchant: InstructionMerchant | undefined;
  items: InstructionItem[];
}

export interface InstructionPayload {
  payment: PaymentInstruction | undefined;
  order: InstructionOrder | undefined;
}

export interface UrlPayload {
  url: string;
  paymentOptions: string[];
  order: InstructionOrder | undefined;
}

export interface PasetoTokenData {
  iss: string;
  sub: string;
  aud: string;
  exp: string;
  nbf: string;
  iat: string;
  jti: string;
  kid: string;
  kep: string;
  kis: string;
  instructionPayload?: InstructionPayload | undefined;
  urlPayload?: UrlPayload | undefined;
}

function createBasePaymentInstruction(): PaymentInstruction {
  return {
    id: "",
    address: "",
    addressTag: "",
    uniqueAssetId: "",
    isOpen: false,
    amount: "",
    minAmount: "",
    maxAmount: "",
    expiresAt: 0,
  };
}

export const PaymentInstruction: MessageFns<PaymentInstruction> = {
  encode(message: PaymentInstruction, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.address !== "") {
      writer.uint32(18).string(message.address);
    }
    if (message.addressTag !== "") {
      writer.uint32(26).string(message.addressTag);
    }
    if (message.uniqueAssetId !== "") {
      writer.uint32(34).string(message.uniqueAssetId);
    }
    if (message.isOpen !== false) {
      writer.uint32(40).bool(message.isOpen);
    }
    if (message.amount !== "") {
      writer.uint32(50).string(message.amount);
    }
    if (message.minAmount !== "") {
      writer.uint32(58).string(message.minAmount);
    }
    if (message.maxAmount !== "") {
      writer.uint32(66).string(message.maxAmount);
    }
    if (message.expiresAt !== 0) {
      writer.uint32(72).int64(message.expiresAt);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PaymentInstruction {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePaymentInstruction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.address = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.addressTag = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.uniqueAssetId = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.isOpen = reader.bool();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.amount = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.minAmount = reader.string();
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.maxAmount = reader.string();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.expiresAt = longToNumber(reader.int64());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PaymentInstruction {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      address: isSet(object.address) ? globalThis.String(object.address) : "",
      addressTag: isSet(object.address_tag) ? globalThis.String(object.address_tag) : "",
      uniqueAssetId: isSet(object.unique_asset_id) ? globalThis.String(object.unique_asset_id) : "",
      isOpen: isSet(object.is_open) ? globalThis.Boolean(object.is_open) : false,
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
      minAmount: isSet(object.min_amount) ? globalThis.String(object.min_amount) : "",
      maxAmount: isSet(object.max_amount) ? globalThis.String(object.max_amount) : "",
      expiresAt: isSet(object.expires_at) ? globalThis.Number(object.expires_at) : 0,
    };
  },

  toJSON(message: PaymentInstruction): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.address !== "") {
      obj.address = message.address;
    }
    if (message.addressTag !== "") {
      obj.address_tag = message.addressTag;
    }
    if (message.uniqueAssetId !== "") {
      obj.unique_asset_id = message.uniqueAssetId;
    }
    if (message.isOpen !== false) {
      obj.is_open = message.isOpen;
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    if (message.minAmount !== "") {
      obj.min_amount = message.minAmount;
    }
    if (message.maxAmount !== "") {
      obj.max_amount = message.maxAmount;
    }
    if (message.expiresAt !== 0) {
      obj.expires_at = Math.round(message.expiresAt);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PaymentInstruction>, I>>(base?: I): PaymentInstruction {
    return PaymentInstruction.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PaymentInstruction>, I>>(object: I): PaymentInstruction {
    const message = createBasePaymentInstruction();
    message.id = object.id ?? "";
    message.address = object.address ?? "";
    message.addressTag = object.addressTag ?? "";
    message.uniqueAssetId = object.uniqueAssetId ?? "";
    message.isOpen = object.isOpen ?? false;
    message.amount = object.amount ?? "";
    message.minAmount = object.minAmount ?? "";
    message.maxAmount = object.maxAmount ?? "";
    message.expiresAt = object.expiresAt ?? 0;
    return message;
  },
};

function createBaseInstructionMerchant(): InstructionMerchant {
  return { name: "", description: "", taxId: "", image: "", mcc: "" };
}

export const InstructionMerchant: MessageFns<InstructionMerchant> = {
  encode(message: InstructionMerchant, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.taxId !== "") {
      writer.uint32(26).string(message.taxId);
    }
    if (message.image !== "") {
      writer.uint32(34).string(message.image);
    }
    if (message.mcc !== "") {
      writer.uint32(42).string(message.mcc);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): InstructionMerchant {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInstructionMerchant();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.description = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.taxId = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.image = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.mcc = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): InstructionMerchant {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      taxId: isSet(object.tax_id) ? globalThis.String(object.tax_id) : "",
      image: isSet(object.image) ? globalThis.String(object.image) : "",
      mcc: isSet(object.mcc) ? globalThis.String(object.mcc) : "",
    };
  },

  toJSON(message: InstructionMerchant): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.taxId !== "") {
      obj.tax_id = message.taxId;
    }
    if (message.image !== "") {
      obj.image = message.image;
    }
    if (message.mcc !== "") {
      obj.mcc = message.mcc;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<InstructionMerchant>, I>>(base?: I): InstructionMerchant {
    return InstructionMerchant.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<InstructionMerchant>, I>>(object: I): InstructionMerchant {
    const message = createBaseInstructionMerchant();
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.taxId = object.taxId ?? "";
    message.image = object.image ?? "";
    message.mcc = object.mcc ?? "";
    return message;
  },
};

function createBaseInstructionItem(): InstructionItem {
  return { description: "", amount: "", coinCode: "", unitPrice: "", quantity: 0 };
}

export const InstructionItem: MessageFns<InstructionItem> = {
  encode(message: InstructionItem, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.description !== "") {
      writer.uint32(10).string(message.description);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    if (message.coinCode !== "") {
      writer.uint32(26).string(message.coinCode);
    }
    if (message.unitPrice !== "") {
      writer.uint32(34).string(message.unitPrice);
    }
    if (message.quantity !== 0) {
      writer.uint32(40).int32(message.quantity);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): InstructionItem {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInstructionItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.description = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.amount = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.coinCode = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.unitPrice = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.quantity = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): InstructionItem {
    return {
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
      coinCode: isSet(object.coin_code) ? globalThis.String(object.coin_code) : "",
      unitPrice: isSet(object.unit_price) ? globalThis.String(object.unit_price) : "",
      quantity: isSet(object.quantity) ? globalThis.Number(object.quantity) : 0,
    };
  },

  toJSON(message: InstructionItem): unknown {
    const obj: any = {};
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    if (message.coinCode !== "") {
      obj.coin_code = message.coinCode;
    }
    if (message.unitPrice !== "") {
      obj.unit_price = message.unitPrice;
    }
    if (message.quantity !== 0) {
      obj.quantity = Math.round(message.quantity);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<InstructionItem>, I>>(base?: I): InstructionItem {
    return InstructionItem.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<InstructionItem>, I>>(object: I): InstructionItem {
    const message = createBaseInstructionItem();
    message.description = object.description ?? "";
    message.amount = object.amount ?? "";
    message.coinCode = object.coinCode ?? "";
    message.unitPrice = object.unitPrice ?? "";
    message.quantity = object.quantity ?? 0;
    return message;
  },
};

function createBaseInstructionOrder(): InstructionOrder {
  return { total: "", coinCode: "", description: "", merchant: undefined, items: [] };
}

export const InstructionOrder: MessageFns<InstructionOrder> = {
  encode(message: InstructionOrder, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.total !== "") {
      writer.uint32(10).string(message.total);
    }
    if (message.coinCode !== "") {
      writer.uint32(18).string(message.coinCode);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.merchant !== undefined) {
      InstructionMerchant.encode(message.merchant, writer.uint32(34).fork()).join();
    }
    for (const v of message.items) {
      InstructionItem.encode(v!, writer.uint32(42).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): InstructionOrder {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInstructionOrder();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.total = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.coinCode = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.description = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.merchant = InstructionMerchant.decode(reader, reader.uint32());
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.items.push(InstructionItem.decode(reader, reader.uint32()));
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): InstructionOrder {
    return {
      total: isSet(object.total) ? globalThis.String(object.total) : "",
      coinCode: isSet(object.coin_code) ? globalThis.String(object.coin_code) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      merchant: isSet(object.merchant) ? InstructionMerchant.fromJSON(object.merchant) : undefined,
      items: globalThis.Array.isArray(object?.items) ? object.items.map((e: any) => InstructionItem.fromJSON(e)) : [],
    };
  },

  toJSON(message: InstructionOrder): unknown {
    const obj: any = {};
    if (message.total !== "") {
      obj.total = message.total;
    }
    if (message.coinCode !== "") {
      obj.coin_code = message.coinCode;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.merchant !== undefined) {
      obj.merchant = InstructionMerchant.toJSON(message.merchant);
    }
    if (message.items?.length) {
      obj.items = message.items.map((e) => InstructionItem.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<InstructionOrder>, I>>(base?: I): InstructionOrder {
    return InstructionOrder.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<InstructionOrder>, I>>(object: I): InstructionOrder {
    const message = createBaseInstructionOrder();
    message.total = object.total ?? "";
    message.coinCode = object.coinCode ?? "";
    message.description = object.description ?? "";
    message.merchant = (object.merchant !== undefined && object.merchant !== null)
      ? InstructionMerchant.fromPartial(object.merchant)
      : undefined;
    message.items = object.items?.map((e) => InstructionItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseInstructionPayload(): InstructionPayload {
  return { payment: undefined, order: undefined };
}

export const InstructionPayload: MessageFns<InstructionPayload> = {
  encode(message: InstructionPayload, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.payment !== undefined) {
      PaymentInstruction.encode(message.payment, writer.uint32(10).fork()).join();
    }
    if (message.order !== undefined) {
      InstructionOrder.encode(message.order, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): InstructionPayload {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInstructionPayload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.payment = PaymentInstruction.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.order = InstructionOrder.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): InstructionPayload {
    return {
      payment: isSet(object.payment) ? PaymentInstruction.fromJSON(object.payment) : undefined,
      order: isSet(object.order) ? InstructionOrder.fromJSON(object.order) : undefined,
    };
  },

  toJSON(message: InstructionPayload): unknown {
    const obj: any = {};
    if (message.payment !== undefined) {
      obj.payment = PaymentInstruction.toJSON(message.payment);
    }
    if (message.order !== undefined) {
      obj.order = InstructionOrder.toJSON(message.order);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<InstructionPayload>, I>>(base?: I): InstructionPayload {
    return InstructionPayload.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<InstructionPayload>, I>>(object: I): InstructionPayload {
    const message = createBaseInstructionPayload();
    message.payment = (object.payment !== undefined && object.payment !== null)
      ? PaymentInstruction.fromPartial(object.payment)
      : undefined;
    message.order = (object.order !== undefined && object.order !== null)
      ? InstructionOrder.fromPartial(object.order)
      : undefined;
    return message;
  },
};

function createBaseUrlPayload(): UrlPayload {
  return { url: "", paymentOptions: [], order: undefined };
}

export const UrlPayload: MessageFns<UrlPayload> = {
  encode(message: UrlPayload, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    for (const v of message.paymentOptions) {
      writer.uint32(18).string(v!);
    }
    if (message.order !== undefined) {
      InstructionOrder.encode(message.order, writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UrlPayload {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUrlPayload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.url = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.paymentOptions.push(reader.string());
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.order = InstructionOrder.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UrlPayload {
    return {
      url: isSet(object.url) ? globalThis.String(object.url) : "",
      paymentOptions: globalThis.Array.isArray(object?.payment_options)
        ? object.payment_options.map((e: any) => globalThis.String(e))
        : [],
      order: isSet(object.order) ? InstructionOrder.fromJSON(object.order) : undefined,
    };
  },

  toJSON(message: UrlPayload): unknown {
    const obj: any = {};
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.paymentOptions?.length) {
      obj.payment_options = message.paymentOptions;
    }
    if (message.order !== undefined) {
      obj.order = InstructionOrder.toJSON(message.order);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UrlPayload>, I>>(base?: I): UrlPayload {
    return UrlPayload.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UrlPayload>, I>>(object: I): UrlPayload {
    const message = createBaseUrlPayload();
    message.url = object.url ?? "";
    message.paymentOptions = object.paymentOptions?.map((e) => e) || [];
    message.order = (object.order !== undefined && object.order !== null)
      ? InstructionOrder.fromPartial(object.order)
      : undefined;
    return message;
  },
};

function createBasePasetoTokenData(): PasetoTokenData {
  return {
    iss: "",
    sub: "",
    aud: "",
    exp: "",
    nbf: "",
    iat: "",
    jti: "",
    kid: "",
    kep: "",
    kis: "",
    instructionPayload: undefined,
    urlPayload: undefined,
  };
}

export const PasetoTokenData: MessageFns<PasetoTokenData> = {
  encode(message: PasetoTokenData, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.iss !== "") {
      writer.uint32(10).string(message.iss);
    }
    if (message.sub !== "") {
      writer.uint32(18).string(message.sub);
    }
    if (message.aud !== "") {
      writer.uint32(26).string(message.aud);
    }
    if (message.exp !== "") {
      writer.uint32(34).string(message.exp);
    }
    if (message.nbf !== "") {
      writer.uint32(42).string(message.nbf);
    }
    if (message.iat !== "") {
      writer.uint32(50).string(message.iat);
    }
    if (message.jti !== "") {
      writer.uint32(58).string(message.jti);
    }
    if (message.kid !== "") {
      writer.uint32(66).string(message.kid);
    }
    if (message.kep !== "") {
      writer.uint32(74).string(message.kep);
    }
    if (message.kis !== "") {
      writer.uint32(82).string(message.kis);
    }
    if (message.instructionPayload !== undefined) {
      InstructionPayload.encode(message.instructionPayload, writer.uint32(90).fork()).join();
    }
    if (message.urlPayload !== undefined) {
      UrlPayload.encode(message.urlPayload, writer.uint32(98).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PasetoTokenData {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePasetoTokenData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.iss = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.sub = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.aud = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.exp = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.nbf = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.iat = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.jti = reader.string();
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.kid = reader.string();
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }

          message.kep = reader.string();
          continue;
        }
        case 10: {
          if (tag !== 82) {
            break;
          }

          message.kis = reader.string();
          continue;
        }
        case 11: {
          if (tag !== 90) {
            break;
          }

          message.instructionPayload = InstructionPayload.decode(reader, reader.uint32());
          continue;
        }
        case 12: {
          if (tag !== 98) {
            break;
          }

          message.urlPayload = UrlPayload.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PasetoTokenData {
    return {
      iss: isSet(object.iss) ? globalThis.String(object.iss) : "",
      sub: isSet(object.sub) ? globalThis.String(object.sub) : "",
      aud: isSet(object.aud) ? globalThis.String(object.aud) : "",
      exp: isSet(object.exp) ? globalThis.String(object.exp) : "",
      nbf: isSet(object.nbf) ? globalThis.String(object.nbf) : "",
      iat: isSet(object.iat) ? globalThis.String(object.iat) : "",
      jti: isSet(object.jti) ? globalThis.String(object.jti) : "",
      kid: isSet(object.kid) ? globalThis.String(object.kid) : "",
      kep: isSet(object.kep) ? globalThis.String(object.kep) : "",
      kis: isSet(object.kis) ? globalThis.String(object.kis) : "",
      instructionPayload: isSet(object.data) ? InstructionPayload.fromJSON(object.data) : undefined,
      urlPayload: isSet(object.data) ? UrlPayload.fromJSON(object.data) : undefined,
    };
  },

  toJSON(message: PasetoTokenData): unknown {
    const obj: any = {};
    if (message.iss !== "") {
      obj.iss = message.iss;
    }
    if (message.sub !== "") {
      obj.sub = message.sub;
    }
    if (message.aud !== "") {
      obj.aud = message.aud;
    }
    if (message.exp !== "") {
      obj.exp = message.exp;
    }
    if (message.nbf !== "") {
      obj.nbf = message.nbf;
    }
    if (message.iat !== "") {
      obj.iat = message.iat;
    }
    if (message.jti !== "") {
      obj.jti = message.jti;
    }
    if (message.kid !== "") {
      obj.kid = message.kid;
    }
    if (message.kep !== "") {
      obj.kep = message.kep;
    }
    if (message.kis !== "") {
      obj.kis = message.kis;
    }
    if (message.instructionPayload !== undefined) {
      obj.data = InstructionPayload.toJSON(message.instructionPayload);
    }
    if (message.urlPayload !== undefined) {
      obj.data = UrlPayload.toJSON(message.urlPayload);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PasetoTokenData>, I>>(base?: I): PasetoTokenData {
    return PasetoTokenData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PasetoTokenData>, I>>(object: I): PasetoTokenData {
    const message = createBasePasetoTokenData();
    message.iss = object.iss ?? "";
    message.sub = object.sub ?? "";
    message.aud = object.aud ?? "";
    message.exp = object.exp ?? "";
    message.nbf = object.nbf ?? "";
    message.iat = object.iat ?? "";
    message.jti = object.jti ?? "";
    message.kid = object.kid ?? "";
    message.kep = object.kep ?? "";
    message.kis = object.kis ?? "";
    message.instructionPayload = (object.instructionPayload !== undefined && object.instructionPayload !== null)
      ? InstructionPayload.fromPartial(object.instructionPayload)
      : undefined;
    message.urlPayload = (object.urlPayload !== undefined && object.urlPayload !== null)
      ? UrlPayload.fromPartial(object.urlPayload)
      : undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(int64: { toString(): string }): number {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
