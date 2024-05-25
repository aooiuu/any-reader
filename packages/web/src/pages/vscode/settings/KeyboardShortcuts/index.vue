<template>
  <div>
    <KeyRow v-model="settingStore.data.keyboardShortcuts.prevChapter" title="上一章" :key-text="keyText" />
    <KeyRow v-model="settingStore.data.keyboardShortcuts.nextChapter" title="下一章" :key-text="keyText" />
    <KeyRow v-model="settingStore.data.keyboardShortcuts.pageUp" title="上一屏" :key-text="keyText" />
    <KeyRow v-model="settingStore.data.keyboardShortcuts.pageDown" title="下一屏" :key-text="keyText" />
  </div>
</template>

<script setup>
import { useMagicKeys } from '@/hooks/useMagicKeys';
import { useSettingStore } from '@/stores/setting.vsc';
import KeyRow from './KeyRow.vue';

const { keyText } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    e.preventDefault();
  }
});

const settingStore = useSettingStore();
</script>
