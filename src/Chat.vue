<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import OpenAI from "openai";
import ChatInput from "./ChatInput.vue";
import ChatContent from "./ChatContent.vue";
import ChatConversations from "./ChatConversations.vue";
import GenerateImage from "./GenerateImage.vue";
import GeneratedImageDisplay from "./GeneratedImageDisplay.vue";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getAiResponse } from "./openai-api";
import { NSpin } from "naive-ui";
import { getGeneratedImage } from "./openai-api";
import {
  getConversations,
  loadImages,
  removeAllImages,
  removeAllMessages,
  removeImage,
  removeMessages,
  saveImages,
  saveMessages,
} from "./utils";
import { Conversation, GeneratedImageCall } from "./models";

const props = defineProps<{
  apiKey: string;
}>();

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: props.apiKey,
});

const messages = ref<ChatCompletionMessageParam[]>([]);
const streamedMessage = ref<string>("");

const conversations = ref<Conversation[]>([]);

const generatedImages = ref<GeneratedImageCall[]>([]);
const generatedImageSelected = ref<string | null>(null);
const generatedImageLoading = ref<boolean>(false);

onMounted(() => {
  loadConversations();
  const images = loadImages();
  generatedImages.value = images;
  delListener();
});

const generatedImageUrl = computed(() => {
  if (generatedImageSelected.value) {
    const generatedImageUrl = generatedImages.value.find(
      (image) => image.prompt === generatedImageSelected.value
    );

    if (generatedImageUrl) {
      return generatedImageUrl.url;
    }
  }
  return null;
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

  getAiResponse(openai, messages, streamedMessage).then(() => {
    if (messages.value.length > 0) {
      saveMessages(messages.value);
      loadConversations();
    }
  });
};

const messagesSelected = (selectedMessages: ChatCompletionMessageParam[]) => {
  generatedImageSelected.value = null;
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

const removeImageCall = (url: string) => {
  generatedImageSelected.value = null;
  removeImage(url);
  const images = loadImages();
  generatedImages.value = images;
};
const removeAllImageCall = () => {
  generatedImageSelected.value = null;
  removeAllImages();
  const images = loadImages();
  generatedImages.value = images;
};

const generateImage = (value: string) => {
  generatedImageLoading.value = true;
  getGeneratedImage(openai, value, "vivid")
    .then((response) => {
      if (!response) {
        return;
      }

      generatedImages.value = [
        ...generatedImages.value,
        { prompt: value, url: response },
      ];
      saveImages(generatedImages.value);
      generatedImageSelected.value = value;
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
      @generate="generatedImageSelected = $event"
      :conversations="conversations"
      :images="generatedImages"
    />
    <main>
      <h1>Ai page</h1>

      <ChatContent
        v-if="!generatedImageSelected"
        :messages="messages"
        :streamed-message="streamedMessage"
      />
      <ChatInput
        v-if="!generatedImageSelected"
        @question="question"
        @remove="remove"
        @removeall="removeall"
      />
      <NSpin size="large" v-if="generatedImageLoading" />

      <GeneratedImageDisplay
        v-if="generatedImageUrl"
        :imageUrl="generatedImageUrl"
        @remove="removeImageCall(generatedImageUrl)"
        @removeall="removeAllImageCall()"
      />

      <GenerateImage
        v-if="generatedImageSelected === 'new' && !generatedImageLoading"
        @prompt="generateImage"
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
