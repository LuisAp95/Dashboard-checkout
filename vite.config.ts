import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
//import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses (including LAN)
    port: 5173,
    // Or, specify a specific IP address:
    // host: '192.168.1.100',
  },
});
