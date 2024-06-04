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
    <SettingRow title="行高">
      <vscode-text-field
        :value="settingStore.data.readStyle.lineHeight"
        class="w-full"
        mode="button"
        @input="(event) => (settingStore.data.readStyle.lineHeight = +event.target.value)"
      />
    </SettingRow>
    <SettingRow title="间距">
      <vscode-text-field
        :value="settingStore.data.readStyle.letterSpacing"
        class="w-full"
        mode="button"
        @input="(event) => (settingStore.data.readStyle.letterSpacing = +event.target.value)"
      />
    </SettingRow>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting';
import SettingRow from '../SettingRow/index.vue';

const settingStore = useSettingStore();
</script>
