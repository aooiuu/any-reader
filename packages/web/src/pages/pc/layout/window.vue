<template>
  <BaseLayout>
    <div class="relative h-full w-full flex flex-col overflow-hidden">
      <TopContainer>
        <div class="topbar__left w-20%" />
        <div class="w-60% flex flex-1 items-center justify-center gap-4 text-[--ar-color-text]">{{ title }}</div>
        <TitleBarRight :sidebar="false" />
      </TopContainer>
      <div class="flex flex-1 overflow-auto">
        <RouterView v-slot="{ Component, route: _route }">
          <KeepAlive>
            <component :is="Component" v-if="_route.meta.keepAlive" :key="_route.path" />
          </KeepAlive>
          <component :is="Component" v-if="!_route.meta.keepAlive" :key="_route.path" />
        </RouterView>
      </div>
    </div>
    <Search />
  </BaseLayout>
</template>

<script setup lang="jsx">
import Search from '@/components/Search/index.vue';
import BaseLayout from './components/BaseLayout.vue';
import TitleBarRight from './components/TitleBarRight.vue';
import TopContainer from './components/TopContainer.vue';
import { useBus, EVENT_TITLE_CHANGE } from '@/utils/bus';

const title = ref('');

const eventTitleChange = useBus(EVENT_TITLE_CHANGE);

eventTitleChange.on((val) => {
  title.value = val;
});
</script>
