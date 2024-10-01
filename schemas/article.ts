import { z } from "zod";

export const articleMetadataSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(100).max(500),
  slug: z.string().min(3).max(100),
  keywords: z.string().min(3).max(200),
  authorName: z.string(),
  image: z.string().url(),
});

export type ArticleMetadata = z.infer<typeof articleMetadataSchema>;

export const articleFormSchema = articleMetadataSchema.extend({
  html: z.string(),
});

export type ArticleForm = z.infer<typeof articleFormSchema>;
