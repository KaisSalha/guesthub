import { builder } from "./builder.js";
import "./types/user/user.js";
import "./types/organization/organization.js";
import "./types/org-invite/org-invite.js";
import "./types/org-membership/org-membership.js";
import "./types/org-role/org-role.js";
import "./types/event/event.js";
import "./types/activity/activity.js";
import "./types/event-attendance/event-attendance.js";

export const schema = builder.toSchema();
