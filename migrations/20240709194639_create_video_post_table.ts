import type { Knex } from 'knex';
import {
  addSoftDeleteColumns,
  addTimestampColumns,
} from '../utils/common-table-utils';

const SCHEMA_NAME = 'yt_sharing';
const TABLE_NAME = 'video_post';
const FOREIGN_TABLE = 'user';

export async function up(knex: Knex): Promise<void> {
  const schemaBuilder = knex.schema.withSchema(SCHEMA_NAME);
  const isTableExist = await schemaBuilder.hasTable(TABLE_NAME);

  if (isTableExist) {
    return;
  }
  await schemaBuilder.createTable(TABLE_NAME, (table) => {
    table.string('id').primary();
    table.string('user_id').notNullable();
    table.string('source_id').notNullable();
    table.string('url').notNullable();
    table.string('description').nullable();
    table.string('title').nullable();
    table.bigint('upvote_count').defaultTo(0);
    table.bigint('downvote_count').defaultTo(0);
    table.unique(['url']);
    table.index('source_id');
    table
      .foreign('user_id')
      .references('id')
      .inTable(`${SCHEMA_NAME}.${FOREIGN_TABLE}`);

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
