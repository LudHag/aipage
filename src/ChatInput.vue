<script setup lang="ts">
import { ref } from "vue";
import { NInput, NButton, NUpload, UploadFileInfo } from "naive-ui";

const emit = defineEmits<{
  (e: "question", text: string, imageb64?: string): void;
  (e: "remove"): void;
  (e: "removeall"): void;
}>();

const textInput = ref<string>("");
const imageb64 = ref<string | null>(null);
const fileList = ref<UploadFileInfo[]>([]);

const click = () => {
  emit("question", textInput.value, imageb64.value ?? undefined);
  textInput.value = "";
  imageb64.value = null;
  fileList.value = [];
};

const formEnter = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    click();
  }
};

const handleFileChange = (data: { file: UploadFileInfo }) => {
  const { file } = data;
  if (file.status === "removed") {
    imageb64.value = null;
    return;
  }
  if (file.file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageb64.value = e.target?.result as string;
    };
    reader.readAsDataURL(file.file);
  }
};
const handleFileListUpdate = (newFileList: UploadFileInfo[]) => {
  // Limit to only one file
  if (newFileList.length > 1) {
    fileList.value = [newFileList[1]]; // Keep the latest file
  } else {
    fileList.value = newFileList;
  }
};
</script>

<template>
  <form class="input-area" @submit.prevent="click" @keydown.enter="formEnter">
    <div class="input-container">
      <div class="text-input-container">
        <NInput v-model:value="textInput" type="textarea" />
      </div>
      <div>
        <NUpload
          @change="handleFileChange"
          :on-update:file-list="handleFileListUpdate"
          :file-list="fileList"
          list-type="image-card"
        >
          <NButton>Select File</NButton>
        </NUpload>
      </div>
    </div>
    <NButton type="primary" attrType="submit" @click.prevent="click"
      >Send</NButton
    >
  </form>
  <NButton type="warning" class="remove-button" @click.prevent="emit('remove')"
    >Remove conversation</NButton
  >

  <NButton type="error" class="remove-button" @click.prevent="emit('removeall')"
    >Remove all conversations</NButton
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
.remove-button {
  margin-bottom: 30px;
}
</style>
