import Theme from 'vitepress/theme';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import '@shikijs/vitepress-twoslash/style.css';
import 'uno.css'
import RulePlay from '../components/RulePlay/index.vue';

export default {
  ...Theme,

  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue);
    app.component('RulePlay', RulePlay);
  }
};
