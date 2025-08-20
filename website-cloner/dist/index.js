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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const openai_1 = require("openai");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const child_process_1 = require("child_process");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function getWeatherDetailsByCity() {
    return __awaiter(this, arguments, void 0, function* (cityname = "") {
        const url = `https://wttr.in/${cityname.toLowerCase()}?format=%C+%t`;
        const { data } = yield axios_1.default.get(url, { responseType: "text" });
        return `The current weather of ${cityname} is ${data}`;
    });
}
const absolutePath = (baseUrl, relativeUrl) => {
    try {
        return new URL(relativeUrl, baseUrl).href;
    }
    catch (_a) {
        return relativeUrl;
    }
};
function downloadCSS(input, outputDir) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const urlObj = new URL(input);
        let fileName = (_a = urlObj.pathname) !== null && _a !== void 0 ? _a : "style.css";
        if (!fileName.endsWith(".css")) {
            fileName += ".css";
        }
        const localPath = path_1.default.join(outputDir, "css", fileName);
        yield fs_extra_1.default.ensureDir(path_1.default.dirname(localPath));
        const response = yield axios_1.default.get(input, { responseType: "stream" });
        const writer = fs_extra_1.default.createWriteStream(localPath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(`./css/${fileName}`));
            writer.on("error", reject);
        });
        console.log(fileName);
    });
}
function downloadJS(input, outputDir) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const urlObj = new URL(input);
        let fileName = (_a = urlObj.pathname) !== null && _a !== void 0 ? _a : "index.js";
        if (!fileName.endsWith(".js")) {
            fileName += ".js";
        }
        const localPath = path_1.default.join(outputDir, "script", fileName);
        yield fs_extra_1.default.ensureDir(path_1.default.dirname(localPath));
        const response = yield axios_1.default.get(input, { responseType: "stream" });
        const writer = fs_extra_1.default.createWriteStream(localPath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(`./script/${fileName}`));
            writer.on("error", reject);
        });
        console.log(fileName);
    });
}
function cloneSite() {
    return __awaiter(this, void 0, void 0, function* () {
        const site = "https://www.piyushgarg.dev/";
        const outDir = "project1";
        yield fs_extra_1.default.ensureDir(outDir);
        const { data: html } = yield axios_1.default.get(site);
        const $ = cheerio.load(html);
        const jsAssets = [];
        const cssAssets = [];
        const imgAssests = [];
        const preloadedAssests = [];
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
            const localpath = yield downloadCSS(css.url, outDir);
        }
        for (let js of jsAssets) {
            const localpath = yield downloadJS(js.url, outDir);
        }
        return;
    });
}
function executeCommand() {
    return __awaiter(this, arguments, void 0, function* (cmd = "") {
        return new Promise((res, rej) => {
            (0, child_process_1.exec)(cmd, (error, data) => {
                if (error) {
                    return res(`Error running command ${error}`);
                }
                else {
                    res(data);
                }
            });
        });
    });
}
function getGithubUserInfoByUsername() {
    return __awaiter(this, arguments, void 0, function* (username = "") {
        const url = `https://api.github.com/users/${username.toLowerCase()}`;
        const { data } = yield axios_1.default.get(url);
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
    });
}
const TOOL_MAP = {
    getWeatherDetailsByCity: getWeatherDetailsByCity,
    getGithubUserInfoByUsername: getGithubUserInfoByUsername,
    executeCommand: executeCommand,
};
const client = new openai_1.OpenAI();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
        const messages = [
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
            const response = yield client.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: messages,
            });
            const rawContent = response.choices[0].message.content;
            const parsedContent = JSON.parse(rawContent);
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
                const toolToCall = parsedContent.tool_name;
                if (!TOOL_MAP[toolToCall]) {
                    messages.push({
                        role: "developer",
                        content: `There is no such tool as ${toolToCall}`,
                    });
                    continue;
                }
                const responseFromTool = yield TOOL_MAP[toolToCall](parsedContent.input);
                console.log(`🛠️: ${toolToCall}(${parsedContent.input}) = `, responseFromTool);
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
    });
}
// main();
cloneSite();
