import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { writeFileSync, readFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
  try {
    const html404 = resolve(__dirname, 'public/404.html')
    const distHtml404 = resolve(__dirname, 'dist/404.html')
    writeFileSync(distHtml404, readFileSync(html404))
  } catch (error) {
    console.error('Error copying 404.html:', error)
  }
}
    }
  ],
  base: '/moguratataki-game/'
})
