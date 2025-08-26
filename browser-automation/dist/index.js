"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const playwright_1 = require("playwright");
const z = __importStar(require("zod"));
const agents_1 = require("@openai/agents");
// import { generateText } from "ai";
// import { openai } from "@ai-sdk/openai";
// import { google } from "@ai-sdk/google";
// import { aisdk } from "@openai/agents-extensions";
// const model = aisdk(openai("gpt-4.1-mini"));
// const model = aisdk(google("gemini-1.5-flash"));
const main = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield playwright_1.chromium.launch({
        headless: false,
        // chromiumSandbox: true,
        env: {},
        args: ["--disable-extensions", "--disable-file-system"],
    });
    let page;
    const openBrowser = (0, agents_1.tool)({
        name: "open_browser",
        description: "Open a new browser",
        parameters: z.object({}),
        execute() {
            return __awaiter(this, void 0, void 0, function* () {
                page = yield browser.newPage();
                return "done";
            });
        },
    });
    const openURL = (0, agents_1.tool)({
        name: "open_url",
        description: "go to the url",
        parameters: z.object({
            url: z.string(),
        }),
        execute(_a) {
            return __awaiter(this, arguments, void 0, function* ({ url }) {
                yield page.goto(url);
                return "done";
            });
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
    const scroll = (0, agents_1.tool)({
        name: "scroll",
        description: "Scrolls the screen",
        parameters: z.object({
            x: z.number().describe("x axis on the screen where we need to scroll"),
            y: z.number().describe("Y axis on the screen where we need to scroll"),
        }),
        execute(input) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(input);
                yield page.mouse.wheel(input.x, input.y);
                return "done";
            });
        },
    });
    const takeScreenshot = (0, agents_1.tool)({
        name: "take_screenshot",
        description: "Takes a screenshot of the screen",
        parameters: z.object({}),
        execute() {
            return __awaiter(this, void 0, void 0, function* () {
                const screenshotBytes = yield page.screenshot({
                    fullPage: false,
                    quality: 50,
                });
                return {
                    type: "image",
                    image: Buffer.from(screenshotBytes).toString("base64"),
                };
            });
        },
    });
    const closeBrowser = (0, agents_1.tool)({
        name: "close_browser",
        description: "Closes the browser",
        parameters: z.object({}),
        execute() {
            return __awaiter(this, void 0, void 0, function* () {
                yield browser.close();
                return "done";
            });
        },
    });
    const websiteAutomationAgent = new agents_1.Agent({
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
    const result = yield (0, agents_1.run)(websiteAutomationAgent, query);
    console.log(result);
});
main("open browser and search for https://ui.chaicode.com/ and go to login form in auth section");
