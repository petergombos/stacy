import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db";
import { sessions, users } from "../db/schema";

const adapter = new DrizzleSQLiteAdapter(
  db as any,
  sessions as any,
  users as any
);

export default adapter;
