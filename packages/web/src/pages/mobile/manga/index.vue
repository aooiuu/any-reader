<template>
  <Category
    :content-type="CONTENT_TYPE.MANGA"
    @to-chapter="
      (arg) =>
        router.push({
          path: '/chapter',
          query: arg
        })
    "
  />
</template>

<script setup>
import { CONTENT_TYPE } from '@/constants';
import Category from '../components/Category/index.vue';

const router = useRouter();
</script>
