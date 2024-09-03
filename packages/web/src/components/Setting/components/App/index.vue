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

    <SettingRow title="缓存">
      <a-button @click="clearCache">删除缓存</a-button>
    </SettingRow>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import * as cacheApi from '@/api/modules/cache';
import { useSettingStore } from '@/stores/setting';
import SettingRow from '../SettingRow/index.vue';

const settingStore = useSettingStore();

function clearCache() {
  cacheApi.clear().then((res) => {
    if (res?.code === 0) {
      message.success('操作成功');
    }
  });
}
</script>
