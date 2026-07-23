import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Converts HMR updates inside src/mocks/ into full page reloads so the
// MSW service worker is always re-initialized with the current handlers.
function mockReloadPlugin() {
  return {
    name: "msw-mock-full-reload",
    handleHotUpdate({ file, server }) {
      if (file.includes("/src/mocks/")) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mockReloadPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      src: path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test-setup.js",
  },
});
