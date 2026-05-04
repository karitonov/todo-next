import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // ローカル開発: basePath なし、GitHub Pages デプロイ時: /todo-next
  basePath: process.env.BASE_PATH ?? "",
  images: { unoptimized: true },
};

export default nextConfig;
