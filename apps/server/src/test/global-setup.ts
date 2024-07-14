import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, pool } from "../db/index.js";
import { resetDb } from "./reset-db.js";

export const setup = async () => {
	await resetDb();
	await migrate(db, {
		migrationsFolder: "src/db/migrations",
		migrationsTable: "migrations",
		migrationsSchema: "public",
	});
};

export const teardown = async () => {
	await resetDb();
	await pool.end();
};
