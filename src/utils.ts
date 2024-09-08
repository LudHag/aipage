import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Conversation } from "./models";

export const djb2HashCode = (str: string) => {
  let hash = 5381; // Seed
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    // Bitwise shift left by 5 and add the character code
    hash = (hash << 5) + hash + char; /* hash * 33 + c */
  }
  return hash;
};

export const saveMessages = (messages: ChatCompletionMessageParam[]) => {
  const hash = djb2HashCode(messages[0].content as string);
  const conversation: Conversation = {
    id: `messages-${hash}`,
    messages,
    title: messages[0].content as string,
    date: new Date().toISOString(),
  };

  localStorage.setItem(`messages-${hash}`, JSON.stringify(conversation));
};

export const removeMessages = (messages: ChatCompletionMessageParam[]) => {
  const hash = djb2HashCode(messages[0].content as string);

  localStorage.removeItem(`messages-${hash}`);
};

export const removeAllMessages = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("messages-")) {
      localStorage.removeItem(key);
    }
  }
};

export const getMessages = (key: string): Conversation | null => {
  const conversation = localStorage.getItem(key);
  if (!conversation) {
    return null;
  }
  return JSON.parse(conversation);
};

export const getConversations = () => {
  const conversations: Conversation[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("messages-")) {
      const conversation = getMessages(key);
      if (conversation) {
        conversations.push(conversation);
      }
    }
  }
  return conversations;
};
