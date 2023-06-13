<template src="./fz_screen_xt.html"></template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { findTimeSync } from '@/api/fz_screen_xt/fz_screen';
import XtCard from './components/XtCard.vue';

@Component({ components: { XtCard } })
export default class FzscreenXt extends Vue {
  private timer: any = 0;
  public information: string = '';
  private callingInfo: boolean = false;
  private callingList: any = [];
  public infoOpen: boolean = false; // 控制提示信息的参数
  private callText: string = '';
  public connectionTimer: number = 0;
  public callTimer: number = 0;
  public isShow: boolean = true;
  private socket: any = null;
  public screenInfoData: any = '';
  public clinicName: string = '血透室';
  private reconnection: boolean = false;
  private callTextTemp: string = '';
  private informationTemp: string = '';
  private wsuri: string = ''; // ws wss
  private screenURL: string = '';
  public macOpen: boolean = false;
  private wsCall: any = {
    androidCallingText: '',
    androidCallingInfo: ''
  };

  public notification: any = {
    title: '',
    content: ''
  };

  public paramsMac: any = {
    // 查询参数
    macAddr: '',
    screenURL: '',
    screenToken: '',
    wsUrl: 'wss://'
  };

  // mac值校验
  screenMacValidator = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback(new Error('请输入Mac地址！'));
    } else {
      const temp = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/;
      const temp2 = /[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}/;
      const regexp = new RegExp(temp);
      const regexp2 = new RegExp(temp2);
      if (!regexp.test(value) && !regexp2.test(value)) {
        callback(new Error('Mac地址格式不正确，请检查'));
      }
      callback();
    }
  };

  public rules: any = {
    macAddr: [
      { required: true, validator: this.screenMacValidator, trigger: 'blur' }
    ],
    screenURL: [
      { required: true, message: '屏幕的URL不能为空', trigger: 'blur' }
    ],
    screenToken: [
      { required: true, message: '请输入屏幕的token', trigger: 'blur' }
    ],
    wsUrl: [
      {
        required: true,
        message: '请输入屏幕的WebSocket请求头',
        trigger: 'change'
      }
    ]
  };

  public dateTime: any = {};
  private getDateTime() {
    findTimeSync().then((res: any) => {
      this.dateTime = res;
    });
  }

  public stopTimer() {
    window.clearInterval(this.connectionTimer)
    window.clearInterval(this.callTimer)
    window.clearInterval(this.timer)
  }

  public getScreenInfoData() {
    // console.log(screenInfo);
    if (this.$refs.xtcard && (this.$refs.xtcard as any).screenInfo) {
      this.screenInfoData = (this.$refs.xtcard as any).screenInfo;
    }
    // console.log(this.screenInfoData);
  }

  /**
   * getScreenInfo
   */
  public getScreenInfo(screenInfo: any) {
    this.clinicName = screenInfo.clinicAreaName;
    this.screenInfoData = screenInfo;
  }

  public setting() {
    this.macOpen = true;
  }

  public cancel() {
    this.macOpen = false;
  }

  private getAndroidValue() {
    // this.containerDom = document.getElementById('div');
    try {
      this.paramsMac.wsUrl = window.androidObject.getWsUrl();
    } catch (e) {
      // this.$message.error('获取安卓WS请求头数据失败请手动输入数据');
    }
    try {
      this.paramsMac.macAddr = window.androidObject.androidMethod();
      if (this.paramsMac.macAddr) {
        this.paramsMac.macAddr = this.paramsMac.macAddr.toLowerCase();
      }
    } catch (e) {
      // this.$message.error('获取安卓MAC地址数据失败请手动输入数据');
    }
    try {
      this.paramsMac.screenURL = window.androidObject.getUrl();
    } catch (e) {
      // this.$message.error('获取安卓WS请求地址数据失败请手动输入数据');
    }
    try {
      this.paramsMac.screenToken = window.androidObject.getToken();
    } catch (e) {
      // this.$message.error('获取安卓连接Token数据失败请手动输入数据');
    }
    if (
      this.paramsMac.macAddr === '' ||
      this.paramsMac.screenToken === '' ||
      this.paramsMac.screenURL === '' ||
      this.paramsMac.wsUrl === ''
    ) {
      this.macOpen = true;
      this.$message.warning(
        '在输入通讯域名时请注意当原有域名以https开头时请使用wss，当域名以http开头时请使用ws！'
      );
    } else {
      this.setMac();
    }
  }

  public setMac() {
    console.log(this.paramsMac);
    if (
      this.paramsMac.wsUrl &&
      this.paramsMac.macAddr &&
      this.paramsMac.screenURL &&
      this.paramsMac.screenToken
    ) {
      try {
        window.androidObject.setWsUrl(this.paramsMac.wsUrl);
        window.androidObject.setUrl(this.paramsMac.screenURL);
        window.androidObject.setToken(this.paramsMac.screenToken);
      } catch (e) {
        this.$message.error('安卓存储数据失败');
      }
      this.paramsMac.macAddr = this.paramsMac.macAddr.toLowerCase();
      // &storage=true 持久化不可使用会导致二次呼叫
      this.screenURL = `${this.paramsMac.wsUrl}${this.paramsMac.screenURL}/msun-websocket-server/ws-server?host=${this.paramsMac.screenURL}&token=${this.paramsMac.screenToken}&appName=msun-middle-business-guidance-server&busiName=sendMsg&clientId=${this.paramsMac.macAddr}`;

      console.log(this.screenURL);
      // eslint-disable-next-line no-unexpected-multiline
      this.$nextTick(() => {
        (this.$refs['xtcard'] as any).getAllData();
      });
      // this.getInfoMationFun()
      this.macOpen = false;
      this.updateUrl(this.screenURL);
    } else {
      this.macOpen = true;
      this.$message.warning('请输入相应的屏幕信息');
    }
  }

  // 调用安卓的同名函数将数据进行传递
  private androidCalling() {
    console.log('2');
    window.androidObject.voiceCall(this.callText);
  }

  // 叫号定时器
  public callfun() {
    if (!this.callingInfo && this.callingList.length > 0) {
      this.callingInfo = true;
      this.information = this.callingList[0].androidCallingInfo;
      this.callText = this.callingList[0].androidCallingText;
      try {
        this.androidCalling();
      } catch (e) {
        this.$message.error('给安卓发送叫号信息失败');
      }
      // 弹出界面
      this.infoOpen = true;
      setTimeout(() => {
        this.callingList.shift();
        this.infoOpen = false;
        setTimeout(() => {
          this.callingInfo = false;
        }, 1000);
      }, 5000);
    }
  }

  created() {
    this.getDateTime();
    this.timer = window.setInterval(() => {
      this.getDateTime();
    }, 6 * 10000);
    this.getAndroidValue();
  }

  mounted() {
    // 大屏ws重连定时器
    this.connectionTimer = window.setInterval(this.connection, 1000);
    // this.getScreenInfoData();
    this.callTimer = window.setInterval(this.callfun, 1000);
  }

  destroyed() {
    window.clearInterval(this.timer);
    window.clearInterval(this.connectionTimer);
    window.clearInterval(this.callTimer);
  }

  // -------------------------------------------------websocket连接---------------------------------------------

  // 初始化weosocket
  initWebSocket() {
    console.log('初始化');
    try {
      if ('WebSocket' in window) {
        console.log('this.wsuri: ', this.wsuri);
        this.socket = new WebSocket(this.wsuri);
      } else {
        alert('您的浏览器不支持websocket');
      }
      this.socket.onopen = this.websocketonopen;
      this.socket.onmessage = this.websocketonmessage;
      this.socket.onclose = this.websocketclose;
      this.socket.onerror = this.websocketonerror;
    } catch (e) {
      this.reconnection = true;
      this.$message.error('初始化失败');
    }
  }

  websocketonopen() {
    // 关闭重连标识
    this.reconnection = false;
  }

  websocketonmessage(e: any) {
    try {
      this.wsCall = {
        androidCallingInfo: '',
        androidCallingText: ''
      };
      const data = JSON.parse(e.data);
      // 脱敏 用于页面显示
      const strArr = data.content.split('&');
      console.log('strArr :>> ', strArr);
      strArr[0] = strArr[0].replaceAll('"', '');
      strArr[0] = strArr[0].replaceAll('，', '');
      this.informationTemp = strArr[0];
      this.callTextTemp = strArr[1].replace('"', '');
      // 播放声音 H5叫号测试
      this.wsCall.androidCallingInfo = this.informationTemp;
      this.wsCall.androidCallingText = this.callTextTemp;
      this.callingList.push(this.wsCall);
      if (strArr.length >= 4) {
        let flag = strArr[3].replace('/', '');
        flag = flag.replace('"', '');
        if (flag === '0') {
          this.isShow = true;
          this.callingList = [];
        } else {
          this.callingList = [];
          this.isShow = false;
          this.notification.title = strArr[2];
          this.notification.content = strArr[1];
        }
      }
    } catch (e) {
      this.$message.error(`${e}`);
    }
  }

  websocketclose(e: any) {
    // console.log('websocketclose (' + e.code + ')');
    // todo 重连机制
    // 开启ws重连标识
    this.reconnection = true;
  }

  websocketonerror(e: any) {
    this.reconnection = true;
  }

  reconnect() {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = null;
    this.initWebSocket();
  }

  updateUrl(arr: string) {
    // console.log('更新连接地址');
    if (this.socket) {
      this.socket.close();
    }
    this.wsuri = arr;
    this.reconnection = true;
  }

  // breakConnection() {
  //   console.log('into:breakConnection()')
  //   if (this.socket) {
  //     this.socket.close();
  //   }
  //   this.socket = null;
  //   this.reconnection = true;
  // }

  connection() {
    // this.$message.warning('进入循环！' + this.reconnection)
    if (this.reconnection) {
      this.reconnect();
    }
  }
}
</script>
<style scoped lang="lesss" src="./fz_screen_xt.less"></style>
