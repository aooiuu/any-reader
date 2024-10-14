<template>
  <div style="margin-top: 24px">
    <Giscus
      id="comments"
      :key="route.path"
      repo="aooiuu/any-reader"
      repo-id="R_kgDOLDIGcg"
      category="公告"
      category-id="DIC_kwDOLDIGcs4CcsAX"
      mapping="title"
      term="Welcome to giscus!"
      reactionsenabled="1"
      emit-metadata="0"
      inputposition="top"
      loading="lazy"
      :theme="isDark ? 'dark' : 'light'"
    ></Giscus>
  </div>
</template>

<script setup>
import Giscus from '@giscus/vue';
import { useRoute, useData } from 'vitepress';

const route = useRoute();
const { isDark } = useData();
</script>
