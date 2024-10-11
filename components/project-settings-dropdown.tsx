"use client";

import { ApiTokenDialog } from "@/components/api-token-dialog";
import { ProjectUpsertDialog } from "@/components/project-upsert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiToken, Project } from "@/lib/db/schema";
import { EllipsisIcon } from "lucide-react";
import { useState } from "react";

export const ProjectSettingsDropdown = ({
  project,
  tokens,
}: {
  project: Project;
  tokens: ApiToken[];
}) => {
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

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
          <DropdownMenuItem onSelect={() => setIsDetailsDialogOpen(true)}>
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setIsTokenDialogOpen(true);
            }}
          >
            API Tokens
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProjectUpsertDialog
        isOpen={isDetailsDialogOpen}
        onOpenChange={() => setIsDetailsDialogOpen(false)}
        project={project}
      />
      <ApiTokenDialog
        projectId={project.id}
        isOpen={isTokenDialogOpen}
        onOpenChange={() => setIsTokenDialogOpen(false)}
        tokens={tokens}
      />
    </>
  );
};
