import { chatProjectCreationResponseSchema } from "@/schemas/chat-response";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { content } = messages.find(
    (message: any) => message.role === "system"
  ) || { content: "" };

  const nonSystemMessages = messages.filter(
    (message: any) => message.role !== "system"
  );

  const result = await streamObject({
    model: openai("gpt-4o-2024-08-06"),
    messages: [
      ...nonSystemMessages,
      {
        role: "system",
        content: `You are Stacy a helpful AI assistant helping to create a new project.
Your task is to gather information about the project and populate the necessary form fields.
Ask questions to collect the following information:

1. Project name
2. Project niche
3. Short description
4. Project full details (detailed context about the project)

Make sure to fine tune the collected information, especially the full context, to ensure it is as detailed and comprehensive as possible.

The collected information will be used as context for future articles that will be written by another AI assistant.
Make sure to ask for all the necessary information in order to create a comprehensive and detailed articles in the future.

Do not repeat the project form values in the response message as it will be sent back in structured data.

Current form values: ${JSON.stringify(content)}`,
      },
    ],
    schema: chatProjectCreationResponseSchema,
  });

  return result.toTextStreamResponse();
}
