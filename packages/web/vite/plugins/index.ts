import jsx from '@vitejs/plugin-vue-jsx';
import { analyzer } from 'vite-bundle-analyzer';
import UnoCSS from 'unocss/vite';
import type { PluginOption } from 'vite';
import autoImport from './autoImport';
import mock from './mock';
import electron from './electron';
import vue from './vue';

export default function createPlugins({ env, isBuild }: { env: Record<string, string>; isBuild: boolean }) {
  const vitePlugins: PluginOption[] = [];
  vitePlugins.push(vue());
  vitePlugins.push(jsx());
  vitePlugins.push(UnoCSS());
  vitePlugins.push(mock());
  vitePlugins.push(autoImport());
  vitePlugins.push(analyzer());

  if (env.VITE_APP_PLATFORM === 'electron') {
    vitePlugins.push(electron(isBuild) as PluginOption);
  }
  return vitePlugins;
}
