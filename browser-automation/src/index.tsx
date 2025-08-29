import "dotenv/config";
import { chromium } from "playwright";
import type { Page, Browser } from "playwright";
import * as z from "zod";
import fs from "node:fs";
import {
  Agent,
  run,
  tool,
  OpenAIProvider,
  setTracingDisabled,
  setDefaultOpenAIClient,
  setOpenAIAPI,
  Runner,
} from "@openai/agents";
import OpenAI from "openai";

// const openaiClient = new OpenAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   baseURL: process.env.BASE_URL,
// });

// const modelProvider = new OpenAIProvider({ openAIClient: openaiClient });
// setDefaultOpenAIClient(openaiClient);
// setOpenAIAPI("chat_completions"); // Gemini supports chat completions API
// setTracingDisabled(true);

// import { generateText } from "ai";
// import { openai } from "@ai-sdk/openai";
// import { google } from "@ai-sdk/google";
// import { aisdk } from "@openai/agents-extensions";

// const model = aisdk(openai("gpt-4.1-mini"));
// const model = aisdk(google("gemini-1.5-flash"));
let page: Page;
let browser: Browser;

const delay = (duration: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const openBrowser = tool({
  name: "open_browser",
  description: "Open a new browser",
  parameters: z.object({}),
  async execute() {
    browser = await chromium.launch({
      headless: false,
      env: {},
      args: [
        "--start-maximized",
        "--disable-extensions",
        "--disable-file-system",
      ],
      channel: "chrome",
    });
    page = await browser.newPage({
      viewport: null,
    });
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
    if (!page) return;

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    return "done";
  },
});

const clickOnScreen = tool({
  name: "click_screen",
  description: "Clicks on the screen with specified co-ordinates",
  parameters: z.object({
    x: z.number().describe("x axis on the screen where we need to click"),
    y: z.number().describe("Y axis on the screen where we need to click"),
  }),
  async execute(input) {
    if (!page) return;

    await page.mouse.click(input.x, input.y);
    await delay();
    return "done";
  },
});

const scroll = tool({
  name: "scroll",
  description: "Scrolls the screen with specified co-ordinates",
  parameters: z.object({
    scrollX: z
      .number()
      .describe("x axis on the screen where we need to scroll"),
    scrollY: z
      .number()
      .describe("Y axis on the screen where we need to scroll"),
  }),
  async execute(input) {
    if (!page) return;
    await page.evaluate(`window.scrollBy(${input.scrollX}, ${input.scrollY})`);
    await delay();
    return "done";
  },
});
const clickElementBySelector = tool({
  name: "click_element_by_selector",
  description: "Click on an element by CSS selector",
  parameters: z.object({
    selector: z.string(),
  }),
  async execute({ selector }) {
    // console.log(selector);
    try {
      await page.waitForSelector(selector, {
        state: "visible",
        timeout: 10000,
      });
      await page.locator(selector).click();
      return "clicked";
    } catch (err) {
      return `failed: could not find ${selector}`;
    }
  },
});
const clickElementByText = tool({
  name: "click_element_by_text",
  description: "Click on an element by text content",
  parameters: z.object({
    text: z.string(),
  }),
  async execute({ text }) {
    // console.log("text", text);
    try {
      await page.waitForSelector(`type=${text}`, {
        state: "visible",
        timeout: 10000,
      });
      await page.locator(`type=${text}`).click();
      return "clicked";
    } catch (err) {
      return `failed: could not find ${`text=${text}`}`;
    }
  },
});

const takeScreenshot = tool({
  name: "take_screenshot",
  description: "Takes a screenshot of the screen",
  parameters: z.object({}),
  async execute() {
    if (!page) return;
    const screenshotBytes = await page.screenshot();
    const fileName = `step-screenshot-${Date.now()}.png`;

    fs.writeFileSync(fileName, screenshotBytes);
    return {
      type: "image",
      image: fileName,
      description: "Screenshot captured successfully",
    };
  },
});
const closeBrowser = tool({
  name: "close_browser",
  description: "Closes the browser",
  parameters: z.object({}),
  async execute() {
    if (!browser) throw new Error("No active browser found.");
    await browser.close();
    return "done";
  },
});
const keyPress = tool({
  name: "key_press",
  description: "Presses a key on the keyboard",
  parameters: z.object({
    keys: z.string(),
  }),
  async execute({ keys }) {
    if (!page) return;
    if (keys === "ENTER") {
      await page.keyboard.press("Enter");
    } else if (keys === "CTRL+F") {
      await page.keyboard.press("Control+f");
    } else if (keys === "SPACE") {
      await page.keyboard.press("Space");
    } else {
      await page.keyboard.type(keys);
    }
    return `Pressed: ${keys}`;
  },
});
const wait = tool({
  name: "wait",
  description: "Waits for a specified duration",
  parameters: z.object({}),
  async execute() {
    await page.waitForTimeout(2000);
    return "done";
  },
});
const getPageSource = tool({
  name: "get_page_source",
  description: "Returns the source code of the current page",
  parameters: z.object({}),
  async execute() {
    if (!page) return;
    return page.content();
  },
});

const fillInput = tool({
  name: "fill_input",
  description: "Fills text into an input field using a CSS selector",
  parameters: z.object({
    selector: z.string(),
    value: z.string(),
  }),
  async execute({ selector, value }) {
    if (!page) return;
    await page.waitForSelector(selector, { state: "visible", timeout: 10000 });
    await page.fill(selector, value, { timeout: 5000 });
    await delay(2000);
    return `filled ${selector} with "${value}"`;
  },
});

const main = async (query: string) => {
  const websiteAutomationAgent = new Agent({
    name: "WebSite Automation Agent",
    instructions: `
        You are an expert website automation agent that helps users interact with web pages.
        Your role is to help users navigate and interact with web pages.

        ----
        
        Available Tools:
        - open_browser: opens a new browser tab
        - open_url : goes to the url
        - scroll : Scrolls to a specific element
        - click_screen : Clicks on a specific element
        - get_page_source : Returns the source code of the current page
        - click_element_by_selector : Click on an element by CSS selector
        - click_element_by_text : Click on an element by text content
        - take_screenshot : Takes a screenshot of the screen
        - close_browser : Closes the browser
        - key_press : Presses a key on the keyboard
        - wait : Waits for a specified duration
        - fill_input: Fills text into an input field using a CSS selector

        ----

        Rules:
        - ALWAYS start by calling 'open_browser' to initialize a new browser tab
        - Always read user query after each step.
        - After opening the url, Analyze the page content by tool 'get_page_source', then take a screenshot
        - ALWAYS take a screenshot after each significant action to see the current state
        - When scrolling, scroll gradually and take screenshots to track progress
        - ALWAYS close the browser when the task is complete using 'close_browser'
        - If an action fails, try alternative approaches or ask for clarification
        - Describe what you see in screenshots to help the user understand progress
        - Be decisive - don't retry failed actions multiple times
        - Complete tasks in under 10 turns
        - Be methodical: plan → execute → verify → continue
        - before submitting any form you have to take the screenshot with the filled form
        - Always close browser when done (You have to striclty follow this rule)

        ----


        Examples:

          Example 1: Navigate to a Section
            1.open_browser
            2.Take a screenshot to see the search results
            3.open_url("https://ui.chaicode.com/")
            4.Take a screenshot to see the search results
            5.Locate and navigate to the "Admin View" section on the website
            6.Take a screenshot to see the search results
            7.Open it and confirm with a screenshot
            8.Take a screenshot to see the search results
            9.close_browser
          
          Example 2: Search and Scroll
            1.open_browser
            2.Take a screenshot to see the search results
            3.open_url("https://example.com")
            4.Take a screenshot to see the search results
            5.Use key_press("CTRL+F") to open search
            6.Type "Pricing" and hit Enter
            7.Take a screenshot to see the search results
            8.Type "Pricing" and hit Enter
            9.Take a screenshot to see the search results
            10.scroll gradually until the "Pricing" section is fully visible
            11.Take a screenshot for confirmation
            12.close_browser
        
            Now you have to carefully follow the instructions and execute the commands provided.
      `,

    tools: [
      openBrowser,
      openURL,
      scroll,
      takeScreenshot,
      closeBrowser,
      clickOnScreen,
      wait,
      keyPress,
      fillInput,
      clickElementBySelector,
      clickElementByText,
      getPageSource,
    ],
    // model: "gemini-2.5-flash",
    model: "gpt-4o-mini",
  });

  // const runner = new Runner({ modelProvider });
  // const result = await runner.run(websiteAutomationAgent, query, {
  //   maxTurns: 30,
  // });
  const result = await run(websiteAutomationAgent, query, {
    maxTurns: 30,
  });
  console.log(result.history);
};

main(
  `
    1.Go to https://ui.chaicode.com.
    2.Go to the Authentication section.
    3. click on the "Login" section
    4.Fill the form with:
    - Email: rahulaggarwal@123456.com
    - Password: Test@12345
    Then click the "Sign in" button.
`
);
