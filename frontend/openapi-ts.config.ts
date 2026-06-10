import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:8000/docs-json",
  output: "generated/openapi.ts",

  plugins: [
    {
      name: "@hey-api/client-next",
      runtimeConfigPath: "./config/openapi-runtime.ts",
    },
  ],
});
