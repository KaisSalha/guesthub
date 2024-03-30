import { config } from "../config/index.js";
import { drizzle } from "drizzle-orm/node-postgres";
import schema from "./schema.js";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
	connectionString: config.DB.url,
	min: 5, // set pool min size to 5
	max: 20, // set pool max size to 20
	idleTimeoutMillis: 1000, // close idle clients after 1 second
	connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
	maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

export const db = drizzle(pool, { schema, logger: true });

export type DB = typeof db;
