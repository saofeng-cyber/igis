import { menu } from '@/api/common/menu';
// import { constantRoutes, staticRoutes } from '@/router';
import { RoutesModule } from '@/store/modules/routes';
// import { RouteConfig } from 'vue-router';
import { createRouter, generateRouter } from './route';
import Vue from 'vue';
import Layout from '@/layout/layout.vue';
import Router, { RouteConfig } from 'vue-router';
Vue.use(Router);

const staticRoutes: RouteConfig[] = [];
class Startup {
  /** 配置打印信息 */
  public static async bootstrap() {
    try {
      const urlAndroid = window.location.href;
      if (
        urlAndroid.indexOf('/fzwyjh/fzAreaScreen') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzRoomScreen') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/tigcliswindow') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/tigclisareascreen') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzPacsWindow') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzPacsRoom') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzYfWindow') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzYfRoom') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzMzRoom') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzMzTdoc') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzRoomTwoScreen') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzAreaScreenDetail') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzAreaScreenScroll') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzScreenXt') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzKqArea') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzMzVertical') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzYfWindowFour') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzAreaScreenNewDetail') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/tigcAndroidAdmin') !== -1 ||
        urlAndroid.indexOf('/fzwyjh/fzYjScreen') !== -1
      ) {
        const _pathList = urlAndroid.split('$$$');
        if (_pathList.length > 4 && _pathList[1] === 'doset') {
          window.sessionStorage.setItem(
            'selectedSystem',
            decodeURIComponent(_pathList[2])
          );
          window.sessionStorage.setItem(
            'currentUser',
            decodeURIComponent(_pathList[3])
          );
          console.info(decodeURIComponent(_pathList[4]));
          document.cookie = decodeURIComponent(_pathList[4]);
          console.info(document.cookie);
          const url = _pathList[0];
          history.pushState(null, String(), url);
          window.location.reload();
        }
      }
      if (staticRoutes.length > 0) {
        this.toConvertRouters();
      }
      if (process.env.NODE_ENV === 'development') {
        const initConfig: any = {
          selectedSystem:
            '{"deptCode":"288","deptId":"288","deptName":"肾病内科","orgId":"10033","sysytemId":"4607730639756853671","systemName":"分诊导引","url":"tigc/","userSysId":"4904096497719840653","userSysName":"分诊导医"}',
          currentUser:
            '{"accountId":"4904058831359971202","accountName":"058003","hospitalId":"10033001","hospitalName":"灰灰度测试医院","mainDeptId":"157","mainDeptCode":"157","mainDeptName":"内科门诊","orgId":"10033","orgName":"灰灰度测试医院","superUser":false,"userId":"4904058831259307913","userCode":"058003","userName":"刘群","token":"1acd61c4-6033-42bc-86ab-9a767139ae9e","secret":"7953689070406649","organizationCode":"h123123123","medicalInsuranceCode":null,"idCard":"MzcwOTIzMTk5NjA1MDU0MjM4","addressCode":[{"dictName":"中国","dictId":"1"},{"dictName":"四川省","dictId":"510000"},{"dictName":"成都市","dictId":"510100"},{"dictName":"锦江区","dictId":"510104"}]}'
        };
        for (const key in initConfig) {
          sessionStorage.setItem(key, initConfig[key]);
        }
      }
      const asyncRoutes: any = await this.getAsyncRouters();
      console.log('asyncRoutes', asyncRoutes);
      let constantRoutes: RouteConfig[] = [];
      if (asyncRoutes) {
        constantRoutes = [
          {
            path: '',
            redirect:
              asyncRoutes[0]?.path + '/' + asyncRoutes[0]?.children[0]?.path
          },
          {
            path: '/redirect',
            component: Layout,
            meta: { hidden: true },
            children: [
              {
                path: '/redirect/:path(.*)',
                component: () =>
                  import(
                    /* webpackChunkName: "redirect" */ '@/views/redirect/index.vue'
                  )
              }
            ]
          }
        ];
        const router = createRouter(constantRoutes, [
          ...staticRoutes,
          ...asyncRoutes
        ]);
        console.log('router', router);
        return Promise.resolve({ router: router });
      } else {
        constantRoutes = [
          {
            path: '/redirect',
            component: Layout,
            meta: { hidden: true },
            children: [
              {
                path: '/redirect/:path(.*)',
                component: () =>
                  import(
                    /* webpackChunkName: "redirect" */ '@/views/redirect/index.vue'
                  )
              }
            ]
          }
        ];
        const router = createRouter(constantRoutes, [...staticRoutes]);
        console.log('router', router);
        return Promise.resolve({ router: router });
      }
      // console.log('constantRoutes', constantRoutes);
      // const asyncRoutes: any = [];
      // const router = createRouter(constantRoutes, [...staticRoutes, ...asyncRoutes]);
      // console.log('router', router);
      // return Promise.resolve({ router: router });
    } catch (error) {
      return Promise.reject(error || new Error('系统异常,  请联系管理员'));
    }
  }

  /**
   * 获取动态菜单信息, 配置菜单、动态路由
   * children.length > 0 => 存在子路由
   */
  private static async getAsyncRouters() {
    /** 组装动态路由  */
    const assembleRoutes = (
      routeParameters: any[],
      asyncRoutes: any[] = []
    ) => {
      for (let i = 0; i < routeParameters.length; i++) {
        if (
          routeParameters[i].children &&
          routeParameters[i].children.length > 0
        ) {
          asyncRoutes = assembleRoutes(
            routeParameters[i].children,
            asyncRoutes
          );
          continue;
        }
        if (routeParameters[i].outsideLink === '1') {
          continue;
        }
        if (
          routeParameters[i].rootPath === null &&
          routeParameters[i].skipPath === null
        )
          continue;
        asyncRoutes.push(generateRouter(routeParameters[i]));
      }
      return asyncRoutes;
    };

    try {
      const _selectedSystem = window.sessionStorage.getItem('selectedSystem');
      if (_selectedSystem !== '' && _selectedSystem !== null) {
        const selectedSystem = JSON.parse(_selectedSystem);
        const data = {
          menuId: selectedSystem.sysytemId
        };
        const params: any = await menu.getAsyncMenu(data);
        
        const asyncRoutes: RouteConfig[] = assembleRoutes(params);
        RoutesModule.SetRoutes(params);
        console.log('params', params);
        return Promise.resolve(asyncRoutes);
      }
    } catch (error) {
      return Promise.reject(error || new Error('error'));
    }
  }

  /** 转换路由格式 */
  private static toConvertRouters() {
    if (staticRoutes.length === 0) {
      return;
    }

    /** 动态生成路由 */
    const assembleRoutes = (
      routes: any,
      rootPath: any = null,
      nav: any[] = []
    ) => {
      let asyncRoutes: any[] = [];
      for (let i = 0; i < routes.length; i++) {
        let _route: any = {};
        // if (routes[i].children && routes[i].children.length === 1) {
        //   _route = this.generateRoute(routes[i].children[0].meta, this.convertPath(routes[i].path, routes[i].children[0].path));
        //   asyncRoutes.push(_route);
        //   continue;
        // }
        if (routes[i].children && routes[i].children.length > 0) {
          if (routes[i].meta) {
            _route = this.generateRoute(routes[i].meta);
            _route.children = assembleRoutes(
              routes[i].children,
              routes[i].path,
              [...nav, routes[i].meta.title]
            );
            asyncRoutes.push(_route);
          } else {
            asyncRoutes = [
              ...asyncRoutes,
              ...assembleRoutes(routes[i].children, routes[i].path)
            ];
          }
          continue;
        }
        _route = {
          ...this.generateRoute(
            routes[i].meta,
            this.convertPath(rootPath, routes[i].path)
          ),
          nav: [...nav, routes[i].meta?.title]
        };
        asyncRoutes.push(_route);
      }

      return asyncRoutes;
    };

    const staticAssembleRoutes = assembleRoutes(staticRoutes);
    RoutesModule.SetStaticRoutes(staticAssembleRoutes);
  }

  /** 生成路由信息 */
  private static generateRoute(meta: any, path: any = null) {
    const asyncRoutes: any = this.getAsyncRouters();
    return {
      key: this.generateRecordId(),
      title: meta?.title,
      icon: meta?.icon,
      path: path,
      // redirect: asyncRoutes[0].path,
      children: []
    };
  }

  /** 拼接 path */
  private static convertPath(rootPath: any, path: any) {
    if (rootPath === null || rootPath === '/') {
      return this.formatPath(path);
    }

    return rootPath + this.formatPath(path);
  }

  /** 格式化 path */
  private static formatPath(path: any) {
    if (!path || path.startsWith('/')) {
      return path;
    }
    return '/' + path;
  }

  /** 生成唯一主键 */
  private static generateRecordId() {
    return Math.random()
      .toString(16)
      .substr(1);
  }

  /** 获取动态权限许可, 包括按钮权限 */
  private static getAsyncPermission() {}
}

export default Startup;
