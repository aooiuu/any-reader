import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useComponent } from './components';

import 'nprogress/nprogress.css';
import '@unocss/reset/sanitize/sanitize.css';
import '@unocss/reset/sanitize/assets.css';
import 'uno.css';
import './assets/vscode.css';
import './assets/main.scss';

// vscode ui
import './plugins/vsc-ui';

import ArcoVue from '@arco-design/web-vue';
import Icon from '@arco-design/web-vue/es/icon';
import '@arco-design/web-vue/dist/arco.css';
import { Modal } from '@arco-design/web-vue';

import { createPinia } from 'pinia';

import '@/utils/monaco';

const app = createApp(App);
Modal._context = app._context;

app.use(router);
app.use(ArcoVue);
app.use(Icon);
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
