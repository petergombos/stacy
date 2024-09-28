"use client";

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
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  ListX,
  Quote,
  SeparatorHorizontal,
  TableCellsMerge,
  Table as TableIcon,
  Trash2,
  Underline,
} from "lucide-react";
import { UnsplashImageSearch } from "./UnsplashImageSearch";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
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
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
      label: "Heading 1",
    },
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

  return (
    <div className="relative">
      <div className="flex gap-2 p-2 bg-background dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {tools.map((tool, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button
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
        <Tooltip>
          <TooltipTrigger>
            <UnsplashImageSearch onImageSelect={handleImageSelect} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Image</p>
          </TooltipContent>
        </Tooltip>
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
    </div>
  );
}
