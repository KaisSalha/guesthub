import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { db } from "../db/index.js";
import { getUserPermissions } from "../services/permissions.js";

export const injectMemberships = fp(async function (
	app: FastifyInstance
): Promise<void> {
	app.addHook("onRequest", async (request) => {
		if (request.user && request.user.type === "org") {
			const memberships = await db.query.memberships.findMany({
				where: (memberships, { eq }) =>
					eq(memberships.user_id, request.user!.id),
				with: {
					role: true,
					organization: true,
				},
			});

			request.user = {
				...request.user,
				memberships: memberships.map((membership) => ({
					...membership,
					role: {
						...membership.role,
						permissions: getUserPermissions({
							permissions: membership.role.permissions,
						}),
					},
				})),
			};

			return;
		}
	});
});
