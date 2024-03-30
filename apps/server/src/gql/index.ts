import { builder } from "./builder.js";
import "./types/users.js";

export const schema = builder.toSchema();
