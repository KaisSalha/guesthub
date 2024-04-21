import { builder } from "@/gql/builder.js";
import { db } from "@/db/index.js";
import { User as UserType } from "@/db/schemas/users.js";

export const UsersNode = builder.loadableNodeRef("User", {
	id: {
		resolve: (user) => user.id,
	},
	load: async (ids: string[]) => {
		const users = await db.query.users.findMany({
			where: (users, { inArray }) => inArray(users.id, ids),
		});

		return ids.map((id) => {
			const user = users.find((user) => user.id == id);

			if (!user) {
				return new Error(`User not found: ${id}`);
			}
			return user;
		});
	},
});

UsersNode.implement({
	isTypeOf: (user) => (user as UserType).id !== undefined,
	fields: (t) => ({
		email: t.exposeString("email"),
		first_name: t.exposeString("first_name", { nullable: true }),
		last_name: t.exposeString("last_name", { nullable: true }),
		type: t.exposeString("type"),
		created_at: t.string({
			nullable: true,
			resolve: (parent) => parent.created_at.toISOString(),
		}),
	}),
});

builder.queryFields((t) => ({
	user: t.field({
		type: UsersNode,
		nullable: true,
		args: {
			id: t.arg.globalID({ required: true }),
		},
		resolve: (_root, args) => args.id.id,
	}),
	users: t.field({
		type: [UsersNode],
		nullable: true,
		args: {
			ids: t.arg.globalIDList({ required: false }),
		},
		resolve: async (_parent, args) => {
			if (args.ids) {
				return [...args.ids.map(({ id }) => id)];
			}

			return await db.query.users.findMany();
		},
	}),
}));
