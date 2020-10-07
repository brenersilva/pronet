import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('protests', table => {
    table.increments('protests_id').primary();
    table.integer('protests_number').notNullable();
    table.integer('customers_id')
      .notNullable()
      .references('customers_id')
      .inTable('customers')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.decimal('protests_cost').notNullable();
    table.date('protests_creation').notNullable();
    table.date('protests_send').nullable();
    table.date('protests_return').nullable();
    table.date('protests_payment').nullable();
    table.string('protests_situation').notNullable();
  });
};

export async function down(knex: Knex) {
  return knex.schema.dropTable('protests');
};