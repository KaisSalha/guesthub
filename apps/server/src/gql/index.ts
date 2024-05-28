import { builder } from "./builder.js";
import "./types/user.js";
import "./types/organization.js";
import "./types/invite.js";
import "./types/membership.js";
import "./types/role.js";

export const schema = builder.toSchema();
