import Vue from 'vue';
// import 'amfe-flexible'
import Antd from 'ant-design-vue';
import App from './App.vue';
import Startup from '@/core/startup';
import i18n from '@/lang';
import store from './store';
import MsunUI from 'msun-lib-ui';
import './styles/index.less';
import '@/assets/font/iconfont.css';
import '@/assets/font/iconfont.js';

if (process.env.NODE_ENV === 'development') {
  const initConfig: any = {
    selectedSystem:
      '{"deptCode":"288","deptId":"288","deptName":"肾病内科","orgId":"10033","sysytemId":"4607730639756853671","systemName":"分诊导引","url":"tigc/","userSysId":"4904096497719840653","userSysName":"分诊导医"}',
    currentUser:
      '{"accountId":"4904058831359971202","accountName":"058003","hospitalId":"10033001","hospitalName":"灰灰度测试医院","mainDeptId":"157","mainDeptCode":"157","mainDeptName":"内科门诊","orgId":"10033","orgName":"灰灰度测试医院","superUser":false,"userId":"4904058831259307913","userCode":"058003","userName":"刘群","token":"be3ef5d9-ff11-4573-890a-2212a25362ee","secret":"5973147997667653","organizationCode":"h123123123","medicalInsuranceCode":null,"idCard":"MzcwOTIzMTk5NjA1MDU0MjM4","addressCode":[{"dictName":"中国","dictId":"1"},{"dictName":"山东省","dictId":"370000"},{"dictName":"菏泽市","dictId":"371700"},{"dictName":"成武县","dictId":"371723"}]}',
  };
  for (const key in initConfig) {
    sessionStorage.setItem(key, initConfig[key]);
  }
}

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(MsunUI);
Vue.prototype.$config = {
  name: '骚风',
};
Startup.bootstrap().then((params: any) => {
  const router = params.router;
  router.afterEach((to: any, next: any) => {
    document.title = to.meta.title;
    const url =
      location.protocol +
      '//' +
      location.hostname +
      (location.port ? ':' + location.port : '') +
      process.env.VUE_APP_BASE_URL +
      '#' +
      to.path;
    history.pushState(null, String(), url);
  });
  const appInstantiate = new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  });
  appInstantiate.$mount('#app');
});