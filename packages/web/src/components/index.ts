import type { App } from 'vue';
import Cover from './Cover/index.vue';
import Category from './Category/index.vue';

export function useComponent(app: App<Element>) {
  app.component('ARCover', Cover);
  app.component('ARCategory', Category);
}
