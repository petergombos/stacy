import { Check, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getSignedUrlAction } from "~/app/actions/s3-upload";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { CircularProgress } from "./circular-progress";

interface ImageSelectProps {
  onImageSelect: (imageUrl: string) => void;
  children: React.ReactNode;
}

interface UnsplashImage {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string;
}

export function ImageSelect({ onImageSelect, children }: ImageSelectProps) {
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success"
  >("idle");

  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageElementRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const searchImages = useCallback(
    async (searchPage: number, newSearch: boolean = false) => {
      if (!searchTerm) return;
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?per_page=12&page=${searchPage}&query=${encodeURIComponent(
            searchTerm
          )}&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID c9f0b8f9e7a3a2ef58bb1dd7b6ec8c236dcc1cf8ad9f4424f5a635a9b0d9d3b8`,
            },
          }
        );
        const data = await res.json();
        setImages((prevImages) =>
          newSearch ? data.results : [...prevImages, ...data.results]
        );
        setHasMore(data.total_pages > searchPage);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm]
  );

  const handleSearch = () => {
    setImages([]);
    setSearchTerm(keyword);
    setPage(1);
  };

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    setIsOpen(false);
    setKeyword("");
    setSearchTerm("");
    setImages([]);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus("uploading");
    try {
      const result = await getSignedUrlAction({
        fileName: file.name,
        fileType: file.type,
      });

      if (!result?.data?.signedUrl || !result?.data?.key) {
        toast.error("Error getting signed URL");
        setUploadStatus("idle");
        return;
      }

      const { signedUrl, key } = result.data;

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const imageUrl = `${process.env.NEXT_PUBLIC_R2_BUCKET_URL}/${key}`;
          setUploadStatus("success");

          // Add a delay before closing the dialog and selecting the image
          setTimeout(() => {
            handleImageSelect(imageUrl);
            toast.success("Image uploaded successfully");
          }, 1000);
        } else {
          setUploadStatus("idle");
          toast.error("Upload failed");
        }
      };

      xhr.onerror = () => {
        setUploadStatus("idle");
        toast.error("Upload failed");
      };

      xhr.send(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("idle");
      toast.error("Error uploading file");
    }
  };

  useEffect(() => {
    if (page > 1) {
      searchImages(page);
    }
  }, [page, searchImages]);

  useEffect(() => {
    if (searchTerm) {
      searchImages(1, true);
    }
  }, [searchTerm, searchImages]);

  useEffect(() => {
    if (!isOpen) {
      setKeyword("");
      setSearchTerm("");
      setImages([]);
      setFile(null);
      setUploadProgress(0);
      setUploadStatus("idle");
    }
  }, [isOpen]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Select an image</DialogTitle>
          <DialogDescription>
            Search for images from Unsplash or upload your own image.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="unsplash" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="unsplash" className="min-h-[344px]">
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search for images..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  autoFocus
                />
                <Button
                  onClick={handleSearch}
                  disabled={isLoading && page === 1}
                >
                  {isLoading && page === 1 ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
              <div
                className={cn(
                  "grid grid-cols-2 gap-4 h-full max-h-[500px] overflow-y-auto"
                )}
              >
                {images?.map((image, index) => (
                  <Image
                    key={image.id}
                    src={image.urls.small}
                    alt={image.alt_description}
                    width={200}
                    height={200}
                    className="w-full h-44 object-cover cursor-pointer rounded-sm"
                    onClick={() => handleImageSelect(image.urls.regular)}
                    ref={
                      index === images.length - 1 ? lastImageElementRef : null
                    }
                  />
                ))}
                {
                  // Loading Placeholders
                  isLoading &&
                    Array.from({ length: 12 }).map((_, index) => (
                      <div
                        key={`loading-${index}`}
                        className={cn(
                          "w-full h-44 bg-gray-200 rounded-sm animate-pulse"
                        )}
                      />
                    ))
                }
              </div>
            </div>
          </TabsContent>
          <TabsContent value="upload" className="min-h-[344px]">
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className={cn(
                  "w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer relative group",
                  dragActive ? "border-primary/80" : "border-primary/50",
                  file && "border-none"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {file ? (
                  <>
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="w-full h-full object-contain"
                    />

                    {uploadStatus !== "idle" && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <CircularProgress
                          value={uploadProgress}
                          size="lg"
                          theme="light"
                        >
                          {uploadStatus === "success" ? (
                            <Check className="w-12 h-12 text-background dark:text-foreground animate-scale" />
                          ) : (
                            `${Math.round(uploadProgress)}%`
                          )}
                        </CircularProgress>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-muted-foreground group-hover:text-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground group-hover:text-foreground">
                      Drag and drop an image, or click to select
                    </p>
                  </>
                )}
              </div>
              <Button
                onClick={handleUpload}
                disabled={!file || uploadStatus !== "idle"}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
