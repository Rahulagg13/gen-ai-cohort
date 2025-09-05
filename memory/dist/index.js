"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const oss_1 = require("mem0ai/oss");
const openai_1 = require("openai");
const client = new openai_1.OpenAI();
const memory = new oss_1.Memory({
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
function main(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield memory.search(query, {
            userId: "rahul",
        });
        const memories = result.results.map((e) => e.memory).join("");
        const SYSTEM_PROMPT = `
    - you are as user's personal assistant you have to resolve the user query according to the      context you have.
    - context available ${memories}

  `;
        const response = yield client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: query },
            ],
        });
        console.log(`\n\n\nBot:`, response.choices[0].message.content);
        console.log("Adding to memory...");
        yield memory.add([
            {
                role: "user",
                content: query,
            },
            {
                role: "assistant",
                content: response.choices[0].message.content,
            },
        ], { userId: "rahul" } // DB
        );
        console.log("Adding to memory done...");
    });
}
main("what is my name");
