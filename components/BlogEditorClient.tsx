"use client";

import { UpdatedChunk } from "@/schemas/chat-response";
import { generateJSON } from "@tiptap/html";
import { JSONContent, useEditor } from "@tiptap/react";
import { useCallback, useState } from "react";
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

export default function BlogEditorClient() {
  const [editorHTML, setEditorHTML] = useState<string>("");

  const editor = useEditor({
    extensions,
    content: "",
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

            editor.commands.setContent(doc);
            setEditorHTML(editor.getHTML());
          } catch (e) {
            console.error(e);
          }
        }
      }
    },
    [editor]
  );

  return (
    <>
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 relative z-50 bg-background">
        <ChatInterface onUpdate={handleAIUpdate} currentContent={editorHTML} />
      </div>
      <div className="w-2/3 h-full relative bg-gray-50 overflow-hidden">
        <div className="z-50 relative h-full">
          {editor ? <TiptapEditor editor={editor} /> : null}
        </div>
        <img
          src="https://play.tailwindcss.com/img/beams.jpg"
          alt="beams"
          className="absolute top-48 left-1/2 -translate-x-2/3 -translate-y-1/2 max-w-none"
          width="1308"
        />
        <div className="absolute inset-0 bg-[url(https://play.tailwindcss.com/img/grid.svg)] bg-top [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>
    </>
  );
}
