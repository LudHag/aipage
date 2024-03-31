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
      <p
        v-if="message.content"
        :class="{ assistant: message.role === 'assistant' }"
      >
        <MdRenderer :source="stringFromValue(message.content)"></MdRenderer>
      </p>
    </template>
    <p v-if="streamedMessage" class="assistant">
      <MdRenderer :source="streamedMessage"></MdRenderer>
    </p>
  </div>
</template>

<style scoped>
.content {
  background: rgb(233, 228, 228);
  margin: 30px;
  text-align: left;
}
.content > p {
  padding: 0 20px;
  display: flex;
}
.assistant {
  background-color: aliceblue;
}
</style>
