<template>
  <div class="h-full w-full flex items-center justify-center bg-[--activityBar-background]">
    <a-empty>
      <template #description>
        <p>您还没有配置规则！</p>
        <a @click="router.push('/rules')">配置规则</a> | <a href="https://aooiuu.github.io/any-reader/" target="_blank">查看文档</a> |
        <a href="https://github.com/aooiuu/any-reader/issues" target="_blank">反馈</a>
      </template>
    </a-empty>
  </div>
</template>

<script setup>
const router = useRouter();
</script>
