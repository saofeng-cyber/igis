import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from './../index';

export interface IReuseTab {
  title?: string;
  path?: string;
  badge: number;
  affix?: boolean;
}

export interface IReuseTabState {
  visitedViews: IReuseTab[];
  cachedViews: (string | undefined)[];
}

@Module({ dynamic: true, store, name: 'ReuseTab' })
class ReuseTab extends VuexModule implements IReuseTabState {
  /** 展示菜单信息 */
  public visitedViews: IReuseTab[] = [];
  /** 缓存菜单信息 */
  public cachedViews: (string | undefined)[] = [];

  @Mutation
  private ADD_VISITED_VIEW(view: IReuseTab) {
    if (this.visitedViews.some(v => v.path === view.path)) return false;
    this.visitedViews.push(view);
  }

  @Mutation
  private ADD_CACHED_VIEW(view: IReuseTab) {
    if (view.title === null) return false;
    if (this.cachedViews.includes(view.title)) return false;
    if (view.title) {
      this.cachedViews.push(view.title);
    }
  }

  @Mutation
  private DEL_VISITED_VIEW(view: IReuseTab) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1);
        break;
      }
    }
  }

  @Mutation
  private DEL_CACHED_VIEW(view: IReuseTab) {
    if (view.title === null) return;
    const index = this.cachedViews.indexOf(view.title);
    index > -1 && this.cachedViews.splice(index, 1);
  }

  @Mutation
  private DEL_OTHERS_VISITED_VIEWS(view: IReuseTab) {
    this.visitedViews = this.visitedViews.filter(v => {
      return v.affix || v.path === view.path;
    });
  }

  @Mutation
  private DEL_OTHERS_CACHED_VIEWS(view: IReuseTab) {
    if (view.title === null) return;
    const index = this.cachedViews.indexOf(view.title);
    if (index > -1) {
      this.cachedViews = this.cachedViews.slice(index, index + 1);
    } else {
      this.cachedViews = [];
    }
  }

  @Mutation
  private DEL_ALL_VISITED_VIEWS() {
    this.visitedViews = this.visitedViews.filter(view => view.affix);
  }

  @Mutation
  private DEL_ALL_CACHED_VIEWS() {
    this.cachedViews = [];
  }

  @Mutation
  private UPDATE_VISITED_VIEW(view: IReuseTab) {
    for (let v of this.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  }

  @Action
  public AddView(view: IReuseTab) {
    this.ADD_VISITED_VIEW(view);
    this.ADD_CACHED_VIEW(view);
  }

  @Action
  public AddVisitedView(view: IReuseTab) {
    this.ADD_VISITED_VIEW(view);
  }

  @Action
  public DelView(view: IReuseTab) {
    this.DEL_VISITED_VIEW(view);
    this.DEL_CACHED_VIEW(view);
  }

  @Action
  public DelCachedView(view: IReuseTab) {
    this.DEL_CACHED_VIEW(view);
  }

  @Action
  public DelOthersViews(view: IReuseTab) {
    this.DEL_OTHERS_VISITED_VIEWS(view);
    this.DEL_OTHERS_CACHED_VIEWS(view);
  }

  @Action
  public DelAllViews() {
    this.DEL_ALL_VISITED_VIEWS();
    this.DEL_ALL_CACHED_VIEWS();
  }

  @Action
  public DelAllCachedViews() {
    this.DEL_ALL_CACHED_VIEWS();
  }

  @Action
  public UpdateVisitedView(view: IReuseTab) {
    this.UPDATE_VISITED_VIEW(view);
  }
}

export const ReuseTabModule = getModule(ReuseTab);
