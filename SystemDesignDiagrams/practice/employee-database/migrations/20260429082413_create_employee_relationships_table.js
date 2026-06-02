/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('employee_relationships', function(table) {
    table.increments('id').primary();
    table.integer('manager_id').unsigned().references('id').inTable('employees').onDelete('CASCADE');
    table.integer('subordinate_id').unsigned().references('id').inTable('employees').onDelete('CASCADE');
    table.unique(['manager_id', 'subordinate_id']); // Prevent duplicate relationships
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('employee_relationships');
};
