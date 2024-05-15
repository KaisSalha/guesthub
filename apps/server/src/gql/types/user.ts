import { builder } from "../builder.js";
import { db } from "../../db/index.js";
import { User as UserType } from "../../db/schemas/users.js";
import { Membership } from "./membership.js";

export const User = builder.loadableNodeRef("User", {
	id: {
		resolve: (user) => user.id,
	},
	load: async (ids: string[]) => {
		const users = await db.query.users.findMany({
			where: (users, { inArray }) =>
				inArray(
					users.id,
					ids.map((id) => parseInt(id))
				),
		});

		return ids.map((id) => {
			const user = users.find((user) => user.id == parseInt(id));

			if (!user) {
				return new Error(`User not found: ${id}`);
			}
			return user;
		});
	},
});

User.implement({
	isTypeOf: (user) => (user as UserType).id !== undefined,
	fields: (t) => ({
		email: t.field({
			type: "Email",
			resolve: (parent) => parent.email,
		}),
		first_name: t.exposeString("first_name", { nullable: true }),
		last_name: t.exposeString("last_name", { nullable: true }),
		avatar_url: t.exposeString("avatar_url", { nullable: true }),
		type: t.exposeString("type"),
		memberships: t.loadableGroup({
			type: Membership,
			load: (ids: number[]) =>
				db.query.memberships.findMany({
					where: (memberships, { inArray }) =>
						inArray(memberships.user_id, ids),
				}),
			group: (membership) => {
				if (typeof membership === "string") return -1;

				return membership.user_id;
			},
			resolve: (parent) => parent.id,
		}),
		created_at: t.field({
			type: "Timestamp",
			nullable: true,
			resolve: (parent) => parent.created_at,
		}),
		updated_at: t.field({
			type: "Timestamp",
			nullable: true,
			resolve: (parent) => parent.updated_at,
		}),
	}),
});

builder.queryFields((t) => ({
	user: t.field({
		type: User,
		nullable: true,
		args: {
			id: t.arg.globalID({ required: true }),
		},
		resolve: (_root, args) => args.id.id,
	}),
	users: t.field({
		type: [User],
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
	me: t.field({
		type: User,
		nullable: true,
		resolve: (_parent, _args, { user }) => {
			return user;
		},
	}),
}));
