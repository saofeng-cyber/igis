import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import store from './../index';
export interface User {
  userName?: string;
  userSysId?: string;
  deptName?: string;
}

export interface UserState {
  userInfo: User;
}
@Module({ dynamic: true, store, name: 'UserInfo' })
class UserInfo extends VuexModule implements UserState {
  public userInfo: User = {};
  @Mutation
  private SET_USER_INFO(userInfo: User) {
    this.userInfo = userInfo;
  }
  @Action
  public setUserInfo(userInfo: User) {
    this.SET_USER_INFO(userInfo);
  }
}

export const UserInfoModule = getModule(UserInfo);
