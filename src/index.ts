export * from "./utils";
import { createHash } from "crypto";

export function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

export default function main() {
  console.log(sha256("hello world"));
}
