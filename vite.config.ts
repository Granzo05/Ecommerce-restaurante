import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      REACT_APP_BASE_URL_DEV: process.env.REACT_APP_BASE_URL_DEV,
      REACT_APP_BASE_URL_PROD: process.env.REACT_APP_BASE_URL_PROD,
      URL_API: process.env.URL_API,
    }
  }
})
