import OpenAI from "openai";
import {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import { Stream } from "openai/streaming.mjs";
import { Ref } from "vue";

export const getAiResponse = (
  openAi: OpenAI,
  messages: Ref<ChatCompletionMessageParam[]>,
  streamedMessage: Ref<string>
) => {
  openAi.chat.completions
    .create({
      model: "gpt-4-turbo-preview",
      messages: messages.value,
      stream: true,
    })
    .then((response) =>
      handleOpenAiStreamResponse(response, messages, streamedMessage)
    );
};

const handleOpenAiStreamResponse = (
  response: Stream<ChatCompletionChunk>,
  messages: Ref<ChatCompletionMessageParam[]>,
  streamedMessage: Ref<string>
): any => {
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
};
