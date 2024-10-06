"use client";

import { createArticleAction } from "@/app/(admin)/actions/article";
import { Button, ButtonProps } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { ReactNode } from "react";
import { toast } from "sonner";

interface CreateArticleButtonProps extends ButtonProps {
  projectId: string;
  children?: ReactNode;
}

export function ArticleCreateButton({
  projectId,
  children,
  ...rest
}: CreateArticleButtonProps) {
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
      size="sm"
      onClick={() => execute({ projectId })}
      disabled={isPending}
      className="h-8 gap-1"
      variant="outline"
      {...rest}
    >
      {children || (
        <>
          <PlusCircle className="h-3.5 w-3.5" />
          Create Article
        </>
      )}
    </Button>
  );
}
