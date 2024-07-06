import { encodeGlobalID } from "@pothos/plugin-relay";
import locationTimezone from "node-location-timezone";
import { and, count, eq, inArray } from "drizzle-orm";
import { render } from "@react-email/render";
import { builder } from "../../builder.js";
import { db } from "../../../db/index.js";
import {
	EventAttendance as EventAttendanceType,
	EVENT_ATTENDANCE_STATUS_ENUM,
	EVENT_USER_ATTENDANCE_TYPE_ENUM,
	eventAttendance,
} from "../../../db/schemas/event-attendance.js";
import { resolveWindowedConnection } from "../../../utils/resolveWindowedConnection.js";
import { resend } from "../../../lib/resend.js";
import { EventInviteEmail } from "../../../emails/event/invite-event-attendance.js";
import { getCityAddress } from "../../../utils/address.js";
import { User } from "../user/user.js";
import { OrgMembership } from "../org-membership/org-membership.js";
import { emailsUsersLoader } from "../../loaders/emails-users-loader.js";
import { Event } from "../event/event.js";
import { events } from "../../../db/schemas/events.js";
import { orgMemberships } from "../../../db/schemas/org-memberships.js";
import { users } from "../../../db/schemas/users.js";

const EventAttendanceStatus = builder.enumType("EventAttendanceStatus", {
	values: Object.values(EVENT_ATTENDANCE_STATUS_ENUM),
});

const EventUserAttendanceType = builder.enumType("EventUserAttendanceType", {
	values: Object.values(EVENT_USER_ATTENDANCE_TYPE_ENUM),
});

export const EventAttendance = builder.loadableNodeRef("EventAttendance", {
	id: {
		resolve: (eventAttendance) => eventAttendance.id,
	},
	load: async (ids: string[]) => {
		const eventAttendances = await db.query.eventAttendance.findMany({
			where: (eventAttendances, { inArray }) =>
				inArray(eventAttendances.id, ids),
		});

		return ids.map((id) => {
			const eventAttendance = eventAttendances.find(
				(eventAttendance) => eventAttendance.id == id
			);

			if (!eventAttendance) {
				return new Error(`Event attendance not found: ${id}`);
			}
			return eventAttendance;
		});
	},
});

EventAttendance.implement({
	isTypeOf: (eventAttendance) =>
		(eventAttendance as EventAttendanceType).id !== undefined,
	fields: (t) => ({
		email: t.field({
			type: "Email",
			resolve: (parent) => parent.email,
		}),
		event: t.loadable({
			type: Event,
			load: (ids, { loadMany }) => loadMany(Event, ids),
			resolve: (parent) => parent.event_id,
		}),
		attendance_type: t.field({
			type: EventUserAttendanceType,
			resolve: (parent) => parent.attendance_type,
		}),
		status: t.field({
			type: EventAttendanceStatus,
			resolve: (parent) => parent.status,
		}),
		user: t.loadable({
			type: User,
			nullable: true,
			load: (emails: string[], context) =>
				emailsUsersLoader(context).loadMany(emails),
			resolve: (parent) => parent.email,
		}),
		travel_required: t.exposeBoolean("travel_required"),
		accommodation_required: t.exposeBoolean("accommodation_required"),
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
	eventAttendance: t.field({
		type: EventAttendance,
		nullable: true,
		args: {
			id: t.arg.globalID({ required: true }),
		},
		resolve: (_root, args) => args.id.id,
	}),
	userEventAttendances: t
		.withAuth({
			isAuthenticated: true,
		})
		.connection({
			type: EventAttendance,
			nullable: true,
			args: {
				offset: t.arg.int({ required: true }),
			},
			resolve: async (_parent, args, ctx) => {
				if (!ctx.user) {
					throw new Error("User required");
				}

				return await resolveWindowedConnection(
					{ args },
					async ({ limit }) => {
						const [items, totalCount] = await Promise.all([
							db
								.select()
								.from(eventAttendance)
								.where(
									eq(eventAttendance.email, ctx.user.email)
								)
								.limit(limit)
								.offset(args.offset),
							db.select({ value: count() }).from(eventAttendance),
						]);

						return {
							items,
							totalCount: totalCount[0].value,
						};
					}
				);
			},
		}),
	eventAttendanceList: t
		.withAuth({
			isAuthenticated: true,
		})
		.connection({
			type: EventAttendance,
			nullable: true,
			args: {
				offset: t.arg.int({ required: true }),
				eventId: t.arg.globalID({ required: true }),
			},
			authScopes: async (_, args, ctx) => {
				const event = await db.query.events.findFirst({
					where: eq(events.id, parseInt(args.eventId.id)),
				});

				if (!event) throw new Error("Event not found");

				const membership = ctx.user.orgMemberships?.find(
					(orgMembership) =>
						orgMembership.organization.id === event.organization_id
				);

				return !!membership;
			},
			resolve: async (_parent, args, ctx) => {
				if (!ctx.user) {
					throw new Error("User required");
				}

				const filter = eq(
					eventAttendance.event_id,
					parseInt(args.eventId.id)
				);

				return await resolveWindowedConnection(
					{ args },
					async ({ limit }) => {
						const [items, totalCount] = await Promise.all([
							db
								.select()
								.from(eventAttendance)
								.where(filter)
								.limit(limit)
								.offset(args.offset),
							db
								.select({ value: count() })
								.from(eventAttendance)
								.where(filter),
						]);

						return {
							items,
							totalCount: totalCount[0].value,
						};
					}
				);
			},
		}),
}));

// invite team member mutation
builder.relayMutationField(
	"inviteEventAttendance",
	{
		inputFields: (t) => ({
			eventId: t.globalID({ required: true }),
			email: t.string({ required: true }),
			attendance_type: t.string({ required: true }),
			travel_required: t.boolean({ required: true }),
			accommodation_required: t.boolean({ required: true }),
		}),
	},
	{
		authScopes: async (_, args, ctx) => {
			if (!ctx.user) {
				throw new Error("User required");
			}

			const event = await db.query.events.findFirst({
				where: eq(events.id, parseInt(args.input.eventId.id)),
			});

			if (!event) throw new Error("Event not found");

			const membership = ctx.user.orgMemberships?.find(
				(orgMembership) =>
					orgMembership.organization.id === event.organization_id
			);

			if (!membership)
				throw new Error("User does not belong to organization");

			return membership.role.permissions.CAN_INVITE_GUESTS;
		},
		resolve: async (_root, args, ctx) => {
			if (!ctx.user) {
				throw new Error("User required");
			}

			const event = await db.query.events.findFirst({
				where: eq(events.id, parseInt(args.input.eventId.id)),
			});

			if (!event) throw new Error("Event not found");

			const email = args.input.email.toLowerCase();

			// Check if the user is already attending the event
			const [existingAttendance] = await db
				.select()
				.from(eventAttendance)
				.where(
					and(
						eq(eventAttendance.email, email),
						eq(
							eventAttendance.event_id,
							parseInt(args.input.eventId.id)
						),
						inArray(eventAttendance.status, [
							EVENT_ATTENDANCE_STATUS_ENUM.PENDING,
							EVENT_ATTENDANCE_STATUS_ENUM.ACCEPTED,
						])
					)
				);

			if (existingAttendance) {
				throw new Error(
					"An invite for this email and event already exists and is pending or accepted."
				);
			}

			// if the type is team, check if the user is a member of the organization
			if (
				args.input.attendance_type ===
				EVENT_USER_ATTENDANCE_TYPE_ENUM.TEAM
			) {
				const userSubquery = db
					.select({
						id: users.id,
					})
					.from(users)
					.where(eq(users.email, args.input.email));

				const orgMembership = await db
					.select()
					.from(orgMemberships)
					.where(
						and(
							eq(orgMemberships.user_id, userSubquery),
							eq(
								orgMemberships.organization_id,
								event.organization_id
							)
						)
					);

				if (!orgMembership?.length) {
					throw new Error("User is not a member of the organization");
				}
			}

			const name = `${ctx.user.first_name} ${ctx.user.last_name}`;

			const [newAttendance] = await db
				.insert(eventAttendance)
				.values({
					email,
					event_id: parseInt(args.input.eventId.id),
					attendance_type: args.input
						.attendance_type as EVENT_USER_ATTENDANCE_TYPE_ENUM,
					travel_required: args.input.travel_required,
					accommodation_required: args.input.accommodation_required,
				})
				.returning();

			const html = render(
				EventInviteEmail({
					email,
					invitedByEmail: ctx.user.email,
					invitedByName: `${ctx.user.first_name} ${ctx.user.last_name}`,
					eventName: event.name,
					inviteCode: encodeGlobalID("Invite", newAttendance.id),
					location: getCityAddress({
						city: event.city,
						state: event.state,
						country: locationTimezone.findCountryByIso(
							event.country_code
						).name,
					}),
				})
			);

			const { error } = await resend.emails.send({
				from: `${name} on GuestHub <support@guesthub.ai>`,
				to: [email],
				subject: `You've been invited to join ${event.name} on GuestHub`,
				html,
			});

			if (error) {
				// Delete attendance from db
				await db
					.delete(eventAttendance)
					.where(eq(eventAttendance.id, newAttendance.id));

				throw new Error(error.message);
			}

			return {
				success: true,
				newAttendance,
			};
		},
	},
	{
		outputFields: (t) => ({
			success: t.boolean({
				resolve: (result) => result.success,
			}),
			eventAttendance: t.field({
				type: EventAttendance,
				nullable: true,
				resolve: (result) => result.newAttendance,
			}),
		}),
	}
);

// accept invitation mutation
builder.relayMutationField(
	"acceptEventAttendance",
	{
		inputFields: (t) => ({
			inviteId: t.globalID({ required: true }),
		}),
	},
	{
		authScopes: async (_, args, ctx) => {
			try {
				if (!ctx.user) {
					throw new Error("User required");
				}

				const [invitation] = await db
					.select()
					.from(eventAttendance)
					.where(eq(eventAttendance.id, args.input.inviteId.id));

				if (!invitation) {
					return false;
				}

				const invitationBelongsToUser =
					invitation.email === ctx.user.email;

				return !!invitationBelongsToUser;
			} catch (error) {
				console.error(error);
				return false;
			}
		},
		resolve: async (_root, args, ctx) => {
			if (!ctx.user) {
				throw new Error("User required");
			}

			await db
				.update(eventAttendance)
				.set({ status: EVENT_ATTENDANCE_STATUS_ENUM.ACCEPTED })
				.where(eq(eventAttendance.id, args.input.inviteId.id))
				.returning();

			OrgMembership.getDataloader(ctx).clearAll();

			return {
				success: true,
			};
		},
	},
	{
		outputFields: (t) => ({
			success: t.boolean({
				resolve: (result) => result.success,
			}),
		}),
	}
);
