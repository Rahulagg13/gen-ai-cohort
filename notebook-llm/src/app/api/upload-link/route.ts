import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function POST(req: Request) {
  try {
    const { link } = await req.json();

    await indexing(link);

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

async function indexing(link: string) {
  if (!process.env.OPENAI_API_KEY) {
    console.log("api key is missing");
    return;
  }
  if (!link) {
    throw new Error("link not found in indexing");
  }
  const loader = new CheerioWebBaseLoader(link);

  const docs = await loader.load();
  if (docs.length === 0) {
    throw new Error("There is an error in loading docs");
  }
  console.log("📄 Loaded website docs:", docs);

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 5000,
    chunkOverlap: 200,
  });
  const chunkedDocs: any[] = [];
  for (const doc of docs) {
    const chunks = await textSplitter.splitDocuments([doc]);
    chunks.forEach((chunk, index) => {
      const links = Array.from(
        chunk.pageContent.matchAll(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g)
      ).map((m) => m[1]);

      chunk.metadata = {
        ...chunk.metadata,
        pageNumber: index + 1,
        links,
      };
    });
    chunkedDocs.push(...chunks);
  }

  // const embeddings = new GoogleGenerativeAIEmbeddings({
  //   model: "text-embedding-004",
  //   taskType: TaskType.RETRIEVAL_DOCUMENT,
  //   title: "Document title",
  //   apiKey: process.env.GOOGLE_API_KEY,
  // });

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  const vectorStore = await QdrantVectorStore.fromDocuments(
    chunkedDocs,
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "notebook-llm-website",
    }
  );
  console.log("success in collection", vectorStore);
}
