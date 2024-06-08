import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../server.js";
import { expect, test } from "vitest";
import { UserFactory } from "../../test/factories/user-factory.js";
import { OrganizationFactory } from "../../test/factories/organization-factory.js";
import { OrganizationRoleFactory } from "../../test/factories/org-role-factory.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { OrganizationInviteFactory } from "../../test/factories/org-invite-factory.js";
import { OrganizationMembershipFactory } from "../../test/factories/org-membership-factory.js";

const app = buildServer();
const client = createMercuriusTestClient(app);

test("works", async () => {
	const user = await UserFactory({ type: "org" });

	client.setHeaders({
		"x-debug-user": user.email,
	});

	const organization = await OrganizationFactory({ owner_id: user.id });

	const orgRole = await OrganizationRoleFactory({
		organization_id: organization.id,
		is_admin: true,
	});

	await OrganizationMembershipFactory({
		organization_id: organization.id,
		user_id: user.id,
		org_role_id: orgRole.id,
	});

	const orgInvite = await OrganizationInviteFactory({
		organization_id: organization.id,
		org_role_id: orgRole.id,
	});

	const orgInviteId = encodeGlobalID("OrgInvite", orgInvite.id);

	const result = await client.query<any, { id: string }>(
		`
    query GetOrgInvite($id: ID!) {
    orgInvite(id: $id) {
      id
      email
      organization {
        id
        name
        logo_url
      }
      user {
        id
        email
        profile_completed
      }
    }
  }
  `,
		{
			variables: {
				id: orgInviteId,
			},
		}
	);

	expect(result.data.orgInvite.id).toBe(orgInviteId);
});
