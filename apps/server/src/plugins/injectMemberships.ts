import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { db } from "../db/index.js";
import { getOrgPermissions } from "../services/org-permissions.js";

export const injectMemberships = fp(async function (
	app: FastifyInstance
): Promise<void> {
	app.addHook("onRequest", async (request) => {
		if (request.user) {
			const orgMemberships = await db.query.orgMemberships.findMany({
				where: (orgMemberships, { eq }) =>
					eq(orgMemberships.user_id, request.user!.id),
				with: {
					role: true,
					organization: true,
				},
			});

			request.user = {
				...request.user,
				orgMemberships: orgMemberships.map((orgMembership) => ({
					...orgMembership,
					role: {
						...orgMembership.role,
						permissions: getOrgPermissions({
							permissions: orgMembership.role.permissions,
							role:
								orgMembership.organization.owner_id ===
								request.user!.id
									? "owner"
									: orgMembership.role.name,
						}),
					},
				})),
			};

			return;
		}
	});
});
