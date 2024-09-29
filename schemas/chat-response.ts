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

export const chatResponseSchema = z.object({
  didUpdateBlogContent: z
    .boolean()
    .describe("Whether the blog content was updated"),
  updatedChunks: z
    .array(updatedChunkSchema)
    .describe("An array of updated chunks")
    .optional(),
  chatResponse: z.string().describe("A response to the user's message"),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;
