import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 投稿管理ダッシュボードのデモアプリ用ビルド設定。
// コンポーネント本体は src/components 配下にあり、Storybook が主たるビューア。
export default defineConfig({
  plugins: [react()],
});
