import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { Scaling } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const ResizableImage: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setAspectRatio(naturalWidth / naturalHeight);
    }
  }, []);

  const onResize = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isResizing && imageRef.current) {
        const startWidth = imageRef.current.offsetWidth;
        const startX = event.clientX;

        const handleMouseMove = (e: MouseEvent) => {
          const deltaX = e.clientX - startX;
          const newWidth = Math.round(startWidth + deltaX);
          const newHeight = Math.round(newWidth / aspectRatio);

          updateAttributes({
            width: Math.max(50, newWidth),
            height: Math.max(50, newHeight),
          });
        };

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          setIsResizing(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    },
    [isResizing, updateAttributes, aspectRatio]
  );

  const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
  };

  return (
    <NodeViewWrapper className="relative inline-block group">
      <img
        ref={imageRef}
        src={node.attrs.src}
        alt={node.attrs.alt}
        className={`max-w-full h-auto ${selected ? "ring-2 ring-ring" : ""}`}
        style={{
          width: node.attrs.width ? `${node.attrs.width}px` : "auto",
          height: node.attrs.height ? `${node.attrs.height}px` : "auto",
        }}
      />
      {selected && (
        <div
          className="absolute right-0 bottom-8 p-1 cursor-se-resize bg-background rounded-tl"
          onMouseDown={handleResizeStart}
          onMouseMove={onResize}
        >
          <Scaling className="w-4 h-4 text-primary rotate-90" />
        </div>
      )}
    </NodeViewWrapper>
  );
};

export default ResizableImage;
