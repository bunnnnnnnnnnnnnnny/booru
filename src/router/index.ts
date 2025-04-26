import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('@/views/posts/index.vue'),
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: () => import('@/views/posts/[id].vue'),
    },
  ],
});

export default router;
