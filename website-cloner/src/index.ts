import "dotenv/config";
import { OpenAI } from "openai";
import axios from "axios";
import * as cheerio from "cheerio";
import { exec } from "child_process";
import fs from "fs-extra";
import { ChatCompletionMessageParam } from "openai/resources/index";
import path from "path";

async function getWeatherDetailsByCity(cityname = "") {
  const url = `https://wttr.in/${cityname.toLowerCase()}?format=%C+%t`;
  const { data } = await axios.get(url, { responseType: "text" });
  return `The current weather of ${cityname} is ${data}`;
}

const absolutePath = (baseUrl: string, relativeUrl: string) => {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return relativeUrl;
  }
};

async function downloadCSS(input: string, outputDir: string) {
  const urlObj = new URL(input);
  let fileName = urlObj.pathname ?? "style.css";
  if (!fileName.endsWith(".css")) {
    fileName += ".css";
  }

  const localPath = path.join(outputDir, "css", fileName);
  await fs.ensureDir(path.dirname(localPath));

  const response = await axios.get(input, { responseType: "stream" });

  const writer = fs.createWriteStream(localPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(`./css/${fileName}`));
    writer.on("error", reject);
  });

  console.log(fileName);
}

async function downloadJS(input: string, outputDir: string) {
  const urlObj = new URL(input);
  let fileName = urlObj.pathname ?? "index.js";
  if (!fileName.endsWith(".js")) {
    fileName += ".js";
  }

  const localPath = path.join(outputDir, "script", fileName);
  await fs.ensureDir(path.dirname(localPath));

  const response = await axios.get(input, { responseType: "stream" });

  const writer = fs.createWriteStream(localPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(`./script/${fileName}`));
    writer.on("error", reject);
  });
}

async function cloneSite() {
  const site = "https://www.piyushgarg.dev/";
  const outDir = "project1";

  await fs.ensureDir(outDir);

  const { data: html } = await axios.get(site);
  const $ = cheerio.load(html);
  const jsAssets: {
    url: string;
    originalSrc: string | undefined;
    element: any;
  }[] = [];

  const cssAssets: {
    url: string;
    originalHref: string | undefined;
    element: any;
  }[] = [];

  const imgAssests: {
    url: string;
    originalImgSrc: string | undefined;
    element: any;
    type: string;
  }[] = [];

  const preloadedAssests: {
    url: string;
    originalPreloaded: string | undefined;
    element: any;
    type: string;
  }[] = [];

  $("script[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (src) {
      jsAssets.push({
        url: absolutePath(site, src),
        originalSrc: src,
        element: el,
      });
    }
  });

  $("link[rel='stylesheet']").each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      cssAssets.push({
        url: absolutePath(site, href),
        originalHref: href,
        element: el,
      });
    }
  });

  $("img[src]").each((_, el) => {
    const src = $(el).attr("src");
    if (src) {
      imgAssests.push({
        url: absolutePath(site, src),
        originalImgSrc: src,
        element: el,
        type: "img",
      });
    }
  });

  $("link[rel='preload'][as='image']").each((_, el) => {
    const preload = $(el).attr("href");
    if (preload) {
      preloadedAssests.push({
        url: absolutePath(site, preload),
        originalPreloaded: preload,
        element: el,
        type: "preload",
      });
    }
  });

  for (let css of cssAssets) {
    const localpath = await downloadCSS(css.url, outDir);
  }
  for (let js of jsAssets) {
    const localpath = await downloadJS(js.url, outDir);
  }
  return;
}

async function executeCommand(cmd = "") {
  return new Promise((res, rej) => {
    exec(cmd, (error, data) => {
      if (error) {
        return res(`Error running command ${error}`);
      } else {
        res(data);
      }
    });
  });
}

async function getGithubUserInfoByUsername(username = "") {
  const url = `https://api.github.com/users/${username.toLowerCase()}`;
  const { data } = await axios.get(url);
  return JSON.stringify({
    login: data.login,
    id: data.id,
    name: data.name,
    location: data.location,
    twitter_username: data.twitter_username,
    public_repos: data.public_repos,
    public_gists: data.public_gists,
    user_view_type: data.user_view_type,
    followers: data.followers,
    following: data.following,
  });
}

const TOOL_MAP = {
  getWeatherDetailsByCity: getWeatherDetailsByCity,
  getGithubUserInfoByUsername: getGithubUserInfoByUsername,
  executeCommand: executeCommand,
};

const client = new OpenAI();

async function main() {
  const SYSTEM_PROMPT = `

    You are a expert software engineer Chai Cli who can create professional level website with 10+year experience which help the user to make the website in the offline. you have make the website purely on HTML, CSS, JavaScript by creating files and folder in the root directory.

    you have given additional tools which help you to gather that data of website.make a separate folder a with project name with separate files

    before giving any final output to the user you have to think multiple times.

    Available Tools:
    - getWeatherDetailsByCity(cityname: string): Returns the current weather data of the city.
    - getGithubUserInfoByUsername(username: string): Retuns the public info about the github user using github api
    - executeCommand(command: string): Takes a linux / unix command as arg and executes the command on user's machine and returns the output

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, OBSERVE and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Alway make sure to do multiple steps of thinking before giving out output.
    - For every tool call always wait for the OBSERVE which contains the output from tool
    - you have to make output by creating a files and folder of the project in the root directory by running the command.


    Output JSON Format:
    { "step": "START | THINK | OUTPUT | OBSERVE | TOOL" , "content": "string", "tool_name": "string", "input": "STRING" }

    Example:

    User: Hey, can you clone the https://www.rahulaggarwal.in/?
    ASSISTANT: { "step": "START", "content": "The user wants me to clone the https://www.rahulaggarwal.in/ website." } 
    ASSISTANT: { "step": "THINK", "content": "Let me see if there is any available tool for this query" } 
    ASSISTANT: { "step": "THINK", "content": "I see that there is a tool available getSitedata which returns current data of the website" } 
    ASSISTANT: { "step": "THINK", "content": "I need to call getSitedata for the website dara" }
    ASSISTANT: { "step": "TOOL", "input": "https://www.rahulaggarwal.in/", "tool_name": "getSitedata" }
    DEVELOPER: { "step": "OBSERVE", "content": "Your site data is here :-" }
    ASSISTANT: { "step": "THINK", "content": "Great, I Got the data of https://www.rahulaggarwal.in/" }
    ASSISTANT: { "step": "THINK", "content": "Please wait a while i am building your website" }
    ASSISTANT: { "step": "OUTPUT", "content": "Ahh.. finally made your which is very complex. now enjoy your website give some time to rest 😂😂😂" }

    User: Hey, please make a todo application?
    ASSISTANT: { "step": "START", "content": "The user wants me to create a todo application" } 
    ASSISTANT: { "step": "THINK", "content": "Let me see if there is any available tool for this query" } 
    ASSISTANT: { "step": "THINK", "content": "I see that there is a tool available executeCommand which help me to create folder" } 
    ASSISTANT: { "step": "THINK", "content": "I need to call executeCommand to run command to make todo application" }
    ASSISTANT: { "step": "TOOL", "input": "todo application", "tool_name": "executeCommand" }
    DEVELOPER: { "step": "OBSERVE", "content": "i have created the todo_app folder" }
    ASSISTANT: { "step": "TOOL", "input": "todo application", "tool_name": "executeCommand" }
    DEVELOPER: { "step": "OBSERVE", "content": "i have created the index.html file" }
    ASSISTANT: { "step": "THINK", "content": "Great, I got the index.html file" }
    ASSISTANT: { "step": "THINK", "content": "Please wait a while i am writing the code in the index.html" }
    ASSISTANT: { "step": "THINK", "content": "now i creating style.css file" }
    ASSISTANT: { "step": "TOOL", "input": "todo application", "tool_name": "executeCommand" }
    DEVELOPER: { "step": "OBSERVE", "content": "i have created the style.css file" }
    ASSISTANT: { "step": "THINK", "content": "Great, I got the the style.css  file" }
    ASSISTANT: { "step": "THINK", "content": "Please wait a while i am writing the code in the the style.css " }
    ASSISTANT: { "step": "THINK", "content": "now i creating index.js file" }
    ASSISTANT: { "step": "TOOL", "input": "todo application", "tool_name": "executeCommand" }
    DEVELOPER: { "step": "OBSERVE", "content": "i have created the index.js file" }
    ASSISTANT: { "step": "THINK", "content": "Great, I got the the index.js  file" }
    ASSISTANT: { "step": "THINK", "content": "Please wait a while i am writing the code in the the index.js " }
    ASSISTANT: { "step": "OUTPUT", "content": "Ahh.. finally made your which is very complex. now enjoy your website give some time to rest 😂😂😂" }
  `;

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: "Plz make cricket game",
    },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages,
    });

    const rawContent = response.choices[0].message.content;
    const parsedContent = JSON.parse(rawContent as string);

    messages.push({
      role: "assistant",
      content: JSON.stringify(parsedContent),
    });

    if (parsedContent.step === "START") {
      console.log(`🔥`, parsedContent.content);
      continue;
    }

    if (parsedContent.step === "THINK") {
      console.log(`\t🧠`, parsedContent.content);
      continue;
    }

    if (parsedContent.step === "TOOL") {
      const toolToCall = parsedContent.tool_name as keyof typeof TOOL_MAP;
      if (!TOOL_MAP[toolToCall]) {
        messages.push({
          role: "developer",
          content: `There is no such tool as ${toolToCall}`,
        });
        continue;
      }

      const responseFromTool = await TOOL_MAP[toolToCall](parsedContent.input);
      console.log(
        `🛠️: ${toolToCall}(${parsedContent.input}) = `,
        responseFromTool
      );
      messages.push({
        role: "developer",
        content: JSON.stringify({ step: "OBSERVE", content: responseFromTool }),
      });
      continue;
    }

    if (parsedContent.step === "OUTPUT") {
      console.log(`🤖`, parsedContent.content);
      break;
    }
  }

  console.log("Done...");
}

// main();

cloneSite();
