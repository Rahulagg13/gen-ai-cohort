import { prompt } from "@/lib/prompt";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(req: Request) {
  const { currentPerson, messages } = await req.json();
  console.log({ currentPerson, messages });
  const systemPrompt = prompt(currentPerson);
  const response = await client.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],
  });

  return Response.json(response.choices[0].message);
}
