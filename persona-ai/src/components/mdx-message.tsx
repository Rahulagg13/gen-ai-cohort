// components/MDXMessage.tsx
"use client";

import { useEffect, useState } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

interface MDXMessageProps {
  mdx: string;
}

export default function MDXMessage({ mdx }: MDXMessageProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );

  useEffect(() => {
    async function compile() {
      const source = await serialize(mdx);
      setMdxSource(source);
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
