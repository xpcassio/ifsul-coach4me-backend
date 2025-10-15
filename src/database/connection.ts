import knex from "knex";
import path from "path";

const db = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "..", "database", "coach4me_db.sqlite"),
  },
  useNullAsDefault: true, // recomendado para sqlite3 no Knex
});

export default db;
