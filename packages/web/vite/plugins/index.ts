import jsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import type { PluginOption } from 'vite';
import autoImport from './autoImport';
import mock from './mock';
import electron from './electron';
import vue from './vue';

export default function createPlugins(env: Record<string, string>) {
  const vitePlugins: PluginOption[] = [];
  vitePlugins.push(vue());
  vitePlugins.push(jsx());
  vitePlugins.push(UnoCSS());
  vitePlugins.push(mock());
  vitePlugins.push(autoImport());

  if (env.VITE_APP_PLATFORM === 'electron') {
    vitePlugins.push(electron() as PluginOption);
  }
  return vitePlugins;
}
