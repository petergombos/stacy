"server-only";
import { z } from "zod";

export const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_AUTH_TOKEN: z.string(),
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  NEXT_PUBLIC_R2_BUCKET_URL: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

export const getEnv = (): Env => {
  const envVars = process.env as any;
  const result = EnvSchema.parse(envVars);
  return result;
};

export const env = getEnv();
