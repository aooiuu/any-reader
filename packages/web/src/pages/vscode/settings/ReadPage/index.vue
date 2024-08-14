<template>
  <div>
    <SettingRow title="字体大小">
      <vscode-text-field
        :value="settingStore.data.readStyle.fontSize"
        class="w-full"
        mode="button"
        @input="(event) => (settingStore.data.readStyle.fontSize = +event.target.value)"
      />
    </SettingRow>
    <SettingRow title="字体粗细">
      <vscode-text-field
        :value="settingStore.data.readStyle.fontWeight"
        class="w-full"
        mode="button"
        @input="(event) => (settingStore.data.readStyle.fontWeight = +event.target.value)"
      />
    </SettingRow>
    <SettingRow title="行高">
      <vscode-text-field
        :value="settingStore.data.readStyle.lineHeight"
        class="w-full"
        mode="button"
        @input="(event) => (settingStore.data.readStyle.lineHeight = +event.target.value)"
      />
    </SettingRow>
    <SettingRow title="文字间距">
      <vscode-text-field
        :value="settingStore.data.readStyle.letterSpacing"
        class="w-full"
        mode="button"
        @input="(event) => (settingStore.data.readStyle.letterSpacing = +event.target.value)"
      />
    </SettingRow>
    <SettingRow title="段落间距">
      <vscode-text-field
        :value="settingStore.data.readStyle.sectionSpacing"
        class="w-full"
        mode="button"
        @input="(event) => (settingStore.data.readStyle.sectionSpacing = +event.target.value)"
      />
    </SettingRow>
    <SettingRow title="文字颜色">
      <div class="flex items-center">
        <input v-model="settingStore.data.readStyle.textColor" type="color" style="border: solid 1px rgba(0, 0, 0, 0.1)" />
        <vscode-button class="ml-5" @click="settingStore.data.readStyle.textColor = ''">重置</vscode-button>
      </div>
    </SettingRow>
    <SettingRow title="背景颜色">
      <div class="flex items-center">
        <input v-model="settingStore.data.readStyle.backgroundColor" type="color" style="border: solid 1px rgba(0, 0, 0, 0.1)" />
        <vscode-button class="ml-5" @click="settingStore.data.readStyle.backgroundColor = ''">重置</vscode-button>
      </div>
    </SettingRow>
    <SettingRow title="文字透明度 (0~1)">
      <div class="flex items-center">
        <vscode-text-field
          :value="settingStore.data.readStyle.textOpacity"
          class="flex-1"
          mode="button"
          @input="(event) => (settingStore.data.readStyle.textOpacity = +event.target.value)"
        />
        <vscode-button class="ml-5" @click="settingStore.data.readStyle.textOpacity = 1">重置</vscode-button>
      </div>
    </SettingRow>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting';
import SettingRow from '../SettingRow/index.vue';

const settingStore = useSettingStore();
</script>
