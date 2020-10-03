import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('protests', table => {
    table.increments('id').primary();
    table.integer('number_protest').notNullable();
    table.integer('customer_id')
      .notNullable()
      .references('id')
      .inTable('customers')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.decimal('cost_protest').notNullable();
    table.date('creation_date').notNullable();
    table.date('send_date').nullable();
    table.date('return_date').nullable();
    table.date('payment_date').nullable();
    table.string('situation').notNullable();
  });
};

export async function down(knex: Knex) {
  return knex.schema.dropTable('protests');
};