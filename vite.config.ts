import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/company_list_Vue/' : '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
