import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const envFound = dotenv.config();
if (envFound.error) {
	// This error should crash whole process
	throw new Error("ENV_FILE_NOT_FOUND");
}

if (
	!process.env.DATABASE_HOST ||
	!process.env.DATABASE_PORT ||
	!process.env.DATABASE_USER ||
	!process.env.DATABASE_PASSWORD ||
	!process.env.DATABASE_NAME
) {
	throw new Error("DATABASE_KEYS_NOT_SET");
}

if (
	!process.env.S3_ACCESS_KEY ||
	!process.env.S3_SECRET_KEY ||
	!process.env.S3_BUCKET_NAME ||
	!process.env.S3_REGION
) {
	throw new Error("S3_KEYS_NOT_SET");
}

if (!process.env.OPENAI_API_KEY) {
	throw new Error("OPENAI_API_KEY_NOT_SET");
}

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV ?? "development";

export const config = {
	PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
	HOST: process.env.HOST || "127.0.0.1",
	ENV: process.env.NODE_ENV,
	isDev: process.env.NODE_ENV === "development",
	isProd: process.env.NODE_ENV === "production",
	DB: {
		host: process.env.DATABASE_HOST,
		port: parseInt(process.env.DATABASE_PORT, 10),
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		url: `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`, // postgres://user:password@host:port/database
	},
	CACHE_PRIVACY: process.env.CACHE_PRIVACY || "public",
	LOGGER: {
		redact: ["DATABASE_URL"],
		transport: {
			target: "pino-pretty",
		},
	},
	S3: {
		ACCESS_KEY: process.env.S3_ACCESS_KEY,
		SECRET_KEY: process.env.S3_SECRET_KEY,
		BUCKET_NAME: process.env.S3_BUCKET_NAME,
		REGION: process.env.S3_REGION,
	},
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

export const SERVER_CONFIG = {
	dev: {
		https: {
			key: fs.readFileSync(
				path.join(
					path.dirname(fileURLToPath(import.meta.url)),
					"../../../../.certs/localhost-key.pem"
				)
			),
			cert: fs.readFileSync(
				path.join(
					path.dirname(fileURLToPath(import.meta.url)),
					"../../../../.certs/localhost.pem"
				)
			),
		},
		logger: config.LOGGER,
	},
	prod: {
		logger: config.LOGGER,
	},
};
