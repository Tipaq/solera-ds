import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Ce dont les primitives ont besoin pour s'afficher : JSX et Tailwind, rien d'autre. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
