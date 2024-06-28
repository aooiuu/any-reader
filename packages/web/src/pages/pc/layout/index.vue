<template>
  <BaseLayout>
    <div class="w-full h-full flex flex-col overflow-hidden text-[--ar-color-text]">
      <div
        class="text-12 flex justify-center items-center h-34 lh-34 bg-[--titleBar-inactiveBackground] border-b-1 border-b-solid border-b-[--titleBar-border-bottom] pr-2"
        :style="{
          '-webkit-app-region': 'drag'
        }"
      >
        <div class="topbar__left w-20%" />
        <div class="w-60% flex gap-4 items-center justify-center flex-1">
          <span
            v-if="route.path !== '/pc/books'"
            class="w-22 codicon codicon-home cursor-pointer hover:op-70 app-region-none"
            @click="router.push('/pc/books')"
          ></span>
          <span class="w-22 codicon codicon-arrow-left cursor-pointer hover:op-70 app-region-none" @click="router.back"></span>
          <span class="w-22 codicon codicon-arrow-right cursor-pointer hover:op-70 app-region-none" @click="router.forward"></span>
          <div
            class="topbar__cmd app-region-none box-content flex items-center justify-center ml-6 w-38vw max-w-600 bg-[--commandCenter-background] border-1 border-solid rounded-6 h-22 border-[--ar-color-border-secondary] cursor-pointer hover:bg-[--commandCenter-activeBackground] px-6"
          >
            <div
              v-if="route.path === '/pc/content'"
              class="w-full h-full flex items-center justify-center"
              :title="readStore.title"
              @click.stop="openChaptersBox.emit"
            >
              <span class="overflow-hidden whitespace-nowrap text-ellipsis">{{ readStore.title }}</span>
            </div>
            <div v-else class="w-full h-full flex items-center justify-center" @click.stop="searchBox.emit">
              <span class="codicon codicon-search mr-10"></span>
              <span class="overflow-hidden whitespace-nowrap text-ellipsis">搜索</span>
            </div>
          </div>
        </div>
        <div class="w-20% h-full flex gap-4 items-center justify-end">
          <!-- 布局 -->
          <div
            v-if="PLATFORM === 'electron'"
            class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--toolbar-hoverBackground] app-region-none"
          >
            <span
              :class="['codicon', settingStore.data.pinned ? 'codicon-pinned-dirty' : 'codicon-pinned']"
              @click="settingStore.data.pinned = !settingStore.data.pinned"
            />
          </div>
          <div class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--toolbar-hoverBackground] app-region-none">
            <span
              :class="['codicon', settingStore.data.sidebar === 'hidden' ? 'codicon-layout-sidebar-left-off' : 'codicon-layout-sidebar-left']"
              @click="changeSidebar"
            />
          </div>
          <template v-if="PLATFORM === 'electron'">
            <!-- 窗口 -->
            <div
              class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--toolbar-hoverBackground] app-region-none"
              @click="minimize"
            >
              <span class="codicon codicon-chrome-minimize" />
            </div>
            <div
              class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--toolbar-hoverBackground] fullscreen app-region-none"
              @click="maximize"
            >
              <span class="codicon codicon-chrome-maximize"></span>
            </div>
          </template>
          <div
            v-if="PLATFORM !== 'utools'"
            title="退出"
            class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--toolbar-hoverBackground] app-region-none"
            @click="onExit"
          >
            <span class="codicon codicon-chrome-close"></span>
          </div>
        </div>
      </div>
      <div class="flex flex-1 overflow-auto">
        <!-- 侧边栏 -->
        <div
          v-if="settingStore.data.sidebar !== 'hidden'"
          class="w-48 flex flex-col py-10 text-[--ar-color-text-secondary] bg-[--activityBar-background] text-24 border-r-1 border-r-solid border-r-[--titleBar-border-bottom]"
        >
          <!-- 收藏 -->
          <div
            v-for="nav in navs"
            :key="nav.path"
            :class="[
              'w-42 h-42 flex items-center justify-center hover:text-[--ar-color-primary] cursor-pointer',
              route.path === nav.path ? 'text-[--ar-color-primary]' : ''
            ]"
            @click="router.push(nav.path)"
          >
            <span :class="['codicon !text-24px', nav.icon]"></span>
          </div>
          <div class="flex-1"></div>

          <div :class="['w-42 h-42 flex items-center justify-center hover:text-[--ar-color-text] cursor-pointer']" @click="openSetting">
            <span :class="['codicon !text-24px codicon-settings-gear']"></span>
          </div>
        </div>
        <div class="flex-1 overflow-hidden bg-[--main-background]">
          <RouterView v-slot="{ Component, route: _route }">
            <KeepAlive>
              <component :is="Component" v-if="_route.meta.keepAlive" :key="_route.path" />
            </KeepAlive>
            <component :is="Component" v-if="!_route.meta.keepAlive" :key="_route.path" />
          </RouterView>
        </div>
      </div>
    </div>
    <Search />
  </BaseLayout>
</template>

<script setup lang="jsx">
import { App } from 'ant-design-vue';
import { PLATFORM } from '@/constants';
import { logout } from '@/api';
import { minimize, maximize, exit } from '@/api/electron';
import { useBus, EVENT_CHAPTERS_BOX, EVENT_SEARCH_BOX } from '@/utils/bus';
import { useSettingStore } from '@/stores/setting';
import { useReadStore } from '@/stores/read';
import Setting from '@/components/Setting/index.vue';
import Search from '@/components/Search/index.vue';
import BaseLayout from './BaseLayout.vue';

const { modal } = App.useApp();
const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();
const readStore = useReadStore();
const openChaptersBox = useBus(EVENT_CHAPTERS_BOX);
const searchBox = useBus(EVENT_SEARCH_BOX);

function changeSidebar() {
  settingStore.data.sidebar = settingStore.data.sidebar === 'hidden' ? 'left' : 'hidden';
}

const navs = [
  { icon: 'codicon-book', path: '/pc/books', title: '书架' },
  { icon: 'codicon-search', path: '/pc/search', title: '搜索' },
  { icon: 'codicon-globe', path: '/pc/category', title: '分类' },
  { icon: 'codicon-extensions', path: '/pc/rules', title: '规则' }
];

function openSetting() {
  modal.confirm({
    icon: null,
    closable: true,
    draggable: true,
    mask: false,
    width: 600,
    footer: false,
    title: '设置',
    bodyClass: '!p-0',
    content: <Setting />
  });
}

async function onExit() {
  if (PLATFORM === 'electron') {
    exit();
  } else if (PLATFORM === 'browser') {
    await logout();
    window.location.reload();
  }
}
</script>
