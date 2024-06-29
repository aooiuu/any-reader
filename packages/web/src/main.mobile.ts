import { createApp } from 'vue';
import App from './Mobile.vue';
import router from '@/router/router.mobile';
import { useComponent } from './components';

import 'nprogress/nprogress.css';
import '@unocss/reset/sanitize/sanitize.css';
import '@unocss/reset/sanitize/assets.css';
import 'uno.css';
import './assets/main.scss';

import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(createPinia());
useComponent(app);

app.mount('#app');
