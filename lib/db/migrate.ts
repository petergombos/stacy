import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";

// This will run migrations on the database, skipping the ones already applied
async function main() {
  console.log("Running migrations");

  await migrate(db, { migrationsFolder: "./lib/db/migrations" });

  console.log("Migrated successfully");

  process.exit(0);
}

main().catch((e) => {
  console.error("Migration failed");
  console.error(e);
  process.exit(1);
});
