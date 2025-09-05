import "dotenv/config";

import { Memory } from "mem0ai/oss";
import { OpenAI } from "openai";

const client = new OpenAI();

const memory = new Memory({
  version: "v1.1",
  vectorStore: {
    provider: "qdrant",
    config: {
      collectionName: "memories",
      dimension: 1536,
      host: "localhost",
      port: 6333,
    },
  },
});

async function main(query: string) {
  const result = await memory.search(query, {
    userId: "rahul",
  });
  const memories = result.results.map((e) => e.memory).join("");

  const SYSTEM_PROMPT = `
    - you are as user's personal assistant you have to resolve the user query according to the      context you have.
    - context available ${memories}

  `;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
  });

  console.log(`\n\n\nBot:`, response.choices[0].message.content);
  console.log("Adding to memory...");
  await memory.add(
    [
      {
        role: "user",
        content: query,
      },
      {
        role: "assistant",
        content: response.choices[0].message.content!,
      },
    ],
    { userId: "rahul" } // DB
  );
  console.log("Adding to memory done...");
}
main("what is my name");
