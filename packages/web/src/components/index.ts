import type { App } from 'vue';
import Cover from './Cover/index.vue';
import Category from './Category/index.vue';
import Tabs from './Tabs/index.vue';
import RuleEmpty from './RuleEmpty/index.vue';

export default function useComponent(app: App<Element>) {
  app.component('ARCover', Cover);
  app.component('ARCategory', Category);
  app.component('ARTabs', Tabs);
  app.component('ARRuleEmpty', RuleEmpty);
}
