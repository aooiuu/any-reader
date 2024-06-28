<template>
  <div>
    <SettingRow title="显示侧边栏">
      <a-switch v-model:checked="settingStore.data.sidebar" checked-value="left" unchecked-value="hidden" />
    </SettingRow>
    <SettingRow title="窗口置顶">
      <a-switch v-model:checked="settingStore.data.pinned" :checked-value="true" :unchecked-value="false" />
    </SettingRow>

    <SettingRow title="本地书籍目录">
      <a-input v-model:value="settingStore.data.bookDir" class="!w-200px" />
    </SettingRow>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting';
import SettingRow from '../SettingRow/index.vue';

const settingStore = useSettingStore();
</script>
