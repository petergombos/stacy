import parse, { HTMLReactParserOptions } from "html-react-parser";
import Image from "next/image";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode.type === "tag" && domNode.name === "img") {
      const { src, alt, width, height } = domNode.attribs;
      return (
        <Image
          src={src}
          alt={alt || ""}
          width={parseInt(width) || 800}
          height={parseInt(height) || 600}
          className="w-full h-auto"
        />
      );
    }

    return;
  },
};

export function ArticleHtmlContent({ content }: { content: string }) {
  return parse(content, options);
}
