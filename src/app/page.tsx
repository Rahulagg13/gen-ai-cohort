"use client";
import { useEffect, useState } from "react";
import { decode, encode } from "@/lib/tokenizer";
import { get } from "http";
import { cn } from "@/lib/utils";

const COLORS = [
  "bg-sky-200",
  "bg-amber-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-orange-200",
  "bg-cyan-200",
  "bg-gray-200",
  "bg-purple-200",
  "bg-indigo-200",
  "bg-lime-200",
  "bg-rose-200",
  "bg-violet-200",
  "bg-yellow-200",
  "bg-emerald-200",
  "bg-zinc-200",
  "bg-red-200",
  "bg-fuchsia-200",
  "bg-pink-200",
  "bg-teal-200",
];

export default function Home() {
  const [token, setToken] = useState("");
  const [mount, setMount] = useState(false);
  const [indexHover, setIndexHover] = useState<null | number>(null);

  const encoded = encode(token);
  const decoded = decode(encoded);
  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount)
    return (
      <div className="min-h-screen flex justify-center items-center"></div>
    );

  return (
    <div className="flex justify-center items-center py-20 min-h-[calc(100vh-8.5rem)] container mx-auto max-w-7xl">
      <div className="flex flex-col gap-10 items-center w-full px-10">
        <div className="flex flex-col items-center gap-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide whitespace-nowrap">
            Custom Tokenizer
          </h1>
          <input
            type="text"
            placeholder="Enter your text here"
            className="px-4 py-2 border w-full max-w-2xl rounded-md"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          <div>
            <h6 className="font-semibold mb-2">Decoded</h6>
            <div className="w-full border p-5 rounded-md min-h-40 break-words">
              {encoded.map((text, index) => {
                let tokenText = decode([text]);
                if (/^\s+$/.test(tokenText)) {
                  tokenText = tokenText.replace(/ /g, "[space]");
                }

                return (
                  <span
                    key={index}
                    onMouseEnter={() => setIndexHover(index)}
                    onMouseLeave={() => setIndexHover(null)}
                    className={cn(" px-2 py-1 inline-block rounded-md", {
                      [COLORS[index % COLORS.length]]: indexHover === index,
                    })}
                  >
                    {tokenText}
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <h6 className="font-semibold mb-2">Encoded</h6>
              {encoded.length > 0 && (
                <p className="text-sm text-neutral-400 mr-3">
                  Token Length -{" "}
                  <span className="font-semibold text-neutral-700">
                    {encoded.length}
                  </span>
                </p>
              )}
            </div>
            <div className="w-full border p-5 rounded-md min-h-40">
              {encoded.map((text, index) => (
                <span
                  key={index}
                  onMouseEnter={() => setIndexHover(index)}
                  onMouseLeave={() => setIndexHover(null)}
                  className={cn(" px-2 py-1 inline-block rounded-md", {
                    [COLORS[index % COLORS.length]]: indexHover === index,
                  })}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
