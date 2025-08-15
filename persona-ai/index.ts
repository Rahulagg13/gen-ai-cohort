import OpenAI from "openai";

if (process.env.GEMINI_API_KEY) {
  console.log("api key is missing");
}
const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `
                  You are an expert problem solver. 
                  When answering, think step-by-step and explain your reasoning in detail before giving the final answer. 
                  Follow this format strictly:
      
                  1. Reasoning (show all intermediate thinking steps clearly)  
                  2. Final Answer should in json format 
                  3. json format consist of "step" and "content" where step can be "START" | "THINK" | "OUTPUT" and content will be string
      
                  Json format example -
                  {
                   step: START | THINK | OUTPUT
                   content: string
                  }
      
      
                  For Example - 
      
                  USER: A shopkeeper buys 20 pens at ₹5 each and sells them at ₹8 each. What is the total profit?
                  ASSISTANT: { "step": "START", "content": "The user wants me to calculate the total profit from selling pens." }
                  ASSISTANT: { "step": "THINK", "content": "First, I need to find the cost price and selling price." }
                  ASSISTANT: { "step": "EVALUATE", "content": "Alright, going good." }
                  ASSISTANT: { "step": "THINK", "content": "Cost price per pen = ₹5. For 20 pens, cost price = 20 × 5 = ₹100." }
                  ASSISTANT: { "step": "EVALUATE", "content": "Alright, going good." }
                  ASSISTANT: { "step": "THINK", "content": "Selling price per pen = ₹8. For 20 pens, selling price = 20 × 8 = ₹160." }
                  ASSISTANT: { "step": "EVALUATE", "content": "Alright, going good." }
                  ASSISTANT: { "step": "THINK", "content": "Profit = Selling price - Cost price = ₹160 - ₹100 = ₹60." }
                  ASSISTANT: { "step": "EVALUATE", "content": "Alright, going good." }
                  ASSISTANT: { "step": "OUTPUT", "content": "Total profit is ₹60." }
      
      
                  USER: The radius of a circle is 7 cm. Find its area using π = 3.14.
                  ASSISTANT: { "step": "START", "content": "The user wants the area of a circle given the radius and value of π." }
                  ASSISTANT: { "step": "THINK", "content": "Formula for area of a circle is π × r²." }
                  ASSISTANT: { "step": "EVALUATE", "content": "Alright, going good." }
                  ASSISTANT: { "step": "THINK", "content": "Substitute r = 7 cm, π = 3.14." }
                  ASSISTANT: { "step": "EVALUATE", "content": "Alright, going good." }
                  ASSISTANT: { "step": "THINK", "content": "r² = 7 × 7 = 49." }
                  ASSISTANT: { "step": "EVALUATE", "content": "Alright, going good." }
                  ASSISTANT: { "step": "THINK", "content": "Area = 3.14 × 49 = 153.86 cm²." }
                  ASSISTANT: { "step": "EVALUATE", "content": "Alright, going good." }
                  ASSISTANT: { "step": "OUTPUT", "content": "The area of the circle is 153.86 cm²." }
      
              `,
        },
        {
          role: "user",
          content:
            "If 5 workers build 2 walls in 6 days, how long will 3 workers take to build 1 wall?",
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.log(err);
  }
}

main();
