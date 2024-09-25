"use client";

import { generateJSON } from "@tiptap/html";
import type { Content } from "@tiptap/react";
import { useCallback, useState } from "react";
import ChatInterface from "./ChatInterface";
import TiptapEditor, { extensions } from "./TiptapEditor";

export default function BlogEditorClient() {
  const [editorHTML, setEditorHTML] = useState("");
  const [editorJSON, setEditorJSON] = useState<Content>("");

  const handleEditorUpdate = useCallback((html: string) => {
    setEditorHTML(html);
  }, []);

  const handleAIUpdate = useCallback((html: string) => {
    const json = generateJSON(html, extensions);
    setEditorJSON(json);
    setEditorHTML(html);
  }, []);

  return (
    <>
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <ChatInterface onUpdate={handleAIUpdate} currentContent={editorHTML} />
      </div>
      <div className="w-2/3 h-full">
        <TiptapEditor content={editorJSON} onUpdate={handleEditorUpdate} />
      </div>
    </>
  );
}
