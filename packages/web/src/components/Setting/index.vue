<template>
  <div class="w-full h-300 overflow-hidden flex text-[--ar-color-text-secondary] bg-[--activityBar-background]">
    <div class="w-120 text-[--ar-color-text] h-full p-10 bg-[--ar-chapter-bg] rounded-8">
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
    <div class="flex-1 bg-[--ar-chapter-bg] rounded-8 ml-10">
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
