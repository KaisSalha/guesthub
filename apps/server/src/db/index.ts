import { config } from "../config/index.js";
import { drizzle } from "drizzle-orm/node-postgres";
import schema from "./schema.js";
import { Pool } from "pg";

export const pool = new Pool({
	connectionString: config.isTest ? config.DB.test : config.DB.url,
	min: 5,
	max: 20,
	idleTimeoutMillis: 1000, // close idle clients after 1 second
	connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
	maxUses: 7500, // close (and replace) a connection after it has been used 7500 times
});

export const db = drizzle(pool, { schema, logger: config.isDev });

export type DB = typeof db;
