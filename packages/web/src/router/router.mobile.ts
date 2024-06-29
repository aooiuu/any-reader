import NProgress from 'nprogress';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/mobile/home',
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
          component: () => import('@/pages/mobile/home/index.vue')
        },
        {
          path: 'manga',
          component: () => import('@/pages/mobile/home/index.vue')
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
