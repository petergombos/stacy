"use client";

import {
  addMessageToArticleAction,
  updateArticleHtmlAction,
  updateArticleMetadataAction,
  updateArticleStatusAction,
} from "@/app/(admin)/actions/article";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Article, ArticleHTML, Message, Project } from "@/lib/db/schema";
import { articleFormSchema } from "@/schemas/article";
import {
  chatArticleResponseSchema,
  UpdatedChunk,
  UpdatedMetadata,
} from "@/schemas/chat-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateJSON } from "@tiptap/html";
import { JSONContent, useEditor } from "@tiptap/react";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useRef } from "react";
import { FormState, useForm } from "react-hook-form";
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
  article: Article & { project: Project | null };
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
          "prose dark:prose-invert outline-none w-full flex-1 [&>*]:max-w-[780px] [&>*]:mx-auto",
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

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <div className="py-3 border-b flex justify-between items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/projects/${article.projectId}`}>
                {article.project?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-4">
          <PublishToggleButton article={article} />
          <SaveButton formRef={formRef} formState={form.formState} />
        </div>
      </div>
      <div className="flex-1 flex h-[calc(100vh-72px)] md:h-[calc(100vh-64px-61px)]">
        <div className="w-1/3 border-r">
          <ChatInterface
            getContext={() => form.getValues()}
            initialMessages={initialMessages}
            onFinish={({ object }) => {
              if (object?.chatResponse) {
                const responseMessage = {
                  role: "assistant",
                  content: object.chatResponse,
                  articleId: article.id,
                } as const;
                addMessageToArticleAction(responseMessage);
              }
              if (
                object?.didUpdateArticleContent ||
                object?.didUpdateArticleMetadata
              ) {
                handleAIUpdate(object);
              }
            }}
            schema={chatArticleResponseSchema}
            endpoint={`/api/chat/article/${article.id}`}
          />
        </div>
        <div className="w-2/3 max-h-fit overflow-hidden">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full"
            >
              {editor ? <ArticleEditor editor={editor} form={form} /> : null}
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

function PublishToggleButton({ article }: { article: Article }) {
  const { execute: executeUpdateStatus, input } = useAction(
    updateArticleStatusAction,
    {
      onError: () => {
        toast.error("Error updating article status");
      },
      onSuccess: ({ data }) => {
        toast.success(
          data?.status === "published"
            ? "Article published"
            : "Article unpublished"
        );
      },
    }
  );

  const currentStatus = input?.status ?? article.status;

  return (
    <Button
      size="sm"
      type="button"
      onClick={() => {
        executeUpdateStatus({
          status: currentStatus === "published" ? "draft" : "published",
          articleId: article.id,
        });
      }}
      variant={currentStatus === "published" ? "destructive" : "outline"}
    >
      {currentStatus === "published" ? (
        <EyeOff className="w-4 h-4 mr-2" />
      ) : (
        <Eye className="w-4 h-4 mr-2" />
      )}
      {currentStatus === "published" ? "Unpublish" : "Publish"}
    </Button>
  );
}

function SaveButton({
  formRef,
  formState,
}: {
  formRef: React.RefObject<HTMLFormElement>;
  formState: FormState<z.infer<typeof articleFormSchema>>;
}) {
  const isSubmitting = formState.isSubmitting;

  return (
    <Button
      size="sm"
      type="button"
      disabled={isSubmitting}
      onClick={() =>
        formRef.current?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        )
      }
    >
      {isSubmitting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Save className="w-4 h-4 mr-2" />
      )}
      Save
    </Button>
  );
}
