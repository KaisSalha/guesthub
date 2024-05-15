import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import ComplexityPlugin from "@pothos/plugin-complexity";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import { ContextType } from "./context.js";
import {
	DateResolver,
	JSONResolver,
	EmailAddressResolver,
	TimestampResolver,
	DateTimeResolver,
	CountryCodeResolver,
	LatitudeResolver,
	LongitudeResolver,
	NonEmptyStringResolver,
} from "graphql-scalars";

const builder = new SchemaBuilder<{
	Connection: {
		totalCount: number;
	};
	Context: ContextType;
	AuthScopes: {
		public: boolean;
	};
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
		CountryCode: {
			Input: string;
			Output: string;
		};
		Latitude: {
			Input: number;
			Output: number;
		};
		Longitude: {
			Input: number;
			Output: number;
		};
		NonEmptyString: {
			Input: string;
			Output: string;
		};
	};
}>({
	plugins: [DataloaderPlugin, RelayPlugin, ScopeAuthPlugin, ComplexityPlugin],
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
	authScopes: async (context) => ({
		public: !!context.user,
	}),
	scopeAuthOptions: {
		authorizeOnSubscribe: true,
		runScopesOnType: true,
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
builder.addScalarType("CountryCode", CountryCodeResolver);
builder.addScalarType("Latitude", LatitudeResolver);
builder.addScalarType("Longitude", LongitudeResolver);
builder.addScalarType("NonEmptyString", NonEmptyStringResolver);

builder.queryType({});
builder.mutationType({});

export { builder };
