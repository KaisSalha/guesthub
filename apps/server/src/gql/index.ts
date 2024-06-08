import { builder } from "./builder.js";
import "./types/user/user.js";
import "./types/organization/organization.js";
import "./types/orgInvite/orgInvite.js";
import "./types/orgMembership/orgMembership.js";
import "./types/orgRole/orgRole.js";

export const schema = builder.toSchema();
