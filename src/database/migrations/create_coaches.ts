import Knex from "knex";

export async function up(knex: {
  schema: {
    createTable: (
      arg0: string,
      arg1: (table: any) => void
    ) => void | PromiseLike<void>;
  };
}): Promise<void> {
  return knex.schema.createTable("coaches", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("avatar").notNullable();
    table.string("whatsapp").notNullable();
    table.string("linkedin");
    table.string("instagram");
    table.string("youtube");
    table.text("bio").notNullable();
  });
}

export async function down(knex: {
  schema: { dropTable: (arg0: string) => void | PromiseLike<void> };
}): Promise<void> {
  return knex.schema.dropTable("coaches");
}
