"server-only";
import { z } from "zod";

export const EnvSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_AUTH_TOKEN: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;

export const getEnv = (): Env => {
  const envVars = process.env as any;
  const result = EnvSchema.parse(envVars);
  return result;
};

export const env = getEnv();
