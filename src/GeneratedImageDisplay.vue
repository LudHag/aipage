<script setup lang="ts">
import { NButton } from "naive-ui";
defineProps<{
  imageUrl: string;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
  (e: "removeall"): void;
}>();
</script>

<template>
  <img :src="imageUrl" />

  <NButton type="warning" class="remove-button" @click.prevent="emit('remove')"
    >Remove conversation</NButton
  >

  <NButton type="error" class="remove-button" @click.prevent="emit('removeall')"
    >Remove all conversations</NButton
  >
</template>

<style scoped>
img {
  max-height: 500px;
}
.remove-button {
  margin-top: 30px;
}
</style>
