FROM postgres:16.1

EXPOSE 5432

COPY ./containers/postgres/install-pgcrypto.sh /docker-entrypoint-initdb.d/
COPY ./containers/postgres/init-test-database.sh /docker-entrypoint-initdb.d/