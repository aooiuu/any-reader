<template>
  <div class="details custom-block !p-10px">
    <button class="mb-10 rounded-4 bg-[#3ca877] px-5 text-[#fff]" @click="exec">执行</button>
    <codemirror v-model="inputText" :autofocus="true" :extensions="extensions" @ready="handleReady" />
  </div>
</template>

<script setup>
import { ref, shallowRef, watch, onMounted } from 'vue';
import { useEventListener } from '@vueuse/core';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { createRuleManager } from '@any-reader/core/browser';
import { decodeHash, encodeHash } from '../../utils/hash';

globalThis.createRuleManager = createRuleManager;

const tpl = `
const rule = {
  // 完善规则内容
};

const analyzer = createRuleManager(rule);

async function search() {
  const list = await analyzer.search('我的');
  console.log('[搜索结果]', list);
  const chapters = await analyzer.getChapter(list[0].url);
  console.log('[章节列表]', chapters);
  const content = await analyzer.getContent(chapters[0].url);
  console.log('[内容]', content);
}

async function discover() {
  const discoverMap = await analyzer.discoverMap();
  console.log('[发现页分类]', discoverMap);
  const discover = await analyzer.discover(discoverMap[0].pairs[0].value);
  console.log('[发现页列表]', discover);
  const chapters = await analyzer.getChapter(discover[0].url);
  console.log('[章节列表]', chapters);
  const content = await analyzer.getContent(chapters[0].url);
  console.log('[内容]', content);
}

search();
discover();
`;
const inputText = ref(tpl);

watch([inputText], () => {
  try {
    history.replaceState(
      {},
      '',
      '#' +
        encodeHash({
          inputText: inputText.value
        })
    );
  } catch (error) {
    console.error(error);
  }
});

const extensions = [javascript()];

const view = shallowRef();
const handleReady = (payload) => {
  view.value = payload.view;
};

function exec() {
  eval(inputText.value);
}

function hashchange() {
  try {
    const data = decodeHash();
    inputText.value = data.inputText || tpl;
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  hashchange();
});

useEventListener('hashchange', hashchange);
</script>
