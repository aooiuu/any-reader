import type { App } from 'vue';
import Cover from './Cover/index.vue';
import CoverM from './Cover/mobile.vue';
import Category from './Category/index.vue';
import CategoryM from './Category/mobile.vue';

export function useComponent(app: App<Element>) {
  app.component('ARCover', Cover);
  app.component('ARCoverM', CoverM);
  app.component('ARCategory', Category);
  app.component('ARCategoryM', CategoryM);
}
