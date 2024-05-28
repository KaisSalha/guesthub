import * as usersSchema from "./schemas/users.js";
import * as sessionsSchema from "./schemas/sessions.js";
import * as organizationsSchema from "./schemas/organizations.js";
import * as rolesSchema from "./schemas/roles.js";
import * as membershipsSchema from "./schemas/memberships.js";
import * as invitesSchema from "./schemas/invites.js";

export default {
	...usersSchema,
	...sessionsSchema,
	...organizationsSchema,
	...rolesSchema,
	...membershipsSchema,
	...invitesSchema,
};
