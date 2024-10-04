"use client";

import { experimental_useObject as useObject } from "ai/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { addMessageToArticleAction } from "~/app/articles/actions";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useAutoResize } from "~/hooks/auto-resize";
import { Message } from "~/lib/db/schema";
import { ArticleForm } from "~/schemas/article";
import {
  chatResponseSchema,
  UpdatedChunk,
  UpdatedMetadata,
} from "~/schemas/chat-response";

interface ChatInterfaceProps {
  onUpdate: ({
    updatedChunks,
    updatedArticleMetadata,
  }: {
    updatedChunks?: UpdatedChunk[];
    updatedArticleMetadata?: UpdatedMetadata;
  }) => void;
  initialMessages: Message[];
  articleId: string;
  getContext: () => ArticleForm;
}

export default function ChatInterface({
  onUpdate,
  getContext,
  initialMessages,
  articleId,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] =
    useState<(Message & { inProgress?: boolean })[]>(initialMessages);

  const { object, submit, isLoading } = useObject({
    api: "/api/chat",
    schema: chatResponseSchema,
    onFinish: ({ object }) => {
      if (object?.chatResponse) {
        const responseMessage = {
          role: "assistant",
          content: object.chatResponse,
          articleId,
        } as const;
        setMessages(
          (prevMessages) => [...prevMessages, responseMessage] as Message[]
        );
        addMessageToArticleAction(responseMessage);
      }
      if (object?.didUpdateArticleContent || object?.didUpdateArticleMetadata) {
        onUpdate(object);
      }
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
        articleId,
      },
    ];

    setMessages(updatedMessages as Message[]);
    submit({
      articleId,
      messages: [
        ...updatedMessages,
        {
          role: "system",
          content: JSON.stringify(getContext()),
        },
      ],
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
    <div className="flex flex-col h-full bg-background/95">
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
              className={`inline-flex gap-3 p-2 rounded-lg bg-background border ${
                message?.role === "user"
                  ? "bg-blue-600 text-background"
                  : "text-foreground"
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
        className="p-4 border-t"
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
          <Button type="submit" disabled={isLoading}>
            Send message
          </Button>
        </div>
      </form>
    </div>
  );
}
