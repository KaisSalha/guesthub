import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import ComplexityPlugin from "@pothos/plugin-complexity";
import { ContextType } from "./context.js";
import {
	DateResolver,
	JSONResolver,
	EmailAddressResolver,
	URLResolver,
	TimestampResolver,
	DateTimeResolver,
	CountryCodeResolver,
} from "graphql-scalars";

const builder = new SchemaBuilder<{
	Connection: {
		totalCount: number;
	};
	Context: ContextType;
	Scalars: {
		JSON: {
			Input: unknown;
			Output: unknown;
		};
		Date: {
			Input: Date;
			Output: Date;
		};
		Timestamp: {
			Input: Date;
			Output: Date;
		};
		DateTime: {
			Input: Date;
			Output: Date;
		};
		Email: {
			Input: string;
			Output: string;
		};
		URL: {
			Input: string;
			Output: string;
		};
		CountryCode: {
			Input: string;
			Output: string;
		};
	};
}>({
	plugins: [DataloaderPlugin, RelayPlugin, ComplexityPlugin],
	relayOptions: {
		clientMutationId: "omit",
		cursorType: "String",
	},
	complexity: {
		defaultComplexity: 1,
		defaultListMultiplier: 10,
		limit: (_ctx: ContextType) => ({
			complexity: 500,
			depth: 10,
			breadth: 50,
		}),
	},
});

builder.globalConnectionField("totalCount", (t) =>
	t.int({
		nullable: false,
		resolve: (parent) => parent.totalCount,
	})
);

builder.addScalarType("JSON", JSONResolver);
builder.addScalarType("Date", DateResolver);
builder.addScalarType("Timestamp", TimestampResolver);
builder.addScalarType("DateTime", DateTimeResolver);
builder.addScalarType("Email", EmailAddressResolver);
builder.addScalarType("URL", URLResolver);
builder.addScalarType("CountryCode", CountryCodeResolver);

builder.queryType({});
// builder.mutationType({});

export { builder };
