<template>
  <div class="h-full w-full flex flex-col overflow-hidden sm:flex-row">
    <div
      class="w-full flex border-r-1 border-r-[--ar-top-bar-border-bottom] border-r-solid bg-[--ar-left-bar-bg-secondary] p-10 text-[--ar-color-text-secondary] sm:block sm:w-120"
    >
      <div v-for="(nav, idx) in navs" :key="nav.title" class="" @click="activeNavIdx = idx">
        <div
          :class="[
            'h-32 lh-32 px-10 rounded-10 mb-5 cursor-pointer hover:bg-[--ar-left-bar-active-bg-secondary]',
            activeNavIdx === idx ? ' bg-[--ar-left-bar-active-bg-secondary] text-[--ar-color-primary-text]' : ''
          ]"
        >
          {{ nav.title }}
        </div>
      </div>
    </div>
    <div class="flex flex-1 flex-wrap content-start items-start justify-center overflow-auto p-10">
      <component :is="navs[activeNavIdx].component" />
      <div v-for="i in 10" :key="i" class="invisible mb-10 mr-10 w-102" />
    </div>
  </div>
</template>

<script setup>
import Local from './Local.vue';
import Favorites from './Favorites.vue';
import History from './History.vue';

const navs = [
  { title: '本地', component: Local },
  { title: '收藏', component: Favorites },
  { title: '历史', component: History }
];

const activeNavIdx = ref(0);
</script>
