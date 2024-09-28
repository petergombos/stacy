import { Image as ImageIcon, Loader2 } from "lucide-react";
import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface UnsplashImageSearchProps extends HTMLAttributes<HTMLButtonElement> {
  onImageSelect: (imageUrl: string) => void;
}

interface UnsplashImage {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string;
}

export function UnsplashImageSearch({
  onImageSelect,
  ...rest
}: UnsplashImageSearchProps) {
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
    if (keyword) {
      setImages([]);
      setSearchTerm(keyword);
      setPage(1);
      // Use the current keyword value directly here
      searchImages(1, true);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    setIsOpen(false);
    setKeyword("");
    setSearchTerm("");
    setImages([]);
  };

  useEffect(() => {
    if (page > 1) {
      searchImages(page);
    }
  }, [page, searchImages]);

  // Add this effect to trigger a search when searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      searchImages(1, true);
    }
  }, [searchTerm, searchImages]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              {...rest}
            >
              <ImageIcon className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Image</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Find the perfect image from Unsplash</DialogTitle>
          <DialogDescription>
            Search for images from Unsplash and select the one you want to use.
            Images from Unsplash are free to use under the Unsplash license.
          </DialogDescription>
        </DialogHeader>
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
            />
            <Button onClick={handleSearch} disabled={isLoading && page === 1}>
              {isLoading && page === 1 ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 h-full max-h-[500px] overflow-y-auto">
            {images.map((image, index) => (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                className="w-full h-44 object-cover cursor-pointer"
                onClick={() => handleImageSelect(image.urls.regular)}
                ref={index === images.length - 1 ? lastImageElementRef : null}
              />
            ))}
            {isLoading && (
              <div className="col-span-2 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
