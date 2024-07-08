require('ts-node/register');

module.exports = {
  client: 'postgresql',
  connection: process.env.DB_CONNECTION_STRING,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
