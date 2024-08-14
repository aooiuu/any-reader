<template>
  <div class="h-300 w-full flex overflow-hidden bg-[--activityBar-background] text-[--ar-color-text-secondary]">
    <div class="h-full w-120 rounded-8 bg-[--ar-chapter-bg] p-10 text-[--ar-color-text]">
      <div v-for="(nav, idx) in navs" :key="nav.title" class="" @click="activeNavIdx = idx">
        <div
          :class="[
            'h-32 lh-32 px-10 rounded-10 mb-5 cursor-pointer hover:text-[--ar-color-primary-text]',
            activeNavIdx === idx ? 'bg-[--ar-color-primary-bg] text-[--ar-color-primary-text]' : ''
          ]"
        >
          {{ nav.title }}
        </div>
      </div>
    </div>
    <div class="ml-10 flex-1 rounded-8 bg-[--ar-chapter-bg]">
      <component :is="navs[activeNavIdx].component" />
    </div>
  </div>
</template>

<script setup>
import ReadPage from './components/ReadPage/index.vue';
import KeyboardShortcuts from './components/KeyboardShortcuts/index.vue';
import App from './components/App/index.vue';
import About from './components/About/index.vue';

const navs = [
  { title: '阅读页', component: ReadPage },
  { title: '热键', component: KeyboardShortcuts },
  { title: '应用', component: App },
  { title: '关于', component: About }
];

const activeNavIdx = ref(0);
</script>
