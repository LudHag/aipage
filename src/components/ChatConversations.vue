<script setup lang="ts">
import { computed } from "vue";
import { NSelect } from "naive-ui";

import { chatModels, ChatModelType, Conversation } from "../types";
import { getMessages } from "../utils/utils";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const props = defineProps<{
  conversations: Conversation[];
}>();

const chatModel = defineModel<ChatModelType>("chatModel");

const emit = defineEmits<{
  (e: "messages", messages: ChatCompletionMessageParam[]): void;
  (e: "generate"): void;
}>();

const click = (conversation: Conversation) => {
  const loadedConversation = getMessages(conversation.id);
  if (loadedConversation) {
    emit("messages", loadedConversation.messages);
  }
};
const sortedConversations = computed(() =>
  props.conversations.toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
);

const chatModelOptions = chatModels.map((model) => ({
  label: model,
  value: model,
}));
</script>

<template>
  <aside>
    <NSelect class="chat-model-select" v-model:value="chatModel" :options="chatModelOptions" />
    <h2>Conversations</h2>

    <a @click.prevent="emit('messages', [])">New</a>
    <a
      v-for="conversation in sortedConversations"
      :key="conversation.date"
      @click.prevent="() => click(conversation)"
    >
      {{ conversation.title }}
    </a>

    <h2><a @click.prevent="emit('generate')">Generate images</a></h2>
  </aside>
</template>

<style scoped>
aside {
  text-align: left;
  width: 300px;
  padding-right: 10px;
}
a {
  display: block;
  cursor: pointer;
  white-space: nowrap;
  width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;
}
.chat-model-select {
  width: fit-content;
}
</style>
