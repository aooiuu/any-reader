<template>
  <div>
    <SettingRow title="字体大小">
      <a-input-number v-model:value="settingStore.data.readStyle.fontSize" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="行高">
      <a-input-number v-model:value="settingStore.data.readStyle.lineHeight" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="间距">
      <a-input-number v-model:value="settingStore.data.readStyle.letterSpacing" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="字体颜色">
      <input v-model="settingStore.data.readStyle.textColor" type="color" style="border: solid 1px rgba(0, 0, 0, 0.1)" />
    </SettingRow>
    <SettingRow title="背景颜色">
      <input v-model="settingStore.data.readStyle.backgroundColor" type="color" style="border: solid 1px rgba(0, 0, 0, 0.1)" />
    </SettingRow>
    <div class="flex items-center h-44 lh-44 px-10 b-b b-b-1 b-b-solid b-b-[--ar-color-border]">
      <div class="flex-1">推荐背景色</div>
      <div class="flex gap-4 flex-wrap">
        <div
          v-for="color in THEME"
          :key="color.label"
          :style="{
            background: color.color
          }"
          :title="color.label"
          class="w-30 h-30 rounded-4 cursor-pointer hover:b-2 b-0"
          @click="changeTheme(color)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { THEME } from '@/constants/theme';
import { useSettingStore } from '@/stores/setting';
import SettingRow from '../SettingRow/index.vue';

const setTheme = inject('setTheme');
const settingStore = useSettingStore();

// 设置颜色
function changeTheme(color) {
  settingStore.data.readStyle.backgroundColor = color.color;
  settingStore.data.readStyle.textColor = color.textColor;
  setTheme(color.theme);
}
</script>
