"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResize } from "@/hooks/auto-resize";
import { cn } from "@/lib/utils";
import { experimental_useObject as useObject } from "ai/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { z } from "zod";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  inProgress?: boolean;
};

interface ChatInterfaceProps<
  T extends {
    chatResponse: string;
  }
> {
  endpoint: string;
  onFinish: ({
    object,
    error,
  }: {
    object: T | undefined;
    error: Error | undefined;
  }) => void;
  schema: z.ZodType<T>;
  initialMessages?: ChatMessage[];
  getContext?: () => any;
  className?: string;
  noPadding?: boolean;
}

export default function ChatInterface<T extends { chatResponse: string }>({
  endpoint,
  onFinish,
  schema,
  getContext,
  initialMessages,
  className,
  noPadding,
}: ChatInterfaceProps<T>) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages ?? []
  );

  const { object, submit, isLoading } = useObject({
    api: endpoint,
    schema,
    onFinish: ({ object, error }) => {
      if (object?.chatResponse) {
        setMessages(
          (prevMessages) =>
            [
              ...prevMessages,
              {
                role: "assistant",
                content: object.chatResponse,
              },
            ] as ChatMessage[]
        );
      }
      onFinish({ object, error });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: input,
      } as const,
    ];

    setMessages(updatedMessages);
    submit({
      messages: [
        ...updatedMessages,
        getContext && {
          role: "system",
          content: JSON.stringify(getContext()),
        },
      ].filter(Boolean),
    });
    setInput("");
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, object?.chatResponse]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useAutoResize(textareaRef);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div
        ref={chatContainerRef}
        className={cn(
          "flex-1 overflow-y-scroll flex flex-col gap-4 p-4",
          noPadding && "p-0 pb-4"
        )}
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
              className={`inline-flex gap-3 p-2 rounded-lg bg-background ${
                message?.role === "user"
                  ? "bg-neutral-700 dark:text-foreground dark:bg-neutral-900 text-background"
                  : "border text-foreground"
              } ${
                message?.role === "user" ? "self-end ml-3" : "self-start mr-3"
              }`}
            >
              {message?.inProgress && !message?.content ? (
                <Loader2 className="animate-spin size-6 shrink-0" />
              ) : (
                <ReactMarkdown className="prose text-inherit prose-sm dark:prose-invert prose-ol:pl-3 prose-ul:pl-3 prose-li:pl-0 max-w-none">
                  {message?.content || ""}
                </ReactMarkdown>
              )}
            </div>
          ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className={cn("p-4 border-t", noPadding && "p-0 pt-4")}
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
            className="flex-1 min-h-[2.5rem] max-h-[10rem] overflow-y-auto resize-none"
            placeholder="Type your message to Stacy..."
            ref={textareaRef}
            rows={1}
          />
          <Button type="submit" variant="outline" disabled={isLoading}>
            Send message
          </Button>
        </div>
      </form>
    </div>
  );
}
