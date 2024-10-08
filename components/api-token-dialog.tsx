"use client";

import {
  createApiTokenAction,
  invalidateApiTokenAction,
} from "@/app/(admin)/actions/api-token";
import { ApiToken } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { Loader2, TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ApiTokenDialogProps {
  projectId: string;
  tokens: ApiToken[];
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ApiTokenDialog({
  projectId,
  tokens,
  children,
  isOpen: isOpenProp,
  onOpenChange,
}: ApiTokenDialogProps) {
  const [isOpenState, setIsOpenState] = useState(false);

  const isOpen = isOpenProp ?? isOpenState;

  const { execute: executeCreateToken, status: createStatus } = useAction(
    createApiTokenAction,
    {
      onSuccess: ({ data }) => {
        if (!data) {
          toast.error("Failed to create API token");
          return;
        }
        toast.success("API token created successfully");
      },
      onError: () => {
        toast.error("Failed to create API token");
      },
    }
  );

  const {
    execute: executeInvalidateToken,
    status: invalidateStatus,
    input,
  } = useAction(invalidateApiTokenAction, {
    onSuccess: () => {
      toast.success("API token invalidated successfully");
    },
    onError: () => {
      toast.error("Failed to invalidate API token");
    },
  });

  const handleCreateToken = () => {
    executeCreateToken({ projectId });
  };

  const handleInvalidateToken = (token: string) => {
    executeInvalidateToken({ token });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpenState(open);
        onOpenChange?.(open);
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Tokens</DialogTitle>
          <DialogDescription>
            API tokens are used to authenticate your requests when using the
            API.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {tokens.length > 0 ? (
            <>
              <div className="grid gap-2">
                <Label>Tokens:</Label>
                <div className="grid gap-5">
                  {tokens
                    .filter((token) => token.isValid)
                    .map((token) => (
                      <div key={token.token}>
                        <div className="flex items-center justify-between">
                          <Input
                            value={token.token}
                            readOnly
                            className="mr-2"
                          />
                          <Button
                            onClick={() => handleInvalidateToken(token.token)}
                            disabled={
                              invalidateStatus === "executing" &&
                              input.token === token.token
                            }
                            variant="destructive"
                            size="icon"
                          >
                            {invalidateStatus === "executing" &&
                            input.token === token.token ? (
                              <Loader2 className="animate-spin size4" />
                            ) : (
                              <TrashIcon className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">
                          Created at: {formatDate(token.createdAt)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-muted-foreground text-sm border rounded-md text-center">
              <p>
                You don&apos;t have any API tokens yet. Create a new token to
                get started.
              </p>
            </div>
          )}
          <Button
            onClick={handleCreateToken}
            disabled={createStatus === "executing"}
            className="w-full"
          >
            {createStatus === "executing" ? (
              <Loader2 className="animate-spin size4" />
            ) : (
              "Create New Token"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
