import NProgress from 'nprogress';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/pages/vscode/layout/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/pages/vscode/home/index.vue')
        },
        {
          path: '/player',
          component: () => import('@/pages/vscode/player/index.vue'),
          meta: {
            hideBtmBar: true
          }
        },
        {
          path: '/rules',
          component: () => import('@/pages/pc/rules/index.vue')
        },
        {
          path: '/rule-info',
          name: 'ruleInfo',
          component: () => import('@/pages/pc/rule-info/index.vue')
        },
        {
          path: '/iframe',
          component: () => import('@/pages/vscode/iframe/index.vue'),
          meta: {
            hideBtmBar: true
          }
        },
        {
          path: '/search',
          component: () => import('@/pages/pc/search/index.vue'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/vsc/search',
          component: () => import('@/pages/vscode/search/index.vue'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/vsc/rules',
          component: () => import('@/pages/vscode/rules/index.vsc.vue')
        },
        {
          path: '/category',
          component: () => import('@/pages/pc/category/index.vue')
        },
        {
          path: '/content',
          name: 'content',
          component: () => import('@/pages/vscode/content/index.vue')
        },
        {
          path: '/chapter',
          component: () => import('@/pages/vscode/chapter/index.vue'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/settings',
          component: () => import('@/pages/vscode/settings/index.vue')
        }
      ]
    }
  ]
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
