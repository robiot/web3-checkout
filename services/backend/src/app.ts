import express, { json } from "express";

import pg from "./pg";
import ProductHandler from "./routes/product";

const router = express();

export type Product = {
  id: string;
  created_by: string;
  name: string;
  description: string;
  price: number;
  media: string[];
  requireWorldCoin: boolean;
  limitPerHuman: number;
  created_at: Date;
};

(async () => {
  try {
    // Check if the table exists, and create it if it doesn't
    const exists = await pg.schema.hasTable("products");

    if (!exists) {
      await pg.schema.createTable("products", (table) => {
        table.string("id").primary();
        table.string("created_by").notNullable();
        table.string("name");
        table.string("description");
        table.integer("price");
        table.specificType("media", "text ARRAY");
        table.boolean("requireWorldCoin");
        table.integer("limitPerHuman");
        table.datetime("created_at");
      });
      console.log("Created products table!");
    }

    // Query users
    const products = await pg<Product>("products").select("*");

    console.log("Products:", products);
  } catch (error) {
    console.error("Error:", error);
  }
})();

// @ts-ignore
router.use(json());

router.use("/product", ProductHandler);

router.listen(8080, () => {});
