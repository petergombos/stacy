import { z } from "zod";

export const updatedChunkSchema = z.object({
  operation: z.enum(["replace", "insert_before", "insert_after", "delete"]),
  nodeID: z
    .string()
    .min(1)
    .describe(
      "The ID of the node to update, if the operation to be applied is global use 'doc'."
    ),
  content: z.string().describe("The new content in HTML format"),
});

export type UpdatedChunk = z.infer<typeof updatedChunkSchema>;

export const updatedMetadataSchema = z.object({
  title: z.string().describe("The title of the article"),
  description: z
    .string()
    .min(100)
    .describe(
      "A good meta description is short, unique to one particular page, and includes the most relevant points of the page"
    ),
  slug: z.string().describe("The slug is the url path of the page"),
  keywords: z
    .string()
    .describe(
      "Keywords are important for SEO, they help search engines understand the content of the page"
    ),
});

export type UpdatedMetadata = z.infer<typeof updatedMetadataSchema>;

export const chatResponseSchema = z.object({
  chatResponse: z.string().describe("A response to the user's message."),
  didUpdateArticleMetadata: z
    .boolean()
    .describe("Whether the article's metadata was updated"),
  updatedArticleMetadata: updatedMetadataSchema.optional(),
  didUpdateArticleContent: z
    .boolean()
    .describe("Whether the article content was updated"),
  updatedChunks: z
    .array(updatedChunkSchema)
    .describe("An array of updated chunks")
    .optional(),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;
