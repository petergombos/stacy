"use client";

import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { UniqueID } from "@tiptap/extension-unique-id";
import {
  BubbleMenu,
  Editor,
  EditorContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditorToolbar from "./EditorToolbar";
import ResizableImage from "./ResizableImage";

interface TiptapEditorProps {
  editor: Editor;
}

export const extensions = [
  StarterKit,
  Underline,
  BubbleMenuExtension,
  UniqueID.configure({
    types: [
      "paragraph",
      "heading",
      "listItem",
      "bulletList",
      "orderedList",
      "image",
    ],
  }),
  Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        width: {
          default: "100%",
          renderHTML: (attributes) => ({
            width: attributes.width,
          }),
        },
        height: {
          default: "auto",
          renderHTML: (attributes) => ({
            height: attributes.height,
          }),
        },
      };
    },
    addNodeView() {
      return ReactNodeViewRenderer(ResizableImage, {
        attrs: ({ node }) => ({
          "data-id": node.attrs.id,
        }),
      });
    },
  }),
  Dropcursor.configure({
    width: 2,
  }),
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
