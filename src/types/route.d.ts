export declare namespace Route {
  interface RouteItem {
    menuName?: string;
    icon?: string;
    key: string;
    menuId?: string;
    rootComponent: string;
    skipComponent: string;
    skipPath: string;
    title?: string;
    rootPath?: string;
    level?: number;
    parentId?: string;
    path: string,
    sortOrder?: number;
    children: Array<RouteItem>;
  }
}
