"use client";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Link,
  X,
  FileText,
  Sparkles,
  Download,
  Share,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/message-context";
import MDXMessage from "@/components/mdx-message";
import UploadFile from "@/components/upload-file";
import { motion, AnimatePresence } from "motion/react";
import UploadLinks from "./upload-links";

export type FileMeta = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export function ThinkingText() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-gray-500 font-medium py-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full"
      />
      <span>Generating insights</span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
      >
        .
      </motion.span>
    </motion.div>
  );
}

const Source = () => {
  const { messages } = useChat();
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("uploadedFileMeta");
    if (saved) setFileMeta(JSON.parse(saved));
  }, []);

  const removeLocalStorage = () => {
    localStorage.removeItem("uploadedFileMeta");
    setFileMeta(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50/50 to-white border border-gray-200/60 rounded-xl shadow-sm ">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 bg-white/80 z-10 p-6 border-b border-gray-100/80"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Notebook LLM
              </h4>
              <p className="text-sm text-gray-500 -mt-1">
                AI-powered document analysis
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-start items-center gap-3">
          <UploadFile fileMeta={fileMeta} setFileMeta={setFileMeta} />
          <UploadLinks />
          {/* <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group rounded-xl bg-white hover:bg-gray-50 px-4 py-2.5 border-2 border-gray-200/80 hover:border-gray-300/80 text-sm flex justify-center items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ClipboardList className="size-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-gray-900">
              Paste Text
            </span>
          </motion.button> */}
        </div>
      </motion.div>

      {/* <AnimatePresence>
        {fileMeta && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="px-6 py-4 border-b border-gray-100/80 bg-gradient-to-r from-blue-50/30 to-purple-50/30"
          >
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/60 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h6 className="text-sm font-semibold text-gray-800 line-clamp-1 max-w-[200px]">
                    {fileMeta.name}
                  </h6>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>Size: {formatFileSize(fileMeta.size)}</span>
                    <span>•</span>
                    <span>
                      Type:{" "}
                      {fileMeta.type.split("/")[1]?.toUpperCase() || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeLocalStorage}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      <div className="flex-1 overflow-hidden">
        <AnimatePresence>
          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-full overflow-y-auto px-6 py-4"
            >
              <div className="mb-8">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <h1 className="text-lg font-semibold text-gray-800">
                    AI Summary
                  </h1>
                </motion.div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6 shadow-sm">
                    {messages[messages.length - 1]?.summary ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="prose prose-gray max-w-none"
                      >
                        <MDXMessage
                          mdx={messages[messages.length - 1]?.summary ?? ""}
                        />
                      </motion.div>
                    ) : (
                      <ThinkingText />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Source;
