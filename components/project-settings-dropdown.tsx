"use client";

import { ApiTokenDialog } from "@/components/api-token-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiToken } from "@/lib/db/schema";
import { EllipsisIcon } from "lucide-react";
import { useState } from "react";

export const ProjectSettingsDropdown = ({
  projectId,
  tokens,
}: {
  projectId: string;
  tokens: ApiToken[];
}) => {
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <EllipsisIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Project Settings</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={() => {
              setIsTokenDialogOpen(true);
            }}
          >
            API Tokens
          </DropdownMenuItem>
        </DropdownMenuContent>
        <ApiTokenDialog
          projectId={projectId}
          isOpen={isTokenDialogOpen}
          onOpenChange={() => setIsTokenDialogOpen(false)}
          tokens={tokens}
        />
      </DropdownMenu>
    </>
  );
};
