<script setup lang="ts">
import { NButton, NText } from "naive-ui";
import { GeneratedImageCall } from "./models";
defineProps<{
  image: GeneratedImageCall;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
  (e: "removeall"): void;
}>();
</script>

<template>
  <img :src="image.url" />
  <NText type="primary" class="prompt">
    {{ image.prompt }}
  </NText>

  <NButton type="warning" class="remove-button" @click.prevent="emit('remove')"
    >Remove image</NButton
  >

  <NButton type="error" class="remove-button" @click.prevent="emit('removeall')"
    >Remove all images</NButton
  >
</template>

<style scoped>
img {
  max-height: 500px;
}
.remove-button {
  margin-top: 30px;
}
.prompt {
  margin-top: 30px;
}
</style>
