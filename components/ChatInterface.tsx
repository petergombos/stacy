"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatResponseSchema, UpdatedChunk } from "@/schemas/chat-response";
import { experimental_useObject as useObject } from "ai/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
