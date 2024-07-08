import { Knex } from 'knex';

export function addTimestampColumns(tableBuilder: Knex.TableBuilder) {
  tableBuilder
    .timestamp('created_at', { useTz: true, precision: 0 })
    .comment('Creation timestamp');

  tableBuilder
    .timestamp('updated_at', { useTz: true, precision: 0 })
    .comment('Last updated timestamp');
}

export function addSoftDeleteColumns(tableBuilder: Knex.TableBuilder) {
  tableBuilder.timestamp('deleted_at').comment('Deletion timestamp');

  tableBuilder
    .boolean('is_deleted')
    .comment('Whether the entity is deleted')
    .defaultTo(false);
}
