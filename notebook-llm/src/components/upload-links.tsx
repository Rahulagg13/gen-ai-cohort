"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { RefObject, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Button } from "./ui/button";
import { Link, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { toast } from "sonner";

const UploadLinks = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [link, setLink] = useState<string>("");
  const [error, setError] = useState("");

  const { mutate: uploadLink, isPending } = useMutation({
    mutationFn: async (link: string) => {
      if (!link) {
        throw new Error("Please enter a link");
      }
      if (!validateLink(link)) {
        throw new Error("Invalid Link");
      }

      const res = await axios.post("/api/upload-link", { link });
      return res.data;
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      console.log("Uploaded:", data);
      setOpen(false);
      setLink("");
      setError("");
    },
  });

  useOnClickOutside(ref as RefObject<HTMLElement>, () => {
    if (isPending) return;
    setLink("");
    setError("");
    setOpen(false);
  });
  const validateLink = (link: string): boolean => {
    const regex =
      /^(https?:\/\/(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:[/?#][^\s]*)?)$/i;
    return regex.test(link.trim());
  };

  return (
    <>
      <AnimatePresence>
        <motion.p
          layoutId="upload-link"
          key={"upload-link"}
          className="rounded-full bg-neutral-50 px-2 py-1.5 border-2 border-neutral-200 text-sm flex justify-center items-center gap-2 active:bg-neutral-100 active:scale-[0.97] cursor-pointer select-none"
          onClick={() => setOpen(true)}
        >
          <motion.span
            layoutId="link-icon"
            key="link-icon"
            className="flex justify-center items-center"
          >
            <Link className="size-5" />
          </motion.span>
          <motion.span layoutId="link-heading" key={"link-heading"}>
            Add Link
          </motion.span>
        </motion.p>
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed bg-black/30 w-full h-full top-0 left-0 border-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="upload-link"
            key={"upload-link"}
            className="bg-white max-w-2xl w-full p-4 rounded-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            ref={ref}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <motion.span
                  layoutId="link-icon"
                  key="link-icon"
                  className="flex justify-center items-center"
                >
                  <Link className="size-5" />
                </motion.span>
                <motion.h4
                  layoutId="link-heading"
                  key="link-heading"
                  className="font-semibold text-xl"
                >
                  Add Link
                </motion.h4>
                {/* <p className="text-xs text-neutral-500">
                  (You can upload only one file.)
                </p> */}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setLink("");
                  setError("");
                  setOpen(false);
                }}
                disabled={isPending}
              >
                <X />
              </Button>
            </div>

            <div
              className={cn(
                "mt-4 rounded-md flex justify-between items-center p-4 gap-2",
                isPending && "bg-neutral-100 pointer-events-none"
              )}
            >
              <Input
                type="url"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="py-6 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    uploadLink(link);
                  }
                }}
              />

              <Button
                className="py-6"
                onClick={() => {
                  uploadLink(link);
                }}
                disabled={isPending || !link}
              >
                Upload
              </Button>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UploadLinks;
