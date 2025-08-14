import { Tiktoken } from "js-tiktoken/lite";
import o200k_base from "js-tiktoken/ranks/o200k_base";

const enc = new Tiktoken(o200k_base);

export function encode(text: string) {
  return enc.encode(text);
}

export function decode(tokens: number[]) {
  return enc.decode(tokens);
}

export function countTokens(text: string) {
  return encode(text).length;
}
