import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('situations', table => {
    table.integer('situations_id').primary();
    table.string('situations_name').notNullable();
  });
};

export async function down(knex: Knex) {
  return knex.schema.dropTable('situations');
};
