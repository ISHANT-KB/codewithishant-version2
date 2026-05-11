"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: Props) {
  // Truncate content to first 3 lines
  const lines = content.split("\n");
  const truncatedContent = lines.slice(0, 3).join("\n");

  return (
    <div
      className={cn(
        "prose prose-stone max-w-none text-inherit prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-code:text-inherit prose-pre:bg-stone-900/90 prose-pre:text-stone-100",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {truncatedContent}
      </ReactMarkdown>
    </div>
  );
}
