import { db } from "../../db/index.js";
import {
	orgMemberships,
	OrgMembershipInsert,
} from "../../db/schemas/orgMemberships.js";

interface OrganizationMembershipFactoryProps
	extends Partial<OrgMembershipInsert> {
	organization_id: number;
	user_id: number;
	org_role_id: number;
}

export const OrganizationMembershipFactory = async ({
	organization_id,
	user_id,
	org_role_id,
	...props
}: OrganizationMembershipFactoryProps) => {
	const [role] = await db
		.insert(orgMemberships)
		.values({
			organization_id,
			user_id,
			org_role_id,
			...props,
		})
		.returning();

	return role;
};
