"use client";

import { createProjectAction } from "@/app/(admin)/actions/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { chatProjectCreationResponseSchema } from "@/schemas/chat-response";
import {
  projectCreationFormSchema,
  ProjectFormValues,
} from "@/schemas/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ChatInterface from "./chat-interface";
import { Label } from "./ui/label";

interface ProjectCreateDialogProps {
  children: React.ReactNode;
}

export function ProjectCreateDialog({ children }: ProjectCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectCreationFormSchema),
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
      <DialogContent className="sm:max-w-[780px]">
        <DialogHeader>
          <DialogTitle>Create a New Project</DialogTitle>
          <DialogDescription>
            Use our AI assistant to help you fill out project details or edit
            them manually. The more information you provide, the better we can
            tailor your project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 max-h-[80vh]">
          <div className="col-span-1">
            <Label className="mb-3 block">AI-Assisted Project Creation</Label>
            <ChatInterface
              className="h-[calc(80vh-56px)]"
              initialMessages={[
                {
                  role: "assistant",
                  content:
                    "Hello, I'm here to help you create your project. The more information you provide, the better articles we can generate for you.",
                },
                {
                  role: "assistant",
                  content:
                    "Tip: you can just copy paste the content of your website or dump any existing content you have here. This will help us create a more accurate and tailored project for you.",
                },
              ]}
              getContext={() => form.getValues()}
              endpoint="/api/chat/project"
              onFinish={({ object }) => {
                if (object?.project) {
                  form.setValue("name", object.project.name ?? "");
                  form.setValue("niche", object.project.niche ?? "");
                  form.setValue(
                    "shortDescription",
                    object.project.shortDescription ?? ""
                  );
                  form.setValue(
                    "fullContext",
                    object.project.fullContext ?? ""
                  );
                }
              }}
              schema={chatProjectCreationResponseSchema}
              noPadding
            />
          </div>
          <div className="col-span-1 overflow-y-auto px-1 -mx-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a unique and descriptive name for your project"
                          {...field}
                        />
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
                      <FormLabel>Project Niche</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Specify the industry or category your project belongs to"
                          {...field}
                        />
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
                        <Textarea
                          placeholder="Provide a brief overview of your project (1-2 sentences)"
                          {...field}
                        />
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
                      <FormLabel>Full Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project in detail, including goals, target audience, and key features"
                          rows={10}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={status === "executing"}
                  className="w-full sticky bottom-0"
                >
                  {status === "executing" ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
