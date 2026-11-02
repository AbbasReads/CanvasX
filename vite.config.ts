import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { handleNetlifyProxy } from "./src/server/netlifyProxy";
import { handleAiPipelineProxy } from "./src/server/aiPipelineProxy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const serverToken = env.NETLIFY_AUTH_TOKEN || env.VITE_NETLIFY_AUTH_TOKEN || "";
  const aiPipelineUrl = env.AI_PIPELINE_URL || "http://127.0.0.1:8001";

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      {
        name: "dev-server-proxies",
        configureServer(server) {
          server.middlewares.use("/api/deploy", (req, res) => {
            handleNetlifyProxy(req, res, serverToken);
          });
          server.middlewares.use("/api/ai", (req, res) => {
            handleAiPipelineProxy(req, res, aiPipelineUrl);
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
