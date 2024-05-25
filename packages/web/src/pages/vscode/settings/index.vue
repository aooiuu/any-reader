<template>
  <div>
    <KeyboardShortcuts />

    <SettingRow title="本地书籍目录">
      <vscode-text-field :value="settingStore.data.bookDir" class="w-full" @input="(event) => (settingStore.data.bookDir = event.target.value)">
      </vscode-text-field>
    </SettingRow>
  </div>
</template>

<script setup>
import { useSettingStore } from '@/stores/setting.vsc';
import KeyboardShortcuts from './KeyboardShortcuts/index.vue';
import SettingRow from './SettingRow/index.vue';

const settingStore = useSettingStore();
</script>
