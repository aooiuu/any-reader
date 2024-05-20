<template>
  <div>
    <!-- 字体 -->
    <!-- 字体大小 -->
    <SettingRow title="字体大小">
      <a-input-number v-model="settingStore.data.readStyle.fontSize" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="行高">
      <a-input-number v-model="settingStore.data.readStyle.lineHeight" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="间距">
      <a-input-number v-model="settingStore.data.readStyle.letterSpacing" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="字体颜色">
      <a-color-picker v-model="settingStore.data.readStyle.textColor" show-text />
    </SettingRow>
    <SettingRow title="背景颜色">
      <a-color-picker v-model="settingStore.data.readStyle.backgroundColor" show-text />
    </SettingRow>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting';
import SettingRow from '../SettingRow/index.vue';

const settingStore = useSettingStore();
</script>
