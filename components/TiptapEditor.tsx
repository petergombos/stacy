"use client";

import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, Content, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./EditorToolbar";

interface TiptapEditorProps {
  content: Content;
  onUpdate: (content: string) => void;
}

export const extensions = [StarterKit, Underline, BubbleMenuExtension];

export default function TiptapEditor({ content, onUpdate }: TiptapEditorProps) {
  const editor = useEditor(
    {
      extensions,
      content: content,
      onUpdate: ({ editor }) => {
        onUpdate(editor.getHTML());
      },
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "prose dark:prose-invert outline-none min-w-full flex-1 p-4",
        },
      },
    },
    [content]
  );

  return (
    <div className="h-full flex flex-col">
      {editor && (
        <BubbleMenu
          className="bubble-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <EditorToolbar editor={editor} />
        </BubbleMenu>
      )}
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="overflow-y-scroll flex-1 w-full flex flex-col"
      />
    </div>
  );
}
