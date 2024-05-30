import type { App } from 'vue';
import ARImage from './ARImage/index.vue';

export function useComponent(app: App<Element>) {
  app.component('ARImage', ARImage);
}
