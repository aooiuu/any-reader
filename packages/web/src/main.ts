import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

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

import { createPinia } from 'pinia';

import '@/utils/monaco';

const app = createApp(App);

app.use(router);
app.use(ArcoVue);
app.use(Icon);
app.use(createPinia());

app.mount('#app');
