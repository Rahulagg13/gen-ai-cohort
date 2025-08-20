import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import fs from "fs/promises";
import os from "os";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    console.log(formData);
    const file = formData.get("file") as File | null;
    if (!file) {
      return Response.json({
        status: "error",
        error: "File not found",
      });
    }

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, file.name);

    console.log(filePath);

    await fs.writeFile(filePath, buffer);
    if (file.type === "application/pdf") await PDFIndexing(filePath);
    if (file.type === "text/csv") await CSVIndexing(filePath);
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "docx" || ext === "doc") {
      await DOCXIndexing(filePath, ext as "docx" | "doc");
    }

    return Response.json({
      status: "succes",
    });
  } catch (error: unknown) {
    console.error("❌ Error in POST:", error);

    return Response.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

async function PDFIndexing(filePath: string) {
  if (!process.env.OPENAI_API_KEY) {
    console.log("api key is missing");
    return;
  }
  if (!filePath) {
    throw new Error("file not found in indexing");
  }

  console.log(await fs.readFile(filePath));
  const loader = new PDFLoader(filePath);
  console.log("loader", loader);
  const docs = await loader.load();
  if (docs.length === 0) {
    throw new Error("There is an error in loading docs");
  }
  console.log("📄 Loaded PDF docs:", docs);

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333",
    collectionName: "notebook-llm-website",
  });
  console.log("success in collection", vectorStore);
}

async function CSVIndexing(filePath: string) {
  if (!process.env.OPENAI_API_KEY) {
    console.log("api key is missing");
    return;
  }
  if (!filePath) {
    throw new Error("file not found in indexing");
  }

  console.log(await fs.readFile(filePath));
  const loader = new CSVLoader(filePath);
  console.log("loader", loader);
  const docs = await loader.load();
  if (docs.length === 0) {
    throw new Error("There is an error in loading docs");
  }
  console.log("📄 Loaded PDF docs:", docs);

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333",
    collectionName: "notebook-llm-website",
  });
  console.log("success in collection", vectorStore);
}

async function DOCXIndexing(filePath: string, type: "docx" | "doc") {
  if (!process.env.OPENAI_API_KEY) {
    console.log("api key is missing");
    return;
  }
  if (!filePath) {
    throw new Error("file not found in indexing");
  }

  console.log(await fs.readFile(filePath));
  const loader = new DocxLoader(filePath, {
    type,
  });
  console.log("loader", loader);
  const docs = await loader.load();
  if (docs.length === 0) {
    throw new Error("There is an error in loading docs");
  }
  console.log("📄 Loaded PDF docs:", docs);

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333",
    collectionName: "notebook-llm-website",
  });
  console.log("success in collection", vectorStore);
}
