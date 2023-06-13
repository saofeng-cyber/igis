<template src="./fz-pacs-reporting.html"></template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { message } from 'ant-design-vue';
import moment from 'moment';
import { ComHospitalApi, readCardApi, fzReportingApi } from '@/api';
import { fzPacsReporting } from '@/api/fz-pacs-reporting/fz-pacs-reporting';
import { DefaultQueueTypeParams, Message, CartTypeObj, TriageObj } from './fz-pacs-reporting';
import { fzAreaScreen } from '../../api/fz-area-screen/fz-area-screen';
import { triagePrint } from '@/api/print/print';
type resType = 'success' | 'error' | 'info' | 'warning';
@Component
export default class ReportingScreen extends Vue {
  medicalCard: string = '';
  nowDate: string = '';
  nowTime: string = '';
  resultSubTitle: string = '';
  resultTitle: string = '分诊成功';
  resultType: resType = 'success';
  nowDateNum: any = 0;
  isPrintTicket: any = '1'; // 打印标识 0关闭打印 1开启打印
  clinicAreaList: any = []; // 诊区
  printParams: any = {}; // 打印入参
  isDisable: boolean = false;
  clinicAreaId: any = 0;
  roomList: any = []; // 诊室
  docList: any = []; // 医生
  second: number = 0;
  timer: any = null;
  triage: any = null;
  isShuPing: boolean = true;
  patInfoCard: any = {
    patientName: '',
    patientCard: '',
    clinicAreaName: '',
    roomName: '',
    docName: '',
    wattingNum: 0,
    patientIdCard: ''
  };

  message: Message = {
    flag: false,
    text: ''
  };

  /* 自助分诊 入参对象 */
  triageObj: TriageObj = {
    businessFee: '',
    businessId: '',
    businessName: '',
    businessTime: '',
    callerCode: 'selfhelp', // 固定值，不可修改！
    doctorId: '',
    medicalCardNumber: '',
    queueTypeId: 0,
    roomId: '',
    serialNumber: '',
    sourceChannelCode: '',
    allowOnlineRoomDoc: 1 // 允许分诊到诊室医生标识（0不启用，1启用）
  };

  defaultQueueTypeParams: DefaultQueueTypeParams = {
    outPatId: '',
    patientCard: '',
    hospitalId: '',
    businessId: '',
    rooms: []
  };

  lisBusinessId: any = 0;
  printPlugin: any = null;
  printCount: any = 0;
  cardTypes: any = [];
  businessData: any = []; // 预约/挂号记录
  isChooseDoc: any = 1; // 是否开启自助选择医生的配置 0关闭 1开启 2有预约记录走预约签到，没有预约记录走选择医生
  appointmentToSignIn: boolean = false; // 预约签到是否展示
  manually: boolean = false; // 手动选择是否展示
  idCardNo: any = null;
  DZcardNo: any = 0;
  step: number = 0;
  visible: boolean = false;
  confirmLoading: boolean = false;
  iconLoading: boolean = false;
  queueId: any = 0;
  confirmFlag: boolean = false; // 确认分诊 loading 标识
  arealogo: any = null;
  newArr: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'X'];
  doIdCardCount: number = 0;
  cardNo: string = '';
  columns = [
    {
      title: '项目',
      dataIndex: 'orderName',
      scopedSlots: { customRender: 'orderName' },
      align: 'center'
    },
    {
      title: '时间',
      dataIndex: 'apponitmentdDate',
      scopedSlots: { customRender: 'apponitmentdDate' },
      align: 'center'
    },
    {
      title: '窗口',
      dataIndex: 'roomName',
      align: 'center',
      scopedSlots: { customRender: 'roomName' }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      scopedSlots: { customRender: 'operate' },
      align: 'center',
      width: '22%'
    }
  ];

  tableData = [];

  // 单元格合并
  mergeCells(text: any, data: any, key: any, index: number) {
    // 上一行该列数据是否一样
    if (index !== 0 && data[index - 1][key] === '签到') {
      return 0;
    }
    let rowSpan = 1;
    // 判断下一行是否相等
    for (let i = index + 1; i < data.length; i++) {
      if (text !== data[i][key]) {
        break;
      }
      rowSpan++;
    }
    return rowSpan;
  }

  /* 签到功能 */
  async SignInLis(data: any) {
    this.resultSubTitle = '';
    this.lisBusinessId = data.businessId;
    let paramsData: any = [];
    const OrderList = this.tableData.filter((item: any) => {
      if (!item.groupId || !data.groupId) return;
      return item.groupId === data.groupId;
    });
    if (OrderList.length === 0) {
      paramsData = [
        {
          applyDetailId: data.orderId,
          applyMainId: data.applyMainId,
          exeDeptId: data.deptId,
          virtualDocId: data.roomId
        }
      ];
    } else {
      paramsData = OrderList.map((item: any) => {
        return {
          applyDetailId: item.orderId,
          applyMainId: item.applyMainId,
          exeDeptId: item.deptId,
          virtualDocId: item.roomId
        };
      });
    }

    const params = {
      channelType: 0,
      idCard: this.idCardNo,
      medicalCardNumber: this.cardNo,
      orderList: paramsData
    };
    console.log(params);
    await fzPacsReporting
      .FzPacsSelfCheckIn(params)
      .then((response: any) => {
        console.log(response);
        if (response) {
          this.queueId = response.queueId;
          this.triageObj.queueTypeId = response.queueTypeId;
          this.appointmentToSignIn = true;
          this.resultTitle = '报到成功';
          this.resultType = 'success';
          this.resultSubTitle = this.patInfoCard.patientName + '，您已成功报道' + '，请尽快前往就诊。';
          setTimeout(() => {
            this.appointmentToSignIn = false;
            this.resultSubTitle = '';
          }, 2500);
        }
      })
      .then(async() => {
        const triageParams: any = {
          medicalCardNumber: this.cardNo,
          idCard: this.idCardNo,
          patId: this.defaultQueueTypeParams.outPatId,
          requestChannel: 'mt_tigc_a',
          status: 0
        };
        await fzReportingApi.FzPacsSignInTriage(triageParams).then((res: any) => {
          this.tableData = res;
          console.log(666, this.tableData, this.tableData.length);
          if (this.tableData.length === 0) {
            this.visible = false
            window.clearInterval(this.timer)
          }
        });
        await this.print(data.orderId);
      })
      .catch(message => {
        this.appointmentToSignIn = true;
        this.resultType = 'warning';
        this.resultTitle = '';
        this.resultSubTitle = message;
        window.clearInterval(this.timer);
        this.visible = false;
        setTimeout(() => {
          this.appointmentToSignIn = false;
          this.resultSubTitle = '';
        }, 2500);
      })
  }

  /* 是否开启打印小票的配置 */
  getIsPrintTicket() {
    ComHospitalApi.getConfigValue('is_pacs_print_ticket')
      .then((response: any) => {
        this.isPrintTicket = response;
      })
      .catch((e: any) => {
        this.message.flag = true;
        this.message.text = e;
        setTimeout(() => {
          this.message.flag = false;
        }, 3000);
      });
  }

  /* 获取lis小票内容 */
  // 获取小票内容
  async print(orderId: any) {
    const params = { applyDetailId: orderId };
    await fzReportingApi
      .getPacsBarcodeNumber(params)
      .then((response: any) => {
        const printObj: any = {};
        printObj.Master = [];
        printObj.Master[0] = response;
        console.log(printObj.Master[0]);
        this.printParams = {
          printRecordId: Symbol(Date.now()),
          printNodeCode: 'guidance_pacs_barcode',
          workstationId: '-1',
          dataType: '3',
          taskType: 'print', // 这里暂时永预览代替打印 'preview'
          // taskType: 'print', // 直接打印
          dataJson: JSON.stringify(printObj),
          // dataJson: response,
          // parameters: param,
          hisOrgId: response.orgId,
          hisHospitalId: response.hospitalId
          // "exportSet":{"exportType":"xls","fileName":"导出excel测试.xls","showOptionDlg":"false","doneOpen":"true"},
        };
        console.log('1');
      })
      .then(async(res: any) => {
        await triagePrint.printContent(this.printParams).then(async(data: any) => {
          const result = this.$workEnv.isElectronEnv();
          console.log('2');
          if (this.isPrintTicket === '1') {
            if (result) {
              // true为在electron中调用打印
              await (window as any).electron.hdApi.print({
                busiVersion: 'Rubylong_V1.0',
                requestContent: data
              });
            } else {
              this.printPlugin.request(data).then((res: any) => {
                console.log('3');
                console.log(res);
              });
            }
          }
        });
      });
    console.log('312313');
    // 打印
  }

  // 点击签到
  signIn(data: any) {
    console.log(data);
    this.SignInLis(data);
    // this.appointmentToSignIn = true
    // this.resultTitle = '分诊成功'
    // this.resultType = 'success'
    // this.resultSubTitle = this.patInfoCard.patientName + '，您已成功分诊' + this.patInfoCard.clinicAreaName + this.patInfoCard.roomName + '，您前面还有' + this.patInfoCard.wattingNum + '位患者，请尽快前往就诊。'
  }

  /* 确认分诊成功提示信息 */
  tipInfo() {
    this.resultSubTitle = '';
    this.patInfoCard.clinicAreaName = '';
    this.patInfoCard.roomName = '';
    this.patInfoCard.docName = '';
    this.clinicAreaList.forEach((area: any) => {
      if (this.clinicAreaId === area.clinicAreaId) {
        this.patInfoCard.clinicAreaName = area.clinicAreaName;
      }
    });
    this.roomList.forEach((room: any) => {
      if (this.triageObj.roomId === room.roomId) {
        this.patInfoCard.roomName = room.roomName;
      }
    });
    if (this.docList.length !== 0 && this.triageObj.doctorId) {
      this.docList.forEach((doc: any) => {
        if (this.triageObj.doctorId === doc.clinicDocId) {
          this.patInfoCard.docName = doc.docName;
          this.resultType = 'success';
          this.resultTitle = '分诊成功';
          this.resultSubTitle = `${this.patInfoCard.patientName}，您已成功分诊 ${this.patInfoCard.clinicAreaName}/${this.patInfoCard.roomName}/${this.patInfoCard.docName} 医生，您前面还有 ${this.patInfoCard.wattingNum} 位患者，请尽快前往就诊。`;
          // clearInterval(this.time)
          // this.visible = false;
        }
      });
    } else {
      this.resultType = 'success';
      this.resultTitle = '分诊成功';
      this.resultSubTitle = this.patInfoCard.patientName + '，您已成功分诊' + this.patInfoCard.clinicAreaName + this.patInfoCard.roomName + '，您前面还有' + this.patInfoCard.wattingNum + '位患者，请尽快前往就诊。';
    }
    this.confirmFlag = false;
    this.step = 4;
    this.isDisable = false;
  }

  mounted() {
    document.onclick = () => {
      setTimeout(() => {
        this.cardReaderFocus()
      }, 1000)
    }
    this.nowDateNum = setInterval(() => {
      this.getNow();
    }, 30000);
    const orientation = window.matchMedia('(orientation: portrait)');
    console.log(orientation);
    // true 是竖屏 false 是横屏
    this.isShuPing = orientation.matches;
    orientation.addListener(res => {
      this.isShuPing = res.matches;
      console.log(this.isShuPing);
    });
  }

  cardReaderFocus() {
    this.$nextTick(() => {
      try {
        const read: any = this.$refs['readCard']
        read.focus()
        // eslint-disable-next-line no-empty
      } catch (error) { }
    })
  }

  openDailog() {
    this.visible = true;
  }

  handleCancel(e: MouseEvent) {
    if (this.triage !== null) {
      clearInterval(this.triage);
    }
    if (this.timer !== null) {
      clearInterval(this.timer._id);
    }
    console.log(e);
    this.visible = false;
  }

  async created() {
    this.cardReaderFocus()
    this.getNow();
    this.getConfigValueForSelfTriageHeaderImage();
    this.getIsPrintTicket();
    // 打印
    this.printPlugin = this.$trayApplication.getPlugin('print');
    this.printPlugin.init();
    this.cardTypes = await readCardApi.findCardTypes();
  }

  getNow() {
    // 右上角时间
    fzAreaScreen.findTimeSync().then((response: any) => {
      this.nowDate = response.currentDate + ' ' + response.currentWeek;
      this.nowTime = moment(response.currentTime, 'HH:mm:ss').format('HH:mm');
    });
  }

  /* 查询 自助机头部医院logo */
  getConfigValueForSelfTriageHeaderImage() {
    ComHospitalApi.getPictureConfigValue('self_triage_header_image')
      .then((response: any) => {
        this.arealogo = response;
      })
      .catch((e: any) => {
        this.$message.warning(e);
      });
  }

  // 读取身份证信息
  tipIDCard() {
    if (this.cardNo) {
      this.cardNo = '';
    }
    const userAgent = navigator.userAgent.toLowerCase();
    const electronFlag = userAgent.indexOf(' electron/') > -1;

    if (electronFlag) {
      (this.$refs.aInput as any).focus();
      this.patInfoCard.patientName = '';
      this.patInfoCard.patientCard = '';
      this.patInfoCard.patientIdCard = '';
      this.doIdCardCount = 0;
      this.message.flag = true;
      this.message.text = '正在扫描身份证!';
      setTimeout(() => {
        this.message.flag = false;
      }, 3000);
      clearInterval(this.idCardNo);
      clearInterval(this.DZcardNo);
      this.idCardNo = window.setInterval(async() => {
        this.doIdCardCount += 1;
        if (this.doIdCardCount >= 5) {
          window.clearInterval(this.idCardNo);
          this.message.flag = true;
          this.message.text = '读卡超时!';
          setTimeout(() => {
            this.message.flag = false;
          }, 3000);
        }
        const res = await (window as any).electron.hdApi.readIdentityCard({ busiVersion: 'X9AFD_V1.0' });
        console.log(666, (window as any).electron.hdApi);
        this.patInfoCard.patientCard = res?.data._patIdCard;
        this.patInfoCard.patientIdCard = res?.data._patIdCard;
        console.log(res?.data._patIdCard);
        console.log(res?.data);
        this.cardNo = res.data._patIdCard;
        this.patInfoCard.patientName = res?.data._patName;
        if (this.cardNo) {
          this.readCard();
        }
      }, 2000);
    } else {
      this.$message.warning('请切换到众阳浏览器来读取身份证');
    }
  }

  async readSelfCard() {
    if (this.timer !== null) {
      clearInterval(this.timer._id);
    }
    this.destoryTimer();
    await this.readCard();
  }

  // 读卡
  // @Watch('cardNo')
  async readCard() {
    // await this.getIsChooseDoc();
    this.cardNo = (this.$refs['readCard'] as any).patCardNo;
    if (this.cardNo) {
      this.message.flag = true;
      this.message.text = '读卡中，请稍后';
      // setTimeout(() => {
      //   this.message.flag = false;
      // }, 2500);
      clearInterval(this.idCardNo);
      // clearInterval(this.SScardNo)
      clearInterval(this.DZcardNo);
      let cardNo = '';
      if (this.cardNo.length > 64) {
        cardNo = this.cardNo.slice(0, 64);
      } else {
        cardNo = this.cardNo;
      }
      const cartTypeObj: CartTypeObj = this.isFilterCard(cardNo);
      // message.success('读卡成功，您的卡类型为:' + cartTypeObj.cardTypeName);
      this.patInfoCard.patientName = '';
      this.patInfoCard.patientIdCard = '';
      if (cartTypeObj?.cardTypeId) {
        this.businessData = [];
        // 读卡
        try {
          const patInfo: any = await readCardApi.readCard({
            cardTypeId: cartTypeObj.cardTypeId,
            patCardNo: cardNo,
            patName: this.patInfoCard?.patientName,
            idcardNo: this.patInfoCard?.patientIdCard
          });
          this.triageObj.medicalCardNumber = patInfo[0].patCardNo;
          this.defaultQueueTypeParams.outPatId = patInfo[0].patId;
          this.defaultQueueTypeParams.hospitalId = patInfo[0].hospitalId;
          this.defaultQueueTypeParams.patientCard = patInfo[0].patCardNo;
          console.log('6666', patInfo[0]);
          if (patInfo[0].patId) {
            this.patInfoCard.patientName = patInfo[0].patName;
            this.patInfoCard.patientCard = patInfo[0].patCardNo;
            await this.getBusinessData();
          } else {
            this.message.flag = true;
            this.message.text = '未查询到患者信息，请先建档！';
            this.cardNo = '';
            setTimeout(() => {
              this.message.flag = false;
            }, 3000);
          }
        } catch (error) {
          this.message.flag = true;
          this.message.text = error;
          setTimeout(() => {
            this.message.flag = false;
            this.cardNo = '';
          }, 2500);
        }
      } else {
        // 不知道会不会一直弹提示
        this.message.flag = true;
        this.message.text = '没有匹配到有效卡类型，请重新刷卡！';
        setTimeout(() => {
          this.message.flag = false;
          this.cardNo = '';
        }, 3000);
      }
    } else {
      this.message.flag = true;
      this.message.text = '卡号为空，请输入卡号';
      setTimeout(() => {
        this.message.flag = false;
      }, 2500);
    }
    this.isRequest = false
  }

  isRequest: boolean = false

  async read(toPromise: Promise<any>) {
    try {
      if (this.isRequest) {
        this.$message.warning('请您耐心等候，不要多次刷卡操作');
        return
      }
      this.destoryTimer();
      this.message.flag = true;
      this.message.text = '读卡中，请稍后';
      const parameters = await toPromise;
      console.log(parameters);
      if (parameters.patId) {
        this.message.flag = false;
        clearInterval(this.idCardNo);
        // clearInterval(this.SScardNo)
        clearInterval(this.DZcardNo);
        this.cardNo = parameters.patCardNo;
        this.triageObj.medicalCardNumber = parameters.patCardNo;
        this.defaultQueueTypeParams.outPatId = parameters.patId;
        // this.defaultQueueTypeParams.hospitalId = parameters.hospitalId;
        this.defaultQueueTypeParams.patientCard = parameters.patCardNo;
        console.log('6666', parameters);
        this.patInfoCard.patientName = parameters.patName;
        this.patInfoCard.patientCard = parameters.patCardNo;
        await this.getBusinessData();
        this.isRequest = false
      } else {
        this.message.flag = true;
        this.message.text = '未查询到患者信息，请先建档！';
        this.cardNo = '';
        setTimeout(() => {
          this.message.flag = false;
        }, 3000);
        this.isRequest = false
      }
    } catch (error) {
      console.log(error);
      this.isRequest = false
    }
  }

  /* 根据outPatId 获取患者预约/挂号记录 */
  async getBusinessData() {
    this.isRequest = true;
    this.resultSubTitle = '';
    this.message.flag = false;
    const params: any = {
      medicalCardNumber: this.cardNo,
      idCard: this.idCardNo,
      patId: this.defaultQueueTypeParams.outPatId,
      requestChannel: 'mt_tigc_a',
      status: 0
    };
    // 上线记得开启
    await fzReportingApi
      .FzPacsSignInTriage(params)
      .then(async(res: any) => {
        const data = res;
        if (data.length && data.length > 1) {
          this.message.flag = false;
          this.tableData = data;
          this.visible = true;
          this.destoryTimer();
        } else if (data.length === 1) {
          this.visible = false;
          await this.SignInLis(data[0]);
        } else {
          this.$message.warning('预约记录为空，请先去挂号预约');
        }
      })
      .catch((msg: any) => {
        console.log(msg);
        this.appointmentToSignIn = true;
        this.resultTitle = msg;
        this.resultType = 'warning';
        setTimeout(() => {
          this.appointmentToSignIn = false;
          this.resultSubTitle = '';
          this.cardNo = '';
        }, 2500);
      });
  }

  destoryTimer() {
    const _self = this;
    this.second = 30;
    if (this.timer !== null) {
      clearInterval(this.timer._id);
    }
    this.timer = setInterval(() => {
      this.second--;
      if (this.second === 0) {
        clearInterval(this.timer._id);
        this.timer = null;
      }
    }, 1000);
    this.triage = setTimeout(() => {
      if (this.timer !== null) {
        clearInterval(this.timer._id);
      }
      this.timer = null;
      this.visible = false;
    }, 30000);
  }

  isFilterCard(cardNo: any) {
    return this.cardTypes.find((item: any) => {
      return item.cardLength === cardNo.length;
      // if (item.cardLength === this.cardNo.length) {
      //   this.cardTypeId = item.cardTypeId
      //   return true
      // } else {
      //   return false
      // }
    });
  }

  btnClick() {
    this.tipIDCard();
  }

  add(num: string) {
    // if (this.medicalCard === '') {
    //   this.medicalCard = e.currentTarget.innerHTML.match(/(<span>=?)(\S*)(?=<\/span>)/)[2];
    // } else {
    //   this.medicalCard = this.medicalCard + e.currentTarget.innerHTML.match(/(<span>=?)(\S*)(?=<\/span>)/)[2];
    // }
    const read = this.$refs['readCard'] as any;
    console.log(read);
    // read.patCardNo = ''
    // read.focus()
    if (!read.patCardNo) {
      read.patCardNo = num;
    } else {
      read.patCardNo = read.patCardNo + num;
    }
    console.log('this.triageObj.medicalCard', num);
  }

  backSpace() {
    const read = this.$refs['readCard'] as any;
    console.log(read);
    read.patCardNo = '';
    read.focus();
  }

  resetCard() {
    this.cardNo = '';
    (this.$refs['aInput'] as any).focus();
  }

  determineCard() {
    if (this.cardNo === '') {
      message.error('请输入您的身份证号');
      return false;
    } else {
      const regexp = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (regexp.test(this.cardNo)) {
        message.success('身份证号正确');
        return true;
      } else {
        message.error('请输入您的身份证号格式有误');
        return false;
      }
    }
  }

  /* 页面销毁销毁定时器 */
  destroyed() {
    clearInterval(this.nowDateNum);
    clearInterval(this.idCardNo);
    clearInterval(this.DZcardNo);
  }
}
</script>
<style scoped lang="less">
@import './fz-pacs-reporting.less';
</style>
