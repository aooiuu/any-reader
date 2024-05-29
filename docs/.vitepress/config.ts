import { defineConfig } from "vitepress";

export default defineConfig({
  base: '/any-reader/',
  lang: "zh-cn",
  title: "any-reader",
  titleTemplate: "any-reader",
  description: "",
  outDir: "./dist",
  head: [],
  lastUpdated: true,
  cleanUrls: true,

  markdown: {
   
  },

  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "VSCode 插件", link: "/vsc/" },
      { text: "桌面端", link: "/desktop/" },
      { text: "网页端", link: "/browser/" },
      { text: "Docker", link: "/docker/" },
      { text: "规则解析库", link: "/core/" },
      { text: "规则", link: "/rule/" }
    ],
    search: {
      provider: "local",
    },
    sidebar: {},
    editLink: {
      pattern: "https://github.com/aooiuu/any-reader/edit/master/docs/:path",
      text: "编辑此页面",
    },
    socialLinks: [{ icon: "github", link: "https://github.com/aooiuu/any-reader" }],
    footer: {},
  },
});
