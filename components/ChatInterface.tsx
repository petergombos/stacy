"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatResponseSchema, UpdatedChunk } from "@/schemas/chat-response";
import { experimental_useObject as useObject } from "ai/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

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
  >([]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              className={`${
                message?.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-flex gap-3 p-2 rounded-lg ${
                  message?.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {message?.inProgress && !message?.content ? (
                  <Loader2 className="animate-spin size-6 shrink-0" />
                ) : (
                  message?.content
                )}
              </div>
            </div>
          ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            className="flex-1"
            placeholder="Type your message..."
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
