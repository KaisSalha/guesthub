import { faker } from "@faker-js/faker";
import { db } from "../../db/index.js";
import { orgRoles, OrgRoleInsert } from "../../db/schemas/org-roles.js";
import { ADMIN_PERMISSIONS, PERMISSIONS } from "../../services/permissions.js";

interface OrganizationRoleFactoryProps extends Partial<OrgRoleInsert> {
	organization_id: number;
	is_admin?: boolean;
}

export const OrganizationRoleFactory = async ({
	organization_id,
	is_admin,
	...props
}: OrganizationRoleFactoryProps) => {
	const [role] = await db
		.insert(orgRoles)
		.values({
			name: faker.company.buzzPhrase(),
			permissions: is_admin ? ADMIN_PERMISSIONS : PERMISSIONS,
			organization_id,
			...props,
		})
		.returning();

	return role;
};
