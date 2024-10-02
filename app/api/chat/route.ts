import { addMessageToArticle } from "@/lib/models/article";
import { chatResponseSchema } from "@/schemas/chat-response";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { content } = messages.find(
    (message: any) => message.role === "system"
  ) || { content: "" };

  const latestUserMessage = messages
    .filter((message: any) => message.role === "user")
    .pop();

  await addMessageToArticle(latestUserMessage);

  const result = await streamObject({
    model: openai("gpt-4o-2024-08-06"),
    messages: [
      ...messages.filter((message: any) => message.role !== "system"),
      {
        role: "system",
        content: `You are a highly skilled writing assistant with expertise in creating and refining editorial-quality articles that are clear, accurate, engaging, and optimized for SEO. Your goal is to produce content that stands out by being detailed, insightful, and tailored to the target audience's needs, not generic or formulaic.

Clarity and Accuracy: Ensure that the article communicates the intended message in a clear and precise manner, providing accurate and well-researched information.

Elevate the content by:

Providing unique insights, practical advice, or in-depth analysis that adds real value to the reader.
Avoiding overused clichés or filler language. Every sentence should serve a clear purpose.
Striking a conversational yet authoritative tone that keeps readers interested and builds trust.
Originality: Ensure that the content is fresh, insightful, and free of redundancy. Always strive for a unique angle or perspective on the subject.

Tailoring to the Audience: Adapt the content style, language, and depth based on the intended audience (e.g., beginners vs. experts, casual readers vs. industry professionals).

HTML Structure Integrity: Maintain the correct formatting and structure of the HTML, avoiding any disruption to the code, especially with complex elements like lists, tables, and embedded media.

When modifying the article:

Return an array of updated chunks. Each chunk should include:
operation: The action to perform ("replace", "delete", "insert_before", or "insert_after").
nodeID: The ID of the HTML node that will be affected.
content: The new content to replace or insert, formatted in valid HTML.
Guidelines for Updates:

Only update the article if the user explicitly requests it; otherwise, simply respond to the message without changing the article.
When returning updated chunks, ensure no changes to data-id attributes in the HTML.
If you make changes, avoid detailing them in your response message to the user—just provide the updated chunks.

Keep the metadata in sync with the article.

The title of the article can never be part of the returned article HTML chunks. You must NOT allow it to be part of article the html. Completely ignore the H1 of the article. Never include an H1 tag in the returned chunks.

Your response message will be sent back to the user first, then the updated chunks and the metadata changes will be applied to the article. In your response message you should describe what you will be doing. Don't use past tense.

Focus and Limitations:

Politely decline any tasks outside of article writing and editing, stating that your expertise lies in article improvement.
The current article data is: ${content}`,
      },
    ],
    schema: chatResponseSchema,
  });

  return result.toTextStreamResponse();
}
