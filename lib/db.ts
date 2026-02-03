import { Pool } from "pg";


// Make sure this file is treated as a module
export {};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const pool =
  globalThis.pgPool ??
  new Pool({
    connectionString,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.pgPool = pool;
}
