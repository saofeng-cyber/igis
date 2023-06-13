import { RouteConfig } from 'vue-router';
import NotFoundVue from '@/views/NotFound.vue';

export const commonRoutes: Array<RouteConfig> = [
  { path: '*', name: 'NotFound', component: NotFoundVue },
];
