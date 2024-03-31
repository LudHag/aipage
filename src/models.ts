import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export interface Conversation {
  date: string;
  messages: ChatCompletionMessageParam[];
  title: string;
}
