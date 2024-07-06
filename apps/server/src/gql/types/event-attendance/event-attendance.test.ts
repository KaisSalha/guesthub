import { createMercuriusTestClient } from "mercurius-integration-testing";
import { buildServer } from "../../../server.js";
import { beforeEach, expect, it, describe, vi, afterAll } from "vitest";
import { UserFactory } from "../../../test/factories/user-factory.js";
import { OrganizationFactory } from "../../../test/factories/organization-factory.js";
import { OrganizationRoleFactory } from "../../../test/factories/org-role-factory.js";
import { encodeGlobalID } from "@pothos/plugin-relay";
import { EventAttendanceFactory } from "../../../test/factories/event-attendance-factory.js";
import { resend } from "../../../lib/resend.js";
import { resetDbTables } from "../../../test/reset-db-tables.js";
import { OrganizationMembershipFactory } from "../../../test/factories/org-membership-factory.js";
import { EventFactory } from "../../../test/factories/event-factory.js";
import { EVENT_USER_ATTENDANCE_TYPE_ENUM } from "../../../db/schemas/event-attendance.js";

describe("eventAttendance", async () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	afterAll(async () => {
		await resetDbTables();
	});

	const client = createMercuriusTestClient(buildServer());

	const user = await UserFactory();

	const user2 = await UserFactory();

	const user3 = await UserFactory();

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

	const ortherRole = await OrganizationRoleFactory({
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

	await OrganizationMembershipFactory({
		organization_id: otherOrganization.id,
		user_id: user3.id,
		org_role_id: ortherRole.id,
	});

	const event = await EventFactory({
		organization_id: organization.id,
		created_by_id: user.id,
	});

	const email = "test@test.com";

	const eventAttendance = await EventAttendanceFactory({
		email,
		event_id: event.id,
		attendance_type: EVENT_USER_ATTENDANCE_TYPE_ENUM.TEAM,
	});

	const eventAttendanceId = encodeGlobalID(
		"EventAttendance",
		eventAttendance.id
	);

	// Query tests
	it("queries an existing event attendance", async () => {
		const result = await client.query<any, { id: string }>(
			`
				query GetEventAttendance($id: ID!) {
					eventAttendance(id: $id) {
						id
						email
                        attendance_type
                        status
                        travel_required
                        accommodation_required
                        created_at
                        updated_at
					}
				}
			`,
			{
				variables: {
					id: eventAttendanceId,
				},
			}
		);

		expect(result.data.eventAttendance.id).toBe(eventAttendanceId);
	});

	it("queries paginated org event attendances", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

		const result = await client.query<
			any,
			{ eventId: string; first: number; offset: number }
		>(
			`
				query GetEventAttendanceList($first: Int!, $offset: Int!, $eventId: ID!) {
					eventAttendanceList(first: $first, offset: $offset, eventId: $eventId) {
					totalCount
					edges {
						node {
							id
							email
							attendance_type
							status
							travel_required
							accommodation_required
							created_at
							updated_at
						}
					}
					pageInfo {
						hasNextPage
						hasPreviousPage
						startCursor
						endCursor
						}
					}
				}
			`,
			{
				variables: {
					first: 10,
					offset: 0,
					eventId: encodeGlobalID("Event", event.id),
				},
			}
		);

		expect(result.data.eventAttendanceList.totalCount).toBe(1);
	});

	it("gives an error if you don't belong to the organization when querying paginated org event attendances", async () => {
		client.setHeaders({
			"x-debug-user": user3.email,
		});

		const result = await client.query<
			any,
			{ eventId: string; first: number; offset: number }
		>(
			`
				query GetEventAttendanceList($first: Int!, $offset: Int!, $eventId: ID!) {
					eventAttendanceList(first: $first, offset: $offset, eventId: $eventId) {
					totalCount
					edges {
						node {
							id
							email
							attendance_type
							status
							travel_required
							accommodation_required
							created_at
							updated_at
						}
					}
					pageInfo {
						hasNextPage
						hasPreviousPage
						startCursor
						endCursor
						}
					}
				}
			`,
			{
				variables: {
					first: 10,
					offset: 0,
					eventId: encodeGlobalID("Event", event.id),
				},
			}
		);

		expect(result.errors).toBeDefined();
	});

	// Invite Tests
	it("invites a user to join an event", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

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
			{
				input: {
					email: string;
					eventId: string;
					attendance_type: string;
					travel_required: boolean;
					accommodation_required: boolean;
				};
			}
		>(
			`
				mutation inviteEventAttendance(
					$input: InviteEventAttendanceInput!
				) {
					inviteEventAttendance(input: $input) {
						eventAttendance {
							id
						}
					}
				}
			`,
			{
				variables: {
					input: {
						email: "test@example.com",
						eventId: encodeGlobalID("Event", event.id),
						attendance_type:
							EVENT_USER_ATTENDANCE_TYPE_ENUM.SPECIAL_GUEST,
						travel_required: false,
						accommodation_required: false,
					},
				},
			}
		);

		expect(result.data.inviteEventAttendance.eventAttendance).toBeDefined();
		expect(resendSpy).toHaveBeenCalled();
	});

	it("gives an error if you invite a user that is already attending the event", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

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
			{
				input: {
					email: string;
					eventId: string;
					attendance_type: string;
					travel_required: boolean;
					accommodation_required: boolean;
				};
			}
		>(
			`
				mutation inviteEventAttendance(
					$input: InviteEventAttendanceInput!
				) {
					inviteEventAttendance(input: $input) {
						eventAttendance {
							id
						}
					}
				}
			`,
			{
				variables: {
					input: {
						email,
						eventId: encodeGlobalID("Event", event.id),
						attendance_type:
							EVENT_USER_ATTENDANCE_TYPE_ENUM.SPECIAL_GUEST,
						travel_required: false,
						accommodation_required: false,
					},
				},
			}
		);

		expect(result.errors).toBeDefined();
		expect(resendSpy).not.toHaveBeenCalled();
	});

	it("gives an error if you invite to an event whose organization you aren't a member of", async () => {
		client.setHeaders({
			"x-debug-user": user3.email,
		});

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
			{
				input: {
					email: string;
					eventId: string;
					attendance_type: string;
					travel_required: boolean;
					accommodation_required: boolean;
				};
			}
		>(
			`
				mutation inviteEventAttendance(
					$input: InviteEventAttendanceInput!
				) {
					inviteEventAttendance(input: $input) {
						eventAttendance {
							id
						}
					}
				}
			`,
			{
				variables: {
					input: {
						email: "test@example.com",
						eventId: encodeGlobalID("Event", event.id),
						attendance_type:
							EVENT_USER_ATTENDANCE_TYPE_ENUM.SPECIAL_GUEST,
						travel_required: false,
						accommodation_required: false,
					},
				},
			}
		);

		expect(result.errors).toBeDefined();
		expect(resendSpy).not.toHaveBeenCalled();
	});

	it("gives an error if you invite a team member that is not a member of the organization", async () => {
		client.setHeaders({
			"x-debug-user": user.email,
		});

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
			{
				input: {
					email: string;
					eventId: string;
					attendance_type: string;
					travel_required: boolean;
					accommodation_required: boolean;
				};
			}
		>(
			`
				mutation inviteEventAttendance(
					$input: InviteEventAttendanceInput!
				) {
					inviteEventAttendance(input: $input) {
						eventAttendance {
							id
						}
					}
				}
			`,
			{
				variables: {
					input: {
						email: user3.email,
						eventId: encodeGlobalID("Event", event.id),
						attendance_type: EVENT_USER_ATTENDANCE_TYPE_ENUM.TEAM,
						travel_required: false,
						accommodation_required: false,
					},
				},
			}
		);

		expect(result.errors).toBeDefined();
		expect(resendSpy).not.toHaveBeenCalled();
	});

	it("gives an error if you don't have the permission to invite a team member", async () => {
		client.setHeaders({
			"x-debug-user": user2.email,
		});

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
			{
				input: {
					email: string;
					eventId: string;
					attendance_type: string;
					travel_required: boolean;
					accommodation_required: boolean;
				};
			}
		>(
			`
				mutation inviteEventAttendance(
					$input: InviteEventAttendanceInput!
				) {
					inviteEventAttendance(input: $input) {
						eventAttendance {
							id
						}
					}
				}
			`,
			{
				variables: {
					input: {
						email: "test2@example.com",
						eventId: encodeGlobalID("Event", event.id),
						attendance_type:
							EVENT_USER_ATTENDANCE_TYPE_ENUM.SPECIAL_GUEST,
						travel_required: false,
						accommodation_required: false,
					},
				},
			}
		);

		expect(result.errors).toBeDefined();
		expect(resendSpy).not.toHaveBeenCalled();
	});
});
