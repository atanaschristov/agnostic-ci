import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: process.env.NODE_ENV === 'production' ? 'agnostic-ci' : '',
	define: {
		__APP_ENV__: JSON.stringify(process.env.NODE_ENV),
		__DEMO_VERSION__: JSON.stringify(process.env.npm_package_version),
		__LIB_VERSION__: JSON.stringify(process.env.LIB_VERSION),
	},
});
