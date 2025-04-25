<script setup lang="ts">
import { ref } from "vue";
import { NInput, NButton } from "naive-ui";

defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "prompt", prompt: string): void;
}>();

const prompt = ref<string>("");

const click = () => {
  emit("prompt", prompt.value);
  prompt.value = "";
};

const formEnter = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    click();
  }
};
</script>

<template>
  <form class="input-area" @submit.prevent="click" @keydown.enter="formEnter">
    <div class="input-container">
      <div class="text-input-container">
        <NInput
          v-model:value="prompt"
          placeholder="Input image prompt"
          type="textarea"
          :disabled="loading"
        />
      </div>
    </div>
    <NButton
      type="primary"
      attrType="submit"
      @click.prevent="click"
      :disabled="loading"
      >Send</NButton
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
  max-width: 1000px;
}
.input-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.text-input-container {
  flex-grow: 1;
}
.text-input-container > div {
  height: 100%;
}
</style>
