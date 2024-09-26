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
    model: openai("gpt-4-turbo"),
    messages: [
      ...messages,
      {
        role: "system",
        content: `You are a helpful assistant that can help with writing a blog post.
        You will be given a blog post in tiptap JSON format and a message.
        You will need to respond to the message and update the blog post if necessary.
        When updating the blog post, return an array of updated chunks, each containing:
        - operation: The operation to be performed ("replace", "delete", "insert_before", "insert_after")
        - nodeID: The ID of the node to be operated on
        - content: The new content in tiptap JSON format
        Only return the updated chunks if the blog post was updated, otherwise just respond to the message.
        Each chunk should only operate on a sibling level, do not go inside nodes to update content.
        Do not to nest nodes, force the content to be flat. You can only nest nodes inside lists.
        Possible nodes are: paragraph, heading, listItem, bulletList, orderedList.
        
        The current blog JSON is:
        ${content}`,
      },
    ],
    schema: chatResponseSchema,
  });

  return result.toTextStreamResponse();
}
