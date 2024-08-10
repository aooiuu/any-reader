<template>
  <div class="h-full overflow-auto">
    <SettingRow title="字体大小">
      <a-input-number v-model:value="settingStore.data.readStyle.fontSize" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="字体粗细">
      <a-input-number v-model:value="settingStore.data.readStyle.fontWeight" :step="100" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="行高">
      <a-input-number v-model:value="settingStore.data.readStyle.lineHeight" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="文字间距">
      <a-input-number v-model:value="settingStore.data.readStyle.letterSpacing" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="段落间距">
      <a-input-number v-model:value="settingStore.data.readStyle.sectionSpacing" class="!w-120px" mode="button" />
    </SettingRow>
    <SettingRow title="文字颜色">
      <input v-model="settingStore.data.readStyle.textColor" type="color" style="border: solid 1px rgba(0, 0, 0, 0.1)" />
    </SettingRow>
    <SettingRow title="背景颜色">
      <input v-model="settingStore.data.readStyle.backgroundColor" type="color" style="border: solid 1px rgba(0, 0, 0, 0.1)" />
    </SettingRow>
    <div class="h-44 flex items-center b-b b-b-1 b-b-[--ar-color-border] b-b-solid px-10 lh-44">
      <div class="flex-1">推荐背景色</div>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="color in THEME"
          :key="color.label"
          :style="{
            background: color.color
          }"
          :title="color.label"
          class="h-30 w-30 cursor-pointer b-0 rounded-4 hover:b-2"
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
