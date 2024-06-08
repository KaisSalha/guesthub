import { pool } from "../db/index.js";

export const resetDbTables = async () => {
	await pool.query(`
			DO $$ DECLARE
				r RECORD;
			BEGIN
				FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
					EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' RESTART IDENTITY CASCADE';
				END LOOP;
			END $$;
		`);
};
