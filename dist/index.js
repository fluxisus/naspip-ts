"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  InvalidKepExpired: () => InvalidKepExpired,
  InvalidPasetoClaim: () => InvalidPasetoClaim,
  InvalidPasetoPurpose: () => InvalidPasetoPurpose,
  InvalidPasetoToken: () => InvalidPasetoToken,
  InvalidPasetoVersion: () => InvalidPasetoVersion,
  InvalidPayload: () => InvalidPayload,
  InvalidQrPaymentKeyExpired: () => InvalidQrPaymentKeyExpired,
  InvalidQrPaymentKeyId: () => InvalidQrPaymentKeyId,
  InvalidQrPaymentKeyIssuer: () => InvalidQrPaymentKeyIssuer,
  InvalidQrPaymentToken: () => InvalidQrPaymentToken,
  MissingKid: () => MissingKid,
  MissingKis: () => MissingKis,
  MissingSecretKey: () => MissingSecretKey,
  PasetoV4Handler: () => PasetoV4Handler,
  PayInsError: () => PayInsError,
  PaymentInstructionsBuilder: () => PaymentInstructionsBuilder,
  PaymentInstructionsReader: () => PaymentInstructionsReader,
  biggerThanOrEqualZero: () => biggerThanOrEqualZero,
  biggerThanZero: () => biggerThanZero,
  isAfterDate: () => isAfterDate
});
module.exports = __toCommonJS(index_exports);

// src/payment-instruction.ts
var superstruct = __toESM(require("superstruct"));

// src/utils/errors.ts
var CODES = {
  InvalidPayload: "ERR_INVALID_PAYLOAD",
  MissingSecretKey: "ERR_MISSING_SECRET_KEY",
  MissingKid: "ERR_MISSING_KEY_ID",
  MissingKis: "ERR_MISSING_KEY_ISSUER",
  InvalidKepExpired: "ERR_KEY_ID_IS_EXPIRED",
  InvalidQrPaymentToken: "ERR_INVALID_QR_PAYMENT_TOKEN",
  InvalidQrPaymentKeyId: "ERR_INVALID_QR_PAYMENT_KID",
  InvalidQrPaymentKeyIssuer: "ERR_INVALID_QR_PAYMENT_KIS",
  InvalidQrPaymentKeyExpired: "ERR_INVALID_QR_PAYMENT_KEP",
  InvalidPasetoClaim: "ERR_INVALID_PASETO_CLAIM",
  InvalidPasetoToken: "ERR_INVALID_PASETO_TOKEN",
  InvalidPasetoVersion: "ERR_INVALID_PASETO_VERSION",
  InvalidPasetoPurpose: "ERR_INVALID_PASETO_PURPOSE"
};
var PayInsError = class extends Error {
  static {
    __name(this, "PayInsError");
  }
  code;
  constructor(message, noColor = false) {
    super(message);
    this.name = noColor ? "[ERROR] " + this.constructor.name : "\x1B[31m[ERROR]\x1B[0m " + this.constructor.name;
    this.code = CODES[this.constructor.name];
    Error.captureStackTrace(this, this.constructor);
  }
};
var InvalidPayload = class extends PayInsError {
  static {
    __name(this, "InvalidPayload");
  }
};
var MissingSecretKey = class extends PayInsError {
  static {
    __name(this, "MissingSecretKey");
  }
};
var MissingKid = class extends PayInsError {
  static {
    __name(this, "MissingKid");
  }
};
var MissingKis = class extends PayInsError {
  static {
    __name(this, "MissingKis");
  }
};
var InvalidKepExpired = class extends PayInsError {
  static {
    __name(this, "InvalidKepExpired");
  }
};
var InvalidQrPaymentToken = class extends PayInsError {
  static {
    __name(this, "InvalidQrPaymentToken");
  }
};
var InvalidQrPaymentKeyId = class extends PayInsError {
  static {
    __name(this, "InvalidQrPaymentKeyId");
  }
};
var InvalidQrPaymentKeyIssuer = class extends PayInsError {
  static {
    __name(this, "InvalidQrPaymentKeyIssuer");
  }
};
var InvalidQrPaymentKeyExpired = class extends PayInsError {
  static {
    __name(this, "InvalidQrPaymentKeyExpired");
  }
};
var InvalidPasetoClaim = class extends PayInsError {
  static {
    __name(this, "InvalidPasetoClaim");
  }
};
var InvalidPasetoToken = class extends PayInsError {
  static {
    __name(this, "InvalidPasetoToken");
  }
};
var InvalidPasetoVersion = class extends PayInsError {
  static {
    __name(this, "InvalidPasetoVersion");
  }
};
var InvalidPasetoPurpose = class extends PayInsError {
  static {
    __name(this, "InvalidPasetoPurpose");
  }
};

// src/utils/format.ts
function isAfterDate(date1, date2) {
  return new Date(date1) > new Date(date2);
}
__name(isAfterDate, "isAfterDate");

// src/utils/paseto.ts
var import_ms = __toESM(require("ms"));
var import_paseto = require("paseto");

// node_modules/@bufbuild/protobuf/dist/esm/wire/varint.js
function varint64read() {
  let lowBits = 0;
  let highBits = 0;
  for (let shift = 0; shift < 28; shift += 7) {
    let b = this.buf[this.pos++];
    lowBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [
        lowBits,
        highBits
      ];
    }
  }
  let middleByte = this.buf[this.pos++];
  lowBits |= (middleByte & 15) << 28;
  highBits = (middleByte & 112) >> 4;
  if ((middleByte & 128) == 0) {
    this.assertBounds();
    return [
      lowBits,
      highBits
    ];
  }
  for (let shift = 3; shift <= 31; shift += 7) {
    let b = this.buf[this.pos++];
    highBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [
        lowBits,
        highBits
      ];
    }
  }
  throw new Error("invalid varint");
}
__name(varint64read, "varint64read");
function varint64write(lo, hi, bytes) {
  for (let i = 0; i < 28; i = i + 7) {
    const shift = lo >>> i;
    const hasNext = !(shift >>> 7 == 0 && hi == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
  const hasMoreBits = !(hi >> 3 == 0);
  bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
  if (!hasMoreBits) {
    return;
  }
  for (let i = 3; i < 31; i = i + 7) {
    const shift = hi >>> i;
    const hasNext = !(shift >>> 7 == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  bytes.push(hi >>> 31 & 1);
}
__name(varint64write, "varint64write");
var TWO_PWR_32_DBL = 4294967296;
function int64FromString(dec) {
  const minus = dec[0] === "-";
  if (minus) {
    dec = dec.slice(1);
  }
  const base = 1e6;
  let lowBits = 0;
  let highBits = 0;
  function add1e6digit(begin, end) {
    const digit1e6 = Number(dec.slice(begin, end));
    highBits *= base;
    lowBits = lowBits * base + digit1e6;
    if (lowBits >= TWO_PWR_32_DBL) {
      highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
      lowBits = lowBits % TWO_PWR_32_DBL;
    }
  }
  __name(add1e6digit, "add1e6digit");
  add1e6digit(-24, -18);
  add1e6digit(-18, -12);
  add1e6digit(-12, -6);
  add1e6digit(-6);
  return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
}
__name(int64FromString, "int64FromString");
function int64ToString(lo, hi) {
  let bits = newBits(lo, hi);
  const negative = bits.hi & 2147483648;
  if (negative) {
    bits = negate(bits.lo, bits.hi);
  }
  const result = uInt64ToString(bits.lo, bits.hi);
  return negative ? "-" + result : result;
}
__name(int64ToString, "int64ToString");
function uInt64ToString(lo, hi) {
  ({ lo, hi } = toUnsigned(lo, hi));
  if (hi <= 2097151) {
    return String(TWO_PWR_32_DBL * hi + lo);
  }
  const low = lo & 16777215;
  const mid = (lo >>> 24 | hi << 8) & 16777215;
  const high = hi >> 16 & 65535;
  let digitA = low + mid * 6777216 + high * 6710656;
  let digitB = mid + high * 8147497;
  let digitC = high * 2;
  const base = 1e7;
  if (digitA >= base) {
    digitB += Math.floor(digitA / base);
    digitA %= base;
  }
  if (digitB >= base) {
    digitC += Math.floor(digitB / base);
    digitB %= base;
  }
  return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
}
__name(uInt64ToString, "uInt64ToString");
function toUnsigned(lo, hi) {
  return {
    lo: lo >>> 0,
    hi: hi >>> 0
  };
}
__name(toUnsigned, "toUnsigned");
function newBits(lo, hi) {
  return {
    lo: lo | 0,
    hi: hi | 0
  };
}
__name(newBits, "newBits");
function negate(lowBits, highBits) {
  highBits = ~highBits;
  if (lowBits) {
    lowBits = ~lowBits + 1;
  } else {
    highBits += 1;
  }
  return newBits(lowBits, highBits);
}
__name(negate, "negate");
var decimalFrom1e7WithLeadingZeros = /* @__PURE__ */ __name((digit1e7) => {
  const partial = String(digit1e7);
  return "0000000".slice(partial.length) + partial;
}, "decimalFrom1e7WithLeadingZeros");
function varint32write(value, bytes) {
  if (value >= 0) {
    while (value > 127) {
      bytes.push(value & 127 | 128);
      value = value >>> 7;
    }
    bytes.push(value);
  } else {
    for (let i = 0; i < 9; i++) {
      bytes.push(value & 127 | 128);
      value = value >> 7;
    }
    bytes.push(1);
  }
}
__name(varint32write, "varint32write");
function varint32read() {
  let b = this.buf[this.pos++];
  let result = b & 127;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 7;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 14;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 21;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 15) << 28;
  for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++) b = this.buf[this.pos++];
  if ((b & 128) != 0) throw new Error("invalid varint");
  this.assertBounds();
  return result >>> 0;
}
__name(varint32read, "varint32read");

// node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
var protoInt64 = /* @__PURE__ */ makeInt64Support();
function makeInt64Support() {
  const dv = new DataView(new ArrayBuffer(8));
  const ok = typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1");
  if (ok) {
    const MIN = BigInt("-9223372036854775808"), MAX = BigInt("9223372036854775807"), UMIN = BigInt("0"), UMAX = BigInt("18446744073709551615");
    return {
      zero: BigInt(0),
      supported: true,
      parse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > MAX || bi < MIN) {
          throw new Error(`invalid int64: ${value}`);
        }
        return bi;
      },
      uParse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > UMAX || bi < UMIN) {
          throw new Error(`invalid uint64: ${value}`);
        }
        return bi;
      },
      enc(value) {
        dv.setBigInt64(0, this.parse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      uEnc(value) {
        dv.setBigInt64(0, this.uParse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      dec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigInt64(0, true);
      },
      uDec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigUint64(0, true);
      }
    };
  }
  return {
    zero: "0",
    supported: false,
    parse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return value;
    },
    uParse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return value;
    },
    enc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return int64FromString(value);
    },
    uEnc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return int64FromString(value);
    },
    dec(lo, hi) {
      return int64ToString(lo, hi);
    },
    uDec(lo, hi) {
      return uInt64ToString(lo, hi);
    }
  };
}
__name(makeInt64Support, "makeInt64Support");
function assertInt64String(value) {
  if (!/^-?[0-9]+$/.test(value)) {
    throw new Error("invalid int64: " + value);
  }
}
__name(assertInt64String, "assertInt64String");
function assertUInt64String(value) {
  if (!/^[0-9]+$/.test(value)) {
    throw new Error("invalid uint64: " + value);
  }
}
__name(assertUInt64String, "assertUInt64String");

// node_modules/@bufbuild/protobuf/dist/esm/wire/text-encoding.js
var symbol = Symbol.for("@bufbuild/protobuf/text-encoding");
function getTextEncoding() {
  if (globalThis[symbol] == void 0) {
    const te = new globalThis.TextEncoder();
    const td = new globalThis.TextDecoder();
    globalThis[symbol] = {
      encodeUtf8(text) {
        return te.encode(text);
      },
      decodeUtf8(bytes) {
        return td.decode(bytes);
      },
      checkUtf8(text) {
        try {
          encodeURIComponent(text);
          return true;
        } catch (e) {
          return false;
        }
      }
    };
  }
  return globalThis[symbol];
}
__name(getTextEncoding, "getTextEncoding");

// node_modules/@bufbuild/protobuf/dist/esm/wire/binary-encoding.js
var WireType;
(function(WireType2) {
  WireType2[WireType2["Varint"] = 0] = "Varint";
  WireType2[WireType2["Bit64"] = 1] = "Bit64";
  WireType2[WireType2["LengthDelimited"] = 2] = "LengthDelimited";
  WireType2[WireType2["StartGroup"] = 3] = "StartGroup";
  WireType2[WireType2["EndGroup"] = 4] = "EndGroup";
  WireType2[WireType2["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
var FLOAT32_MAX = 34028234663852886e22;
var FLOAT32_MIN = -34028234663852886e22;
var UINT32_MAX = 4294967295;
var INT32_MAX = 2147483647;
var INT32_MIN = -2147483648;
var BinaryWriter = class {
  static {
    __name(this, "BinaryWriter");
  }
  constructor(encodeUtf8 = getTextEncoding().encodeUtf8) {
    this.encodeUtf8 = encodeUtf8;
    this.stack = [];
    this.chunks = [];
    this.buf = [];
  }
  /**
   * Return all bytes written and reset this writer.
   */
  finish() {
    if (this.buf.length) {
      this.chunks.push(new Uint8Array(this.buf));
      this.buf = [];
    }
    let len = 0;
    for (let i = 0; i < this.chunks.length; i++) len += this.chunks[i].length;
    let bytes = new Uint8Array(len);
    let offset = 0;
    for (let i = 0; i < this.chunks.length; i++) {
      bytes.set(this.chunks[i], offset);
      offset += this.chunks[i].length;
    }
    this.chunks = [];
    return bytes;
  }
  /**
   * Start a new fork for length-delimited data like a message
   * or a packed repeated field.
   *
   * Must be joined later with `join()`.
   */
  fork() {
    this.stack.push({
      chunks: this.chunks,
      buf: this.buf
    });
    this.chunks = [];
    this.buf = [];
    return this;
  }
  /**
   * Join the last fork. Write its length and bytes, then
   * return to the previous state.
   */
  join() {
    let chunk = this.finish();
    let prev = this.stack.pop();
    if (!prev) throw new Error("invalid state, fork stack empty");
    this.chunks = prev.chunks;
    this.buf = prev.buf;
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Writes a tag (field number and wire type).
   *
   * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
   *
   * Generated code should compute the tag ahead of time and call `uint32()`.
   */
  tag(fieldNo, type) {
    return this.uint32((fieldNo << 3 | type) >>> 0);
  }
  /**
   * Write a chunk of raw bytes.
   */
  raw(chunk) {
    if (this.buf.length) {
      this.chunks.push(new Uint8Array(this.buf));
      this.buf = [];
    }
    this.chunks.push(chunk);
    return this;
  }
  /**
   * Write a `uint32` value, an unsigned 32 bit varint.
   */
  uint32(value) {
    assertUInt32(value);
    while (value > 127) {
      this.buf.push(value & 127 | 128);
      value = value >>> 7;
    }
    this.buf.push(value);
    return this;
  }
  /**
   * Write a `int32` value, a signed 32 bit varint.
   */
  int32(value) {
    assertInt32(value);
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `bool` value, a variant.
   */
  bool(value) {
    this.buf.push(value ? 1 : 0);
    return this;
  }
  /**
   * Write a `bytes` value, length-delimited arbitrary data.
   */
  bytes(value) {
    this.uint32(value.byteLength);
    return this.raw(value);
  }
  /**
   * Write a `string` value, length-delimited data converted to UTF-8 text.
   */
  string(value) {
    let chunk = this.encodeUtf8(value);
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Write a `float` value, 32-bit floating point number.
   */
  float(value) {
    assertFloat32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setFloat32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `double` value, a 64-bit floating point number.
   */
  double(value) {
    let chunk = new Uint8Array(8);
    new DataView(chunk.buffer).setFloat64(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
   */
  fixed32(value) {
    assertUInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setUint32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
   */
  sfixed32(value) {
    assertInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setInt32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
   */
  sint32(value) {
    assertInt32(value);
    value = (value << 1 ^ value >> 31) >>> 0;
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
   */
  sfixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
   */
  fixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `int64` value, a signed 64-bit varint.
   */
  int64(value) {
    let tc = protoInt64.enc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
  /**
   * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64(value) {
    let tc = protoInt64.enc(value), sign = tc.hi >> 31, lo = tc.lo << 1 ^ sign, hi = (tc.hi << 1 | tc.lo >>> 31) ^ sign;
    varint64write(lo, hi, this.buf);
    return this;
  }
  /**
   * Write a `uint64` value, an unsigned 64-bit varint.
   */
  uint64(value) {
    let tc = protoInt64.uEnc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
};
var BinaryReader = class {
  static {
    __name(this, "BinaryReader");
  }
  constructor(buf, decodeUtf8 = getTextEncoding().decodeUtf8) {
    this.decodeUtf8 = decodeUtf8;
    this.varint64 = varint64read;
    this.uint32 = varint32read;
    this.buf = buf;
    this.len = buf.length;
    this.pos = 0;
    this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  /**
   * Reads a tag - field number and wire type.
   */
  tag() {
    let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
    if (fieldNo <= 0 || wireType < 0 || wireType > 5) throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
    return [
      fieldNo,
      wireType
    ];
  }
  /**
   * Skip one element and return the skipped data.
   *
   * When skipping StartGroup, provide the tags field number to check for
   * matching field number in the EndGroup tag.
   */
  skip(wireType, fieldNo) {
    let start = this.pos;
    switch (wireType) {
      case WireType.Varint:
        while (this.buf[this.pos++] & 128) {
        }
        break;
      // eslint-disable-next-line
      // @ts-expect-error TS7029: Fallthrough case in switch
      case WireType.Bit64:
        this.pos += 4;
      // eslint-disable-next-line no-fallthrough
      case WireType.Bit32:
        this.pos += 4;
        break;
      case WireType.LengthDelimited:
        let len = this.uint32();
        this.pos += len;
        break;
      case WireType.StartGroup:
        for (; ; ) {
          const [fn, wt] = this.tag();
          if (wt === WireType.EndGroup) {
            if (fieldNo !== void 0 && fn !== fieldNo) {
              throw new Error("invalid end group tag");
            }
            break;
          }
          this.skip(wt, fn);
        }
        break;
      default:
        throw new Error("cant skip wire type " + wireType);
    }
    this.assertBounds();
    return this.buf.subarray(start, this.pos);
  }
  /**
   * Throws error if position in byte array is out of range.
   */
  assertBounds() {
    if (this.pos > this.len) throw new RangeError("premature EOF");
  }
  /**
   * Read a `int32` field, a signed 32 bit varint.
   */
  int32() {
    return this.uint32() | 0;
  }
  /**
   * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
   */
  sint32() {
    let zze = this.uint32();
    return zze >>> 1 ^ -(zze & 1);
  }
  /**
   * Read a `int64` field, a signed 64-bit varint.
   */
  int64() {
    return protoInt64.dec(...this.varint64());
  }
  /**
   * Read a `uint64` field, an unsigned 64-bit varint.
   */
  uint64() {
    return protoInt64.uDec(...this.varint64());
  }
  /**
   * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64() {
    let [lo, hi] = this.varint64();
    let s = -(lo & 1);
    lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
    hi = hi >>> 1 ^ s;
    return protoInt64.dec(lo, hi);
  }
  /**
   * Read a `bool` field, a variant.
   */
  bool() {
    let [lo, hi] = this.varint64();
    return lo !== 0 || hi !== 0;
  }
  /**
   * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
   */
  fixed32() {
    return this.view.getUint32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
   */
  sfixed32() {
    return this.view.getInt32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
   */
  fixed64() {
    return protoInt64.uDec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
   */
  sfixed64() {
    return protoInt64.dec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `float` field, 32-bit floating point number.
   */
  float() {
    return this.view.getFloat32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `double` field, a 64-bit floating point number.
   */
  double() {
    return this.view.getFloat64((this.pos += 8) - 8, true);
  }
  /**
   * Read a `bytes` field, length-delimited arbitrary data.
   */
  bytes() {
    let len = this.uint32(), start = this.pos;
    this.pos += len;
    this.assertBounds();
    return this.buf.subarray(start, start + len);
  }
  /**
   * Read a `string` field, length-delimited data converted to UTF-8 text.
   */
  string() {
    return this.decodeUtf8(this.bytes());
  }
};
function assertInt32(arg) {
  if (typeof arg == "string") {
    arg = Number(arg);
  } else if (typeof arg != "number") {
    throw new Error("invalid int32: " + typeof arg);
  }
  if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN) throw new Error("invalid int32: " + arg);
}
__name(assertInt32, "assertInt32");
function assertUInt32(arg) {
  if (typeof arg == "string") {
    arg = Number(arg);
  } else if (typeof arg != "number") {
    throw new Error("invalid uint32: " + typeof arg);
  }
  if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0) throw new Error("invalid uint32: " + arg);
}
__name(assertUInt32, "assertUInt32");
function assertFloat32(arg) {
  if (typeof arg == "string") {
    const o = arg;
    arg = Number(arg);
    if (isNaN(arg) && o !== "NaN") {
      throw new Error("invalid float32: " + o);
    }
  } else if (typeof arg != "number") {
    throw new Error("invalid float32: " + typeof arg);
  }
  if (Number.isFinite(arg) && (arg > FLOAT32_MAX || arg < FLOAT32_MIN)) throw new Error("invalid float32: " + arg);
}
__name(assertFloat32, "assertFloat32");

// src/encoding/protobuf/model.ts
function createBasePaymentInstruction() {
  return {
    id: "",
    address: "",
    addressTag: "",
    uniqueAssetId: "",
    isOpen: false,
    amount: "",
    minAmount: "",
    maxAmount: "",
    expiresAt: 0
  };
}
__name(createBasePaymentInstruction, "createBasePaymentInstruction");
var PaymentInstruction = {
  encode(message, writer = new BinaryWriter()) {
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
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
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
  fromJSON(object2) {
    return {
      id: isSet(object2.id) ? globalThis.String(object2.id) : "",
      address: isSet(object2.address) ? globalThis.String(object2.address) : "",
      addressTag: isSet(object2.address_tag) ? globalThis.String(object2.address_tag) : "",
      uniqueAssetId: isSet(object2.unique_asset_id) ? globalThis.String(object2.unique_asset_id) : "",
      isOpen: isSet(object2.is_open) ? globalThis.Boolean(object2.is_open) : false,
      amount: isSet(object2.amount) ? globalThis.String(object2.amount) : "",
      minAmount: isSet(object2.min_amount) ? globalThis.String(object2.min_amount) : "",
      maxAmount: isSet(object2.max_amount) ? globalThis.String(object2.max_amount) : "",
      expiresAt: isSet(object2.expires_at) ? globalThis.Number(object2.expires_at) : 0
    };
  },
  toJSON(message) {
    const obj = {};
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
  create(base) {
    return PaymentInstruction.fromPartial(base ?? {});
  },
  fromPartial(object2) {
    const message = createBasePaymentInstruction();
    message.id = object2.id ?? "";
    message.address = object2.address ?? "";
    message.addressTag = object2.addressTag ?? "";
    message.uniqueAssetId = object2.uniqueAssetId ?? "";
    message.isOpen = object2.isOpen ?? false;
    message.amount = object2.amount ?? "";
    message.minAmount = object2.minAmount ?? "";
    message.maxAmount = object2.maxAmount ?? "";
    message.expiresAt = object2.expiresAt ?? 0;
    return message;
  }
};
function createBaseInstructionMerchant() {
  return {
    name: "",
    description: "",
    taxId: "",
    image: "",
    mcc: ""
  };
}
__name(createBaseInstructionMerchant, "createBaseInstructionMerchant");
var InstructionMerchant = {
  encode(message, writer = new BinaryWriter()) {
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
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
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
  fromJSON(object2) {
    return {
      name: isSet(object2.name) ? globalThis.String(object2.name) : "",
      description: isSet(object2.description) ? globalThis.String(object2.description) : "",
      taxId: isSet(object2.tax_id) ? globalThis.String(object2.tax_id) : "",
      image: isSet(object2.image) ? globalThis.String(object2.image) : "",
      mcc: isSet(object2.mcc) ? globalThis.String(object2.mcc) : ""
    };
  },
  toJSON(message) {
    const obj = {};
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
  create(base) {
    return InstructionMerchant.fromPartial(base ?? {});
  },
  fromPartial(object2) {
    const message = createBaseInstructionMerchant();
    message.name = object2.name ?? "";
    message.description = object2.description ?? "";
    message.taxId = object2.taxId ?? "";
    message.image = object2.image ?? "";
    message.mcc = object2.mcc ?? "";
    return message;
  }
};
function createBaseInstructionItem() {
  return {
    description: "",
    amount: "",
    coinCode: "",
    unitPrice: "",
    quantity: 0
  };
}
__name(createBaseInstructionItem, "createBaseInstructionItem");
var InstructionItem = {
  encode(message, writer = new BinaryWriter()) {
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
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
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
  fromJSON(object2) {
    return {
      description: isSet(object2.description) ? globalThis.String(object2.description) : "",
      amount: isSet(object2.amount) ? globalThis.String(object2.amount) : "",
      coinCode: isSet(object2.coin_code) ? globalThis.String(object2.coin_code) : "",
      unitPrice: isSet(object2.unit_price) ? globalThis.String(object2.unit_price) : "",
      quantity: isSet(object2.quantity) ? globalThis.Number(object2.quantity) : 0
    };
  },
  toJSON(message) {
    const obj = {};
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
  create(base) {
    return InstructionItem.fromPartial(base ?? {});
  },
  fromPartial(object2) {
    const message = createBaseInstructionItem();
    message.description = object2.description ?? "";
    message.amount = object2.amount ?? "";
    message.coinCode = object2.coinCode ?? "";
    message.unitPrice = object2.unitPrice ?? "";
    message.quantity = object2.quantity ?? 0;
    return message;
  }
};
function createBaseInstructionOrder() {
  return {
    total: "",
    coinCode: "",
    description: "",
    merchant: void 0,
    items: []
  };
}
__name(createBaseInstructionOrder, "createBaseInstructionOrder");
var InstructionOrder = {
  encode(message, writer = new BinaryWriter()) {
    if (message.total !== "") {
      writer.uint32(10).string(message.total);
    }
    if (message.coinCode !== "") {
      writer.uint32(18).string(message.coinCode);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.merchant !== void 0) {
      InstructionMerchant.encode(message.merchant, writer.uint32(34).fork()).join();
    }
    for (const v of message.items) {
      InstructionItem.encode(v, writer.uint32(42).fork()).join();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
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
  fromJSON(object2) {
    return {
      total: isSet(object2.total) ? globalThis.String(object2.total) : "",
      coinCode: isSet(object2.coin_code) ? globalThis.String(object2.coin_code) : "",
      description: isSet(object2.description) ? globalThis.String(object2.description) : "",
      merchant: isSet(object2.merchant) ? InstructionMerchant.fromJSON(object2.merchant) : void 0,
      items: globalThis.Array.isArray(object2?.items) ? object2.items.map((e) => InstructionItem.fromJSON(e)) : []
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.total !== "") {
      obj.total = message.total;
    }
    if (message.coinCode !== "") {
      obj.coin_code = message.coinCode;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.merchant !== void 0) {
      obj.merchant = InstructionMerchant.toJSON(message.merchant);
    }
    if (message.items?.length) {
      obj.items = message.items.map((e) => InstructionItem.toJSON(e));
    }
    return obj;
  },
  create(base) {
    return InstructionOrder.fromPartial(base ?? {});
  },
  fromPartial(object2) {
    const message = createBaseInstructionOrder();
    message.total = object2.total ?? "";
    message.coinCode = object2.coinCode ?? "";
    message.description = object2.description ?? "";
    message.merchant = object2.merchant !== void 0 && object2.merchant !== null ? InstructionMerchant.fromPartial(object2.merchant) : void 0;
    message.items = object2.items?.map((e) => InstructionItem.fromPartial(e)) || [];
    return message;
  }
};
function createBaseInstructionPayload() {
  return {
    payment: void 0,
    order: void 0
  };
}
__name(createBaseInstructionPayload, "createBaseInstructionPayload");
var InstructionPayload = {
  encode(message, writer = new BinaryWriter()) {
    if (message.payment !== void 0) {
      PaymentInstruction.encode(message.payment, writer.uint32(10).fork()).join();
    }
    if (message.order !== void 0) {
      InstructionOrder.encode(message.order, writer.uint32(18).fork()).join();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
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
  fromJSON(object2) {
    return {
      payment: isSet(object2.payment) ? PaymentInstruction.fromJSON(object2.payment) : void 0,
      order: isSet(object2.order) ? InstructionOrder.fromJSON(object2.order) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.payment !== void 0) {
      obj.payment = PaymentInstruction.toJSON(message.payment);
    }
    if (message.order !== void 0) {
      obj.order = InstructionOrder.toJSON(message.order);
    }
    return obj;
  },
  create(base) {
    return InstructionPayload.fromPartial(base ?? {});
  },
  fromPartial(object2) {
    const message = createBaseInstructionPayload();
    message.payment = object2.payment !== void 0 && object2.payment !== null ? PaymentInstruction.fromPartial(object2.payment) : void 0;
    message.order = object2.order !== void 0 && object2.order !== null ? InstructionOrder.fromPartial(object2.order) : void 0;
    return message;
  }
};
function createBaseUrlPayload() {
  return {
    url: "",
    paymentOptions: [],
    order: void 0
  };
}
__name(createBaseUrlPayload, "createBaseUrlPayload");
var UrlPayload = {
  encode(message, writer = new BinaryWriter()) {
    if (message.url !== "") {
      writer.uint32(10).string(message.url);
    }
    for (const v of message.paymentOptions) {
      writer.uint32(18).string(v);
    }
    if (message.order !== void 0) {
      InstructionOrder.encode(message.order, writer.uint32(26).fork()).join();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
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
  fromJSON(object2) {
    return {
      url: isSet(object2.url) ? globalThis.String(object2.url) : "",
      paymentOptions: globalThis.Array.isArray(object2?.payment_options) ? object2.payment_options.map((e) => globalThis.String(e)) : [],
      order: isSet(object2.order) ? InstructionOrder.fromJSON(object2.order) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.url !== "") {
      obj.url = message.url;
    }
    if (message.paymentOptions?.length) {
      obj.payment_options = message.paymentOptions;
    }
    if (message.order !== void 0) {
      obj.order = InstructionOrder.toJSON(message.order);
    }
    return obj;
  },
  create(base) {
    return UrlPayload.fromPartial(base ?? {});
  },
  fromPartial(object2) {
    const message = createBaseUrlPayload();
    message.url = object2.url ?? "";
    message.paymentOptions = object2.paymentOptions?.map((e) => e) || [];
    message.order = object2.order !== void 0 && object2.order !== null ? InstructionOrder.fromPartial(object2.order) : void 0;
    return message;
  }
};
function createBasePasetoTokenData() {
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
    instructionPayload: void 0,
    urlPayload: void 0
  };
}
__name(createBasePasetoTokenData, "createBasePasetoTokenData");
var PasetoTokenData = {
  encode(message, writer = new BinaryWriter()) {
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
    if (message.instructionPayload !== void 0) {
      InstructionPayload.encode(message.instructionPayload, writer.uint32(90).fork()).join();
    }
    if (message.urlPayload !== void 0) {
      UrlPayload.encode(message.urlPayload, writer.uint32(98).fork()).join();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === void 0 ? reader.len : reader.pos + length;
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
  fromJSON(object2) {
    return {
      iss: isSet(object2.iss) ? globalThis.String(object2.iss) : "",
      sub: isSet(object2.sub) ? globalThis.String(object2.sub) : "",
      aud: isSet(object2.aud) ? globalThis.String(object2.aud) : "",
      exp: isSet(object2.exp) ? globalThis.String(object2.exp) : "",
      nbf: isSet(object2.nbf) ? globalThis.String(object2.nbf) : "",
      iat: isSet(object2.iat) ? globalThis.String(object2.iat) : "",
      jti: isSet(object2.jti) ? globalThis.String(object2.jti) : "",
      kid: isSet(object2.kid) ? globalThis.String(object2.kid) : "",
      kep: isSet(object2.kep) ? globalThis.String(object2.kep) : "",
      kis: isSet(object2.kis) ? globalThis.String(object2.kis) : "",
      instructionPayload: isSet(object2.data) ? InstructionPayload.fromJSON(object2.data) : void 0,
      urlPayload: isSet(object2.data) ? UrlPayload.fromJSON(object2.data) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
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
    if (message.instructionPayload !== void 0) {
      obj.data = InstructionPayload.toJSON(message.instructionPayload);
    }
    if (message.urlPayload !== void 0) {
      obj.data = UrlPayload.toJSON(message.urlPayload);
    }
    return obj;
  },
  create(base) {
    return PasetoTokenData.fromPartial(base ?? {});
  },
  fromPartial(object2) {
    const message = createBasePasetoTokenData();
    message.iss = object2.iss ?? "";
    message.sub = object2.sub ?? "";
    message.aud = object2.aud ?? "";
    message.exp = object2.exp ?? "";
    message.nbf = object2.nbf ?? "";
    message.iat = object2.iat ?? "";
    message.jti = object2.jti ?? "";
    message.kid = object2.kid ?? "";
    message.kep = object2.kep ?? "";
    message.kis = object2.kis ?? "";
    message.instructionPayload = object2.instructionPayload !== void 0 && object2.instructionPayload !== null ? InstructionPayload.fromPartial(object2.instructionPayload) : void 0;
    message.urlPayload = object2.urlPayload !== void 0 && object2.urlPayload !== null ? UrlPayload.fromPartial(object2.urlPayload) : void 0;
    return message;
  }
};
function longToNumber(int64) {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}
__name(longToNumber, "longToNumber");
function isSet(value) {
  return value !== null && value !== void 0;
}
__name(isSet, "isSet");

// src/utils/paseto.ts
var PasetoV4Handler = class {
  static {
    __name(this, "PasetoV4Handler");
  }
  /*
  
  */
  /**
  * Generate asymetric public/private key
  *
  * @param purpose - Only support "public"
  * @param options - Only support { format: "paserk" }
  *
  * @returns
  * `{ secretKey: string; publicKey: string; }`
  *
  *
  * @example
  * ```ts
  * PasetoV4Handler.generateKey("public", { format: "paserk" });
  *
  * returns
  * {
  *   secretKey: 'k4.secret.ICXpik-1FLvjjvspZuFpzudF2WMkjsmBECOkjlNR6lb7C_pYpZkYoB6wW0RTVQTSKNO2kYrL55lxnctEY6fabw',
  *   publicKey: 'k4.public.-wv6WKWZGKAesFtEU1UE0ijTtpGKy-eZcZ3LRGOn2m8'
  * }
  *
  * ```
  */
  static async generateKey(purpose, options) {
    return import_paseto.V4.generateKey(purpose, options);
  }
  /**
  * Decode paseto token
  *
  * @param token - paseto token
  * @returns
  * `{ ...data, footer: string | Record<string, any> }`
  */
  decode(token) {
    const data = token.split(".");
    if (data.length !== 3 && data.length !== 4) {
      throw new InvalidPasetoToken("token is not a PASETO formatted value");
    }
    const [version, purpose, payload, encodedFooter] = data;
    if (version !== "v4") {
      throw new InvalidPasetoVersion("unsupported PASETO version");
    }
    if (purpose !== "local" && purpose !== "public") {
      throw new InvalidPasetoPurpose("unsupported PASETO purpose");
    }
    const footer = encodedFooter ? Buffer.from(encodedFooter, "base64") : void 0;
    if (purpose === "local") {
      return {
        footer,
        version,
        purpose
      };
    }
    let raw;
    try {
      raw = Buffer.from(payload, "base64").subarray(0, -64);
    } catch {
      throw new InvalidPasetoToken("token is not a PASETO formatted value");
    }
    const payloadDecoded = PasetoTokenData.decode(raw);
    const payloadToken = PasetoTokenData.toJSON(payloadDecoded);
    return {
      footer,
      version,
      purpose,
      payload: payloadToken
    };
  }
  /**
  *
  * @remarks
  * Claims reserved
  *
  * | Key |    Name        |  Type  |             Example                 |
  *
  * | iss |   Issuer       | string |       {"iss":"paragonie.com"}       |
  *
  * | sub |  Subject       | string |            {"sub":"test"}           |
  *
  * | aud |  Audience      | string |       {"aud":"pie-hosted.com"}      |
  *
  * | exp | Expiration     | DtTime | {"exp":"2039-01-01T00:00:00+00:00"} |
  *
  * | nbf | Not Before     | DtTime | {"nbf":"2038-04-01T00:00:00+00:00"} |
  *
  * | iat | Issued At      | DtTime | {"iat":"2038-03-17T00:00:00+00:00"} |
  *
  * | jti |  Token ID      | string |  {"jti":"87IFSGFgPNtQNNuw0AtuLttP"} |
  *
  * | kid |   Key-ID       | string |    {"kid":"stored-in-the-footer"}   |
  *
  * | kis | Key-Issuer     | string |    {"kis":"my-issuer.com"}          |
  *
  * | kep | Key-Expiration | DtTime | {"kep":"2038-03-17T00:00:00+00:00"} |
  *
  *
  * @param payload - a Record with data to sign
  * @param privateKey - private key as string
  * @param options - options for paseto v4 algorimth
  * @returns
  * Paseto V4 public token format.
  */
  async sign(payload, privateKey, options) {
    const isUrl = "url" in payload.data;
    const payloadWithOptions = this.applyOptions({
      kid: payload.kid,
      kis: payload.kis,
      kep: payload.kep,
      data: payload.data
    }, options);
    const payloadProtobuf = PasetoTokenData.fromJSON({
      ...payloadWithOptions
    });
    if (isUrl) {
      delete payloadProtobuf.instructionPayload;
    } else {
      delete payloadProtobuf.urlPayload;
    }
    const payloadProtobufBinary = PasetoTokenData.encode(payloadProtobuf).finish();
    return import_paseto.V4.sign(Buffer.from(payloadProtobufBinary), privateKey, {
      footer: options?.footer,
      assertion: options?.assertion
    });
  }
  /**
  * Verify paseto token
  *
  * @param token - paseto token
  * @param publicKey - public key as string
  * @param options - options for paseto v4 algorimth
  * @returns
  * Paseto V4 public token format.
  */
  async verify(token, publicKey, options) {
    const result = await import_paseto.V4.verify(token, publicKey, {
      assertion: options?.assertion,
      buffer: true,
      complete: true
    });
    const payloadDecoded = PasetoTokenData.decode(result.payload);
    const payload = PasetoTokenData.toJSON(payloadDecoded);
    this.assertPayload(payload, options);
    return {
      ...result,
      payload
    };
  }
  // eslint-disable-next-line sonarjs/cognitive-complexity
  applyOptions(payload, options) {
    const now = /* @__PURE__ */ new Date();
    const unix = now.getTime();
    payload.iat = new Date(unix).toISOString();
    if (options?.expiresIn) {
      if (typeof options.expiresIn !== "string") {
        throw new TypeError("options.expiresIn must be a string");
      }
      payload.exp = new Date(unix + (0, import_ms.default)(options.expiresIn)).toISOString();
    }
    if (options?.notBefore) {
      if (typeof options.notBefore !== "string") {
        throw new TypeError("options.notBefore must be a string");
      }
      payload.nbf = new Date(unix + (0, import_ms.default)(options.notBefore)).toISOString();
    }
    if (options?.audience) {
      if (typeof options.audience !== "string") {
        throw new TypeError("options.audience must be a string");
      }
      payload.aud = options.audience;
    }
    if (options?.issuer) {
      if (typeof options.issuer !== "string") {
        throw new TypeError("options.issuer must be a string");
      }
      payload.iss = options.issuer;
    }
    if (options?.subject) {
      if (typeof options.subject !== "string") {
        throw new TypeError("options.subject must be a string");
      }
      payload.sub = options.subject;
    }
    if (options?.kid) {
      if (typeof options.kid !== "string") {
        throw new TypeError("options.kid must be a string");
      }
      payload.kid = options.kid;
    }
    if (options?.jti) {
      if (typeof options.jti !== "string") {
        throw new TypeError("options.jti must be a string");
      }
      payload.jti = options.jti;
    }
    if (options?.kid) {
      if (typeof options.kid !== "string") {
        throw new TypeError("options.kid must be a string");
      }
      payload.kid = options.kid;
    }
    return payload;
  }
  // eslint-disable-next-line sonarjs/cognitive-complexity
  assertPayload(payload, options) {
    const nowUnix = (/* @__PURE__ */ new Date()).getTime();
    if ("iss" in payload && typeof payload.iss !== "string") {
      throw new InvalidPasetoClaim("payload.iss must be a string");
    }
    if (options?.issuer && payload.iss !== options.issuer) {
      throw new InvalidPasetoClaim("issuer mismatch");
    }
    if ("sub" in payload && typeof payload.sub !== "string") {
      throw new InvalidPasetoClaim("payload.sub must be a string");
    }
    if (options?.subject && payload.sub !== options.subject) {
      throw new InvalidPasetoClaim("subject mismatch");
    }
    if ("aud" in payload && typeof payload.aud !== "string") {
      throw new InvalidPasetoClaim("payload.aud must be a string");
    }
    if (options?.audience && payload.aud !== options.audience) {
      throw new InvalidPasetoClaim("audience mismatch");
    }
    if (!options?.ignoreIat) {
      if (!payload.iat) {
        throw new InvalidPasetoClaim("payload.iat is required");
      }
      const iat = new Date(payload.iat).getTime();
      if (!iat) {
        throw new InvalidPasetoClaim("payload.iat must be a valid ISO8601 string");
      }
      if (iat > nowUnix) {
        throw new InvalidPasetoClaim("token issued in the future");
      }
    }
    if (!options?.ignoreNbf && payload.nbf) {
      const nbf = new Date(payload.nbf).getTime();
      if (!nbf) {
        throw new InvalidPasetoClaim("payload.nbf must be a valid ISO8601 string");
      }
      if (nbf > nowUnix) {
        throw new InvalidPasetoClaim("token is not active yet");
      }
    }
    if (!options?.ignoreExp) {
      if (!payload.exp) {
        throw new InvalidPasetoClaim("payload.exp is required");
      }
      const exp = new Date(payload.exp).getTime();
      if (!exp) {
        throw new InvalidPasetoClaim("payload.exp must be a valid ISO8601 string");
      }
      if (exp <= nowUnix) {
        throw new InvalidPasetoClaim("token is expired");
      }
    }
    if (!options?.ignoreIat && options?.maxTokenAge) {
      const iat = new Date(payload.iat).getTime();
      if (iat + (0, import_ms.default)(options.maxTokenAge) < nowUnix) {
        throw new InvalidPasetoClaim("maxTokenAge exceeded");
      }
    }
  }
};

// src/utils/validate.ts
function biggerThanZero(value) {
  return parseFloat(value.toString()) > 0;
}
__name(biggerThanZero, "biggerThanZero");
function biggerThanOrEqualZero(value) {
  return parseFloat(value) >= 0;
}
__name(biggerThanOrEqualZero, "biggerThanOrEqualZero");

// src/payment-instruction.ts
var PaymentInstructionsBuilder = class {
  static {
    __name(this, "PaymentInstructionsBuilder");
  }
  pasetoHandler;
  constructor() {
    this.pasetoHandler = new PasetoV4Handler();
  }
  /**
  * Create a QR-Crypto token
  *
  * @param data - InstructionPayload | UrlPayload;
  * @param secretKey - string;
  * @param options - TokenCreateOptions;
  * @param [warnings=true]
  *
  * @returns
  * `string`
  *
  *
  * @example
  * ```ts
  * const builder = new PaymentInstructionsBuilder();
  *
  * await builder.create(
  *   {
  *     payment: {
  *       id: "payment-id",
  *       address: "crypto-address",
  *       network_token: "ntrc20_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  *       is_open: true,
  *       expires_at: 1739802610209,
  *     },
  *   },
  *   secretKey: "some-private-secret",
  *   {
  *     issuer: "client.com",
  *     expiresIn: "1h",
  *     keyId: "key-id-one",
  *     keyExpiration: "2025-12-12T01:00:00.000Z",
  *     keyIssuer: "my-bussines.com",
  *   }
  * });
  *
  * returns
  * ```ts
  * "qr-crypto.v4.public...."
  * ```
  */
  async create(data, secretKey, options, warnings = true) {
    this.validateParameters({
      payload: data,
      secretKey,
      optionsKey: {
        keyId: options.keyId,
        keyIssuer: options.keyIssuer,
        keyExpiration: options.keyExpiration
      }
    });
    if (warnings && !options?.expiresIn) {
      console.warn(`\x1B[33m[WARNING]\x1B[0m: Field 'expiresIn' not provided in QR-Crypto token creation.
         It is recommended to set an expiration time.
         Use default of 10 minutes.`);
    }
    const payload = {
      data,
      kid: options.keyId,
      kis: options.keyIssuer,
      kep: options.keyExpiration
    };
    const pasetoToken = await this.pasetoHandler.sign(payload, secretKey, {
      issuer: options.issuer,
      expiresIn: options?.expiresIn || "10m",
      kid: options.keyId,
      subject: options?.subject,
      audience: options?.audience,
      assertion: options?.assertion
    });
    return [
      "naspip",
      options.keyIssuer,
      options.keyId,
      pasetoToken
    ].join(";");
  }
  /**
  * Validate the payload of the payment instruction or url
  *
  * @param payload - InstructionPayload | UrlPayload
  *
  * @returns
  * `void` | `Error`
  *
  * @example
  * ```ts
  * const builder = new PaymentInstructionsBuilder();
  *
  * builder.validatePayload({
  *   payment: {
  *     id: "payment-id",
  *     address: "crypto-address",
  *     network_token: ntrc20_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t,
  *     is_open: true,
  *     expires_at: 17855465854,
  *   },
  * });
  * ```
  */
  validatePayload(payload) {
    if ("url" in payload) {
      return this.validateUrlPayload(payload);
    }
    this.validatePaymentInstructionPayload(payload);
  }
  validateParameters({ payload, secretKey, optionsKey }) {
    if (!secretKey) {
      throw new MissingSecretKey("secretKey is required for token creation");
    }
    if (!optionsKey.keyId) {
      throw new MissingKid("kid is required for token creation");
    }
    if (!optionsKey.keyIssuer) {
      throw new MissingKis("kis is required for token creation");
    }
    const isKeyExpired = isAfterDate((/* @__PURE__ */ new Date()).toISOString(), optionsKey.keyExpiration);
    if (isKeyExpired) {
      throw new InvalidKepExpired("kid is expired for token creation");
    }
    this.validatePayload(payload);
  }
  /*
  * Instruction Order Schema
  */
  instructionOrderSchema = superstruct.object({
    total: superstruct.refine(superstruct.string(), "total", biggerThanZero),
    coin_code: superstruct.string(),
    description: superstruct.optional(superstruct.string()),
    merchant: superstruct.object({
      name: superstruct.string(),
      description: superstruct.optional(superstruct.string()),
      tax_id: superstruct.optional(superstruct.string()),
      image: superstruct.optional(superstruct.string()),
      mcc: superstruct.optional(superstruct.string())
    }),
    items: superstruct.optional(superstruct.array(superstruct.object({
      description: superstruct.string(),
      amount: superstruct.refine(superstruct.string(), "amount", biggerThanOrEqualZero),
      unit_price: superstruct.optional(superstruct.refine(superstruct.string(), "unit_price", biggerThanOrEqualZero)),
      quantity: superstruct.refine(superstruct.number(), "quantity", biggerThanZero),
      coin_code: superstruct.string()
    })))
  });
  /**
  * Payment Instruction Payload Schema
  *
  * @private
  *
  */
  payloadSchema = superstruct.object({
    payment: superstruct.object({
      id: superstruct.string(),
      address: superstruct.string(),
      address_tag: superstruct.optional(superstruct.string()),
      unique_asset_id: superstruct.string(),
      is_open: superstruct.boolean(),
      amount: superstruct.optional(superstruct.refine(superstruct.string(), "amount", biggerThanZero)),
      min_amount: superstruct.optional(superstruct.refine(superstruct.string(), "min_amount", biggerThanZero)),
      max_amount: superstruct.optional(superstruct.refine(superstruct.string(), "max_amount", biggerThanZero)),
      expires_at: superstruct.integer()
    }),
    order: superstruct.optional(this.instructionOrderSchema)
  });
  /**
  * URL Payload Schema
  *
  * @private
  *
  */
  payloadUrlSchema = superstruct.object({
    url: superstruct.string(),
    payment_options: superstruct.optional(superstruct.array(superstruct.string())),
    order: superstruct.optional(this.instructionOrderSchema)
  });
  /**
  * Validate payload of the payment instruction
  *
  * @private
  * @param payload - InstructionPayload
  *
  * @returns
  * `void` | `Error`
  */
  validatePaymentInstructionPayload(payload) {
    const [errors] = superstruct.validate(payload, this.payloadSchema);
    if (errors) {
      const [failure] = errors.failures();
      throw new InvalidPayload(`${errors.path.join("_")}: ${failure?.message ?? "Payload does not match the expected schema"}`);
    }
    if (!payload.payment.is_open && !payload.payment.amount) {
      throw new InvalidPayload("payment.amount is required when 'is_open' is false");
    }
  }
  /**
  * Validate URL Payload
  *
  * @private
  * @param payload - UrlPayload
  *
  * @returns
  * `void` | `Error`
  */
  validateUrlPayload(payload) {
    const [errors] = superstruct.validate(payload, this.payloadUrlSchema);
    if (errors) {
      const [failure] = errors.failures();
      throw new InvalidPayload(failure?.message ?? "Payload does not match the expected schema");
    }
  }
};
var PaymentInstructionsReader = class {
  static {
    __name(this, "PaymentInstructionsReader");
  }
  pasetoHandler;
  constructor() {
    this.pasetoHandler = new PasetoV4Handler();
  }
  decode(naspipToken) {
    const decoded = naspipToken.split(";");
    const isValidQr = decoded.length == 4 && decoded[0] == "naspip";
    if (!isValidQr) {
      throw new InvalidQrPaymentToken("Invalid naspip token prefix");
    }
    const [prefix, keyIssuer, keyId, token] = decoded;
    if (!token) {
      throw new InvalidQrPaymentToken("Invalid naspip token");
    }
    return {
      prefix,
      keyIssuer,
      keyId,
      token
    };
  }
  /**
  * Read a QR payment instruction
  *
  * @param qrPayment - QR-Crypto token string
  * @param publicKey - string
  * @param options - ConsumeOptions<true> (optional)
  *
  * @returns
  * ```json{
  *    payload: CompleteResult<InstructionPayload>;
  *    footer?: Buffer | Record<string, any>;
  *    version: "v4";
  *    purpose: "public";
  *  }```
  *
  *
  * @example
  * ```ts
  * const reader = new PaymentInstructionsReader();
  *
  * reader.read({
  *    qrPayment: "naspip;keyIssuer;keyId;v4.public....",
  *    publicKey: "some-public-key",
  *    issuerDomain: "qrCrypto.com",
  *    options: { subject: "customer@qrCrypto.com", audience: "payer-crypto.com"}
  * });
  *
  * returns
  * ```ts
  * {
  *   version: "v4",
  *   purpose: "public",
  *   payload: {
  *    payload: {
  *      payment: {...},
  *      order: {....}
  *    },
  *    iss: "qrCrypto.com",
  *    iat: "2024-10-29T21:17:00.000Z",
  *    exp: "2024-10-29T21:25:00.000Z",
  *    kid: "some-kid",
  *    kep: "2025-12-31T00:00:00.000Z"
  *    kis: "some-business.com"
  *    sub: "customer@qrCrypto.com",
  *    aud: "payer-crypto.com"
  *   }
  * }
  * ```
  */
  async read({ qrPayment, publicKey, options }) {
    const decodedQr = this.decode(qrPayment);
    const data = await this.pasetoHandler.verify(decodedQr.token, publicKey, {
      ...options,
      complete: true,
      ignoreExp: false,
      ignoreIat: false,
      assertion: publicKey
    });
    if (options?.keyId && options.keyId !== data.payload.kid) {
      throw new InvalidQrPaymentKeyId("Invalid Key ID");
    }
    if (options?.keyIssuer && options.keyIssuer !== data.payload.kis) {
      throw new InvalidQrPaymentKeyIssuer("Invalid Key Issuer");
    }
    if (!options?.ignoreKeyExp && isAfterDate((/* @__PURE__ */ new Date()).toISOString(), data.payload.kep)) {
      throw new InvalidQrPaymentKeyIssuer("Invalid Key Issuer");
    }
    return data;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InvalidKepExpired,
  InvalidPasetoClaim,
  InvalidPasetoPurpose,
  InvalidPasetoToken,
  InvalidPasetoVersion,
  InvalidPayload,
  InvalidQrPaymentKeyExpired,
  InvalidQrPaymentKeyId,
  InvalidQrPaymentKeyIssuer,
  InvalidQrPaymentToken,
  MissingKid,
  MissingKis,
  MissingSecretKey,
  PasetoV4Handler,
  PayInsError,
  PaymentInstructionsBuilder,
  PaymentInstructionsReader,
  biggerThanOrEqualZero,
  biggerThanZero,
  isAfterDate
});
//# sourceMappingURL=index.js.map