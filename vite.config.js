import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` must match the GitHub Pages repo name so built asset URLs resolve at
// https://brdeweese.github.io/CV_Website/. If a custom domain is added later,
// change this to '/' and update the router basename follows automatically
// (it reads import.meta.env.BASE_URL).
export default defineConfig({
  plugins: [react()],
  base: '/CV_Website/',
})
