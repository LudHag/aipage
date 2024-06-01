<script setup lang="ts">
import { ref } from "vue";
import OpenAI from "openai";
import ChatInput from "./ChatInput.vue";
import ChatContent from "./ChatContent.vue";
import ChatConversations from "./ChatConversations.vue";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getAiResponse } from "./openai-api";
import { removeMessages, saveMessages } from "./utils";

const props = defineProps<{
  apiKey: string;
}>();

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: props.apiKey,
});

const messages = ref<ChatCompletionMessageParam[]>([]);
const streamedMessage = ref<string>("");

const question = (question: string, imageb64?: string) => {
  messages.value = [...messages.value, { role: "user", content: question }];
  if (imageb64) {
    messages.value.push({
      role: "user",
      content: [{ type: "image_url", image_url: { url: imageb64 } }],
    });
  }

  getAiResponse(openai, messages, streamedMessage).then(() => {
    if (messages.value.length > 0) {
      saveMessages(messages.value);
    }
  });
};

const messagesSelected = (selectedMessages: ChatCompletionMessageParam[]) => {
  messages.value = selectedMessages;
  // Scroll down to the last message
  const content = document.querySelector(".content");
  if (content) {
    content.scrollTop = content.scrollHeight;
  }
};

const remove = () => {
  if (!confirm("Are you sure you want to remove the conversation?")) {
    return;
  }
  removeMessages(messages.value);
  messages.value = [];
  window.location.reload();
};
</script>

<template>
  <div class="wrapper">
    <ChatConversations @messages="messagesSelected" />
    <main>
      <h1>Ai page</h1>
      <ChatContent :messages="messages" :streamed-message="streamedMessage" />
      <ChatInput @question="question" @remove="remove" />
    </main>
  </div>
</template>

<style scoped>
main {
  display: flex;
  align-items: center;
  margin: auto;
  flex-direction: column;
  flex-grow: 1;
}
.wrapper {
  display: flex;
}
</style>
