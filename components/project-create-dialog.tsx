"use client";

import { createProjectAction } from "@/app/(admin)/actions/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResize } from "@/hooks/auto-resize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  niche: z
    .string()
    .min(3, "Niche must be at least 3 characters")
    .max(100, "Niche must be at most 100 characters"),
  shortDescription: z
    .string()
    .min(3, "Short description must be at least 3 characters")
    .max(155, "Short description must be at most 155 characters"),
  fullContext: z
    .string()
    .min(100, "Full context must be at least 100 characters"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectCreateDialogProps {
  children: React.ReactNode;
}

export function ProjectCreateDialog({ children }: ProjectCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      niche: "",
      shortDescription: "",
      fullContext: "",
    },
  });

  const { execute, status } = useAction(createProjectAction, {
    onSuccess: () => {
      setOpen(false);
      form.reset();
      toast.success("Project created successfully");
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    execute(data);
  };

  const contextRef = useRef<HTMLTextAreaElement>(null);
  useAutoResize(contextRef);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Enter the details for your new project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="niche"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niche</FormLabel>
                  <FormControl>
                    <Input placeholder="Project niche" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullContext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full context"
                      rows={10}
                      {...field}
                      ref={contextRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={status === "executing"}>
                {status === "executing" ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
