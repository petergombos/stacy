import { z } from "zod";

export const projectUpsertFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .describe("The name of the project"),
  niche: z
    .string()
    .min(3, "Niche must be at least 3 characters")
    .describe("Specify the industry or category the project belongs to"),
  shortDescription: z
    .string()
    .min(3, "Short description must be at least 3 characters")
    .describe("Provide a brief overview of the project (1-2 sentences)"),
  fullContext: z
    .string()
    .describe(
      "Describe your project in detail, including goals, target audience, and key features. This will be used as base information for future article creations."
    ),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export type ProjectFormValues = z.infer<typeof projectUpsertFormSchema>;
