"use client";

import { createArticleAction } from "@/app/articles/actions";
import { PlusCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function CreateArticleButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { execute, isPending } = useAction(createArticleAction, {
    onError: () => {
      toast.error("Could not create article");
    },
    onSuccess: () => {
      toast.success("Article created");
    },
  });

  return (
    <Button
      className={className}
      onClick={() => execute()}
      disabled={isPending}
    >
      <PlusCircle className="w-5 h-5 mr-2" />
      {children || "Create Article"}
    </Button>
  );
}
