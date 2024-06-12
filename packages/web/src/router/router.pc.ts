import NProgress from 'nprogress';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/pc/login/index.vue')
    },
    {
      path: '/install',
      name: 'install',
      component: () => import('@/pages/pc/install/index.vue')
    },
    {
      path: '/',
      redirect: '/pc/books',
      component: () => import('@/pages/pc/layout/window.vue'),
      children: [
        {
          path: '/player',
          component: () => import('@/pages/pc/player/index.vue')
        },
        {
          path: '/iframe',
          component: () => import('@/pages/vscode/iframe/index.vue')
        }
      ]
    },

    // pc
    {
      path: '/pc',
      component: () => import('@/pages/pc/layout/index.vue'),
      children: [
        {
          path: 'books',
          component: () => import('@/pages/pc/books/index.vue')
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/pages/pc/search/index.vue'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'category',
          component: () => import('@/pages/pc/category/index.vue')
        },
        {
          path: 'rules',
          component: () => import('@/pages/pc/rules/index.vue')
        },
        {
          path: 'chapter',
          component: () => import('@/pages/pc/chapter/index.vue')
        },
        {
          path: 'content',
          component: () => import('@/pages/pc/content/index.vue')
        },
        {
          path: 'rule-info',
          name: 'ruleInfo',
          component: () => import('@/pages/pc/rule-info/index.vue')
        }
      ]
    }
  ]
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
