import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      "https://guesthub.internal:3000/graphql": {
        headers: {
          "x-debug-user": "kaiss.salha@gmail.com",
        },
      },
    },
  ],
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  generates: {
    "src/gql/": {
      preset: "client",
      config: {
        scalars: {
          DateTime: "Date",
          JSON: "Record<string, any>",
          Date: "Date",
          Timestamp: "number",
          Email: "string",
          CountryCode: "string",
          Latitude: "number",
          Longitude: "number",
          NonEmptyString: "string",
          TimeZone: "string",
          S3File: "string",
        },
      },
    },
  },
};

export default config;
