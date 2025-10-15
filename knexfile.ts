import type { Knex } from "knex";
import path from "path";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(
        __dirname,
        "src",
        "database",
        "coach4me_db.sqlite"
      ),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "migrations"),
    },
  },
};

module.exports = config;
