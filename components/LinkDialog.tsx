import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tiptap/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface LinkDialogProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

export function LinkDialog({ editor, isOpen, onClose }: LinkDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      const { href } = editor.getAttributes("link");
      form.reset({ url: href || "" });
    } else {
      form.reset({ url: "" });
    }
  }, [isOpen, editor, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.url) {
      // Ensure the selection is expanded to word boundaries
      if (editor.state.selection.empty) {
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: values.url })
          .run();
      } else {
        editor.chain().focus().setLink({ href: values.url }).run();
      }
    } else {
      editor.chain().focus().unsetLink().run();
    }
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editor.isActive("link") ? "Edit Link" : "Insert Link"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {editor.isActive("link") && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    editor.chain().focus().unsetLink().run();
                    onClose();
                  }}
                >
                  Remove Link
                </Button>
              )}
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
