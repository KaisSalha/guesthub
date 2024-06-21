import { faker } from "@faker-js/faker";
import { db } from "../../db/index.js";
import { orgInvites, OrgInviteInsert } from "../../db/schemas/org-invites.js";

interface OrganizationInviteFactoryProps extends Partial<OrgInviteInsert> {
	organization_id: number;
	org_role_id: number;
}

export const OrganizationInviteFactory = async ({
	organization_id,
	org_role_id,
	...props
}: OrganizationInviteFactoryProps) => {
	const [invite] = await db
		.insert(orgInvites)
		.values({
			email: faker.internet.email(),
			organization_id,
			org_role_id,
			...props,
		})
		.returning();

	return invite;
};
