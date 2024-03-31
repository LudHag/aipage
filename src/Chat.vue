<script setup lang="ts">
import { ref } from "vue";
import OpenAI from "openai";
import MdRenderer from "./MdRenderer.vue";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

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

// model for textcontent
const messages = ref<ChatCompletionMessageParam[]>([]);
const textInput = ref<string>("");

const click = () => {
  messages.value = [
    ...messages.value,
    { role: "user", content: textInput.value },
  ];

  openai.chat.completions
    .create({
      model: "gpt-4-turbo-preview",
      messages: messages.value,
    })
    .then((response) => {
      messages.value = [
        ...messages.value,
        ...response.choices.map((choice) => choice.message),
      ];
      textInput.value = "";
    });
};
</script>

<template>
  <div class="content">
    <div v-for="message in messages">
      <p v-if="message.content">
        <MdRenderer :source="stringFromValue(message.content)"></MdRenderer>
      </p>
    </div>
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
  padding: 20px;
}
.input-area {
  display: flex;
  justify-content: center;
  margin: 30px;
  flex-direction: column;
}
</style>
