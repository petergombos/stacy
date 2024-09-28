"use client";

import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import { UniqueID } from "@tiptap/extension-unique-id";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import AutoJoiner from "tiptap-extension-auto-joiner";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import EditorToolbar from "./EditorToolbar";

interface TiptapEditorProps {
  editor: Editor;
}

export const extensions = [
  StarterKit,
  Underline,
  UniqueID.configure({
    types: [
      "paragraph",
      "heading",
      "listItem",
      "bulletList",
      "orderedList",
      "image",
      "table",
      "tableRow",
      "tableCell",
      "tableHeader",
      "blockQuote",
      "horizontalRule",
      "codeBlock",
      "code",
    ],
  }),
  Image.configure({
    HTMLAttributes: {
      class: "w-full h-auto",
    },
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "not-prose",
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: "not-prose",
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: "not-prose",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: "not-prose",
    },
  }),
  AutoJoiner,
  GlobalDragHandle.configure({
    dragHandleWidth: 28,
  }),
  CodeBlock,
];

export default function TiptapEditor({ editor }: TiptapEditorProps) {
  return (
    <div className="h-full flex flex-col">
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="overflow-y-scroll flex-1 w-full flex flex-col"
      />
    </div>
  );
}
