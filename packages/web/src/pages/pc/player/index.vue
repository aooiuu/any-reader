<template>
  <div ref="contentRef" class="h-full w-full"></div>
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

  const { name, chapterName } = route.query;
  document.title = [name, chapterName].filter((e) => e).join('-');
});

watch(
  () => route.query,
  () => {
    location.reload();
  }
);
</script>
