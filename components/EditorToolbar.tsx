"use client";

import { articleFormSchema } from "@/schemas/article";
import { Editor } from "@tiptap/react";
import {
  BetweenHorizonalEnd,
  BetweenHorizonalStart,
  BetweenVerticalEnd,
  BetweenVerticalStart,
  Bold,
  Code,
  FileJson2,
  Heading,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  ListX,
  Loader2,
  Quote,
  Save,
  SeparatorHorizontal,
  TableCellsMerge,
  Table as TableIcon,
  Trash2,
  Underline,
} from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { LinkDialog } from "./LinkDialog";
import { UnsplashImageSearch } from "./UnsplashImageSearch";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface EditorToolbarProps {
  editor: Editor | null;
  form: UseFormReturn<z.infer<typeof articleFormSchema>>;
}

export default function EditorToolbar({ editor, form }: EditorToolbarProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const tools = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Underline,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
      label: "Underline",
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
      label: "Ordered List",
    },
    // {
    //   icon: Heading1,
    //   action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    //   isActive: () => editor.isActive("heading", { level: 1 }),
    //   label: "Heading 1",
    // },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
      label: "Heading 3",
    },
    {
      icon: LinkIcon,
      action: () => setIsLinkDialogOpen(true),
      isActive: () => editor.isActive("link"),
      label: "Link",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
      label: "Blockquote",
    },
    {
      icon: SeparatorHorizontal,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: () => editor.isActive("horizontalRule"),
      label: "Horizontal Rule",
    },
    {
      icon: TableIcon,
      action: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      isActive: () => editor.isActive("table"),
      label: "Table",
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
      label: "Code",
    },
    {
      icon: FileJson2,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
      label: "Code Block",
    },
  ];

  const tableTools = [
    {
      icon: BetweenHorizonalStart,
      label: "Add column before",
      action: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
      icon: BetweenHorizonalEnd,
      label: "Add column after",
      action: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
      icon: ListX,
      label: "Delete column",
      action: () => editor.chain().focus().deleteColumn().run(),
      className: "-rotate-90",
    },
    {
      icon: BetweenVerticalStart,
      label: "Add row before",
      action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
      icon: BetweenVerticalEnd,
      label: "Add row after",
      action: () => editor.chain().focus().addRowAfter().run(),
    },
    {
      icon: ListX,
      label: "Delete row",
      action: () => editor.chain().focus().deleteRow().run(),
    },
    {
      icon: Heading,
      label: "Toggle header cell",
      action: () => editor.chain().focus().toggleHeaderCell().run(),
    },
    {
      icon: TableCellsMerge,
      label: "Merge or split cells",
      action: () => editor.chain().focus().mergeOrSplit().run(),
    },
    {
      icon: Trash2,
      label: "Delete table",
      action: () => editor.chain().focus().deleteTable().run(),
    },
  ];

  const handleImageSelect = (imageUrl: string) => {
    editor.chain().focus().setImage({ src: imageUrl }).run();
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="sticky top-0 z-20">
      <div className="flex justify-between gap-5 p-2 bg-background dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {tools.map((tool, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={tool.action}
                  className={`p-2 rounded ${
                    tool.isActive()
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <tool.icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <UnsplashImageSearch onImageSelect={handleImageSelect}>
            <DialogTrigger>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Image</p>
                </TooltipContent>
              </Tooltip>
            </DialogTrigger>
          </UnsplashImageSearch>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save
        </Button>
      </div>
      {editor.isActive("table") && (
        <div className="flex gap-2 p-2 bg-background dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 absolute -bottom-full w-full z-10">
          {tableTools.map((tool, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  onClick={tool.action}
                  className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  <tool.icon className={`w-5 h-5 ${tool.className}`} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      )}
      <LinkDialog
        editor={editor}
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
      />
    </div>
  );
}
