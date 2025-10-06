import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export interface Conversation {
  id: string;
  date: string;
  messages: ChatCompletionMessageParam[];
  title: string;
}

export const chatModels = ["gpt-4o", "gpt-5"] as const;

export type ChatModelType = (typeof chatModels)[number];
