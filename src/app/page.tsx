"use client";
import { useEffect, useState } from "react";
import { decode, encode } from "@/lib/tokenizer";

export default function Home() {
  const [token, setToken] = useState("");
  const [mount, setMount] = useState(false);
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
              {decoded}
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
              {encoded.toString()
                ? `[${encoded.toString().split(",").join(", ")}]`
                : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
