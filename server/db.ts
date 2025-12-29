import { Pool, neon, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleWs } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

let pool: Pool | null = null;
let db: ReturnType<typeof drizzleWs> | ReturnType<typeof drizzleHttp> | null = null;

const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  return process.env.DATABASE_URL;
};

export function getPool() {
  if (pool) {
    return pool;
  }

  const url = getDatabaseUrl();
  neonConfig.webSocketConstructor = ws;
  pool = new Pool({ connectionString: url });
  return pool;
}

export function getDb() {
  if (db) {
    return db;
  }

  const url = getDatabaseUrl();

  if (process.env.VERCEL) {
    const sql = neon(url);
    db = drizzleHttp({ client: sql, schema });
    return db;
  }

  const client = getPool();
  db = drizzleWs({ client, schema });
  return db;
}
