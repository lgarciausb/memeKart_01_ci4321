// vite.config.js
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    // Add the singlefile plugin
    viteSingleFile({
      // Optional: Configuration options if needed, 
      // but the defaults usually work fine.
    }),
  ],
  
  build: {
    // This is optional, but setting it to false prevents Vite from 
    // automatically inserting preload/prefetch tags for modules, 
    // which helps keep the final file cleaner.
    modulePreload: false, 
  }
});