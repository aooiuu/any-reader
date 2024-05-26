<template>
  <div>
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
    <div class="flex items-center h-44 lh-44 px-10 b-b b-1 b-solid b-[--titleBar-border-bottom]">
      <div class="flex-1">推荐背景色</div>
      <div class="flex gap-4 flex-wrap">
        <div
          v-for="color in colors"
          :key="color.label"
          :style="{
            background: color.color
          }"
          :title="color.label"
          class="w-30 h-30 rounded-4 cursor-pointer hover:b-2 b-0 b-solid b-[#006ab1]"
          @click="setTheme(color)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting';
import SettingRow from '../SettingRow/index.vue';

const settingStore = useSettingStore();

// 预置配色
const colors = [
  { label: '杏仁黄', color: '#FAF9DE' },
  { label: '秋叶褐', color: '#FFF2E2' },
  { label: '胭脂红', color: '#FDE6E0' },
  { label: '青草绿', color: '#E3EDCD' },
  { label: '海天蓝', color: '#DCE2F1' },
  { label: '葛巾紫', color: '#E9EBFE' },
  { label: '极光灰', color: '#EAEAEF' },
  { label: '默认黑', color: '#1f1f1f' }
];

// 设置颜色
function setTheme(color) {
  settingStore.data.readStyle.backgroundColor = color.color;
  settingStore.data.readStyle.textColor = '#000000e6';
}
</script>
