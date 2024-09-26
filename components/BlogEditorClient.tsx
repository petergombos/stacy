"use client";

import { UpdatedChunk } from "@/schemas/chat-response";
import { Content, JSONContent, useEditor } from "@tiptap/react";
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

function deleteNode(node: JSONContent, nodeID: string) {
  const parent = findNodeParent(node, nodeID);
  if (parent?.content) {
    parent.content = parent.content.filter(
      (child) => child.attrs?.id !== nodeID
    );
  }
}

export default function BlogEditorClient() {
  const [editorJSON, seteditorJSON] = useState<Content>(null);

  const editor = useEditor({
    extensions,
    content: "",
    onUpdate: ({ editor }) => {
      seteditorJSON(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert outline-none min-w-full flex-1 p-4",
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

        if (node) {
          try {
            const parsedContent = chunk.content;

            if (chunk.operation === "replace") {
              node.content = parsedContent.content;
              node.type = parsedContent.type;
              node.attrs = parsedContent.attrs;
              node.marks = parsedContent.marks;
            }

            // if (chunk.operation === "append") {
            //   node.content = [...(node.content ?? []), parsedContent];
            // }

            // if (chunk.operation === "prepend") {
            //   node.content = [parsedContent, ...(node.content ?? [])];
            // }

            if (chunk.operation === "delete") {
              deleteNode(doc, chunk.nodeID);
            }

            if (chunk.operation === "insert_before") {
              const parent = findNodeParent(doc, chunk.nodeID);
              if (parent) {
                const index = parent.content?.findIndex(
                  (child) => child.attrs?.id === chunk.nodeID
                );
                if (index) {
                  parent.content = [
                    ...(parent.content?.slice(0, index) ?? []),
                    parsedContent,
                    ...(parent.content?.slice(index) ?? []),
                  ];
                }
              }
            }

            if (chunk.operation === "insert_after") {
              const parent = findNodeParent(doc, chunk.nodeID);
              if (parent) {
                const index = parent.content?.findIndex(
                  (child) => child.attrs?.id === chunk.nodeID
                );
                if (index) {
                  parent.content = [
                    ...(parent.content?.slice(0, index) ?? []),
                    parsedContent,
                    ...(parent.content?.slice(index) ?? []),
                  ];
                }
              }
            }

            console.log(doc);
            editor.commands.setContent(doc);
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
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <ChatInterface onUpdate={handleAIUpdate} currentContent={editorJSON} />
      </div>
      <div className="w-2/3 h-full">
        {editor ? <TiptapEditor editor={editor} /> : null}
      </div>
    </>
  );
}
