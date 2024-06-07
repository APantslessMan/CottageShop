import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    server: {
      host: "0.0.0.0", // Listen on all network interfaces
      port: 5173, // Optional: Specify the port (default is 3000)
    },
    plugins: [react()],
  };
});
