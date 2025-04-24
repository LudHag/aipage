<script setup lang="ts">
import { computed } from "vue";

import { Conversation, GeneratedImageCall } from "./models";
import { getMessages } from "./utils";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const props = defineProps<{
  conversations: Conversation[];
  images: GeneratedImageCall[];
}>();

const emit = defineEmits<{
  (e: "messages", messages: ChatCompletionMessageParam[]): void;
  (e: "generate", image: "new" | string): void;
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

    <h2>Generated images</h2>
    <a @click.prevent="emit('generate', 'new')">New</a>
    <a
      v-for="image in images"
      :key="image.prompt"
      @click.prevent="() => emit('generate', image.prompt)"
    >
      {{ image.prompt }}
    </a>
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
