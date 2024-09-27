"use client";

import { Button } from "@/components/ui/button";
import { chatResponseSchema, UpdatedChunk } from "@/schemas/chat-response";
import { experimental_useObject as useObject } from "ai/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";

interface ChatInterfaceProps {
  onUpdate: (updatedChunks: UpdatedChunk[]) => void;
  currentContent: string;
}

export default function ChatInterface({
  onUpdate,
  currentContent,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: string; content: string; inProgress?: boolean }[]
  >([
    {
      role: "assistant",
      content: `Hey! I’m Stacy, ready to assist you in crafting high-quality, SEO-optimized blog posts.
Together, we can work through every stage of the process:

- Topic Ideas & Inspiration: Stuck on what to write? I can suggest topics based on your niche.
- Organizing Your Post: I’ll help structure your content with a clear and effective outline.
- Content Drafting: Whether you need help starting or refining, I’m here to make your post shine.
SEO Strategy: We’ll ensure your post is optimized with keywords and best practices for ranking.
Final Touches: From editing to formatting, I’ll ensure your post is polished and ready to publish.`,
    },
  ]);

  const { object, submit, isLoading } = useObject({
    api: "/api/chat",
    schema: chatResponseSchema,
    onFinish: ({ object }) => {
      if (object?.chatResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: object.chatResponse },
        ]);
      }
      if (object?.updatedChunks && object?.didUpdateBlogContent) {
        onUpdate(object.updatedChunks);
      }
    },
  });

  useEffect(() => {
    if (object?.updatedChunks && object?.didUpdateBlogContent) {
      // onUpdate(object.updatedChunks as UpdatedChunk[]);
    }
  }, [object?.updatedChunks, object?.didUpdateBlogContent, onUpdate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: input }];

    setMessages(updatedMessages);
    submit([
      ...updatedMessages,
      {
        role: "system",
        content: `Current post content: "${currentContent}"`,
      },
    ]);
    setInput("");
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, object?.chatResponse]);

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
      >
        {[
          ...messages,
          isLoading
            ? {
                inProgress: true,
                role: "assistant",
                content: object?.chatResponse,
              }
            : null,
        ]
          .filter((message) => message !== null && message.role !== "system")
          .map((message, index) => (
            <div
              key={index}
              className={`inline-flex gap-3 p-2 rounded-lg whitespace-pre-wrap ${
                message?.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              } ${
                message?.role === "user" ? "self-end ml-6" : "self-start mr-6"
              }`}
            >
              {message?.inProgress && !message?.content ? (
                <Loader2 className="animate-spin size-6 shrink-0" />
              ) : (
                message?.content
              )}
            </div>
          ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      >
        <div className="grid w-full gap-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            className="flex-1"
            placeholder="Type your message to the AI..."
          />
          <Button type="submit" disabled={isLoading}>
            Send message
          </Button>
        </div>
      </form>
    </div>
  );
}
