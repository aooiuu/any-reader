// 预置配色

const BASE_THEME = {
  borderRadius: 4,
  cmdActiveBg: '#ffffff14'
};

export const THEME = [
  {
    label: '杏仁黄',
    color: '#FAF9DE',
    textColor: '#000000e6',
    theme: {
      ...BASE_THEME,
      colorPrimary: '#d4d192',

      // 侧边栏
      leftBarBg: '#A39A48',
      leftBarText: '#000',
      // 侧边栏二级
      leftBarBgSecondary: '#CFCA8A',
      leftBarTextSecondary: '#000',
      leftBarActiveBgSecondary: '#FCFFE8',
      // 顶部栏
      topBarBg: '#A39A48',
      topBarText: '#000',
      topBarHoverBackground: '#5a5d5e4f',
      cmdBorder: '#B5B061',
      cmdBg: '#B5B061',

      colorPrimaryBg: '#FAF9DE',

      mainBackground: '#f6f6f6',
      colorBgContainer: '#fff',
      colorBgLayout: '#f6f6f6',
      colorBgSpotlight: '#f6f6f6',
      colorBgElevated: '#f6f6f6', // 弹窗背景

      settingColorBorder: '#FAF9DE',
      colorBorder: '#d8d8d8',
      topBarBorderBottom: '#0000001a',

      colorText: 'rgba(0, 0, 0, 0.85)',
      colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
      colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
      colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',

      // 章节背景颜色
      chapterBg: '#fff'
    }
  },
  // {
  //   label: '秋叶褐',
  //   color: '#FFF2E2',
  //   textColor: '#000000e6',
  //   theme: {
  //     ...BASE_THEME,
  //     colorPrimary: '#ffcf94',
  //   }
  // },
  // {
  //   label: '胭脂红',
  //   color: '#FDE6E0',
  //   textColor: '#000000e6',
  //   theme: {
  //     ...BASE_THEME,
  //     colorPrimary: '#fdbbaa',
  //   }
  // },
  {
    label: '青草绿',
    color: '#E3EDCD',
    textColor: '#000000e6',
    theme: {
      ...BASE_THEME,
      colorPrimary: '#acbf82',

      // 侧边栏
      leftBarBg: '#ADC580',
      leftBarText: '#000',
      // 侧边栏二级
      leftBarBgSecondary: '#E3EDCD',
      leftBarTextSecondary: '#000',
      leftBarActiveBgSecondary: '#FCFFE8',
      topBarHoverBackground: '#5a5d5e4f',
      // 顶部栏
      topBarBg: '#ADC580',
      topBarText: '#000',
      cmdBorder: '#BED192',
      cmdBg: '#BED192',

      mainBackground: '#f6f6f6',
      colorBgContainer: '#fff',
      colorBgLayout: '#f6f6f6',
      colorBgSpotlight: '#f6f6f6',
      colorBgElevated: '#f6f6f6', // 弹窗背景

      colorPrimaryBg: '#E3EDCD',
      settingColorBorder: '#E3EDCD',
      colorBorder: '#d8d8d8',
      topBarBorderBottom: '#0000001a',

      colorText: 'rgba(0, 0, 0, 0.85)',
      colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
      colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
      colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',

      // 章节背景颜色
      chapterBg: '#fff'
    }
  },
  // {
  //   label: '海天蓝',
  //   color: '#DCE2F1',
  //   textColor: '#000000e6',
  //   theme: {
  //     ...BASE_THEME,
  //     colorPrimary: '#adbadb',
  //   }
  // },
  // {
  //   label: '葛巾紫',
  //   color: '#E9EBFE',
  //   textColor: '#000000e6',
  //   theme: {
  //     ...BASE_THEME,
  //     colorPrimary: '#b4bbfe',
  //   }
  // },
  // {
  //   label: '极光灰',
  //   color: '#EAEAEF',
  //   textColor: '#000000e6',
  //   theme: {
  //     ...BASE_THEME,
  //     colorPrimary: '#b2b2db',
  //   }
  // },
  {
    label: '默认黑',
    color: '#181818',
    textColor: '#FFFFFFB3',
    theme: {
      ...BASE_THEME,
      colorPrimary: '#40b883',

      // 侧边栏
      leftBarBg: '#1f1f1f',
      leftBarText: '#FFFFFFB3',
      // 侧边栏二级
      leftBarBgSecondary: '#181818',
      leftBarTextSecondary: '#FFFFFFB3',
      leftBarActiveBgSecondary: '#1F1F1F',
      // 顶部栏
      topBarBg: '#1f1f1f',
      topBarText: '#FFFFFFB3',
      topBarBorderBottom: '#2b2b2b',
      topBarHoverBackground: '#5a5d5e4f',
      cmdBorder: '#303030',
      cmdBg: '#ffffff0d',

      mainBackground: '#1F1F1F',
      colorBgContainer: '#1F1F1F',
      colorBgLayout: '#1F1F1F',
      colorBgSpotlight: '#1F1F1F',
      colorBgElevated: '#1F1F1F',

      colorPrimaryBg: '#1f1f1f',
      settingColorBorder: '#E3EDCD',

      colorBorder: 'rgba(0,0,0,0.4)',

      colorText: 'rgba(255,255,255, 0.65)',
      colorTextSecondary: 'rgba(255,255,255, 0.65)',
      colorTextTertiary: 'rgba(255,255,255, 0.65)',
      colorTextQuaternary: 'rgba(255,255,255, 0.65)',

      // 章节背景颜色
      chapterBg: '#181818'
    }
  }
];
