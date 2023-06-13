import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import qs from 'qs';
import store from './../index';
import { Route } from '@/types/route';

export interface IRoutes {
  key?: number;
  title?: string;
  code?: string;
  externalUrl?: string;
  path?: string;
  icon?: string;
  children: IRoutes[];
  component?:object;
  name?:string;
  meta?:object;
  redirect?:string;
}

export interface IRoutesState {
  routes: Route.RouteItem[];
}

@Module({ dynamic: true, store, name: 'Routes' })
class Routes extends VuexModule implements IRoutesState {
  public routes: Route.RouteItem[] = [];

  get getRoutes() {
    const getExternalList = (routes: any, externalList: any = []) => {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].children && routes[i].children.length > 0) {
          externalList = getExternalList(routes[i].children, externalList);
          continue;
        }
        if (routes[i].code && routes[i].code !== null) {
          externalList.push(routes[i]);
        }
      }
      return externalList;
    }
    return getExternalList(this.routes);
  }

  @Mutation
  private SET_ROUTES(routes: Route.RouteItem[]) {
    this.routes.push(...routes);
  }

  @Action
  public SetStaticRoutes(routes: any[]) {
    this.SET_ROUTES(routes);
  }

  @Action
  public SetRoutes(routes: any[]) {
    const assembleRoutes = (routes: any[], asyncRoutes: any[] = [], nav: string = '') => {
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].children && routes[i].children.length > 0) {
          routes[i].path = routes[i].rootPath;
          asyncRoutes.push(routes[i]);
          asyncRoutes[i].children = assembleRoutes(routes[i].children, [], routes[i].title);
          continue;
        }
        routes[i].title = routes[i].menuName;
        routes[i].key = routes[i].menuId;
        if (routes[i].rootPath !== null && routes[i].skipPath !== null) {
          routes[i].path = routes[i].rootPath + '/' + routes[i].skipPath;
        }
        routes[i].nav = [nav, routes[i].title].filter((item: any) => item);
        if (routes[i].outsideLink === '1') {
          const skipPath = routes[i].skipPath.split('?');
          const parameters = qs.parse(skipPath[1]);
          routes[i].code = parameters.code;
          routes[i].externalUrl = parameters.url;
          delete parameters.url;
          routes[i].path = routes[i].rootPath + '/' + skipPath[0] + '?' + qs.stringify(parameters);
        }
        asyncRoutes.push(routes[i])
      }
      return asyncRoutes;
    }
    const routeParameters = assembleRoutes(routes);
    this.SET_ROUTES(routeParameters);
  }
}

export const RoutesModule = getModule(Routes);
