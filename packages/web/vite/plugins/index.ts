import vue from '@vitejs/plugin-vue';
import jsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import type { PluginOption } from 'vite';
import autoImport from './autoImport';
import mock from './mock';

export default function createPlugins() {
  const vitePlugins: PluginOption[] = [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('vscode-')
        }
      }
    })
  ];
  vitePlugins.push(jsx());
  vitePlugins.push(UnoCSS());
  vitePlugins.push(mock());
  vitePlugins.push(autoImport());
  return vitePlugins;
}
