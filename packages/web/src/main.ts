import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useComponent } from './components';

import 'nprogress/nprogress.css';
import '@unocss/reset/sanitize/sanitize.css';
import '@unocss/reset/sanitize/assets.css';
import 'uno.css';
import './assets/main.scss';
// vscode ui
import './plugins/vsc-ui';

import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(createPinia());
useComponent(app);

router.beforeEach((_from, _to, next) => {
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
