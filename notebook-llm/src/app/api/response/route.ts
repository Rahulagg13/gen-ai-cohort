import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai";
import { parse } from "jsonc-parser";

const client = new OpenAI({
  // apiKey: process.env.GOOGLE_API_KEY,
  // baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

function safeJSONParse(text: string) {
  try {
    let cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("safeJSONParse error:", err);
    return null;
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log({ messages });
  console.log(messages[messages.length - 1].content);
  const query = messages[messages.length - 1].content;
  // const embeddings = new GoogleGenerativeAIEmbeddings({
  //   model: "text-embedding-004",
  //   taskType: TaskType.RETRIEVAL_DOCUMENT,
  //   title: "Document title",
  //   apiKey: process.env.GOOGLE_API_KEY,
  // });
  const embeddings = new OpenAIEmbeddings({
    // apiKey: "YOUR-API-KEY", // In Node.js defaults to process.env.OPENAI_API_KEY
    // batchSize: 512, // Default value if omitted is 512. Max is 2048
    model: "text-embedding-3-large",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "notebook-llm-website",
    }
  );

  const vectorRetriver = vectorStore.asRetriever({
    k: 4,
  });

  const relvantdocs = await vectorRetriver.invoke(query);
  console.log(relvantdocs);

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `Your name is Hitesh Choudhary who help the user to resolve its query.
        you resolve those query only and only based on the file you get from the user. you have the send the page number and content as well as the summary of the context you have. If any context is in bullet or numbers point return your reply also in bullet and number points also you have to give the original content from the given context by the user.


        RULES:
        - Only response to the context user provided to you if user asked you the query which is not in the ${relvantdocs} you have to reject the user query.
        - you must have to convert the relvantdocs into the mdx format, read the relvantdocs and convert heading into heading, bullet point into bullet, paragraph by paragraph point etc and return into the originalContent
        - Convert any bullet points (•, ●, ▪, ◦, -) into Markdown lists using "- item".  
        - Preserve headings as "###" or "##" when needed.  
        - Ensure proper line breaks and spacing.  
        - Do NOT return extra commentary. Only return valid MDX text.
        - Strictly follow the JSON format
        - Use bullet points if the context is in bullet/numbered format.
        - summary and reply must be in the MDX text.
        - you have to only summary the context you have found based on query asked by user.
        - You have to give both summary and reply in above contersational style and you have strictly follow the converstaion style.
        - No text outside JSON.
        - if you have received any html convert it into mdx format.
        - originalContent must be return in mdx format if there bullet point convert it into mdx bullet points.
        - reply and originalContent must be valid MDX format:
          - Bullet points → "- item"
          - Headings → "## " or "### "
          - Paragraphs separated by \n\n
          - No extra commentary
        - Reply in this exact format:  
            {
            "summary": "short summary of retrieved context relevant to query the style of the summary mention above you to strictly follow it ",
            "reply": "full reply to the user query in MDX format",
            "originalContent": "give the actual context without changing the conversational style. format the string in MDX format so that the user can easily read it. make heading bigger if there is subheadin also add it and convert into mdx format. add page number also."
            }
        
        You have to striclty follow the above rules.
        Context: 
        ${JSON.stringify(relvantdocs)}

        Output: 
        {summary:"string", reply:"string", "originalContent":"string"}


        Example:
        
        {
          "summary": "Haan ji, to cloud services aur AWS fundamentals ke baare mein kaafi achhi jaankari context mein mili hai. Yeh topics cloud ki basic understanding se lekar advanced monitoring tak cover karte hain, jisme AWS ke major services jaise EC2, S3, Lambda, CloudWatch, etc. include hain.",
          "reply": "# Cloud Services & AWS Fundamentals\n\n- Overview of AWS Global Infrastructure\n- Detailed Overview of Elastic Compute Cloud (EC2)\n- Setting Up Your First EC2 Instance\n- In-Depth Guide to EC2 Instance Configuration\n- Exploring EC2 Options in Detail\n- Connecting to Cloud Instances\n- Security Group Handling and Management\n- Introduction to Amazon S3\n- Auto Scaling and Load Balancing\n- Understanding CloudFormation and CloudWatch\n- Exploring Simple Notification Service (SNS) and Simple Queue Service (SQS)\n- Overview of Relational Database Service (RDS) and Identity and Access Management (IAM)\n- Project-Based Learning: ECS and ECR\n- Serverless Architecture\n- Utilizing CloudWatch for Monitoring and Setting Billing Alarms\n\n## Hands-On Experience with AWS Services\n\n- AWS VPC\n- AWS Lambda\n- Amazon API Gateway\n- Amazon SNS\n\nHaan ji, cloud ke field mein yeh sari cheezein sikhni hain tabhi aap cloud engineer ya DevOps ke roles mein easily fit ho sakte hain. Shuruaat karne ke liye AWS ki ye fundamentals important hain, toh dhyan se padhna aur apply karna!",
          "originalContent": "# Week6 - Cloud Services & AWS Fundamentals (Page Number: 5)\n\n- Overview of AWS Global Infrastructure\n- Detailed Overview of Elastic Compute Cloud (EC2)\n- Setting Up Your First EC2 Instance\n- In-Depth Guide to EC2 Instance Configuration\n- Exploring EC2 Options in Detail\n- Connecting to Cloud Instances\n- Security Group Handling and Management\n- Introduction to Amazon S3\n- Auto Scaling and Load Balancing\n- Understanding CloudFormation and CloudWatch\n- Exploring Simple Notification Service (SNS) and Simple Queue Service (SQS)\n- Overview of Relational Database Service (RDS) and Identity and Access Management (IAM)\n- Project-Based Learning: ECS and ECR\n- Serverless Architecture\n- Utilizing CloudWatch for Monitoring and Setting Billing Alarms\n\n## Hands-On Experience with AWS Services\n\n- AWS VPC\n- AWS Lambda\n- Amazon API Gateway\n- Amazon SNS"
      }
        `,
      },
      ...messages,
    ],
  });

  console.log(response.choices[0].message?.content);
  let assistentContent;
  try {
    assistentContent = parse(response.choices[0].message?.content || "");
  } catch {
    assistentContent = {
      summary: null,
      reply: response.choices[0].message?.content || "",
    };
  }
  return Response.json({
    role: response.choices[0].message.role,
    content: assistentContent.reply,
    summary: assistentContent.summary,
    originalContent: assistentContent.originalContent,
    // originalFile: file,
  });
}
