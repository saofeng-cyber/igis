<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view />
    </a-config-provider>
  </div>
</template>
<script lang="ts">
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { User, UserInfoModule } from './store/modules/userInfo';
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
  data() {
    return {
      locale: zhCN,
    };
  },
  mounted() {
    this.setUserinfo()
  },
  methods: {
    setUserinfo() {
      const selectedSystem = window.sessionStorage.getItem('selectedSystem')!
      const currentUser = window.sessionStorage.getItem('currentUser')!
      const { userSysId, deptName } = JSON.parse(selectedSystem)
      const { userName } = JSON.parse(currentUser)
      const userInfo: User = {
        userName,
        userSysId,
        deptName
      }
      UserInfoModule.setUserInfo(userInfo)
    }
  }
})
</script>
