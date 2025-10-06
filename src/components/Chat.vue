<script setup lang="ts">
import { onMounted, ref } from "vue";
import OpenAI from "openai";
import ChatInput from "./ChatInput.vue";
import ChatContent from "./ChatContent.vue";
import ChatConversations from "./ChatConversations.vue";
import GenerateImage from "./GenerateImage.vue";
import GeneratedImageDisplay from "./GeneratedImageDisplay.vue";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getAiResponse } from "../utils/openai-api";
import { NSpin } from "naive-ui";
import { getGeneratedImage } from "../utils/openai-api";
import { getConversations, removeAllMessages, removeMessages, saveMessages } from "../utils/utils";
import { ChatModelType, Conversation } from "../types";
import Thinking from "./Thinking.vue";

const props = defineProps<{
  apiKey: string;
}>();

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: props.apiKey,
});

const messages = ref<ChatCompletionMessageParam[]>([]);
const streamedMessage = ref<string>("");
const messageLoading = ref<boolean>(false);

const conversations = ref<Conversation[]>([]);

const generatedImageSelected = ref<boolean>(false);
const generatedImage = ref<string | null>(null);
const generatedImageLoading = ref<boolean>(false);

const chatModel = ref<ChatModelType>("gpt-4o");

onMounted(() => {
  loadConversations();
  delListener();
});

const delListener = () => {
  window.addEventListener("keydown", function (event) {
    if (event.code === "Delete") {
      if (messages.value.length > 0) {
        remove();
      }
    }
  });
};

const loadConversations = () => {
  const storeageConversations: Conversation[] = getConversations();

  if (storeageConversations.length > 0) {
    conversations.value = storeageConversations;
  }
};

const question = (question: string, imageb64?: string) => {
  messages.value = [...messages.value, { role: "user", content: question }];
  if (imageb64) {
    messages.value.push({
      role: "user",
      content: [{ type: "image_url", image_url: { url: imageb64 } }],
    });
  }
  messageLoading.value = true;
  getAiResponse(openai, messages, streamedMessage, chatModel.value).then(() => {
    messageLoading.value = false;

    if (messages.value.length > 0) {
      saveMessages(messages.value);
      loadConversations();
    }
  });
};

const messagesSelected = (selectedMessages: ChatCompletionMessageParam[]) => {
  generatedImageSelected.value = false;
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
  loadConversations();
};

const removeall = () => {
  if (!confirm("Are you sure you want to remove all conversations?")) {
    return;
  }
  removeAllMessages();
  messages.value = [];
  conversations.value = [];
};

const generateImage = (value: string) => {
  generatedImageLoading.value = true;
  getGeneratedImage(openai, value)
    .then((response) => {
      if (!response) {
        return;
      }
      generatedImageSelected.value = true;
      generatedImage.value = response;
    })
    .finally(() => {
      generatedImageLoading.value = false;
    });
};
</script>

<template>
  <div class="wrapper">
    <ChatConversations
      @messages="messagesSelected"
      @generate="generatedImageSelected = true"
      :conversations="conversations"
      v-model:chat-model="chatModel"
    />
    <main>
      <h1>Ai page</h1>

      <ChatContent
        v-if="!generatedImageSelected"
        :messages="messages"
        :streamed-message="streamedMessage"
      />
      <Thinking :active="messageLoading" />

      <ChatInput
        v-if="!generatedImageSelected"
        @question="question"
        @remove="remove"
        @removeall="removeall"
      />
      <NSpin size="large" v-if="generatedImageLoading" />

      <GeneratedImageDisplay
        v-if="generatedImageSelected && generatedImage"
        :image="generatedImage"
      />

      <GenerateImage
        v-if="generatedImageSelected"
        @prompt="generateImage"
        :loading="generatedImageLoading"
      />
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
