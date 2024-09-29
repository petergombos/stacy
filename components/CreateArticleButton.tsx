"use client";

import { createArticleAction } from "@/app/dashboard/actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function CreateArticleButton() {
  const { execute, isPending } = useAction(createArticleAction, {
    onError: () => {
      toast.error("Could not create article");
    },
    onSuccess: () => {
      toast.success("Article created");
    },
  });

  return (
    <Button onClick={() => execute()} disabled={isPending}>
      Create Article
    </Button>
  );
}
