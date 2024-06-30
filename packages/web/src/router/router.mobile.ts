import NProgress from 'nprogress';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/player',
      component: () => import('@/pages/mobile/player/index.vue')
    },
    {
      path: '/chapter',
      component: () => import('@/pages/mobile/chapter/index.vue')
    },
    {
      path: '/content',
      component: () => import('@/pages/mobile/content/index.vue')
    },
    {
      path: '/',
      redirect: '/video',
      component: () => import('@/pages/mobile/layout/index.vue'),
      children: [
        {
          path: 'home',
          component: () => import('@/pages/mobile/home/index.vue')
        },
        {
          path: 'video',
          component: () => import('@/pages/mobile/video/index.vue')
        },
        {
          path: 'novel',
          component: () => import('@/pages/mobile/novel/index.vue')
        },
        {
          path: 'manga',
          component: () => import('@/pages/mobile/manga/index.vue')
        },
        {
          path: 'setting',
          component: () => import('@/pages/mobile/home/index.vue')
        }
      ]
    }
  ]
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
