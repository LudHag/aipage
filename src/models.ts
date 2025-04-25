import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export interface Conversation {
  id: string;
  date: string;
  messages: ChatCompletionMessageParam[];
  title: string;
}
