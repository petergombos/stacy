"use client";

import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { UniqueID } from "@tiptap/extension-unique-id";
import { BubbleMenu, Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./EditorToolbar";

interface TiptapEditorProps {
  editor: Editor;
}

export const extensions = [
  StarterKit,
  Underline,
  BubbleMenuExtension,
  UniqueID.configure({
    types: ["paragraph", "heading", "listItem", "bulletList", "orderedList"],
  }),
  Image,
];

export default function TiptapEditor({ editor }: TiptapEditorProps) {
  return (
    <div className="h-full flex flex-col">
      <BubbleMenu
        className="bubble-menu"
        tippyOptions={{ duration: 100 }}
        editor={editor}
      >
        <EditorToolbar editor={editor} />
      </BubbleMenu>
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="overflow-y-scroll flex-1 w-full flex flex-col"
      />
    </div>
  );
}
