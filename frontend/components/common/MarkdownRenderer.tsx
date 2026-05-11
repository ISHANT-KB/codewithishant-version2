"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

interface Props {
  content: string;
  className?: string;
  truncate?: boolean;
}

export default function MarkdownRenderer({
  content,
  className,
  truncate = false,
}: Props) {
  const displayContent = truncate
    ? content.split("\n").slice(0, 3).join("\n")
    : content;

  return (
    <article
      className={cn(
        `
        max-w-none

        /* BASE TYPOGRAPHY */
        prose prose-stone dark:prose-invert

        /* HEADINGS */
        [&_h1]:text-4xl
        [&_h1]:font-bold
        [&_h1]:mt-6
        [&_h1]:mb-4

        [&_h2]:text-3xl
        [&_h2]:font-semibold
        [&_h2]:mt-10
        [&_h2]:mb-3

        [&_h3]:text-2xl
        [&_h3]:font-semibold
        [&_h3]:mt-8
        [&_h3]:mb-2

        [&_h4]:text-xl
        [&_h4]:font-semibold

        /* PARAGRAPH */
        [&_p]:text-base
        [&_p]:leading-7
        [&_p]:my-3

        /* LINKS */
        [&_a]:text-blue-500
        [&_a]:no-underline
        hover:[&_a]:underline
        hover:[&_a]:text-blue-400

        /* LISTS */
        [&_ul]:my-4
        [&_ol]:my-4
        [&_li]:my-1
        [&_li]:marker:text-stone-500

        /* BLOCKQUOTE */
        [&_blockquote]:border-l-4
        [&_blockquote]:border-stone-400
        [&_blockquote]:pl-4
        [&_blockquote]:italic

        /* INLINE CODE */
        [&_code]:text-pink-500
        [&_code]:bg-stone-100
        dark:[&_code]:bg-stone-800
        [&_code]:px-1.5
        [&_code]:py-0.5
        [&_code]:rounded-md

        /* CODE BLOCK */
        [&_pre]:bg-stone-900
        [&_pre]:text-stone-100
        [&_pre]:border
        [&_pre]:border-stone-700
        [&_pre]:rounded-xl
        [&_pre]:p-4
        [&_pre]:overflow-x-auto

        /* TABLES */
        [&_table]:w-full
        [&_table]:border-collapse

        [&_th]:border
        [&_th]:border-stone-300
        dark:[&_th]:border-stone-700
        [&_th]:px-4
        [&_th]:py-2
        [&_th]:bg-stone-100
        dark:[&_th]:bg-stone-800

        [&_td]:border
        [&_td]:border-stone-300
        dark:[&_td]:border-stone-700
        [&_td]:px-4
        [&_td]:py-2

        /* IMAGES */
        [&_img]:rounded-xl
        [&_img]:shadow-md

        /* HR */
        [&_hr]:border-stone-300
        dark:[&_hr]:border-stone-700
        `,
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      >
        {displayContent}
      </ReactMarkdown>
    </article>
  );
}