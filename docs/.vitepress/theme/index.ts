import { h } from 'vue';
import Theme from 'vitepress/theme';
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client';
import '@shikijs/vitepress-twoslash/style.css';
import 'uno.css';
import './style.css';
import RulePlay from '../components/RulePlay/index.vue';
import RuleComparess from '../components/RuleComparess/index.vue';
import Playground from '../components/Playground/index.vue';
import GiscusComment from '../components/GiscusComment/index.vue';

export default {
  ...Theme,

  Layout() {
    return h(Theme.Layout, null, {
      'doc-after': () => h(GiscusComment)
    });
  },

  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue);
    app.component('RulePlay', RulePlay);
    app.component('RuleComparess', RuleComparess);
    app.component('Playground', Playground);
  }
};
