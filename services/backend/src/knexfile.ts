// knexfile.ts
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "postgres",
      user: "postgres",
      password: "root",
      database: "web3checkout",
    },
  },
};

export default config;
