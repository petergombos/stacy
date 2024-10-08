import { z } from "zod";

export const projectCreationFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters")
    .describe("The name of the project"),
  niche: z
    .string()
    .min(3, "Niche must be at least 3 characters")
    .max(100, "Niche must be at most 100 characters")
    .describe("Specify the industry or category the project belongs to"),
  shortDescription: z
    .string()
    .min(3, "Short description must be at least 3 characters")
    .max(155, "Short description must be at most 155 characters")
    .describe("Provide a brief overview of the project (1-2 sentences)"),
  fullContext: z
    .string()
    .min(250, "Full context must be at least 250 characters")
    .describe(
      "Describe your project in detail, including goals, target audience, and key features. This will be used as base information for future article creations."
    ),
});

export type ProjectFormValues = z.infer<typeof projectCreationFormSchema>;
