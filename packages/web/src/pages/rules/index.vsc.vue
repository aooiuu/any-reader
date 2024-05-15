<template>
  <div class="w-full">
    <TreeItem v-for="item in rulesStore.list" :key="item.id">
      {{ item.name }}
    </TreeItem>
  </div>
</template>

<script setup>
import { useRulesStore } from '@/stores/rules';
import TreeItem from '@/components/vsc/TreeItem.vue';

const rulesStore = useRulesStore();

rulesStore.sync();
</script>
