<template>
  <div>
    <SettingRow title="版本">
      <div>{{ VERSION }}</div>
    </SettingRow>
    <SettingRow title="文档">
      <a target="_blank" href="https://aooiuu.github.io/any-reader/">打开文档</a>
    </SettingRow>
    <SettingRow title="反馈">
      <a target="_blank" href="https://github.com/aooiuu/any-reader/issues">Issues</a>
    </SettingRow>
    <SettingRow title="源代码">
      <a target="_blank" href="https://github.com/aooiuu/any-reader">Github</a>
    </SettingRow>
  </div>
</template>

<script setup>
import { VERSION } from '@/constants';
import SettingRow from '../SettingRow/index.vue';
</script>
