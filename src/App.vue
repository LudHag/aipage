<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chat from "./Chat.vue";
const apiKey = ref<string>("");
const apiKeyInput = ref<string>("");

const save = () => {
  apiKey.value = apiKeyInput.value;
  localStorage.setItem("apiKey", apiKeyInput.value);
  apiKeyInput.value = "";
};

onMounted(() => {
  const apiKeyStorage = localStorage.getItem("apiKey");
  if (apiKeyStorage) {
    apiKey.value = apiKeyStorage;
  }
});
</script>

<template>
  <header>
    <form @submit.prevent="save" v-if="!apiKey">
      <label for="api-key">API Key</label>
      <input v-model="apiKeyInput" />
    </form>
  </header>
  <Chat :api-key="apiKey" v-if="apiKey" />
</template>

<style scoped></style>
