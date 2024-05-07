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
    },
  },
};

export default config;
