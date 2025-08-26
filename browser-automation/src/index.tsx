import "dotenv/config";
import { chromium } from "playwright";
import type { Page } from "playwright";
import * as z from "zod";
import { Agent, run, tool } from "@openai/agents";

// import { generateText } from "ai";
// import { openai } from "@ai-sdk/openai";
// import { google } from "@ai-sdk/google";
// import { aisdk } from "@openai/agents-extensions";

// const model = aisdk(openai("gpt-4.1-mini"));
// const model = aisdk(google("gemini-1.5-flash"));

const main = async (query: string) => {
  const browser = await chromium.launch({
    headless: false,
    // chromiumSandbox: true,
    env: {},
    args: ["--disable-extensions", "--disable-file-system"],
  });

  let page: Page;

  const openBrowser = tool({
    name: "open_browser",
    description: "Open a new browser",
    parameters: z.object({}),
    async execute() {
      page = await browser.newPage();
      return "done";
    },
  });

  const openURL = tool({
    name: "open_url",
    description: "go to the url",
    parameters: z.object({
      url: z.string(),
    }),
    async execute({ url }) {
      await page.goto(url);
      return "done";
    },
  });

  // const clickOnScreen = tool({
  //   name: "click_screen",
  //   description: "Clicks on the screen with specified co-ordinates",
  //   parameters: z.object({
  //     x: z.number().describe("x axis on the screen where we need to click"),
  //     y: z.number().describe("Y axis on the screen where we need to click"),
  //   }),
  //   async execute(input) {
  //     return await page.mouse.click(input.x, input.y);
  //   },
  // });

  const scroll = tool({
    name: "scroll",
    description: "Scrolls the screen",
    parameters: z.object({
      x: z.number().describe("x axis on the screen where we need to scroll"),
      y: z.number().describe("Y axis on the screen where we need to scroll"),
    }),
    async execute(input) {
      console.log(input);
      await page.mouse.wheel(input.x, input.y);
      return "done";
    },
  });

  const takeScreenshot = tool({
    name: "take_screenshot",
    description: "Takes a screenshot of the screen",
    parameters: z.object({}),
    async execute() {
      const screenshotBytes = await page.screenshot({
        fullPage: false,
        quality: 50,
      });
      return {
        type: "image",
        image: Buffer.from(screenshotBytes).toString("base64"),
      };
    },
  });
  const closeBrowser = tool({
    name: "close_browser",
    description: "Closes the browser",
    parameters: z.object({}),
    async execute() {
      await browser.close();
      return "done";
    },
  });

  const websiteAutomationAgent = new Agent({
    name: "WebSite Automation Agent",
    instructions: `
        You are an expert website automation agent that helps users interact with web pages.
        Your role is to help users navigate and interact with web pages.

        Rules:
        - ALWAYS start by calling 'open_browser' to initialize a new browser tab
        - ALWAYS take a screenshot after each significant action to see the current state
        - When scrolling, scroll gradually and take screenshots to track progress
        - ALWAYS close the browser when the task is complete using 'close_browser'
        - If an action fails, try alternative approaches or ask for clarification
        - Describe what you see in screenshots to help the user understand progress
        - Be methodical: plan → execute → verify → continue
      `,

    tools: [openBrowser, openURL, scroll, takeScreenshot, closeBrowser],
    model: "gpt-4o-mini",
  });

  const result = await run(websiteAutomationAgent, query);
  console.log(result);
};
main(
  "open browser and search for https://ui.chaicode.com/ and go to login form in auth section"
);
