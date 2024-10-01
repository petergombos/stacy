"use client";

import { articleFormSchema } from "@/schemas/article";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import { UniqueID } from "@tiptap/extension-unique-id";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { UseFormReturn } from "react-hook-form";
import AutoJoiner from "tiptap-extension-auto-joiner";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import { z } from "zod";
import { ArticleMetadataFields } from "./ArticleMetadataFields";
import EditorToolbar from "./EditorToolbar";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [2, 3],
    },
  }),
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
      "link",
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
    dragHandleWidth: 20,
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-primary underline",
    },
  }),
];

interface ArticleEditorProps {
  editor: Editor;
  form: UseFormReturn<z.infer<typeof articleFormSchema>>;
}

export default function ArticleEditor({ editor, form }: ArticleEditorProps) {
  return (
    <div className="h-full flex flex-col gap-8 overflow-y-scroll">
      <EditorToolbar form={form} editor={editor} />
      <div className="max-w-[780px] mx-auto space-y-6 w-full px-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="text-2xl font-semibold py-6 px-6 border-none shadow rounded"
                  placeholder="The headline of your article"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <EditorContent
            editor={editor}
            className="flex-1 w-full flex flex-col min-h-[60vh]"
          />
        </div>
        <ArticleMetadataFields form={form} />
      </div>
    </div>
  );
}
