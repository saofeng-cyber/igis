import { Module, VuexModule, getModule, Mutation, Action } from 'vuex-module-decorators';
import store from './../index';

export interface ISidebar {
  opened: boolean;
  withoutAnimation: boolean;
}

export interface ILayoutState {
  sidebar: ISidebar;
  size: number;
}

@Module({ dynamic: true, store, name: 'Layout' })
class Layout extends VuexModule implements ILayoutState {
  public sidebar: ISidebar = {
    opened: false,
    withoutAnimation: false
  };

  public size: number = 16;

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened;
    this.sidebar.withoutAnimation = withoutAnimation;
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false;
    this.sidebar.withoutAnimation = withoutAnimation;
  }

  @Mutation
  private SET_SIZE(size: number) {
    this.size = size;
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    console.log(555, withoutAnimation);
    
    this.TOGGLE_SIDEBAR(withoutAnimation);
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation);
  }

  @Action
  public SetSize(size: number) {
    this.SET_SIZE(size);
  }
}

export const LayoutModule = getModule(Layout);
