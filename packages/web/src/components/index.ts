import type { App } from 'vue';
import Cover from './Cover/index.vue';
import Category from './Category/index.vue';
import Tabs from './Tabs/index.vue';

export function useComponent(app: App<Element>) {
  app.component('ARCover', Cover);
  app.component('ARCategory', Category);
  app.component('ARTabs', Tabs);
}
