import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { db } from "../db";
import { apiTokens } from "../db/schema";

export const createApiToken = async (projectId: string) => {
  const token = generateIdFromEntropySize(50);
  await db.insert(apiTokens).values({
    token,
    projectId,
  });
  return token;
};

export const getApiTokens = async (projectId: string) => {
  const tokens = await db.query.apiTokens.findMany({
    where: eq(apiTokens.projectId, projectId),
  });
  return tokens;
};

export const invalidateApiToken = async (token: string) => {
  await db
    .update(apiTokens)
    .set({ isValid: false })
    .where(eq(apiTokens.token, token));
};

export const getToken = async (token: string) => {
  const t = await db.query.apiTokens.findFirst({
    where: eq(apiTokens.token, token),
  });
  if (!t) {
    throw new Error("Token not found");
  }
  return t;
};
