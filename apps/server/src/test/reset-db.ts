import { pool } from "../db/index.js";

export const resetDb = async () => {
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
};
