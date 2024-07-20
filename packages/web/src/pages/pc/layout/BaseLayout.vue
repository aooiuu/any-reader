<template>
  <slot />
</template>

<style lang="scss">
body {
  --scrollbarSlider-background: rgba(121, 121, 121, 0.4);
}

.app-region-drag {
  -webkit-app-region: drag;

  * {
    -webkit-app-region: drag;
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
