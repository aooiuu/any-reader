import jsx from '@vitejs/plugin-vue-jsx';
import { analyzer } from 'vite-bundle-analyzer';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

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
  env.ENABLE_BUNDLE_ANALYZER && vitePlugins.push(analyzer());
  vitePlugins.push(
    Components({
      dts: true,
      dirs: [],
      resolvers: [
        AntDesignVueResolver({
          resolveIcons: true,
          importStyle: false
        })
      ]
    })
  );

  if (env.VITE_APP_PLATFORM === 'electron') {
    vitePlugins.push(electron(isBuild) as PluginOption);
  }
  return vitePlugins;
}
