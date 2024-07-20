<template>
  <div class="w-full h-full overflow-hidden flex flex-col sm:flex-row">
    <div
      class="w-full flex sm:block sm:w-120 text-[--ar-color-text-secondary] bg-[--ar-left-bar-bg-secondary] p-10 border-r-1 border-r-solid border-r-[--ar-top-bar-border-bottom]"
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
    <div class="flex-1 overflow-auto p-10 flex flex-wrap justify-center items-start content-start">
      <component :is="navs[activeNavIdx].component" />
      <div v-for="i in 10" :key="i" class="w-102 invisible mr-10 mb-10" />
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
