import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
export default defineConfig({
  plugins: [
    ViteMinifyPlugin({}),
    ViteImageOptimizer({
      include: ['**/*.png', '**/*.jpg', '**/*.jpeg']
    }),
    copy({
      targets: [{ src: 'src/assets/images/*.svg', dest: 'docs/assets' }],
      hook: 'writeBundle' // Aseguramos que los archivos se copien después de que el bundle se haya generado
    })
  ],
  root: 'src',
  base: '',
  build: {
    outDir: '../docs'
  }
});
