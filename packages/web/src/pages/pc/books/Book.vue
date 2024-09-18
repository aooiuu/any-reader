<template>
  <div class="w-102 flex flex-col cursor-pointer overflow-hidden" @click="showChapter">
    <div class="relative mb-5 h-136 w-102 overflow-hidden rounded-6">
      <ARCover :src="props.cover" :preview="false" alt="" srcset="" class="cover !h-136px !w-102px" width="100%" height="100%" fit="cover" />
      <slot />
    </div>
    <div class="mb-2 overflow-hidden text-ellipsis whitespace-nowrap text-[--ar-color-text]">{{ props.name }}</div>
    <div class="overflow-hidden text-ellipsis whitespace-nowrap text-12 text-[--ar-color-text] op-70">{{ props.author }}</div>
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
      ruleId: props.ruleId,
      name: props.name
    }
  });
}
</script>
