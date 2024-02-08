import autoImport from 'unplugin-auto-import/vite';

export default function createAutoImport() {
  return autoImport({
    imports: ['vue', 'vue-router'],
    dts: true,
    eslintrc: {
      enabled: true
    }
  });
}
