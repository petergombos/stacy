import { HTMLAttributes } from "react";

interface ArticleContainerProps extends HTMLAttributes<HTMLDivElement> {}

export function ArticleContainer({ children, ...rest }: ArticleContainerProps) {
  return (
    <article
      className="container prose xl:prose-lg dark:prose-invert mx-auto max-w-screen-md p-5 sm:p-10 bp-8 sm:pb-16 [&>img]:-mx-5 [&>img]:sm:-mx-10 [&>img]:w-[calc(100%+2.5rem)] [&>img]:sm:w-[calc(100%+5rem)] [&>img]:max-w-none"
      {...rest}
    >
      {children}
    </article>
  );
}
