<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div v-if="showToolbar" class="flex gap-4 px-10 pb-2 justify-end">
      <div :class="['vsc-toolbar-btn codicon ', pinned ? 'codicon-pinned' : 'codicon-pin']" @click="pinned = !pinned"></div>
      <div class="flex-1"></div>
      <div v-if="lastChapter" class="vsc-toolbar-btn codicon codicon-chevron-left" @click="onMenuClick('lastChapter')"></div>
      <div v-if="nextChapter" class="vsc-toolbar-btn codicon codicon-chevron-right" @click="onMenuClick('nextChapter')"></div>
      <div class="vsc-toolbar-btn codicon codicon-chevron-up" @click="pageUp()"></div>
      <div class="vsc-toolbar-btn codicon codicon-chevron-down" @click="pageDown()"></div>
    </div>
    <div
      ref="contentRef"
      class="flex-1 p-10 whitespace-pre-wrap overflow-auto lh-1.5em"
      @contextmenu.stop="contextmenu($event)"
      @click="nemuShow = false"
      v-html="content"
    />
    <ul v-if="nemuShow" ref="nemuRef" class="z-9999 fixed p-0 list-none bg-[#fff]" style="border: 1px solid #282c34" :style="nemuPos">
      <li v-for="item in menuOptions" :key="item.label">
        <a class="text-[#282c34] decoration-none block cursor-pointer w-full text-center p-10" @click="onMenuClick(item.cmd)">{{ item.label }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useMouse } from '@vueuse/core';
import { getContent } from '@/api';
import { useChaptersStore } from '@/stores/chapters';

const { y } = useMouse();

const route = useRoute();
const router = useRouter();
const chaptersStore = useChaptersStore();

const content = ref('');
const contentRef = ref();

const chapterPath = ref('');
const lastChapter = computed(() => {
  if (!chapterPath.value) return '';
  const idx = chaptersStore.chapters.findIndex((e) => e.chapterPath === chapterPath.value);
  const item = idx === 0 ? null : chaptersStore.chapters[idx - 1];
  return item?.chapterPath || '';
});
const nextChapter = computed(() => {
  if (!chapterPath.value) return '';
  const idx = chaptersStore.chapters.findIndex((e) => e.chapterPath === chapterPath.value) + 1;
  if (idx === 0) return '';
  const item = chaptersStore.chapters.length - 1 < idx ? null : chaptersStore.chapters[idx];
  return item?.chapterPath || '';
});

const nemuRef = ref();
const nemuShow = ref(false);
const nemuPos = reactive({
  left: '',
  top: ''
});

// 菜单配置
const menuOptions = computed(() => {
  const items = [];
  if (lastChapter.value) {
    items.push({ label: '上一章', cmd: 'lastChapter' });
  }
  if (nextChapter.value) {
    items.push({ label: '下一章', cmd: 'nextChapter' });
  }
  return items;
});

// 初始化
async function init() {
  content.value = '';
  lastChapter.value = '';
  nextChapter.value = '';
  nemuShow.value = false;
  const res = await getContent(route.query).catch(() => {});

  chapterPath.value = route.query.chapterPath;

  chaptersStore.getChapters(route.query.filePath, route.query.ruleId);
  if (res?.code === 0) {
    content.value = res?.data?.content || '';
  }
  nextTick(() => {
    contentRef.value.scrollTop = 0;
  });
}

// 路由被改变
watch(() => route.query, init, {
  immediate: true,
  deep: true
});

// 弹出菜单
function contextmenu(event) {
  nemuPos.left = event.clientX + 'px';
  nemuPos.top = event.clientY + 'px';
  nemuShow.value = true;
  return false;
}

// 处理菜单
function onMenuClick(cmd) {
  if (cmd === 'lastChapter') {
    router.push({
      name: route.name,
      query: {
        ...route.query,
        chapterPath: lastChapter.value
      }
    });
  } else if (cmd === 'nextChapter') {
    router.push({
      name: route.name,
      query: {
        ...route.query,
        chapterPath: nextChapter.value
      }
    });
  }
  nemuShow.value = false;
}

// 上一页
function pageUp() {
  contentRef.value.scrollTop = contentRef.value.scrollTop - contentRef.value.offsetHeight + 5;
}

// 下一页
function pageDown() {
  contentRef.value.scrollTop = contentRef.value.scrollTop + contentRef.value.offsetHeight - 5;
}

// 置顶
const pinned = ref(true);

const showToolbar = computed(() => {
  if (pinned.value) return true;
  return y.value <= 20;
});
</script>

<style scoped>
::v-deep p {
  margin: 0;
  padding: 0;
}
</style>
