import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
	schema: "./dist/src/db/schemas/*",
	out: "./src/db/migrations",
	driver: "pg",
	dbCredentials: {
		connectionString: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
	},
} satisfies Config;
