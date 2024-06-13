import * as usersSchema from "./schemas/users.js";
import * as sessionsSchema from "./schemas/sessions.js";
import * as organizationsSchema from "./schemas/organizations.js";
import * as orgRolesSchema from "./schemas/orgRoles.js";
import * as orgMembershipsSchema from "./schemas/orgMemberships.js";
import * as orgInvitesSchema from "./schemas/orgInvites.js";
import * as eventsSchema from "./schemas/events.js";

export default {
	...usersSchema,
	...sessionsSchema,
	...organizationsSchema,
	...orgRolesSchema,
	...orgMembershipsSchema,
	...orgInvitesSchema,
	...eventsSchema,
};
