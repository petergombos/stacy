import { CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArticleForm } from "@/schemas/article";
import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { ImageSelect } from "./image-select";

export function ArticleMetadataFields({
  form,
}: {
  form: UseFormReturn<ArticleForm>;
}) {
  return (
    <div className="p-6 max-w-[780px] mx-auto rounded bg-muted dark:bg-neutral-900 space-y-6 w-full border">
      <CardTitle>Metadata</CardTitle>
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Featured Image</FormLabel>
            <FormControl>
              <ImageSelect onImageSelect={(url) => form.setValue("image", url)}>
                <button className="relative rounded-md overflow-hidden w-full block">
                  <Image
                    src={field.value}
                    alt="Featured Image"
                    width={800}
                    height={800}
                    className="object-cover w-full aspect-video"
                  />
                  <div className="absolute inset-0 inline-flex items-center justify-center opacity-0 bg-black/50 hover:opacity-100 transition-opacity duration-300">
                    <div className="rounded-full p-4 bg-background border">
                      <ImagePlusIcon className="h-5 w-5" />
                    </div>
                  </div>
                </button>
              </ImageSelect>
            </FormControl>
            <FormDescription>
              Select or enter a URL for the article&apos;s featured image.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of the article"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A short summary of your article (10-500 characters). This will be
              used for SEO and on social media.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input placeholder="article-slug" {...field} />
            </FormControl>
            <FormDescription>
              The URL-friendly version of your article title. This will be used
              in the URL of the article.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Keywords</FormLabel>
            <FormControl>
              <Input placeholder="keyword1, keyword2, keyword3" {...field} />
            </FormControl>
            <FormDescription>Comma-separated keywords for SEO.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="authorName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Author Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormDescription>
              The name of the article&apos;s author.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
