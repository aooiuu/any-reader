<template>
  <div class="flex flex-col w-102 overflow-hidden cursor-pointer" @click="showChapter">
    <div class="w-102 h-136 mb-5 rounded-6 overflow-hidden relative">
      <ARCover :src="props.cover" :preview="false" alt="" srcset="" class="cover w-102 h-136" width="100%" height="100%" fit="cover" />
      <slot />
    </div>
    <div class="overflow-hidden whitespace-nowrap text-ellipsis mb-2 text-[--ar-color-text]">{{ props.name }}</div>
    <div class="overflow-hidden whitespace-nowrap text-ellipsis text-12 op-70 text-[--ar-color-text]">{{ props.author }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string; cover?: string; author?: string; filePath?: string; ruleId?: string }>();

const router = useRouter();

function showChapter() {
  router.push({
    path: '/chapter',
    query: {
      filePath: props.filePath,
      ruleId: props.ruleId
    }
  });
}
</script>
