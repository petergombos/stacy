import { chatResponseSchema } from "@/schemas/chat-response";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const messages = await req.json();

  const { content } = messages.find(
    (message: any) => message.role === "system"
  ) || { content: "" };

  const result = await streamObject({
    model: openai("gpt-4o-2024-08-06"),
    messages: [
      ...messages,
      {
        role: "system",
        content: `You are a helpful assistant that can help with writing a blog post.
        You are an expert at writing blog posts and making sure the content is correct and SEO friendly.
        You will be given a blog post in HTML format and a message.
        You will need to respond to the message and update the blog post if necessary.
        When updating the blog post, return an array of updated chunks, each containing:
        - operation: The operation to be performed ("replace", "delete", "insert_before", "insert_after")
        - nodeID: The ID of the node to be operated on
        - content: The new content for the node in HTML format
        Only return the updated chunks if the blog post was updated, otherwise just respond to the message.
        Never add data-id attributes to the nodes.
        You should only update the blog post if the user asks you to, if the user doesn't ask you to update the blog post, you should just respond to the message.

        If the user asks anything unrelated to your primary function, you should politely decline and say that your speciality is writing blog posts.
        
        The current blog HTML is:
        ${content}`,
      },
    ],
    schema: chatResponseSchema,
  });

  return result.toTextStreamResponse();
}
