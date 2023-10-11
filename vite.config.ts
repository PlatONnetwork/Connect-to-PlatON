import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    Unocss(),
    react(),
    nodePolyfills(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        {
          clsx: ['clsx'],
        },
      ],
      dts: './types/auto-imports.d.ts',
      dirs: ['src/components', 'src/hooks', 'src/utils', 'src/config'],
      defaultExportByFilename: true,
    }),
  ],
  optimizeDeps: {
    include: ['clsx', 'react', 'react-dom', 'react-router-dom'],
  },
  build: {
    sourcemap: true,
  },
  // define: {
  //   global: 'globalThis',
  // },
})
