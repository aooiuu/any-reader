import vue from '@vitejs/plugin-vue';

export default function plugin() {
  return vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('vscode-')
      }
    }
  });
}
