import type { Knex } from 'knex';
import {
  addSoftDeleteColumns,
  addTimestampColumns,
} from '../utils/common-table-utils';

const SCHEMA_NAME = 'yt_sharing';
const TABLE_NAME = 'user';

export async function up(knex: Knex): Promise<void> {
  const schemaBuilder = knex.schema.withSchema(SCHEMA_NAME);
  const isTableExist = await schemaBuilder.hasTable(TABLE_NAME);

  if (isTableExist) {
    return;
  }
  await schemaBuilder.createTable(TABLE_NAME, (table) => {
    table.string('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.boolean('is_active').defaultTo(false);
    table.unique(['email']);

    addTimestampColumns(table);
    addSoftDeleteColumns(table);
  });
}

export async function down(knex: Knex): Promise<void> {
  const schemaBuilder = knex.schema.withSchema(SCHEMA_NAME);
  const isTableExist = await schemaBuilder.hasTable(TABLE_NAME);
  if (isTableExist) {
    await schemaBuilder.dropTable(TABLE_NAME);
  }
}
