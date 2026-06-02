/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('employees', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('position').notNullable();
    table.string('type').notNullable(); // 'manager' or 'individual'
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('employees');
};
