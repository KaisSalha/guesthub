import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import { ContextType } from "./context";
import ComplexityPlugin from "@pothos/plugin-complexity";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";

const builder = new SchemaBuilder<{
	Connection: {
		totalCount: number;
	};
	Context: ContextType;
	AuthScopes: {
		admin: boolean;
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
	authScopes: async (context: ContextType) => ({
		admin: context.isAdmin ?? false,
	}),
});

builder.globalConnectionField("totalCount", (t) =>
	t.int({
		nullable: false,
		resolve: (parent) => parent.totalCount,
	})
);

builder.queryType({});
builder.mutationType({});

export { builder };
