import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../../server.js";
import { beforeEach, expect, it, describe, vi, afterAll } from "vitest";
import { UserFactory } from "../../../test/factories/user-factory.js";
import { OrganizationFactory } from "../../../test/factories/organization-factory.js";
import { OrganizationRoleFactory } from "../../../test/factories/org-role-factory.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { OrganizationInviteFactory } from "../../../test/factories/org-invite-factory.js";
import { OrganizationMembershipFactory } from "../../../test/factories/org-membership-factory.js";
import { resend } from "../../../lib/resend.js";
import { resetDbTables } from "../../../test/reset-db-tables.js";

const app = buildServer();
const client = createMercuriusTestClient(app);

describe("orgInvites", async () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterAll(async () => {
		await resetDbTables();
	});

	const user = await UserFactory({ type: "org" });

	const user2 = await UserFactory({ type: "org" });

	client.setHeaders({
		"x-debug-user": user.email,
	});

	const organization = await OrganizationFactory({ owner_id: user.id });

	const otherOrganization = await OrganizationFactory({ owner_id: user.id });

	const orgRole = await OrganizationRoleFactory({
		organization_id: organization.id,
		is_admin: true,
	});

	const orgRole2 = await OrganizationRoleFactory({
		organization_id: organization.id,
		is_admin: false,
	});

	await OrganizationMembershipFactory({
		organization_id: organization.id,
		user_id: user.id,
		org_role_id: orgRole.id,
	});

	await OrganizationMembershipFactory({
		organization_id: organization.id,
		user_id: user2.id,
		org_role_id: orgRole2.id,
	});

	const orgInvite = await OrganizationInviteFactory({
		organization_id: organization.id,
		org_role_id: orgRole.id,
	});

	const orgInviteId = encodeGlobalID("OrgInvite", orgInvite.id);

	it("queries an existing org invite", async () => {
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

	it("invites a user to join an organization", async () => {
		const resendSpy = vi
			.spyOn(resend.emails, "send")
			.mockImplementation(() => {
				return Promise.resolve({
					data: {
						id: "123",
					},
					error: null,
				});
			});

		const result = await client.mutate<
			any,
			{ input: { email: string; orgId: string; orgRoleId: string } }
		>(
			`
				mutation InviteTeamMemberForm_inviteTeamMember(
					$input: InviteTeamMemberInput!
				) {
					inviteTeamMember(input: $input) {
						invite {
							id
						}
					}
				}
			`,
			{
				variables: {
					input: {
						email: "test@example.com",
						orgId: encodeGlobalID("Organization", organization.id),
						orgRoleId: encodeGlobalID("OrgRole", orgRole.id),
					},
				},
			}
		);

		expect(result.data.inviteTeamMember.invite).toBeDefined();
		expect(resendSpy).toHaveBeenCalled();
	});

	it("gives an error if you invite to an org that you aren't a member of", async () => {
		const result = await client.mutate<
			any,
			{ input: { email: string; orgId: string; orgRoleId: string } }
		>(
			`
				mutation InviteTeamMemberForm_inviteTeamMember(
					$input: InviteTeamMemberInput!
				) {
					inviteTeamMember(input: $input) {
						invite {
							id
						}
					}
				}
			`,
			{
				variables: {
					input: {
						email: "test@example.com",
						orgId: encodeGlobalID(
							"Organization",
							otherOrganization.id
						),
						orgRoleId: encodeGlobalID("OrgRole", orgRole.id),
					},
				},
			}
		);

		expect(result.errors).toBeDefined();
	});

	it("gives an error if you don't have permissions", async () => {
		client.setHeaders({
			"x-debug-user": user2.email,
		});

		const result = await client.mutate<
			any,
			{ input: { email: string; orgId: string; orgRoleId: string } }
		>(
			`
				mutation InviteTeamMemberForm_inviteTeamMember(
					$input: InviteTeamMemberInput!
				) {
					inviteTeamMember(input: $input) {
						invite {
							id
						}
					}
				}
			`,
			{
				variables: {
					input: {
						email: "test@example.com",
						orgId: encodeGlobalID("Organization", organization.id),
						orgRoleId: encodeGlobalID("OrgRole", orgRole.id),
					},
				},
			}
		);

		expect(result.errors).toBeDefined();
	});
});
