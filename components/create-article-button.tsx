"use client";

import { PlusCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createArticleAction } from "~/app/articles/actions";
import { Button, ButtonProps } from "~/components/ui/button";

export default function CreateArticleButton({
  children,
  ...rest
}: ButtonProps) {
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
      onClick={() => execute()}
      disabled={isPending}
      className="h-8 gap-1"
      variant="outline"
      {...rest}
    >
      <PlusCircle className="h-3.5 w-3.5" />
      {children || "Create Article"}
    </Button>
  );
}
