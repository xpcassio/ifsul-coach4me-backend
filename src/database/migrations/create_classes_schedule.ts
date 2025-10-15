import Knex from "knex";

export async function up(knex: {
  schema: {
    createTable: (
      arg0: string,
      arg1: (table: any) => void
    ) => void | PromiseLike<void>;
  };
}): Promise<void> {
  return knex.schema.createTable("classes_schedule", (table) => {
    table.increments("id").primary();
    table.integer("week_day").notNullable();
    table.string("from").notNullable();
    table.string("to").notNullable();

    table
      .integer("class_id")
      .notNullable()
      .references("id")
      .inTable("classes")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: {
  schema: { dropTable: (arg0: string) => void | PromiseLike<void> };
}): Promise<void> {
  return knex.schema.dropTable("classes_schedule");
}
