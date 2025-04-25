<script setup lang="ts">
import { computed } from "vue";

import { Conversation } from "./models";
import { getMessages } from "./utils";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const props = defineProps<{
  conversations: Conversation[];
}>();

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
  props.conversations.toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
);
</script>

<template>
  <aside>
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
</style>
