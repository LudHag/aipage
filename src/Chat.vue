<script setup lang="ts">
import { ref } from "vue";
import OpenAI from "openai";
import ChatInput from "./ChatInput.vue";
import ChatContent from "./ChatContent.vue";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getAiResponse } from "./openai-api";
import { saveMessages } from "./utils";

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
  getAiResponse(openai, messages, streamedMessage).then(() => {
    if (messages.value.length > 0) {
      saveMessages(messages.value);
    }
  });
};
</script>

<template>
  <div class="wrapper">
    <aside>
      <h2>Conversations</h2>
    </aside>
    <main>
      <h1>Ai page</h1>
      <ChatContent :messages="messages" :streamed-message="streamedMessage" />
      <ChatInput @question="click" />
    </main>
  </div>
</template>

<style scoped>
main {
  display: flex;
  align-items: center;
  margin: auto;
  flex-direction: column;
}
.wrapper {
  display: flex;
}
</style>
