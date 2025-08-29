"use client";
import { RefObject, useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useState } from "react";
import { Paperclip, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { FileMeta, Source } from "./source";
import { toast } from "sonner";

const UploadFile = ({
  fileMeta,
  setFileMeta,
}: {
  fileMeta: Source | null;
  setFileMeta: React.Dispatch<React.SetStateAction<Source | null>>;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [attachment, setAttachment] = useState<File | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);

  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          }
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Successfully uploaded!");
      setTimeout(() => {
        setProgress(0);
      }, 200);
    },
    onError: (err) => {
      toast.error("Something went Wrong!");
      setTimeout(() => {
        setProgress(0);
      }, 200);
    },
  });

  useOnClickOutside(ref as RefObject<HTMLElement>, () => {
    if (isPending) return;
    setOpen(false);
  });

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setAttachment(file);

      const metadata: FileMeta = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };
      setFileMeta([metadata, ...(fileMeta ?? [])]);
      let sourceFile: FileMeta[];
      const uploadedFileMeta = localStorage.getItem("uploadedMeta");
      if (uploadedFileMeta) {
        sourceFile = JSON.parse(uploadedFileMeta);
      } else {
        sourceFile = [];
      }

      sourceFile = [metadata, ...sourceFile];

      localStorage.setItem("uploadedMeta", JSON.stringify(sourceFile));

      uploadFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  return (
    <>
      <AnimatePresence>
        <motion.p
          layoutId="upload-file"
          key={"upload-file"}
          className="rounded-full bg-neutral-50 px-2 py-1.5 border-2 border-neutral-200 text-sm flex justify-center items-center gap-2 active:bg-neutral-100 active:scale-[0.97] cursor-pointer select-none"
          onClick={() => setOpen(true)}
        >
          <motion.span
            layoutId="attach-icon"
            key="attach-icon"
            className="flex justify-center items-center"
          >
            <Paperclip className="size-5" />
          </motion.span>
          <motion.span layoutId="attach-heading" key={"attach-heading"}>
            Attach File
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
            layoutId="upload-file"
            key={"upload-file"}
            className="bg-white max-w-2xl w-full p-4 rounded-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            ref={ref}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <motion.span
                  layoutId="attach-icon"
                  key="attach-icon"
                  className="flex justify-center items-center"
                >
                  <Paperclip className="size-5" />
                </motion.span>
                <motion.h4
                  layoutId="attach-heading"
                  key="attach-heading"
                  className="font-semibold text-xl"
                >
                  Attach file
                </motion.h4>
                {/* <p className="text-xs text-neutral-500">
                  (You can upload only one file.)
                </p> */}
              </div>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                <X />
              </Button>
            </div>

            <div
              className={cn(
                "mt-4 rounded-md",
                isPending && "bg-neutral-100 pointer-events-none"
              )}
            >
              <label
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed  min-h-96 border-neutral-300 rounded-lg p-6 cursor-pointer hover:border-neutral-400 transition"
              >
                {isPending && progress > 0 ? (
                  <div className="mt-4 w-full">
                    <p className="text-sm text-neutral-500 mb-2 text-center">
                      Uploading...{" "}
                      <span className="text-sm text-neutral-500 mt-1">
                        {progress}%
                      </span>
                    </p>
                    <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="size-8 mb-3 text-neutral-400" />
                    <span className="text-neutral-500 mb-2 text-base">
                      {dragActive
                        ? "Drop your file here"
                        : "Drag & drop or click to select a file"}
                    </span>
                    <span className="text-neutral-400 text-xs">
                      Supported formats: .pdf, .csv
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf, .csv, .docx, .doc"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </>
                )}
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UploadFile;
