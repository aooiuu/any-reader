<template>
  <div class="ar-tabs relative mb-5 flex select-none items-center overflow-auto pr-0 sm:block sm:pr-10">
    <div class="mx-2 cursor-pointer sm:hidden hover:text-[--ar-color-primary-text]" @click="scrollToLeft">
      <LeftOutlined />
    </div>
    <div ref="navsRef" class="ar-scrollbar-none flex flex-1 items-center overflow-auto sm:block" @wheel="onWheel">
      <div v-for="(option, idx) in props.options" :key="idx" class="flex-shrink-0" @click="changeTab(option)">
        <div
          :class="[
            'h-32 lh-32 px-10 rounded-10  cursor-pointer hover:bg-[--ar-left-bar-active-bg-secondary] overflow-hidden',
            model === option[props.valueKey] ? ' bg-[--ar-left-bar-active-bg-secondary] text-[--ar-color-primary-text]' : ''
          ]"
        >
          <slot :label="option[props.labelKey]" :item="option">{{ option[props.labelKey] }}</slot>
        </div>
      </div>
    </div>
    <div class="mx-2 cursor-pointer sm:hidden hover:text-[--ar-color-primary-text]" @click="scrollToRight">
      <RightOutlined />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { useTabs } from './useTabs';

const model = defineModel<string>();

const props = defineProps<{
  options: any[];
  labelKey: string;
  valueKey: string;
}>();

const emit = defineEmits(['change']);

const navsRef = ref();

const { scrollToLeft, scrollToRight, onWheel } = useTabs(navsRef);

function changeTab(option: any) {
  emit('change', option);
  model.value = option[props.valueKey];
}
</script>

<style scoped lang="scss">
.ar-tabs {
  &::-webkit-scrollbar {
    display: none;
  }

  &:hover {
    &::-webkit-scrollbar {
      display: initial;
    }
  }
}
</style>
