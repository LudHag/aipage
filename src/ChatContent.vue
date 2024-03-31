<script setup lang="ts">
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import MdRenderer from "./MdRenderer.vue";

defineProps<{
  messages: ChatCompletionMessageParam[];
  streamedMessage: string;
}>();

type ContentType = ChatCompletionMessageParam["content"];

const stringFromValue = (content: ContentType): string => {
  if (typeof content === "string") return content;
  return "";
};
</script>

<template>
  <div class="content">
    <template v-for="message in messages">
      <div
        v-if="message.content"
        :class="{ assistant: message.role === 'assistant' }"
      >
        <MdRenderer :source="stringFromValue(message.content)"></MdRenderer>
      </div>
    </template>
    <div v-if="streamedMessage" class="assistant">
      <MdRenderer :source="streamedMessage"></MdRenderer>
    </div>
  </div>
</template>

<style scoped>
.content {
  background: rgb(233, 228, 228);
  margin: 30px;
  text-align: left;
  width: 100%;
  max-width: 1000px;
}
.content > div {
  padding: 0 20px;
  display: flex;
  margin-bottom: 0;
}

.assistant {
  background-color: aliceblue;
}
</style>
