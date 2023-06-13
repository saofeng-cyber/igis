import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import AppMainVue from '@/layout/app-main.vue';
import { commonRoutes } from './common';
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/home',
    name: 'Home',
    redirect: '/index',
    component: AppMainVue,
    meta: {
      title: '首页',
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '配置引导',
        },
      },
      {
        path: '/main',
        name: 'main',
        component: () => import('../views/triage-table/triage-table.vue'),
        meta: {
          title: '关于',
        },
      },
    ],
  },
  ...commonRoutes,
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to: any, from, next) => {
  document.title = to.meta.title as string;
  next();
});
export default router;
