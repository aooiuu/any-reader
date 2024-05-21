<template>
  <div>
    <SettingRow title="显示侧边栏">
      <a-switch v-model="settingStore.data.sidebar" checked-value="left" unchecked-value="hidden" />
    </SettingRow>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting';
import SettingRow from '../SettingRow/index.vue';

const settingStore = useSettingStore();
</script>
