import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('customers', table => {
    table.integer('id').primary();
    table.string('name').notNullable();
  });
};

export async function down(knex: Knex) {
  return knex.schema.dropTable('users');
};