<template>
  <div>
    <SettingRow title="显示侧边栏">
      <a-switch v-model="settingStore.data.sidebar" checked-value="left" unchecked-value="hidden" />
    </SettingRow>
    <SettingRow title="窗口置顶">
      <a-switch v-model="settingStore.data.pinned" :checked-value="true" :unchecked-value="false" />
    </SettingRow>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting';
import SettingRow from '../SettingRow/index.vue';

const settingStore = useSettingStore();
</script>
