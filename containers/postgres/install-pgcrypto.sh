#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Enable pgcrypto extension
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "guesthubtest" <<-EOSQL
    -- Enable pgcrypto extension
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
EOSQL