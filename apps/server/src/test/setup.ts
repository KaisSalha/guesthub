import { beforeAll, beforeEach, afterAll, afterEach } from "vitest";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, pool } from "../db/index.js";

// Command to run before all tests
beforeAll(async () => {
	console.log("Running global setup before all tests...");
});

// Command to run before each test
beforeEach(async () => {
	console.log("Running setup before each test...");
	await migrate(db, {
		migrationsFolder: "src/db/migrations",
		migrationsTable: "migrations",
		migrationsSchema: "public",
	});
	// Add your per-test setup code here
});

// Command to run after all tests
afterAll(async () => {
	console.log("Running global teardown after all tests...");

	// Drop all tables
	await pool.query(`
	  DO $$ DECLARE
	      r RECORD;
	  BEGIN
	      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
	          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
	      END LOOP;
	  END $$;


	  DO $$ DECLARE
	      r RECORD;
	  BEGIN
	      FOR r IN (SELECT n.nspname as schema, t.typname as type
	                FROM pg_type t
	                LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
	                WHERE t.typtype = 'e') LOOP
	          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.schema) || '.' || quote_ident(r.type) || ' CASCADE';
	      END LOOP;
	  END $$;


	  DO $$ DECLARE
	      r RECORD;
	  BEGIN
	      FOR r IN (SELECT nspname FROM pg_namespace
	                WHERE nspname NOT IN ('pg_catalog', 'information_schema', 'public', 'pg_toast', 'pg_temp_1', 'pg_toast_temp_1')) LOOP
	          EXECUTE 'DROP SCHEMA IF EXISTS ' || quote_ident(r.nspname) || ' CASCADE';
	      END LOOP;
	  END $$;
	`);
	pool.end();
});

// Command to run after each test
afterEach(async () => {
	console.log("Running teardown after each test...");

	// Truncate all tables in the public schema
	await pool.query(`
	  DO $$ DECLARE
	      r RECORD;
	  BEGIN
	      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
	          EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
	      END LOOP;
	  END $$;
	`);
});
