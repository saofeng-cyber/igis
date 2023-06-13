import Vue from 'vue';
import Vuex from 'vuex';
import { ILayoutState } from './modules/layout';
import { IReuseTabState } from './modules/reuse-tab';
import { IRoutesState } from './modules/routes';
import { UserState } from './modules/userInfo'

Vue.use(Vuex);

export interface IState {
  layout: ILayoutState;
  reusetab: IReuseTabState;
  routes: IRoutesState;
  userState: UserState;
}

const store = new Vuex.Store<IState>({
  modules: {}
});

export default store;
