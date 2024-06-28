<template>
  <slot />
</template>

<style lang="scss">
body {
  --titleBar-inactiveBackground: var(--ar-color-bg-container);
  --titleBar-border-bottom: rgb(43, 43, 43);

  --toolbar-hoverBackground: rgba(90, 93, 94, 0.31);
  --commandCenter-background: rgba(255, 255, 255, 0.05);
  --commandCenter-activeBackground: rgba(255, 255, 255, 0.08);

  --foreground: var(--ar-color-text);
  --activityBar-foreground: var(--ar-color-text-secondary);

  --titleBar-inactiveForeground: var(--ar-color-text);
  --commandCenter-inactiveBorder: var(--ar-color-text);

  --activityBar-background: var(--ar-color-bg-container);
  --main-background: var(--ar-color-bg-elevated);
  --scrollbarSlider-background: rgba(121, 121, 121, 0.4);
  --editor-background: #1f1f1f;

  --color-bg-3: var(--ar-color-bg-container);

  &[arco-theme='dark'] {
    --color-bg-3: var(--ar-color-bg-container);
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
