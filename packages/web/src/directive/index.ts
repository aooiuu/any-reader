import type { App } from 'vue';

export default function useDirective(app: App) {
  app.directive('focus', {
    mounted: (el) => el.focus()
  });
}
