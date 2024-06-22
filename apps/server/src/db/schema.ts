import * as usersSchema from "./schemas/users.js";
import * as sessionsSchema from "./schemas/sessions.js";
import * as organizationsSchema from "./schemas/organizations.js";
import * as orgRolesSchema from "./schemas/org-roles.js";
import * as orgMembershipsSchema from "./schemas/org-memberships.js";
import * as orgInvitesSchema from "./schemas/org-invites.js";
import * as eventsSchema from "./schemas/events.js";
import * as activitiesSchema from "./schemas/activities.js";

export default {
	...usersSchema,
	...sessionsSchema,
	...organizationsSchema,
	...orgRolesSchema,
	...orgMembershipsSchema,
	...orgInvitesSchema,
	...eventsSchema,
	...activitiesSchema,
};
