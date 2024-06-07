<script setup lang="ts">
import markdownit from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return "";
  },
});

defineProps<{
  source: string;
}>();
</script>

<template>
  <div class="md-container" v-html="md.render(source)"></div>
</template>
<style scoped>
.md-container {
  max-width: 100%;
}

.md-container :deep(code) {
  font-family: "Fira Code", monospace;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  max-width: 100%;
  text-wrap: wrap;
}

.md-container :deep(pre) {
  margin-top: 30px;
  position: relative;
}

.md-container :deep(pre code::before) {
  content: "Code";
  position: absolute;
  top: -25px;
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 12px;
  width: 100%;
  background-color: #2f2f2f;
  color: #fff;
}

.md-container :deep(pre .language-css::before) {
  content: "CSS";
  background-color: #ffffff;
  color: #1a237e;
}

.md-container :deep(pre .language-html::before) {
  content: "HTML";
  background-color: #b3d9ff;
  color: #000080;
}

.md-container :deep(pre .language-javascript::before) {
  content: "Javascript";
  background-color: #e0e0e0;
  color: #424242;
}

.md-container :deep(pre .language-python::before) {
  content: "Python";
  background-color: #bbdefb;
  color: #0d47a1;
}

.md-container :deep(pre .language-csharp::before) {
  content: "C#";
  background-color: #fffdd0;
  color: #5b3a29;
}

.md-container :deep(pre .language-go::before) {
  content: "Go";
  background-color: #e6e6fa;
  color: #2e1a47;
}

.md-container :deep(pre .language-sql::before) {
  content: "SQL";
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.md-container :deep(pre .language-c::before) {
  content: "C";
  background-color: #f0f0f0;
  color: #2e2e2e;
}

.md-container :deep(pre .language-rust::before) {
  content: "Rust";
  background-color: #002b36;
  color: #839496;
}

.md-container :deep(pre .language-json::before) {
  content: "JSON";
  background-color: #e69a8dff;
  color: #5f4b8bff;
}

.md-container :deep(pre .language-yaml::before) {
  content: "YAML";
  background-color: #f0f0f0;
  color: #2e2e2e;
}

.md-container :deep(pre .language-sh::before) {
  content: "Shell";
  background-color: #f0f0f0;
  color: #2e2e2e;
}

.md-container :deep(pre .language-typescript::before) {
  content: "Typescript";
  background-color: #00203fff;
  color: #adefd1ff;
}
</style>
