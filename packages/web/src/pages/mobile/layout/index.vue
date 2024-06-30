<template>
  <div class="flex flex-col h-full overflow-hidden text-12">
    <div
      class="flex-1 overflow-hidden"
      :style="{
        paddingBottom: 'var(--van-tabbar-height)'
      }"
    >
      <RouterView v-slot="{ Component, route: _route }">
        <KeepAlive>
          <component :is="Component" v-if="_route.meta.keepAlive" :key="_route.path" />
        </KeepAlive>
        <component :is="Component" v-if="!_route.meta.keepAlive" :key="_route.path" />
      </RouterView>
    </div>

    <van-tabbar route>
      <van-tabbar-item v-for="nav in navs" :key="nav.title" :to="nav.path" :icon="nav.icon">{{ nav.title }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
const navs = [
  // { title: '首页', path: '/home', icon: 'home-o' },
  { title: '视频', path: '/video', icon: 'tv-o' },
  { title: '小说', path: '/novel', icon: 'font-o' },
  { title: '漫画', path: '/manga', icon: 'flower-o' },
  { title: '设置', path: '/setting', icon: 'setting-o' }
];
</script>
