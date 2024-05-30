<template>
  <div class="flex flex-col w-102 overflow-hidden cursor-pointer" @click="showChapter">
    <div class="w-102 h-136 mb-5 rounded-6 overflow-hidden">
      <ARImage :src="props.cover" :preview="false" alt="" srcset="" class="cover w-102 h-136" width="100%" height="100%" fit="cover" />
    </div>
    <div class="overflow-hidden whitespace-nowrap text-ellipsis mb-2 text-[--foreground]">{{ props.name }}</div>
    <div class="overflow-hidden whitespace-nowrap text-ellipsis text-12 op-70 text-[--foreground]">{{ props.author }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string; cover?: string; author?: string; filePath?: string; ruleId?: string }>();

const router = useRouter();

function showChapter() {
  router.push({
    path: '/pc/chapter',
    query: {
      filePath: props.filePath,
      ruleId: props.ruleId
    }
  });
}
</script>

<style scoped>
.cover {
  transition: all ease 0.3s;
}
.cover:hover {
  transform: scale(1.2);
}
</style>
