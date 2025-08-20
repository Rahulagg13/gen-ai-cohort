// components/MDXMessage.tsx
"use client";

import { useEffect, useState } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

interface MDXMessageProps {
  mdx: string;
}

export default function MDXMessage({ mdx }: MDXMessageProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );

  useEffect(() => {
    async function compile() {
      const mdxSource = await serialize(mdx, {
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [rehypeHighlight, rehypeRaw],
          format: "mdx",
        },
        parseFrontmatter: false,
      });
      setMdxSource(mdxSource);
    }
    compile();
  }, [mdx]);

  if (!mdxSource) return <p>Loading...</p>;

  return (
    <div className="prose max-w-full">
      <MDXRemote {...mdxSource} />
    </div>
  );
}
