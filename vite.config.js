import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Build the main index page
        main: resolve(__dirname, 'index.html'),
        // Explicitly tell Vite to build the genres page too!
        genres: resolve(__dirname, 'pages/geners.html'),
      }
    }
  }
});
