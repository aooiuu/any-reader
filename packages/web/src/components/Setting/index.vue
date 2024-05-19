<template>
  <div class="w-full h-300 overflow-hidden flex">
    <div class="w-120 text-[--foreground] bg-[--activityBar-background] h-full p-10 border-r-1 border-r-solid border-r-[--titleBar-border-bottom]">
      <div v-for="(nav, idx) in navs" :key="nav.title" class="" @click="activeNavIdx = idx">
        <div
          :class="[
            'h-32 lh-32 px-10 rounded-10 mb-5 cursor-pointer hover:bg-[--main-background]',
            activeNavIdx === idx ? ' bg-[--main-background]' : ''
          ]"
        >
          {{ nav.title }}
        </div>
      </div>
    </div>
    <div class="flex-1">
      <component :is="navs[activeNavIdx].component" />
    </div>
  </div>
</template>

<script setup>
import ReadPage from './components/ReadPage/index.vue';

const navs = [{ title: '阅读页', component: ReadPage }];

const activeNavIdx = ref(0);
</script>
