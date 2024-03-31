<script setup lang="ts">
import { ref } from "vue";
import OpenAI from "openai";
import ChatInput from "./ChatInput.vue";
import ChatContent from "./ChatContent.vue";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getAiResponse } from "./openai-api";

const props = defineProps<{
  apiKey: string;
}>();

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: props.apiKey,
});

const messages = ref<ChatCompletionMessageParam[]>([]);
const streamedMessage = ref<string>("");

const click = (question: string) => {
  messages.value = [...messages.value, { role: "user", content: question }];
  getAiResponse(openai, messages, streamedMessage);
};
</script>

<template>
  <ChatContent :messages="messages" :streamed-message="streamedMessage" />
  <ChatInput @question="click" />
</template>

<style scoped></style>
