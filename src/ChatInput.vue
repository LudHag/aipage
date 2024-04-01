<script setup lang="ts">
import { ref } from "vue";
import { NInput, NButton } from "naive-ui";

const emit = defineEmits<{
  (e: "question", text: string): void;
  (e: "remove"): void;
}>();

const textInput = ref<string>("");

const click = () => {
  emit("question", textInput.value);
  textInput.value = "";
};

const formEnter = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    click();
  }
};
</script>

<template>
  <form class="input-area" @submit.prevent="click" @keydown.enter="formEnter">
    <NInput v-model:value="textInput" type="textarea" />
    <NButton type="primary" attrType="submit" @click.prevent="click"
      >Send</NButton
    >
  </form>
  <NButton type="warning" @click.prevent="emit('remove')"
    >Remove conversation</NButton
  >
</template>

<style scoped>
.input-area {
  display: flex;
  justify-content: center;
  margin: 30px;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
}
</style>
