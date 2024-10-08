import { db } from "@/lib/db";
import { apiTokens } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function validateApiToken(token: string) {
  const validToken = await db.query.apiTokens.findFirst({
    where: and(eq(apiTokens.token, token), eq(apiTokens.isValid, true)),
  });

  if (!validToken || !validToken.isValid) {
    return null;
  }

  return validToken;
}
