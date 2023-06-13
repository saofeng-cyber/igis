<template>
  <div class="tigcAndroidAdmin">
    <div class="logo">
      <img src="@/assets/logo.png" alt="" srcset="">
      <span class="title">
        众阳健康—分诊导引
      </span>
    </div>
    <div class="jump_actions">
      <!-- 请先去分诊系统的屏幕管理中选择要跳转的屏幕 -->
      <div class="doctor_svg">
        <img src="./svg/doctor.svg" alt="" srcset="" />
      </div>
      <div style="display: flex;justify-content: center;align-items: center;">
        <p class="waring_title">
          <span v-for="(item, index) in warningText" :key="index">
            {{ item }}</span>
        </p>
      </div>
      <p class="mac_address">
        MAC地址：{{ paramsMac.macAddr }}
      </p>
    </div>
    <!-- <div class="footer">
      <div class="footer_svg">
        <div>
          <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g class="parallax">
              <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
              <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
              <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
              <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
          </svg>
        </div>
      </div>
    </div> -->
    <!-- <div v-if="isShow" class="error_msg">
      <span>
        {{ errorMsg }}
      </span>
    </div> -->
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { fzAreaScreen } from '@/api/fz-area-screen/fz-area-screen';
import { screenTypeSet } from '@/api/screenTypeSet/screenTypeSet';
@Component
export default class TigcAndroidAdmin extends Vue {
  paramsMac: any = {
    macAddr: '',
    screenURL: '',
    screenToken: '',
    wsUrl: 'wss://'
  }
  warningText: string = '请先去分诊系统屏幕管理中维护该屏幕信息'
  timer: number = 0
  async getMacAddress() {
    try {
      const macAddr = window.androidObject.androidMethod();
      this.paramsMac.macAddr = macAddr
      if (macAddr) await screenTypeSet.updateMac(this.paramsMac)
    } catch (error) {
      console.log(error);
    }
  }
  async getScreenInfo() {
    fzAreaScreen.selectClinicAreaAndRoomByMac(this.paramsMac).then((res: any) => {
      if (!res) {
        return
      }
      if (res.fzScreenStyleVO.screenStyleUrl) this.$router.push(res.fzScreenStyleVO.screenStyleUrl)
    })
  }
  timeGetScreenInfo() {
    this.timer = window.setInterval(() => {
      this.getScreenInfo()
    }, 10000)
  }

  async created() {
    await this.getMacAddress()
  }

  mounted() {
    this.getScreenInfo()
    this.timeGetScreenInfo()
  }

  destroyed() {
    window.clearInterval(this.timer)
  }

}
</script>
<style scoped lang="less">
.tigcAndroidAdmin {
  position: relative;
  height: 100%;
  min-height: 100vh;

  .jump_actions {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24px;

    .doctor_svg {
      img {
        max-width: 320px;
        max-height: 360px;
      }
    }

    .waring_title {
      font-size: 24px;
      font-weight: bolder;
      margin-top: 12px;
    }

    .mac_address {
      font-size: 24px;
      font-weight: bolder;
    }
  }

  .logo {
    padding-left: 16px;
    padding-top: 12px;
    display: flex;
    align-items: center;

    img {
      width: 42px;
      height: 42px;
    }

    .title {
      font-size: 16px;
      font-weight: bolder;
      margin-left: 10px;
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .error_msg {
    width: auto;
    text-align: center;
    padding: 0 16px;
    margin-top: 12px;

    span {
      display: inline-block;
      font-size: 24px;
      color: #fff;
      padding: 12px 18px;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.04);
      border-radius: 12px;
      background-color: rgba(191, 210, 239, 0.568)
    }
  }
}
</style>
<style scoped src="./tigc_android_admin.less" lang="less"></style>
