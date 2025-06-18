<script setup lang="ts">
defineProps<{
  image: string | null;
}>();
</script>

<template>
  <img id="webpImage" :src="`data:image/webp;base64,${image}`" />
</template>

<style scoped>
img {
  max-height: 500px;
}
.prompt {
  margin-top: 30px;
}
</style>
