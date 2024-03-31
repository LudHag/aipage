<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { Conversation } from "./models";
import { getConversations, getMessages } from "./utils";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const emit = defineEmits<{
  (e: "messages", messages: ChatCompletionMessageParam[]): void;
}>();

const conversations = ref<Conversation[]>([]);

onMounted(() => {
  const storeageConversations: Conversation[] = getConversations();

  if (storeageConversations.length > 0) {
    conversations.value = storeageConversations;
  }
});

const click = (conversation: Conversation) => {
  const loadedConversation = getMessages(conversation.id);
  if (loadedConversation) {
    emit("messages", loadedConversation.messages);
  }
};
const sortedConversations = computed(() =>
  conversations.value.sort(
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
  </aside>
</template>

<style scoped>
aside {
  text-align: left;
  width: 300px;
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
