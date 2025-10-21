import baseConfig from './vite.config'
export default {
  ...baseConfig,
  build: { outDir: 'dist/firefox' },
  define: {
    __BROWSER__: '"firefox"',
  },
}