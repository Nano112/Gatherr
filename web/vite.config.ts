import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 5173,
		proxy: {
			'/api': { target: 'http://localhost:8181', changeOrigin: true, secure: false },
			'/login': { target: 'http://localhost:8181', changeOrigin: true, secure: false },
			'/logout': { target: 'http://localhost:8181', changeOrigin: true, secure: false },
			'/preview': { target: 'http://localhost:8181', changeOrigin: true, secure: false },
			'/debug': { target: 'http://localhost:8181', changeOrigin: true, secure: false, ws: true },
		},
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
	},
})
