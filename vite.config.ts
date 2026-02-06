import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      strictPort: true,
      host: true,
    },
    preview: {
      port: 3000,
      strictPort: true,
      host: true,
    },
    optimizeDeps: {
      include: ['@schedule-x/react', '@schedule-x/calendar', '@schedule-x/drag-and-drop', '@schedule-x/events-service', '@schedule-x/resize', '@schedule-x/theme-default'],
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
