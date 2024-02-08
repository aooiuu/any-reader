import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', '.git', '.husky', '.vscode', 'public', 'dist', 'dist-electron', 'mock']
    }
  },
  presets: [presetUno({ dark: 'class' })],

  postprocess: (util) => {
    util.entries.forEach((i) => {
      const value = i[1];
      if (value && typeof value === 'string' && /^-?[.\d]+rem$/.test(value)) i[1] = `${+value.slice(0, -3) * 4}px`;
    });
  },

  // 映射组合
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center'
  }
});
