import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import useComponent from './components';
import useDirective from './directive';
import './assets';
import './plugins/vsc-ui';
import './plugins/antd';
import { addHistory } from '@/api/modules/resource-history';
import { saveChapterHistory } from '@/api/modules/chapter-history';

import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(createPinia());
useComponent(app);
useDirective(app);

router.beforeEach((to, _from, next) => {
  const { query, path } = to;

  // 添加历史记录
  if (path === '/chapter' && query.ruleId && query.name) {
    addHistory(query);
  } else if (path === '/content') {
    saveChapterHistory(query);
  }

  // 处理 vscode 第一次打开页面的地址
  if (window.__vscode$initialize_page) {
    const initialize_page = window.__vscode$initialize_page;
    window.__vscode$initialize_page = '';
    next(initialize_page);
  } else {
    next();
  }
});

app.mount('#app');
