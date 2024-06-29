<template>
  <van-config-provider theme="dark" class="bg-[--ar-color-background] text-[--ar-color-text] h-full">
    <RouterView />
  </van-config-provider>
</template>

<script setup>
import { useRulesStore } from '@/stores/rules';
import { useFavoritesStore } from '@/stores/favorites';

useRulesStore().sync();
useFavoritesStore().sync();
</script>
