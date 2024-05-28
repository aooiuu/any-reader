<template>
  <div ref="contentRef" class="w-full h-full"></div>
</template>

<script setup>
import Hls from 'hls.js';
import DPlayer from 'dplayer';

const route = useRoute();

const contentRef = ref();

onMounted(async () => {
  new DPlayer({
    container: contentRef.value,
    autoplay: true,
    video: {
      url: route.query.url,
      type: 'customHls',
      customType: {
        customHls: function (video) {
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        }
      }
    }
  });
});

watch(
  () => route.query,
  () => {
    location.reload();
  }
);
</script>
