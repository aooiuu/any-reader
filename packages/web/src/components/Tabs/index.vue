<template>
  <div class="ar-tabs relative flex items-center md:block overflow-auto mb-5 select-none pr-0 md:pr-10">
    <div class="mx-2 hover:text-[--ar-color-primary-text] cursor-pointer md:hidden" @click="scrollToLeft">
      <LeftOutlined />
    </div>
    <div ref="navsRef" class="flex-1 flex items-center md:block overflow-auto ar-scrollbar-none" @wheel="onWheel">
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
    <div class="mx-2 hover:text-[--ar-color-primary-text] cursor-pointer md:hidden" @click="scrollToRight">
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
