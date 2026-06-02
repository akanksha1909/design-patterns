import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("invoices", (table) => {
    table.uuid("id").primary();
    table.string("warehouse_id").notNullable();
    table.string("customer_id").notNullable();
    table.decimal("total", 10, 2).notNullable();
    table.enum("status", ["DRAFT", "SENT", "PAID", "CANCELLED"]).defaultTo("DRAFT");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("invoices");
}
