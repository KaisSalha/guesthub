import { builder } from "./builder.js";
import "./types/user.js";
import "./types/organization.js";
import "./types/orgInvite.js";
import "./types/orgMembership.js";
import "./types/orgRole.js";

export const schema = builder.toSchema();
