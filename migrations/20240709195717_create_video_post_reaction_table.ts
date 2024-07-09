import type { Knex } from 'knex';
import {
  addSoftDeleteColumns,
  addTimestampColumns,
} from '../utils/common-table-utils';

const SCHEMA_NAME = 'yt_sharing';
const TABLE_NAME = 'video_post_reaction';
const FOREIGN_TABLE_VIDEO = 'video_post';
const FOREIGN_TABLE_USER = 'user';
export async function up(knex: Knex): Promise<void> {
  const schemaBuilder = knex.schema.withSchema(SCHEMA_NAME);
  const isTableExist = await schemaBuilder.hasTable(TABLE_NAME);

  if (isTableExist) {
    return;
  }
  await schemaBuilder.createTable(TABLE_NAME, (table) => {
    table.string('user_id').notNullable();
    table.string('video_id').notNullable();
    table.primary(['video_id', 'user_id']);
    table.string('type').notNullable(); // upvote or downvote
    table
      .foreign('user_id')
      .references('id')
      .inTable(`${SCHEMA_NAME}.${FOREIGN_TABLE_USER}`);
    table
      .foreign('video_id')
      .references('id')
      .inTable(`${SCHEMA_NAME}.${FOREIGN_TABLE_VIDEO}`);

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
