"use client";

import {
  updateArticleHtmlAction,
  updateArticleMetadataAction,
} from "@/app/articles/actions";
import { Form } from "@/components/ui/form";
import { Article, ArticleHTML, Message } from "@/lib/db/schema";
import { articleFormSchema } from "@/schemas/article";
import { UpdatedChunk, UpdatedMetadata } from "@/schemas/chat-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateJSON } from "@tiptap/html";
import { JSONContent, useEditor } from "@tiptap/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ArticleEditor, { extensions } from "./article-editor";
import ChatInterface from "./chat-interface";

function findNode(node: JSONContent, nodeID: string): JSONContent | null {
  if (node.attrs?.id === nodeID || node.type === nodeID) {
    return node;
  }
  for (const child of node.content ?? []) {
    const result = findNode(child, nodeID);
    if (result) {
      return result;
    }
  }
  return null;
}

function findNodeParent(node: JSONContent, nodeID: string): JSONContent | null {
  if (node.content?.some((child) => child.attrs?.id === nodeID)) {
    return node;
  }
  for (const child of node.content ?? []) {
    const result = findNodeParent(child, nodeID);
    if (result) {
      return result;
    }
  }
  return null;
}

export default function BlogEditorClient({
  initialContentHTML,
  initialMessages = [],
  article,
}: {
  initialContentHTML: ArticleHTML;
  initialMessages: Message[];
  article: Article;
}) {
  const form = useForm<z.infer<typeof articleFormSchema>>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: article.title ?? "",
      description: article.description ?? "",
      slug: article.slug ?? "",
      keywords: article.keywords ?? "",
      authorName: article.authorName ?? "",
      image: article.image ?? "",
      html: initialContentHTML.html,
    },
  });

  const onSubmit = async (data: z.infer<typeof articleFormSchema>) => {
    const metadataPromise = updateArticleMetadataAction({
      articleId: article.id,
      metadata: {
        title: data.title,
        description: data.description,
        slug: data.slug,
        keywords: data.keywords,
        authorName: data.authorName,
        image: data.image,
      },
    });
    const htmlPromise = updateArticleHtmlAction({
      articleHTMLId: initialContentHTML.id,
      html: data.html,
    });

    try {
      const [metadata, html] = await Promise.all([
        metadataPromise,
        htmlPromise,
      ]);
      if (
        metadata?.serverError ||
        html?.serverError ||
        metadata?.validationErrors ||
        html?.validationErrors
      ) {
        toast.error("Error saving article");
      } else {
        toast.success("Saved");
      }
    } catch (e: any) {
      toast.error("Error saving article");
      console.error(e);
    }
  };

  const editor = useEditor({
    extensions,
    content: initialContentHTML.html,
    onUpdate: ({ editor }) => {
      form.setValue("html", editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert outline-none w-full flex-1 p-6 max-w-[780px] mx-auto shadow rounded bg-background",
      },
    },
    immediatelyRender: false,
  });

  const handleAIUpdate = useCallback(
    ({
      updatedChunks,
      updatedArticleMetadata,
    }: {
      updatedChunks?: UpdatedChunk[];
      updatedArticleMetadata?: UpdatedMetadata;
    }) => {
      if (updatedChunks) {
        if (!editor) return;
        const doc = editor.getJSON();
        for (const chunk of updatedChunks) {
          if (!chunk.nodeID) {
            continue;
          }
          const node = findNode(doc, chunk.nodeID);
          const parent = findNodeParent(doc, chunk.nodeID);

          if (node && parent) {
            try {
              const parsedContent = generateJSON(
                chunk.content || "",
                extensions
              );
              const index = parent.content?.findIndex(
                (child) => child.attrs?.id === chunk.nodeID
              );

              if (index !== undefined && index !== -1) {
                switch (chunk.operation) {
                  case "replace":
                    if (parent.content) {
                      // Remove the original node
                      parent.content.splice(index, 1);
                      // Insert all new content items at the same position
                      parent.content.splice(index, 0, ...parsedContent.content);
                    }
                    break;
                  case "insert_after":
                    parent.content?.splice(
                      index + 1,
                      0,
                      ...parsedContent.content
                    );
                    break;
                  case "insert_before":
                    parent.content?.splice(index, 0, ...parsedContent.content);
                    break;
                  case "delete":
                    parent.content?.splice(index, 1);
                    break;
                }
              }
              if (doc.content) {
                editor.commands.setContent(doc.content);
                editor.commands.blur();
              }
              const html = editor.getHTML();
              form.setValue("html", html);
            } catch (e) {
              console.error(e);
            }
          }
        }
      }

      if (updatedArticleMetadata) {
        form.setValue("title", updatedArticleMetadata.title);
        form.setValue("description", updatedArticleMetadata.description);
        form.setValue("slug", updatedArticleMetadata.slug);
        form.setValue("keywords", updatedArticleMetadata.keywords);
      }
    },
    [editor, form]
  );

  return (
    <div className="flex-1 flex h-[calc(100vh-24px)] md:h-[calc(100vh-64px)] bg-foreground">
      <div className="w-1/3 border-r">
        <ChatInterface
          onUpdate={handleAIUpdate}
          getContext={() => form.getValues()}
          initialMessages={initialMessages}
          articleId={article.id}
        />
      </div>
      <div className="w-2/3 max-h-fit bg-background/95 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
            {editor ? (
              <ArticleEditor article={article} editor={editor} form={form} />
            ) : null}
          </form>
        </Form>
      </div>
    </div>
  );
}
