<script setup lang="ts">
defineProps<{
  active: boolean;
}>();
</script>

<template>
  <div class="thinking-dots">
    <div class="dot" :class="{ active }"></div>
    <div class="dot" :class="{ active }"></div>
    <div class="dot" :class="{ active }"></div>
  </div>
</template>

<style scoped>
.thinking-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  margin-top: -10px;
  margin-bottom: -10px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: transparent;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.dot.active {
  background-color: #666;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

.dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-12px);
  }
}
</style>
