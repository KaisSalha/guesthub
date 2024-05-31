import { builder } from "../builder.js";
import { db } from "../../db/index.js";
import { User as UserType, users } from "../../db/schemas/users.js";
import { Membership } from "./membership.js";
import { eq } from "drizzle-orm";
import { Invite } from "./invite.js";
import { userInvitesLoader } from "../loaders/user-invites-loader.js";

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
	authScopes: {
		isAuthenticated: true,
	},
	fields: (t) => ({
		email: t.field({
			type: "Email",
			resolve: (parent) => parent.email,
		}),
		first_name: t.exposeString("first_name", { nullable: true }),
		last_name: t.exposeString("last_name", { nullable: true }),
		full_name: t.field({
			type: "String",
			resolve: (parent) => `${parent.first_name} ${parent.last_name}`,
		}),
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
		invites: t.loadableList({
			type: Invite,
			nullable: true,
			load: (emails: string[], context) =>
				userInvitesLoader(context).loadMany(emails),
			resolve: (parent) => parent.email,
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
	me: t.field({
		type: User,
		nullable: true,
		authScopes: {
			isAuthenticated: true,
		},
		resolve: (_parent, _args, { user }) => {
			return user;
		},
	}),
	user: t.field({
		type: User,
		nullable: true,
		authScopes: {
			isAuthenticated: true,
		},
		args: {
			id: t.arg.globalID({ required: true }),
		},
		resolve: (_root, args) => args.id.id,
	}),
}));

builder.relayMutationField(
	"updateUser",
	{
		inputFields: (t) => ({
			first_name: t.string({ required: false }),
			last_name: t.string({ required: false }),
			avatar_url: t.string({ required: false }),
		}),
	},
	{
		authScopes: {
			isAuthenticated: true,
		},
		resolve: async (_root, args, ctx) => {
			try {
				const updateFields: Partial<UserType> = {
					...(args.input.first_name && {
						first_name: args.input.first_name,
					}),
					...(args.input.last_name && {
						last_name: args.input.last_name,
					}),
					...(args.input.avatar_url && {
						avatar_url: args.input.avatar_url,
					}),
				};

				const [user] = await db
					.update(users)
					.set(updateFields)
					.where(eq(users.id, ctx.user.id))
					.returning();

				return {
					success: true,
					user,
				};
			} catch (error) {
				console.log(error);
				return {
					success: false,
				};
			}
		},
	},
	{
		outputFields: (t) => ({
			success: t.boolean({
				resolve: (result) => result.success,
			}),
			user: t.field({
				type: User,
				nullable: true,
				resolve: (result) => result.user,
			}),
		}),
	}
);
