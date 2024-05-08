import { builder } from "./builder.js";
import "./types/user.js";

export const schema = builder.toSchema();
