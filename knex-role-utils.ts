import { Knex } from 'knex';

export async function addUserIfNotExist(
  knex: Knex,
  name: string,
  password: string,
) {
  await knex.raw(
    `DO $$ BEGIN IF NOT EXISTS ( SELECT FROM pg_catalog.pg_roles WHERE rolname = '${name}' ) THEN CREATE USER ${name} WITH PASSWORD '${password}'; END IF; END $$;`,
  );
}

export async function changeTableOwner(
  knex: Knex,
  table: string,
  roleName: string,
) {
  await knex.raw(`ALTER TABLE ${table} owner to ${roleName};`);
}

export async function dropUserIfExists(knex: Knex, roleName: string) {
  await knex.raw(
    `DO $$ BEGIN IF EXISTS ( SELECT FROM pg_catalog.pg_roles WHERE rolname = '${roleName}' ) THEN DROP USER ${roleName}; END IF; END $$;`,
  );
}

export async function grantAllTablePermissionsToRole(
  knex: Knex,
  table: string,
  roleName: string,
) {
  await knex.raw(`GRANT ALL ON TABLE ${table} TO ${roleName}`);
}

export async function revokeAllTablePermissionsFromRole(
  knex: Knex,
  table: string,
  roleName: string,
) {
  await knex.raw(`REVOKE ALL ON TABLE ${table} TO ${roleName}`);
}

export function getConnectionProperties(knex: Knex): {
  migratorUser: string;
  connectedDatabase: string;
} {
  const { user, database } = knex.client.connectionSettings as {
    user: string;
    database: string;
  };

  return { migratorUser: user, connectedDatabase: database };
}

export async function grantAllSchemaPermissionToRole(
  knex: Knex,
  schema: string,
  roleName: string,
): Promise<void> {
  const { migratorUser, connectedDatabase } = getConnectionProperties(knex);
  await knex.raw(`GRANT ${roleName} TO ${migratorUser}`);
  await knex.raw(
    `GRANT CONNECT ON DATABASE ${connectedDatabase} TO ${roleName}`,
  );

  // Allow access to schema
  await knex.raw(`GRANT USAGE ON SCHEMA ${schema} TO ${roleName}`);

  // Allow access to tables in schema
  await knex.raw(
    `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ${schema} TO ${roleName}`,
  );
  await knex.raw(
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${migratorUser} IN SCHEMA ${schema} GRANT ALL PRIVILEGES ON TABLES TO ${roleName}`,
  );

  // Allow access sequences
  await knex.raw(
    `GRANT USAGE ON ALL SEQUENCES IN SCHEMA ${schema} TO ${roleName}`,
  );
  await knex.raw(
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${migratorUser} IN SCHEMA ${schema} GRANT USAGE ON SEQUENCES TO ${roleName}`,
  );
}

export async function revokeAllSchemaPermissionFromRole(
  knex: Knex,
  schema: string,
  roleName: string,
): Promise<void> {
  const { migratorUser, connectedDatabase } = getConnectionProperties(knex);
  await knex.raw(`REVOKE ${roleName} FROM ${migratorUser}`);
  await knex.raw(
    `REVOKE CONNECT ON DATABASE ${connectedDatabase} FROM ${roleName}`,
  );
  await knex.raw(`REVOKE USAGE ON SCHEMA ${schema} FROM ${roleName}`);
  await knex.raw(
    `REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA ${schema} FROM ${roleName}`,
  );
  await knex.raw(
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${migratorUser} IN SCHEMA ${schema} REVOKE ALL PRIVILEGES ON TABLES FROM ${roleName}`,
  );
  await knex.raw(
    `REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ${schema} FROM ${roleName}`,
  );
  await knex.raw(
    `ALTER DEFAULT PRIVILEGES FOR ROLE ${migratorUser} IN SCHEMA ${schema} REVOKE ALL ON SEQUENCES FROM ${roleName}`,
  );
}
