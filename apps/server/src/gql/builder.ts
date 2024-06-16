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
	TimeZoneResolver,
} from "graphql-scalars";
import { generateReadPresignedUrl } from "../lib/s3.js";
import { User } from "../types/user.js";

const builder = new SchemaBuilder<{
	Connection: {
		totalCount: number;
	};
	Context: ContextType;
	AuthScopes: {
		isAuthenticated: boolean;
	};
	AuthContexts: {
		isAuthenticated: ContextType & { user: User };
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
		TimeZone: {
			Input: string;
			Output: string;
		};
		S3File: {
			Input: {
				url: string;
				duration?: number;
			};
			Output: {
				url: string;
				duration?: number;
			};
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
	authScopes: (context) => ({
		isAuthenticated: context.isAuthenticated,
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

builder.scalarType("S3File", {
	serialize: async (value: { url: string; duration?: number }) => {
		// Ensure the value is of the expected format
		if (typeof value === "object" && "url" in value) {
			if (value.url.includes("/public/")) return value.url;

			return await generateReadPresignedUrl({
				url: value.url,
				duration: value.duration,
			});
		}
		throw new Error(
			"S3File scalar can only serialize an object with url and duration"
		);
	},
	parseValue: (value) => {
		if (!!value && typeof value === "object" && "url" in value) {
			return value as { url: string; duration?: number };
		}
		throw new Error(
			"S3File scalar can only parse an object with url and duration"
		);
	},
	description: "S3 File URL with presigned URL generation",
});

builder.addScalarType("JSON", JSONResolver);
builder.addScalarType("Date", DateResolver);
builder.addScalarType("Timestamp", TimestampResolver);
builder.addScalarType("DateTime", DateTimeResolver);
builder.addScalarType("Email", EmailAddressResolver);
builder.addScalarType("CountryCode", CountryCodeResolver);
builder.addScalarType("Latitude", LatitudeResolver);
builder.addScalarType("Longitude", LongitudeResolver);
builder.addScalarType("NonEmptyString", NonEmptyStringResolver);
builder.addScalarType("TimeZone", TimeZoneResolver);

builder.queryType({});
builder.mutationType({});

export { builder };
