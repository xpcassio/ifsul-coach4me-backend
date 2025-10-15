import Knex from "knex";

export async function up(knex: {
  schema: {
    createTable: (
      arg0: string,
      arg1: (table: any) => void
    ) => void | PromiseLike<void>;
  };
}): Promise<void> {
  return knex.schema.createTable("classes", (table) => {
    table.increments("id").primary();
    table.string("subject").notNullable();
    table.decimal("cost").notNullable();

    table
      .integer("coach_id")
      .notNullable()
      .references("id")
      .inTable("coaches")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
}

export async function down(knex: {
  schema: { dropTable: (arg0: string) => void | PromiseLike<void> };
}): Promise<void> {
  return knex.schema.dropTable("classes");
}
