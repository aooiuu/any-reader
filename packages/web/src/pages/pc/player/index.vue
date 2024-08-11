<template>
  <div ref="contentRef" class="h-full w-full"></div>
</template>

<script setup>
import Hls from 'hls.js';
import DPlayer from 'dplayer';
import { useBus, EVENT_TITLE_CHANGE } from '@/utils/bus';

const route = useRoute();

const contentRef = ref();
const eventTitleChange = useBus(EVENT_TITLE_CHANGE);

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
  eventTitleChange.emit(document.title);
});

watch(
  () => route.query,
  () => {
    location.reload();
  }
);
</script>
