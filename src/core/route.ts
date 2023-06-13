import Router from 'vue-router';

/** 动态生成路由 */
const generateRouter = (item: any) => {
  return {
    path: item.rootPath,
    component: () => import(`@/layout/${item.rootComponent}.vue`),
    children: [
      {
        path: item.skipPath,
        component: () => import(`@/views/${item.skipComponent}.vue`),
        meta: {
          title: item.menuName
        }
      }
    ]
  };
};

/** 创建路由 */
const createRouter = (constantRoutes: any, asyncRoutes: any) =>
  new Router({
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition;
      }
      return { x: 0, y: 0 };
    },
    base: process.env.VUE_APP_BASE_URL,
    routes: [...asyncRoutes, ...constantRoutes]
  });

/** 重置路由 */
const resetRouter = (router: any, constantRoutes: any, asyncRoutes: any) => {
  const newRouter = createRouter(constantRoutes, asyncRoutes);
  (router as any).matcher = (newRouter as any).matcher;
};

export {
  generateRouter,
  createRouter,
  resetRouter
};
