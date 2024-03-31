<script setup lang="ts">
import { ref } from "vue";
import { NInput, NButton } from "naive-ui";

const emit = defineEmits<{
  (e: "question", text: string): void;
}>();

const textInput = ref<string>("");

const click = () => {
  emit("question", textInput.value);
  textInput.value = "";
};
</script>

<template>
  <form class="input-area" @submit.prevent="click">
    <NInput v-model:value="textInput" type="textarea" />
    <NButton type="primary" attrType="submit" @click.prevent="click"
      >Skicka</NButton
    >
  </form>
</template>

<style scoped>
.input-area {
  display: flex;
  justify-content: center;
  margin: 30px;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
}
</style>
