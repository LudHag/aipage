import OpenAI from "openai";
import { ChatCompletionChunk, ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { Stream } from "openai/streaming.mjs";
import { Ref } from "vue";
import { ChatModelType } from "../types";

export const getGeneratedImage = async (
  openAi: OpenAI,
  prompt: string
): Promise<string | undefined> => {
  const generatedImage = await openAi.images.generate({
    prompt,
    model: "gpt-image-1",
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

export const getAiResponse = (
  openAi: OpenAI,
  messages: Ref<ChatCompletionMessageParam[]>,
  streamedMessage: Ref<string>,
  chatModel: ChatModelType
): Promise<void> => {
  return new Promise((resolve) => {
    let messagesToSend = [...messages.value];

    if (chatModel === "gpt-5") {
      messagesToSend = [
        ...messages.value,
        {
          role: "system",
          content:
            "Always format response as markdown, with code blocks using syntax highlighting with appropriate language tags (e.g., ```javascript, ```python, etc.).",
        },
        ...messagesToSend,
      ];
    }

    openAi.chat.completions
      .create({
        model: chatModel,
        messages: messagesToSend,
        stream: true,
      })
      .then((response) =>
        handleOpenAiStreamResponse(response, messages, streamedMessage).then(() => resolve())
      );
  });
};

const handleOpenAiStreamResponse = (
  response: Stream<ChatCompletionChunk>,
  messages: Ref<ChatCompletionMessageParam[]>,
  streamedMessage: Ref<string>
): Promise<void> => {
  return new Promise((resolve) => {
    const stream = response.toReadableStream();
    const reader = stream.getReader();

    const readStream = () => {
      reader.read().then(({ value, done }) => {
        if (done) {
          messages.value = [
            ...messages.value,
            { role: "assistant", content: streamedMessage.value },
          ];
          streamedMessage.value = "";
          resolve();
          return;
        }
        const decoder = new TextDecoder("utf-8");
        const decodedString = decoder.decode(value);
        const responseObject = JSON.parse(decodedString) as ChatCompletionChunk;

        const textChange = responseObject.choices[0].delta.content;
        if (textChange) {
          streamedMessage.value += textChange;
        }

        readStream();
      });
    };

    readStream();
  });
};
