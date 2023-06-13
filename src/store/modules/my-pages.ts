import { Module, VuexModule, getModule, Mutation, Action } from 'vuex-module-decorators';
import store from '../index';

@Module({ dynamic: true, store, name: 'MyPages' })
class MyPages extends VuexModule {
  public changeModulesFlag: Boolean = false; // 更改医生模板和排班模板数量

  get isChangedModulesFlag() {
    return this.changeModulesFlag
  }

  @Mutation
  private SET_FLAG(changeModulesFlag: Boolean) {
    this.changeModulesFlag = changeModulesFlag;
  }

  @Action
  public SetModuleFlag(changeModulesFlag: Boolean) {
    this.SET_FLAG(changeModulesFlag);
  }
}

export const MyPagesModule = getModule(MyPages);
