<template>
  <div>
    <KeyboardShortcuts />
    <ReadPage />
    <SettingRow title="本地书籍目录">
      <vscode-text-field :value="settingStore.data.bookDir" class="w-full" @input="(event) => (settingStore.data.bookDir = event.target.value)">
      </vscode-text-field>
    </SettingRow>
    <SettingRow title="缓存">
      <vscode-button @click="clearCache">删除缓存</vscode-button>
    </SettingRow>
    <SettingRow title="摸鱼时间">
      <vscode-checkbox :checked="settingStore.timeIsShow" @input="handleInput">显示/隐藏</vscode-checkbox>
    </SettingRow>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { useSettingStore } from '@/stores/setting';
import * as cacheApi from '@/api/modules/cache';
import KeyboardShortcuts from './KeyboardShortcuts/index.vue';
import ReadPage from './ReadPage/index.vue';
import SettingRow from './SettingRow/index.vue';

const settingStore = useSettingStore();

function clearCache() {
  cacheApi.clear().then((res) => {
    if (res?.code === 0) {
      message.success('操作成功');
    }
  });
}

const handleInput = (event) => {
  console.log('event:', event);
  console.log('event.target.checked:', event.target.checked);
};
</script>
