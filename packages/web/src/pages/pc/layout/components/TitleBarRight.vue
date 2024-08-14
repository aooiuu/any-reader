<template>
  <div class="h-full w-20% flex items-center justify-end gap-4">
    <!-- 布局 -->
    <TitleBarIcon v-if="PLATFORM === 'electron'">
      <span :class="['codicon', pinned.pinned.value ? 'codicon-pinned-dirty' : 'codicon-pinned']" @click="pinned.changePinned" />
    </TitleBarIcon>
    <!-- 左边侧栏 -->
    <TitleBarIcon v-if="props.sidebar">
      <span
        :class="['codicon', settingStore.data.sidebar === 'hidden' ? 'codicon-layout-sidebar-left-off' : 'codicon-layout-sidebar-left']"
        @click="changeSidebar"
      />
    </TitleBarIcon>
    <template v-if="PLATFORM === 'electron'">
      <!-- 窗口 -->
      <TitleBarIcon @click="minimize">
        <span class="codicon codicon-chrome-minimize" />
      </TitleBarIcon>
      <TitleBarIcon class="fullscreen" @click="maximize">
        <span class="codicon codicon-chrome-maximize"></span>
      </TitleBarIcon>
    </template>
    <TitleBarIcon v-if="PLATFORM !== 'utools'" title="退出" @click="onExit">
      <span class="codicon codicon-chrome-close"></span>
    </TitleBarIcon>
  </div>
</template>

<script setup lang="ts">
import { PLATFORM } from '@/constants';
import { minimize, maximize, exit } from '@/api/modules/electron';
import { logout } from '@/api/modules/web';
import { useSettingStore } from '@/stores/setting';
import { usePinned } from '../usePinned';
import TitleBarIcon from './TitleBarIcon.vue';

const props = defineProps<{
  sidebar: boolean;
}>();

const pinned = usePinned();

const settingStore = useSettingStore();

async function onExit() {
  if (PLATFORM === 'electron') {
    exit();
  } else if (PLATFORM === 'browser') {
    await logout();
    window.location.reload();
  }
}

function changeSidebar() {
  settingStore.data.sidebar = settingStore.data.sidebar === 'hidden' ? 'left' : 'hidden';
}
</script>
