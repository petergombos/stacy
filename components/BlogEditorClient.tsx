"use client";

import { updateArticleHtmlAction } from "@/app/articles/actions";
import { Article, ArticleHTML, Message } from "@/lib/db/schema";
import { UpdatedChunk } from "@/schemas/chat-response";
import { generateJSON } from "@tiptap/html";
import { JSONContent, useEditor } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import ChatInterface from "./ChatInterface";
import TiptapEditor, { extensions } from "./TiptapEditor";

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
  const [editorHTML, setEditorHTML] = useState(initialContentHTML.html);

  const editor = useEditor({
    extensions,
    content: initialContentHTML.html,
    onUpdate: ({ editor }) => {
      setEditorHTML(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose xl:prose-lg dark:prose-invert outline-none w-full flex-1 p-10 max-w-[780px] mx-auto shadow rounded bg-background",
      },
    },
    immediatelyRender: false,
  });

  const handleAIUpdate = useCallback(
    (updatedChunks: UpdatedChunk[]) => {
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
            const parsedContent = generateJSON(chunk.content || "", extensions);
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
            }
            const html = editor.getHTML();
            setEditorHTML(html);
          } catch (e) {
            console.error(e);
          }
        }
      }
    },
    [editor]
  );

  // create editor instance and other stuff
  const [debouncedEditor] = useDebounce(editorHTML, 5000);

  useEffect(() => {
    if (debouncedEditor && debouncedEditor !== initialContentHTML.html) {
      updateArticleHtmlAction({
        articleHTMLId: initialContentHTML.id,
        html: debouncedEditor,
      }).then((response) => {
        if (response?.serverError) {
          toast.error(response.serverError);
        } else {
          toast.success("Saved");
        }
      });
    }
  }, [debouncedEditor, initialContentHTML.id, initialContentHTML.html]);

  return (
    <div className="flex-1 flex h-[calc(100vh-24px)] md:h-[calc(100vh-64px)]">
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-background">
        <ChatInterface
          onUpdate={handleAIUpdate}
          currentContent={editorHTML}
          initialMessages={initialMessages}
          articleId={article.id}
        />
      </div>
      <div className="w-2/3 max-h-fit bg-gray-50 overflow-hidden">
        <div className="h-full">
          {editor ? (
            <TiptapEditor articleId={article.id} editor={editor} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
