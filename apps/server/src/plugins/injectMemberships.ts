import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { db } from "../db/index.js";
import {
	OWNER_PERMISSIONS,
	getAdminPermissions,
	getUserPermissions,
} from "../services/permissions.js";

export const injectMemberships = fp(async function (
	app: FastifyInstance
): Promise<void> {
	app.addHook("onRequest", async (request) => {
		if (request.user && request.user.type === "org") {
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
						permissions:
							orgMembership.organization.owner_id ===
							request.user!.id
								? OWNER_PERMISSIONS
								: orgMembership.role.name === "admin"
									? getAdminPermissions({
											permissions:
												orgMembership.role.permissions,
										})
									: getUserPermissions({
											permissions:
												orgMembership.role.permissions,
										}),
					},
				})),
			};

			return;
		}
	});
});
