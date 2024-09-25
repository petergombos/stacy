import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const messages = await req.json();

  const responseSchema = z.object({
    didUpdateBlogContent: z
      .boolean()
      .describe("Whether the blog content was updated"),
    updatedBlogContent: z
      .string()
      .describe("The updated blog content in HTML format")
      .optional(),
    chatResponse: z.string(),
  });

  const { content } = messages.find(
    (message: any) => message.role === "system"
  ) || { content: "" };

  const result = await streamObject({
    model: openai("gpt-4-turbo"),
    messages: [
      ...messages,
      {
        role: "system",
        content: `You are a helpful assistant that can help with writing a blog post.
You will be given a blog post and a message.
You will need to respond to the message and update the blog post.
You will need to return the updated blog post in HTML format.
You don't always need to update the blog post, sometimes you just need to respond to the message.
Only return the updated blog post if it was updated, otherwise just respond to the message.

${content}`,
      },
    ],
    schema: responseSchema,
  });

  return result.toTextStreamResponse();
}
