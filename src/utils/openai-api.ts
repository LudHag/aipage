import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type {
  EasyInputMessage,
  ResponseInput,
  ResponseInputMessageContentList,
  ResponseStreamEvent,
} from "openai/resources/responses/responses.mjs";
import { Ref } from "vue";

export type ChatMode = "simple" | "agentic";

const MARKDOWN_INSTRUCTIONS =
  "Always format response as markdown, with code blocks using syntax highlighting with appropriate language tags (e.g., ```javascript, ```python, etc.).";

export const getGeneratedImage = async (
  openAi: OpenAI,
  prompt: string
): Promise<string | undefined> => {
  const generatedImage = await openAi.images.generate({
    prompt,
    model: "gpt-image-1.5",
    size: "1024x1024",
    output_format: "webp",
    quality: "medium",
  });

  const images = generatedImage.data;
  if (!images || images.length === 0) {
    return undefined;
  }

  const image = images[0];

  return image.b64_json;
};

const toResponseInput = (messages: ChatCompletionMessageParam[]): ResponseInput => {
  const input: EasyInputMessage[] = [];

  for (const message of messages) {
    if (message.role === "system") {
      continue;
    }

    if (message.role === "assistant") {
      if (typeof message.content === "string" && message.content.length > 0) {
        input.push({ role: "assistant", content: message.content });
      }
      continue;
    }

    if (message.role !== "user") {
      continue;
    }

    if (typeof message.content === "string") {
      if (message.content.length > 0) {
        input.push({ role: "user", content: message.content });
      }
      continue;
    }

    if (Array.isArray(message.content)) {
      const parts: ResponseInputMessageContentList = [];

      for (const part of message.content) {
        if (part.type === "text" && part.text) {
          parts.push({ type: "input_text", text: part.text });
        } else if (part.type === "image_url") {
          parts.push({
            type: "input_image",
            image_url: part.image_url.url,
            detail: "auto",
          });
        }
      }

      if (parts.length > 0) {
        input.push({ role: "user", content: parts });
      }
    }
  }

  return input;
};

const appendAssistantMessage = (
  messages: Ref<ChatCompletionMessageParam[]>,
  content: string
) => {
  if (!content) {
    return;
  }
  messages.value = [...messages.value, { role: "assistant", content }];
};

const handleStreamEvent = (
  event: ResponseStreamEvent,
  streamedMessage: Ref<string>,
  toolStatus: Ref<string>
) => {
  switch (event.type) {
    case "response.output_text.delta":
      toolStatus.value = "";
      streamedMessage.value += event.delta;
      break;
    case "response.web_search_call.in_progress":
    case "response.web_search_call.searching":
      toolStatus.value = "Searching the web";
      break;
    case "response.code_interpreter_call.in_progress":
    case "response.code_interpreter_call.interpreting":
      toolStatus.value = "Running code";
      break;
    default:
      break;
  }
};

const messagesWithSystem = (
  messages: ChatCompletionMessageParam[]
): ChatCompletionMessageParam[] => {
  if (messages.some((msg) => msg.role === "system")) {
    return messages;
  }
  return [
    { role: "system", content: MARKDOWN_INSTRUCTIONS },
    ...messages,
  ];
};

export const getSimpleChatResponse = async (
  openAi: OpenAI,
  messages: Ref<ChatCompletionMessageParam[]>,
  streamedMessage: Ref<string>
): Promise<void> => {
  streamedMessage.value = "";

  try {
    const stream = await openAi.chat.completions.create({
      model: "gpt-5.4",
      messages: messagesWithSystem(messages.value),
      stream: true,
    });

    for await (const chunk of stream) {
      const textChange = chunk.choices[0]?.delta?.content;
      if (textChange) {
        streamedMessage.value += textChange;
      }
    }

    appendAssistantMessage(messages, streamedMessage.value);
    streamedMessage.value = "";
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    appendAssistantMessage(
      messages,
      streamedMessage.value || `Something went wrong: ${message}`
    );
    streamedMessage.value = "";
  }
};

export const getAgenticResponse = async (
  openAi: OpenAI,
  messages: Ref<ChatCompletionMessageParam[]>,
  streamedMessage: Ref<string>,
  toolStatus: Ref<string>
): Promise<void> => {
  streamedMessage.value = "";
  toolStatus.value = "";

  try {
    const stream = await openAi.responses.create({
      model: "gpt-5.4",
      instructions: MARKDOWN_INSTRUCTIONS,
      input: toResponseInput(messages.value),
      tools: [
        { type: "web_search" },
        { type: "code_interpreter", container: { type: "auto" } },
      ],
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "error") {
        appendAssistantMessage(
          messages,
          streamedMessage.value ||
            `Something went wrong: ${event.message}`
        );
        streamedMessage.value = "";
        return;
      }

      if (event.type === "response.failed") {
        appendAssistantMessage(
          messages,
          streamedMessage.value ||
            "The response failed. Please try again."
        );
        streamedMessage.value = "";
        return;
      }

      if (event.type === "response.completed") {
        appendAssistantMessage(messages, streamedMessage.value);
        streamedMessage.value = "";
        return;
      }

      handleStreamEvent(event, streamedMessage, toolStatus);
    }

    if (streamedMessage.value) {
      appendAssistantMessage(messages, streamedMessage.value);
      streamedMessage.value = "";
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    appendAssistantMessage(
      messages,
      streamedMessage.value || `Something went wrong: ${message}`
    );
    streamedMessage.value = "";
  } finally {
    toolStatus.value = "";
  }
};

export const getAiResponse = async (
  openAi: OpenAI,
  messages: Ref<ChatCompletionMessageParam[]>,
  streamedMessage: Ref<string>,
  toolStatus: Ref<string>,
  mode: ChatMode
): Promise<void> => {
  if (mode === "agentic") {
    await getAgenticResponse(openAi, messages, streamedMessage, toolStatus);
    return;
  }
  await getSimpleChatResponse(openAi, messages, streamedMessage);
};
