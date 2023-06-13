<template src="./fz-area-screen.html"></template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { fzAreaScreen } from '../../api/fz-area-screen/fz-area-screen';
import { ComHospitalApi, fzScreen } from '@/api'
import moment from 'moment';
import { fzRoomScreen } from '@/api/fz-room-screen/fz-room-screen';
interface ComponentType {
    '-1': () => void;
    0: () => void;
    1: () => void;
}

type typeCall = '0' | '1' | '-1'
type callTimesArea = -1 | 1 | 2 | 3 | 4 | 5

const columns = [
  {
    title: '诊室',
    align: 'center',
    width: '20%',
    dataIndex: 'roomName',
    scopedSlots: { customRender: 'roomName' }
    // customCell: (record:any, rowIndex:any) => {
    //   return {
    //     style: {
    //       color: 'var(--tigc_area_screen_roomName)'
    //     }
    //   }
    // }
  },
  {
    title: '医生',
    align: 'center',
    width: '12%',
    dataIndex: 'docName',
    scopedSlots: { customRender: 'docName' }
    // customCell: (record: any, rowIndex: any) => {
    //   return {
    //     style: {
    //       'background-color': '#0ca2f9'
    //     }
    //   }
    // }
  },
  {
    title: '正在就诊',
    align: 'center',
    width: '19%',
    dataIndex: 'fzCallingQueueVOS',
    scopedSlots: { customRender: 'fzCallingQueueVOS' }
  },
  {
    title: '等待就诊',
    align: 'center',
    width: '26%',
    dataIndex: 'fzWattingQueueVOS',
    scopedSlots: { customRender: 'fzWattingQueueVOS' }
  },
  {
    title: '过号患者',
    align: 'center',
    width: '23%',
    dataIndex: 'fzOverQueueVOS',
    scopedSlots: { customRender: 'fzOverQueueVOS' }
  }
];

declare global {
  interface Window { androidObject: any; }
}

window.androidObject = window.androidObject || {};

@Component
export default class FzAreaScreen extends Vue {
  callongTemp: boolean = false; // 判断是否需要走定时器
  calling: boolean = false; // 判断是不是叫号
  clinicAreaName: string = '';
  macOpen: boolean = false; // 控制输入屏幕数据弹窗的参数
  infoOpen: boolean = false; // 控制提示信息的参数;
  information: string = '请xxx到xxx诊室就诊！';
  roomList: any = []; // 用于存储诊室信息
  nowDateNum: any = 0;
  scrollIndex: number = 0
  screenTypeByMac:number = 1
  callTimes: number = 1;
  isJhtm: string = '否'
  callingList: any = [];
  wsCall: any = {
    androidCallingText: '',
    androidCallingInfo: ''
  }

  informationTemp: string = '';
  screenType:number = 2 // 1 是安卓屏 2 是windows屏
  callTextTemp: string = '';
  callingInfo: boolean = false;
  nowDate: string = '';
  nowTime: string = '';
  missionaryText: string = '';
  timer: any = 0;
  time: any = 0;
  task: boolean = false;
  docList: any = [];
  docListTemp: any = [];
  screenQueueWithConfig: any = {
    docQueue: 1,
    roomQueue: 0,
    roomIds: ''
  }

  queryList: any = [];
  total: number = 0;// 总条数
  pageNumber: number = 0;
  pageSize: number = 7;
  page: number = 0;
  loading: boolean = false;
  columns: any = columns;
  paramsMac: any = { // 查询参数
    macAddr: null,
    screenURL: null,
    screenToken: null,
    wsUrl: 'wss://'
  };

  paramsRoomId: any = {
    roomIds: '',
    screenCategory: 1
  }

  paramsScreenId:any = {
    screenId: ''
  }

  screenStyle: any = []

  arealogo: any = null
  wsuri: any = '' // ws wss
  lockReconnect: boolean = false // 连接失败不进行重连
  socket: any = null;
  callText: string = '';
  reconnection: boolean = false; // 重连定时器参数
  screenURL: any = ''
  callTimer: any = 0
  roomTimer: any = 0
  breakTimer: any = 0
  connectionTimer: any = 0
  // synth: any = window.speechSynthesis; // 播放声音
  // msg: any = new SpeechSynthesisUtterance();
  // eslint-disable-next-line camelcase
  theme_red: any = {
    tigc_area_screen_clinicAreaName: '#1f6ca8', // 头部和表格的阴影，主体的颜色
    tigc_area_screen_roomName: '#000000a6', // 表格中诊室名字的字体颜色
    tigc_area_screen_zzjz: '#008000', // 头部背景色，表格背景色，除头部的主题颜色
    tigc_area_screen_ddjz: '#000000', // 表头的颜色和医生列的颜色
    tigc_area_screen_ghhz: '#db0606', // 叫号弹框的背景色
    tigc_area_screen_missionary: '#ffffff', // 屏幕宣教的背景色
    tigc_area_screen_docName: '#ffffff', // 叫号弹窗中的字体颜色//
    tigc_area_screen_level: '#ffffff' // 叫号弹窗中的字体颜色//
  };

  changeTheme(screenStyle: any) {
    screenStyle.forEach((item: any) => {
      document.documentElement.style.setProperty(`--${item.alias}`, item.color)
    });
    // for (const key in screenStyle) {
    //   if (Object.prototype.hasOwnProperty.call(theme, key)) {
    //     const element = theme[key];
    //     document.documentElement.style.setProperty(`--${key}`, element)
    //   }
    // }
  }

  // mac值校验
  screenMacValidator = function(rule: any, value: any, callback: any) {
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

  rules: any = {
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
      { required: true, message: '请输入屏幕的WebSocket请求头', trigger: 'change' }
    ]
  }

  // 在安卓拿到所需要的数据包括屏幕的mac值，ws访问时所需要的URL和token
  async getAndroidValue() {
    try {
      this.paramsMac.wsUrl = window.androidObject.getWsUrl()
      if (this.paramsMac.wsUrl === null && this.paramsMac.wsUrl === '') {
        this.paramsMac.wsUrl = 'wss://'
      }
    } catch (e) {
      this.$message.error('获取安卓WS请求头数据失败请手动输入数据')
    }
    try {
      this.paramsMac.macAddr = window.androidObject.androidMethod()
      if (this.paramsMac.macAddr !== null && this.paramsMac.macAddr !== '') {
        this.paramsMac.macAddr = this.paramsMac.macAddr.toLowerCase()
      }
    } catch (e) {
      this.$message.error('获取安卓MAC地址数据失败请手动输入数据')
    }
    try {
      this.paramsMac.screenURL = window.androidObject.getUrl()
    } catch (e) {
      this.$message.error('获取安卓通讯域名失败请手动输入数据')
    }
    try {
      this.paramsMac.screenToken = window.androidObject.getToken()
    } catch (e) {
      this.$message.error('获取安卓连接Token数据失败请手动输入数据')
    }
    try {
      this.isJhtm = window.androidObject.getIsJhtm();
      if (!this.isJhtm) {
        this.isJhtm = '否'
      }
    } catch (e) {
      this.$message.error('获取安卓脱敏配置失败请手动输入数据');
      this.isJhtm = '否'
    }
    try {
      this.callTimes = window.androidObject.getCallTimes();
      if (!this.callTimes) {
        this.callTimes = 1
      }
    } catch (e) {
      this.$message.error('获取安卓叫号次数失败请手动输入数据');
      this.callTimes = 1
    }
    if (this.paramsMac.macAddr === null || this.paramsMac.screenURL === null || this.paramsMac.screenToken === null || this.paramsMac.wsUrl === null || this.callTimes === null) {
      this.macOpen = true;
      if (!this.callTimes) {
        this.callTimes = 1
      }
      if (!this.isJhtm) {
        this.isJhtm = '否'
      }
      this.$message.warning('在输入通讯域名时请注意当原有域名以https开头时请使用wss，当域名以http开头时请使用ws！')
    } else {
      this.setMacType()
    }
  }

  speakCalling() {
    if (this.screenTypeByMac === 2) {
      this.windowPlayVoice(this.callText)
    } else {
      this.androidCalling()
    }
  }

  androidCalling() {
    window.androidObject.voiceCall(this.callText)
  }

  docVOS: any = {
    keyValue: '',
    roomName: '',
    docName: '',
    fzCallingQueueVOS: '',
    fzOverQueueVOS: '',
    fzWattingQueueVOS: ''
  }

  /* 查询 自助机头部医院logo */
  getConfigValueForSelfTriageHeaderImage() {
    ComHospitalApi.getPictureConfigValue('self_triage_header_image').then((response: any) => {
      this.arealogo = response
    }).catch((e: any) => {
      this.$message.warning(e)
    })
  }

  // 通过mac查询诊室信息
  getRoom() {
    this.roomList = [];
    fzAreaScreen.selectClinicAreaAndRoomByMac(this.paramsMac).then(
      (response: any) => {
        if (response !== null) {
          this.updateIpAddress({ screenId: response.screenId, screenCategory: response.screenCategory })
          // 策略模式
          const getIsJhtm: ComponentType = {
            '-1': () => {
              try {
                if (window.androidObject.getIsJhtm()) {
                  this.isJhtm = window.androidObject.getIsJhtm()
                } else {
                  this.isJhtm = '是'
                }
              } catch (error) {
                this.isJhtm = '是'
                console.log(this.isJhtm);
              }
            },
            0: () => {
              this.isJhtm = '否'
            },
            1: () => {
              this.isJhtm = '是'
            }
          }

          const getCallTimes = {
            '-1': () => {
              try {
                if (window.androidObject.getCallTimes()) {
                  this.callTimes = window.androidObject.getCallTimes()
                } else {
                  this.callTimes = 1
                }
              } catch (error) {
                this.callTimes = 1
              }
            },
            1: () => {
              this.callTimes = 1
            },
            2: () => {
              this.callTimes = 2
            },
            3: () => {
              this.callTimes = 3
            },
            4: () => {
              this.callTimes = 4
            },
            5: () => {
              this.callTimes = 5
            }
          }
          getIsJhtm[response.callAntianaphylaxis as typeCall]()
          console.log(this.isJhtm);
          getCallTimes[response.callTimes as callTimesArea]()
          this.roomList = response.roomVOS;
          this.paramsScreenId.screenId = response.screenId
          const screenShowPage = response.screenShowPage
          // 判断屏幕url是否和当前一致
          console.log('当前路由', this.$route.path);
          if (response.fzScreenStyleVO && response.fzScreenStyleVO.screenStyleUrl && response.fzScreenStyleVO.screenStyleUrl !== this.$route.path) {
            console.log('数据库中配置的路由', response.fzScreenStyleVO.screenUrl);
            clearInterval(this.nowDateNum)
            clearInterval(this.timer)
            clearInterval(this.roomTimer)
            clearInterval(this.breakTimer)
            clearInterval(this.connectionTimer)
            clearInterval(this.callTimer)
            this.$router.push(response.fzScreenStyleVO.screenStyleUrl)
            return
          }
          if (response.fzScreenStyleVO && response.fzScreenStyleVO.screenStyle) {
            this.screenStyle = JSON.parse(response.fzScreenStyleVO.screenStyle)
            this.changeTheme(this.screenStyle)
          } else {
            this.changeTheme([
              {
                color: '#1f6ca8',
                alias: 'tigc_area_screen_clinicAreaName'
              },
              {
                color: '#000',
                alias: 'tigc_area_screen_roomName'
              },
              {
                color: '#FFFFFF',
                alias: 'tigc_area_screen_docName'
              },
              {
                color: '#40A9FF',
                alias: 'tigc_area_screen_level'
              },
              {
                color: '#67C23A',
                alias: 'tigc_area_screen_zzjz'
              },
              {
                color: '#E6A23C',
                alias: 'tigc_area_screen_ddjz'
              },
              {
                label: '过号患者',
                color: '#ff0000',
                alias: 'tigc_area_screen_ghhz'
              },
              {
                color: '#ffffff',
                alias: 'tigc_area_screen_missionary'
              }
            ])
          }
          this.getscreenlogo()
          this.loading = false
          this.clinicAreaName = response.clinicAreaName
          this.missionaryText = response.missionaryText;
          // 组装roomid查询条件
          this.paramsRoomId.roomIds = ''
          for (let i = 0; i < this.roomList.length; i++) {
            if (i === 0) {
              this.paramsRoomId.roomIds = this.paramsRoomId.roomIds + this.roomList[i].roomId
            } else {
              this.paramsRoomId.roomIds = this.paramsRoomId.roomIds + ',' + this.roomList[i].roomId
            }
          }
          this.screenQueueWithConfig = {
            roomQueue: response.roomQueue,
            roomIds: this.paramsRoomId.roomIds,
            docQueue: response.docQueue
          }
          this.getDocPat(screenShowPage)
        }
      })
  }

  getscreenlogo() {
    console.log(this.paramsScreenId)
    fzRoomScreen.selectLogoByScreenId(this.paramsScreenId).then(
      (response:any) => {
        this.arealogo = response.logoUrl
      })
  }

  cancel() {
    this.macOpen = false
  }

  setMacType() {
    if (this.screenTypeByMac === 1) {
      this.setMac()
    } else {
      this.setWindows()
    }
  }

  // 同步更新ip地址
  async updateIpAddress(params: any) {
    const isElectron = this.$workEnv.isElectronEnv();
    try {
      if (isElectron) {
        const ipInfo = await (window as any).electron.hdApi.getIpAddress({})
        const ipAddr = ipInfo.data.ipAddress
        await fzScreen.updateFzScreen({ ...params, screenIp: ipAddr })
      } else {
        const ipAddr = window.androidObject.getDeviceIp();
        await fzScreen.updateFzScreen({ ...params, screenIp: ipAddr })
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 进行ws通讯路由的组装与传值
  setMac() {
    clearInterval(this.timer)
    // this.callTimes = 1
    if (!this.callTimes) {
      this.callTimes = 1
    }
    if (!this.isJhtm) {
      this.isJhtm = '否'
    }
    if (this.paramsMac.wsUrl !== null && this.paramsMac.wsUrl !== '' && this.paramsMac.macAddr !== null && this.paramsMac.macAddr !== '' && this.paramsMac.screenURL !== null && this.paramsMac.screenURL !== '' && this.paramsMac.screenToken !== null && this.paramsMac.screenToken !== '' && this.callTimes) {
      try {
        window.androidObject.setWsUrl(this.paramsMac.wsUrl)
        window.androidObject.setUrl(this.paramsMac.screenURL)
        window.androidObject.setToken(this.paramsMac.screenToken)
        window.androidObject.setIsJhtm(this.isJhtm)
        window.androidObject.setCallTimes(this.callTimes)
      } catch (e) {
        this.$message.error('安卓存储数据失败')
      }
      this.paramsMac.macAddr = this.paramsMac.macAddr.toLowerCase()
      // &storage=true 持久化不可使用会导致二次呼叫
      this.screenURL = this.paramsMac.wsUrl + this.paramsMac.screenURL +
        '/msun-websocket-server/ws-server?host=' + this.paramsMac.screenURL + '&token=' + this.paramsMac.screenToken +
        '&appName=msun-middle-business-guidance-server&busiName=sendMsg&clientId=' + this.paramsMac.macAddr
      this.getRoom()
      // this.getConfigValueForSelfTriageHeaderImage()
      this.macOpen = false;
      this.updateUrl(this.screenURL)
    } else {
      this.macOpen = true
      this.$message.warning('请输入相应的屏幕信息')
    }
  }

  // 调用安卓的同名函数将数据进行传递
  ceshi() {
    this.infoOpen = true
  }

  // 通过诊室id去查询医生的信息和队列的信息
  getDocPat(pageCount: number) {
    fzAreaScreen.selectScreenQueueWithConfig(this.screenQueueWithConfig)
      .then((response: any) => {
        if (response.length !== 0) {
          this.total = response.length
          // this.pageNumber = Math.ceil(this.total / this.pageSize)
          this.docList = []
          for (let i = 0; i < response.length; i++) {
            // 初始化对象
            this.docVOS = {
              keyValue: '',
              roomName: '',
              docName: '',
              fzCallingQueueVOS: '',
              fzOverQueueVOS: '',
              fzWattingQueueVOS: ''
            }
            // 得到诊室的名称
            this.docVOS.roomName = response[i].roomName
            const ysList = response[i].doctorVOS
            if (ysList !== null && ysList.length !== 0) {
              for (let j = 0; j < ysList.length; j++) {
                // 初始化对象
                this.docVOS = {
                  keyValue: '',
                  roomName: response[i].roomName,
                  docName: '',
                  fzCallingQueueVOS: '',
                  fzOverQueueVOS: '',
                  fzWattingQueueVOS: ''
                }
                // 得到医生的名称
                this.docVOS.docName = ysList[j].docName
                // 正在就诊的队列信息
                const jzhzList = ysList[j].fzCallingQueueVOS
                if (jzhzList.length !== 0) {
                  for (let k = 0; k < jzhzList.length; k++) {
                    // 组装正在就诊的患者信息
                    if (k === 0) {
                      this.docVOS.fzCallingQueueVOS = '(' + jzhzList[k].queueTypeAlias + ') ' + jzhzList[k].serialNumber + ' ' + jzhzList[k].patientName + ' ' + jzhzList[k].shiftName
                    } else {
                      this.docVOS.fzCallingQueueVOS = this.docVOS.fzCallingQueueVOS + ',' + '(' + jzhzList[k].queueTypeAlias + ') ' + jzhzList[k].serialNumber + ' ' + jzhzList[k].patientName + ' ' + jzhzList[k].shiftName
                    }
                  }
                }
                // 等待就诊的患者
                const ddjzList = ysList[j].fzWattingQueueVOS
                if (ddjzList.length !== 0) {
                  for (let k = 0; k < ddjzList.length; k++) {
                    // 组装等待就诊的患者信息
                    if (k === 0) {
                      this.docVOS.fzWattingQueueVOS = '(' + ddjzList[k].queueTypeAlias + ') ' + ddjzList[k].serialNumber + ' ' + ddjzList[k].patientName + ' ' + ddjzList[k].shiftName
                    } else {
                      this.docVOS.fzWattingQueueVOS = this.docVOS.fzWattingQueueVOS + ',' + '(' + ddjzList[k].queueTypeAlias + ') ' + ddjzList[k].serialNumber + ' ' + ddjzList[k].patientName + ' ' + ddjzList[k].shiftName
                    }
                  }
                }
                // 过号的患者
                const ghList = ysList[j].fzOverQueueVOS
                if (ghList.length !== 0) {
                  for (let k = 0; k < ghList.length; k++) {
                    // 组装过号患者信息
                    if (k === 0) {
                      this.docVOS.fzOverQueueVOS = '(' + ghList[k].queueTypeAlias + ') ' + ghList[k].serialNumber + ' ' + ghList[k].patientName + ' ' + ghList[k].shiftName
                    } else {
                      this.docVOS.fzOverQueueVOS = this.docVOS.fzOverQueueVOS + ',' + '(' + ghList[k].queueTypeAlias + ') ' + ghList[k].serialNumber + ' ' + ghList[k].patientName + ' ' + ghList[k].shiftName
                    }
                  }
                }
                this.docVOS.keyValue = new Date().getTime().toString().concat(i.toString()).concat(j.toString())
                console.log(this.docVOS.keyValue)
                this.docList.push(this.docVOS)
              }
            } else {
              this.docVOS.keyValue = new Date().getTime().toString().concat(i.toString())
              this.docList.push(this.docVOS)
            }
          }
        }
        // 叫号刷新逻辑所使用的参数
        if (this.calling) {
          this.calling = false
          this.callongTemp = true
        }
        // 中专队列
        this.docListTemp = this.docList
        this.queryList = []
        this.scrollIndex = 0
        this.docListTemp.forEach((item: any, index: number) => {
          // if (item.fzWattingQueueVOS !== '' || item.fzCallingQueueVOS !== '') {
          const page = Math.floor(this.scrollIndex / 7)
          // 如果数组中没有这个页码，设置为空
          if (!this.queryList[page]) {
            this.queryList[page] = [];
          }
          this.queryList[page].push(item);
          this.scrollIndex = this.scrollIndex + 1
          // }
        })
        console.log(this.queryList);
        // 判断前端数据的展示方式1.当前的数据需要翻页 2.当前的数据不需要进行翻页 3.当前的请求是叫号请求
        // if (this.pageNumber > 1 && !this.callongTemp) {
        //   this.task = false;
        // for (let i = 0; i < this.pageSize; i++) {
        //   this.queryList.push(this.docListTemp[this.page * this.pageSize + i])
        // }
        // if (page === -1) {
        //   this.timetask()
        // } else {
        //   clearInterval(this.timer)
        //   this.pageNumber = page - 1
        // }
        if (pageCount !== -1) {
          this.queryList = [this.queryList[pageCount - 1]]
        }
      })
  }

  // 通过赋值的方式对当前界面的数据进行更新，实现翻页的功能
  pageTimer: any = 0
  // 通过赋值的方式对当前界面的数据进行更新，实现翻页的功能
  timetask(timerCount: number) {
    // this.pageNumber = 0
    // alert(timerCount);
    clearInterval(this.pageTimer)
    this.pageTimer = window.setInterval(() => {
      // alert(1)
      // this.$nextTick(() => {
      //   this.pageScroll()
      // })
      this.pageChange()
    }, timerCount * 1000)
  }

  timeList:any[] = []

  // 翻页与刷新
  pageChange() {
    if (this.queryList.length <= 0) return
    this.timeList = []
    let data: any[] = []
    // this.queryList = []
    if (this.pageNumber < this.queryList.length - 1) {
      this.pageNumber++
      console.log(data);
    } else {
      this.pageNumber = 0
    }

    data = this.queryList[this.pageNumber];
    console.log(data);
    if (data && data.length >= 0) {
      this.timeList = data.map(item => {
        if (item.fzWattingQueueVOS) {
          return item.fzWattingQueueVOS.split(',').length
        }
      })
    }
    // console.log('this.timeList :>> ', this.timeList.sort()[0]);
    const timeLength = this.timeList.sort()[0] ? this.timeList.sort((m, n) => n - m)[0] : 0
    let timeLengthSecond = 5;
    console.log('this.timeList :>> ', this.timeList);
    if (timeLength !== 0) {
      timeLengthSecond = timeLength * 8 > 240 ? 240 : timeLength * 8;
    }
    this.timetask(timeLengthSecond)
  }

  reset() {
    this.page = 0
    clearInterval(this.timer)
    // 当数据的展示到达最后一页时进行数据的更新
    this.getRoom()
  }

  // 点击齿轮后弹窗
  setting() {
    this.macOpen = true
    this.$message.warning('在输入通讯域名时请注意当原有域名以https开头时请使用wss，当域名以http开头时请使用ws！')
  }

  // 关闭定时器
  destroyed() {
    clearInterval(this.nowDateNum)
    clearInterval(this.timer)
    clearInterval(this.roomTimer)
    clearInterval(this.breakTimer)
    clearInterval(this.connectionTimer)
    clearInterval(this.callTimer)
    console.log('断开连接');
    // 离开路由之后断开websocket连接
    this.socket.close();
  }

  mounted() {
    // 右上角时间
    fzAreaScreen.findTimeSync().then((response: any) => {
      this.nowDate = response.currentDate + ' ' + response.currentWeek
      this.nowTime = moment(response.currentTime, 'HH:mm:ss').format('HH:mm')
    })
    this.nowDateNum = setInterval(() => {
      fzAreaScreen.findTimeSync().then((response: any) => {
        this.nowDate = response.currentDate + ' ' + response.currentWeek
        this.nowTime = moment(response.currentTime, 'HH:mm:ss').format('HH:mm')
      })
    }, 60000)
    // 大屏数据刷新定时器
    this.roomTimer = setInterval(this.getroomfun, 30000)
    // websocket初始化逻辑及配置

    // 大屏ws断开定时器
    this.breakTimer = setInterval(this.breakConnection, 300000)
    // 大屏ws重连定时器
    this.connectionTimer = setInterval(this.connection, 1000)
    // 初始化ws
    // this.initWebSocket();
    // 叫弹窗的定时器
    this.callTimer = setInterval(this.callfun, 1000)

    this.timetask(10)
  }

  // 叫号定时器
  callfun() {
    if (!this.callingInfo && this.callingList.length > 0) {
      this.callingInfo = true
      // this.information = this.callingList[0].androidCallingInfo
      this.callText = this.callingList[0].androidCallingText
      if (this.isJhtm === '是') {
        this.information = this.callingList[0].androidCallingInfo
      } else {
        this.information = this.callText.replace(new RegExp('，', 'g'), '')
      }
      try {
        this.speakCalling()
      } catch (e) {
        console.log(e);
        this.$message.error('叫号信息发送失败')
      }
      // 弹出界面
      this.infoOpen = true
      setTimeout(() => {
        this.callingList.shift()
        this.infoOpen = false
        setTimeout(() => {
          this.callingInfo = false
        }, 1000)
      }, 5000)
    }
  }

  getCofnigValue() {
    if (this.screenTypeByMac === 1) {
      this.getAndroidValue()
    } else {
      this.getWindowValue()
    }
  }

  speakSetting: any = {}
  async created() {
    await this.getScreenTypeByMac()
    this.getCofnigValue()
    window.speechSynthesis.getVoices()
    if (localStorage.getItem('speakSetting')) {
      this.speakSetting = JSON.parse(localStorage.getItem('speakSetting') as string);
      console.log(this.speakSetting);
    }
    console.log(this.speakSetting.rate);
  }

  getroomfun() {
    this.getRoom()
  }

  // -------------------------------------------------websocket连接---------------------------------------------

  // 初始化weosocket
  initWebSocket() {
    console.log('初始化');
    try {
      if ('WebSocket' in window) {
        console.log('this.wsuri: ', this.wsuri)
        this.socket = new WebSocket(this.wsuri)
      } else {
        alert('您的浏览器不支持websocket');
      }
      this.socket.onopen = this.websocketonopen;
      this.socket.onmessage = this.websocketonmessage;
      this.socket.onclose = this.websocketclose;
      this.socket.onerror = this.websocketonerror;
    } catch (e) {
      this.reconnection = true;
      this.$message.error('初始化失败')
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
      }
      const data = JSON.parse(e.data);
      // 脱敏 用于页面显示
      const strArr = data.content.split('&');
      console.log(strArr);
      strArr[0] = strArr[0].replaceAll('"', '')
      strArr[0] = strArr[0].replaceAll('，', '')
      this.informationTemp = strArr[0]
      this.callTextTemp = strArr[1].replace('"', '')
      // 播放声音 H5叫号测试
      this.wsCall.androidCallingInfo = this.informationTemp
      if (this.screenTypeByMac === 2) {
        // windows html5 叫号下，不能存在逗号，所以进行去除。
        this.wsCall.androidCallingText = this.callTextTemp.replace(new RegExp('，', 'g'), '')
      } else {
        this.wsCall.androidCallingText = this.callTextTemp
      }
      for (let i = 0; i < this.callTimes; i++) {
        this.callingList.push(this.wsCall)
      }
    } catch (e) {
      this.$message.error(`${e}`);
    }
  }

  websocketclose(e: any) {
    // console.log('websocketclose (' + e.code + ')');
    // todo 重连机制
    // 开启ws重连标识
    this.reconnection = true
  }

  websocketonerror(e: any) {
    this.reconnection = true
  }

  reconnect() {
    if (this.socket !== null) {
      this.socket.close();
    }
    this.socket = null;
    this.initWebSocket();
  }

  updateUrl(arr: string) {
    // console.log('更新连接地址');
    if (this.socket) {
      this.socket.close()
    }
    this.wsuri = arr;
    this.reconnection = true
  }

  breakConnection() {
    console.log('into:breakConnection()')
    if (this.socket) {
      this.socket.close();
    }
    this.socket = null;
    this.reconnection = true;
  }

  connection() {
    // this.$message.warning('进入循环！' + this.reconnection)
    if (this.reconnection) {
      this.reconnect();
    }
  }

  // ------------------------------------windows叫号逻辑-------------------------------------------

  // windows进行ws通讯路由的组装与传值
  setWindows() {
    clearInterval(this.timer)
    // this.callTimes = 1
    if (!this.callTimes) {
      this.callTimes = 1
    }
    if (!this.isJhtm) {
      this.isJhtm = '否'
    }
    if (this.paramsMac.wsUrl !== null && this.paramsMac.wsUrl !== '' && this.paramsMac.macAddr !== null && this.paramsMac.macAddr !== '' && this.paramsMac.screenURL !== null && this.paramsMac.screenURL !== '' && this.paramsMac.screenToken !== null && this.paramsMac.screenToken !== '' && this.callTimes) {
      // &storage=true 持久化不可使用会导致二次呼叫
      this.screenURL = this.paramsMac.wsUrl + this.paramsMac.screenURL +
        '/msun-websocket-server/ws-server?host=' + this.paramsMac.screenURL + '&token=' + this.paramsMac.screenToken +
        '&appName=msun-middle-business-guidance-server&busiName=sendMsg&clientId=' + this.paramsMac.macAddr
      this.getRoom()
      // this.getConfigValueForSelfTriageHeaderImage()
      this.macOpen = false;
      this.updateUrl(this.screenURL)
    } else {
      this.macOpen = true
      this.$message.warning('请输入相应的屏幕信息')
    }
  }

  // 根据mac地址获取屏幕类型
  async getScreenTypeByMac() {
    // const isZyllq = this.$workEnv.isElectronEnv();
    const macAddr = localStorage.getItem('tigc_screenMac') as string
    if (macAddr) {
      const res: any = await fzAreaScreen.getFzScreenByMac({ macAddress: macAddr })
      if (res) {
        this.screenTypeByMac = res.screenType
      } else {
        this.$message.warning(`mac地址:${macAddr},未查询到屏幕信息，请到屏幕管理进行检验`)
      }
    } else {
      // 为兼容Android逻辑，默认为安卓屏幕类型。
      this.screenTypeByMac = 1
    }
  }

  // 获取浏览器中语音服务
  getWindowVoice() {
    return window.speechSynthesis.getVoices().find(item => item.localService && item.lang === 'zh-CN') as any;
  }

  // Windows叫号
  windowPlayVoice(callText: string) {
    const synth = window.speechSynthesis
    const message = new SpeechSynthesisUtterance();
    message.text = callText;
    // message.lang = 'zh';
    // message.volume = 20;
    message.rate = this.speakSetting.rate ? this.speakSetting.rate : 1;
    message.pitch = this.speakSetting.pitch ? this.speakSetting.pitch : 1;
    message.voice = this.getWindowVoice()[this.speakSetting.voiceType ? this.speakSetting.voiceType : 0];
    // window.speechSynthesis.cancel();
    synth.speak(message)
  }

  // 获取windows端的配置信息
  getWindowValue() {
    console.log('sessionStorage:', sessionStorage);
    this.paramsMac.screenToken = JSON.parse(sessionStorage.getItem('currentUser') as any).token
    this.paramsMac.screenURL = window.location.host
    if (localStorage.getItem('tigc_screenMac') && localStorage.getItem('tigc_screenType')) {
      this.paramsMac.macAddr = localStorage.getItem('tigc_screenMac')
      this.setMacType()
    } else {
      this.$message.warning('请输入mac地址')
      this.macOpen = true
    }
  }

  // 重置屏幕
  resetScreen() {
    this.macOpen = false
    localStorage.setItem('tigc_screenType', '')
    localStorage.setItem('tigc_screenMac', '')
    // this.$router.push('/screenAdmin/screenAdmin')
    window.location.href = window.location.origin + window.location.pathname + '#/screenAdmin/screenAdmin'
    window.location.reload()
  }
}
</script>
<style lang="less" src="./fz-area-screen.less" scoped>

</style>
