import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2022",
  format: ["cjs"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
});
