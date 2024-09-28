import { withMermaid } from 'vitepress-plugin-mermaid';
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';

const guide = [
  { text: '桌面端', link: '/desktop/' },
  { text: 'VSCode 插件', link: '/vsc/' },
  { text: '网页端', link: '/browser/' },
  { text: 'Docker', link: '/docker/' },
  { text: '命令行工具', link: '/cli/' },
  { text: '规则解析库', link: '/core/' },
  { text: '常见问题', link: '/help/' }
];

export default withMermaid({
  base: '/any-reader/',
  lang: 'zh-cn',
  title: 'any-reader',
  titleTemplate: 'any-reader',
  description: '',
  outDir: './dist',
  head: [],
  lastUpdated: true,
  cleanUrls: true,

  markdown: {
    codeTransformers: [transformerTwoslash()]
  },
  mermaid: {},

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/desktop/' },
      { text: '规则', link: '/rule/' },
      { text: '在线工具', link: '/play/' }
    ],
    search: {
      provider: 'local'
    },
    sidebar: guide.reduce(
      (p, v) => {
        p[v.link] = guide;
        return p;
      },
      {
        '/play/': {
          items: [
            { text: '取文本测试', link: '/play/' },
            { text: '规则测试', link: '/play/core' },
            { text: '规则编解码', link: '/play/comparess' }
          ]
        }
      }
    ),
    editLink: {
      pattern: 'https://github.com/aooiuu/any-reader/edit/master/docs/:path',
      text: '编辑此页面'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/aooiuu/any-reader' }],
    footer: {}
  }
});
