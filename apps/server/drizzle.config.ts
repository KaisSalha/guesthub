import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
	schema: "./dist/db/schemas/*",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
	},
	migrations: {
		table: "migrations",
		schema: "public",
	},
} satisfies Config;
