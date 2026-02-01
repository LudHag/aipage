import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/aipage/",
  resolve: {
    dedupe: ["vue"],
    extensions: [".vue", ".ts", ".js", ".json"],
  },
});
