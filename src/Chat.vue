<script setup lang="ts">
import { ref } from "vue";
import OpenAI from "openai";
import MdRenderer from "./MdRenderer.vue";
import {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";

const props = defineProps<{
  apiKey: string;
}>();

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: props.apiKey,
});

type ContentType = ChatCompletionMessageParam["content"];

const stringFromValue = (content: ContentType): string => {
  if (typeof content === "string") return content;
  return "";
};

const messages = ref<ChatCompletionMessageParam[]>([]);
const textInput = ref<string>("");
const streamedMessage = ref<string>("");

const click = () => {
  messages.value = [
    ...messages.value,
    { role: "user", content: textInput.value },
  ];

  openai.chat.completions
    .create({
      model: "gpt-4-turbo-preview",
      messages: messages.value,
      stream: true,
    })
    .then((response) => {
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
          const responseObject = JSON.parse(
            decodedString
          ) as ChatCompletionChunk;

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
</script>

<template>
  <div class="content">
    <template v-for="message in messages">
      <p
        v-if="message.content"
        :class="{ assistant: message.role === 'assistant' }"
      >
        <MdRenderer :source="stringFromValue(message.content)"></MdRenderer>
      </p>
      <p v-if="streamedMessage" class="assistant">
        <MdRenderer :source="streamedMessage"></MdRenderer>
      </p>
    </template>
  </div>
  <form class="input-area">
    <textarea v-model="textInput"></textarea>
    <button type="submit" @click.prevent="click">Skicka</button>
  </form>
</template>

<style scoped>
.content {
  background: rgb(233, 228, 228);
  margin: 30px;
  text-align: left;
  padding: 20px 0;
}
.content > p {
  padding: 0 20px;
}
.input-area {
  display: flex;
  justify-content: center;
  margin: 30px;
  flex-direction: column;
}
.assistant {
  background-color: aliceblue;
}
</style>
