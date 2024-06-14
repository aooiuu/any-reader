<template>
  <slot />
</template>

<style lang="scss">
body {
  --titleBar-inactiveBackground: rgb(31, 31, 31);
  --titleBar-inactiveForeground: rgba(204, 204, 204, 0.6);
  --titleBar-border-bottom: rgb(43, 43, 43);
  /* --toolbar-activeBackground: rgba(90, 93, 94, 0.31); */
  --toolbar-hoverBackground: rgba(90, 93, 94, 0.31);
  --commandCenter-background: rgba(255, 255, 255, 0.05);
  --commandCenter-inactiveBorder: rgba(204, 204, 204, 0.15);
  --commandCenter-activeBackground: rgba(255, 255, 255, 0.08);
  --foreground: rgb(134, 134, 134);
  --activityBar-foreground: rgb(215, 215, 215);
  --activityBar-background: rgb(24, 24, 24);
  --main-background: rgb(31, 31, 31);
  --scrollbarSlider-background: rgba(121, 121, 121, 0.4);
  --editor-background: #1f1f1f;

  --color-bg-3: rgb(24, 24, 24);

  &[arco-theme='dark'] {
    --color-bg-3: rgb(24, 24, 24);
  }
}

.app-region-none {
  -webkit-app-region: none;

  * {
    -webkit-app-region: none;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--scrollbarSlider-background);
}

::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>

<style scoped lang="scss">
@media (max-width: 300px) {
  .topbar__left {
    display: none;
  }
}

@media (max-width: 250px) {
  .topbar__cmd {
    display: none;
  }
}
</style>
