import PgBoss from "pg-boss";
import { config } from "../config/index.js";

export const boss = new PgBoss(config.DB.pgBoss);
