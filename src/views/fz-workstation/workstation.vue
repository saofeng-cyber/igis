<template src="./workstation.html"></template>
<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { fzWorkstation } from '@/api/fz-workstation/fz-workstation';
import { fzRoom } from '@/api/fz-room/fz-room'
import SceneTypeMixin from '@/mixins/scene/scenemixins';
import { sceneType } from '@/api/common-scene-type/scene-type'
import { fzScreen, ComHospitalApi, fzClinicArea } from '@/api';

const columns = [
  {
    title: '工作站名称',
    dataIndex: 'workstationName',
    align: 'center'
    // ellipsis: true
  },
  {
    title: '场景类型',
    align: 'center',
    width: 80,
    dataIndex: 'sceneTypeName'
  },
  {
    title: '场景子类型',
    align: 'center',
    width: 90,
    dataIndex: 'subtypeName'
  },
  {
    title: '所属诊室',
    align: 'center',
    dataIndex: 'roomName'
  },
  // {
  //   title: '工作站 IP/MAC',
  //   align: 'center',
  //   dataIndex: 'workstationMac'
  // },
  {
    title: '机器码',
    align: 'center',
    dataIndex: 'workstationMachineCode'
  },
  {
    title: '工作站屏幕名称',
    align: 'center',
    scopedSlots: { customRender: 'screenName' }
  },
  {
    title: '登录医生',
    align: 'center',
    dataIndex: 'docName',
    scopedSlots: { customRender: 'docNameRender' }
  },
  {
    title: '最近登录时间',
    align: 'center',
    dataIndex: 'clinicTime'
  },
  {
    title: '首次登陆时间',
    align: 'center',
    dataIndex: 'firstClinicTime'
  },
  {
    title: '序号',
    align: 'center',
    ellipsis: true,
    width: 60,
    dataIndex: 'sortNo'
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
@Component
export default class FzWorkstation extends Mixins(SceneTypeMixin) {
  columns:any = columns;
  loading:boolean = false; // 遮罩层
  loadingSync:boolean = false; // 设备同步按钮loading
  loadingSubmit:boolean = false; // 数据提交按钮loading
  total:number = 0;// 总条数
  workstationList:any = [];
  title:string = '';// 弹出层标题
  open:boolean = false;// 是否显示弹出层
  clinicAreaList: any = [] // 诊区下拉列表
  roomList: any [] = [];// 诊室 下拉 数据集合
  sceneSubtypeList: any [] = [];// 场景子类 下拉 数据集合
  screenList: any = [] // 工作站屏幕下拉列表
  getMachineLoading:boolean = false
  visibleHelp:boolean = false

  previewSrcList: any = [
    require('@/assets/help/fz_workstation_edit.png'),
    require('@/assets/help/fz_workstation_add.png'),
    require('@/assets/help/fz_workstation_form.png')
  ]

  openHelpReadMe() {
    console.log(555);
    this.visibleHelp = true
  }

  onCloseHelp() {
    this.visibleHelp = false
  }

  queryParams:any = { // 查询参数
    workstationName: undefined,
    sceneType: undefined,
    roomStr: undefined,
    roomName: undefined,
    roomId: undefined,
    pageNum: 1,
    pageSize: 10,
    clinicAreaId: undefined,
    workstationMachineCode: '',
    screenName: ''
  };

  queryScreenParams:any = { // 查询参数
    screenName: '',
    pageNum: 1,
    pageSize: 40
  };

  emptyParams: any = {}
  machineLoading:boolean = false

  sceneSubTypeParams: any = {
    sceneId: undefined
  }

  delParams: any = {
    workstationId: undefined
  }

  isMsunBrowser:any = 0 // 是否启用众阳浏览器 默认0不启用；1启用

  formModify:any = {
    workstationName: '',
    dictCode: undefined,
    sceneTypeStr: undefined,
    sceneTypeName: undefined,
    sceneType: undefined,
    subTypeStr: undefined,
    sceneSubtype: undefined,
    subtypeName: undefined,
    subtypeCode: undefined,
    roomStr: undefined,
    roomName: undefined,
    roomId: undefined,
    workstationMac: '',
    workstationMachineCode: '',
    screenIds: [],
    screenMac: undefined,
    screenName: undefined,
    missionaryText: '',
    imageUrl: '',
    docName: undefined,
    sortNo: 0
  };

  rules:any = {
    workstationName: [
      { required: true, message: '工作站名称 不能为空', trigger: 'change' }
    ],
    sceneTypeStr: [
      { required: true, message: '场景类型 不能为空', trigger: 'change' }
    ],
    subTypeStr: [
      { required: true, message: '场景子类型 不能为空', trigger: 'change' }
    ],
    roomStr: [
      { required: true, message: '所属诊室 不能为空', trigger: 'change' }
    ],
    workstationMachineCode: [
      { required: true, message: '机器码 不能为空', trigger: 'blur' }
    ],
    workstationMac: [
      { required: true, message: '工作站MAC 不能为空', trigger: 'blur' }
    ]/* ,
    screenIds: [
      { required: true, message: '工作站屏幕名称/屏幕MAC 不能为空', trigger: 'blur' }
    ] */
  }

  headers: any = {
    authorization: 'authorization-text'
  }

  created() {
    this.queryList();
    this.getMedicalRoomList()
    this.getScreenList()
    this.getFzClinicAreaList();
    this.getConfigValue()
  }

  /* searchLike(value: any) {
    this.queryScreenParams.screenName = value
    const a:any = []
    fzScreen
      .getFzScreenListByPage(this.queryScreenParams)
      .then((response: any) => {
        response.list.forEach((element: any) => {
          if (element.screenCategory === 2) {
            a.push(element)
          }
        });
      }).then(() => {
        this.screenList =
        this.screenList = a
      })
    console.log('模糊查询', this.screenList);
  } */

  /* 查询 是否使用众阳浏览器 0:不启用，1：启用 */
  getConfigValue() {
    ComHospitalApi.getConfigValue('open_msunsoft_browser').then((response:any) => {
      this.isMsunBrowser = response
    }).catch((e:any) => {
      this.$message.warning(e)
    })
  }

  async getWorkstationMachineCode() {
    this.isMsunBrowser = await ComHospitalApi.getConfigValue('open_msunsoft_browser')
    console.log('this.isMsunBrowser :>> ', this.isMsunBrowser);
    const result = this.$workEnv.isElectronEnv();
    console.log(result);
    if (this.isMsunBrowser === '1') {
      if (result) {
        // 众阳浏览器获取机器码
        // this.formModify.workstationMachineCode = (window as any).electron.hdApi.getMachineCode()
        (window as any).electron.hdApi.getMachineCode().then((response:any) => {
          console.log('response', response);
          this.queryParams.workstationMachineCode = response.data.machineId
          console.log('this.queryParams.workstationMachineCode', this.queryParams.workstationMachineCode);
        })
      } else {
        this.$message.warning('该浏览器为非众阳浏览器，系统配置为启用众阳浏览器！如继续获取，请关闭启用众阳浏览器配置，或将浏览器换为众阳浏览器！')
      }
    } else {
      if (result) {
        this.$message.warning('该浏览器为众阳浏览器，系统配置为不启用众阳浏览器！如继续获取，请启用众阳浏览器配置，或将浏览器换为普通浏览器！')
      } else {
        try {
          this.getMachineLoading = true
          const workstationPlugin:any = this.$trayApplication.getPlugin('workstation');
          workstationPlugin.init();
          const code = await workstationPlugin.request('GetMachineCode');
          this.queryParams.workstationMachineCode = code
          this.getMachineLoading = false
        } catch (error) {
          this.getMachineLoading = false
          console.log(error);
          if (error === 'socket_error') {
            this.$message.error('机器码获取失败，请检查是否启用了众阳托盘')
          }
        }
      }
    }
  }

  // 获取机器码
  getMachineCode() {
    const result = this.$workEnv.isElectronEnv();
    if (this.isMsunBrowser === '1') {
      if (result) {
        // 众阳浏览器获取机器码
        // this.formModify.workstationMachineCode = (window as any).electron.hdApi.getMachineCode()
        (window as any).electron.hdApi.getMachineCode().then((response:any) => {
          this.formModify.workstationMachineCode = response.data.machineId
        })
      } else {
        this.$message.warning('该浏览器为非众阳浏览器，系统配置为启用众阳浏览器！如继续获取，请关闭启用众阳浏览器配置，或将浏览器换为众阳浏览器！')
      }
    } else {
      if (result) {
        this.$message.warning('该浏览器为众阳浏览器，系统配置为不启用众阳浏览器！如继续获取，请启用众阳浏览器配置，或将浏览器换为普通浏览器！')
      } else {
        this.handleWebSocket()
      }
    }
  }

  // 清空机器码
  clearMachineCode() {
    this.formModify.workstationMachineCode = ''
  }

  showSizeChange() {
    this.loading = true;
    this.queryParams.pageNum = 1
    fzWorkstation.queryWorkstationListByPage(this.queryParams).then(
      (response:any) => {
        this.workstationList = response.list;
        this.total = Number(response.total);
        if (this.total === 0) {
          this.$message.warning('当前工作站为空，请添加工作站。')
          this.openAddModal()
        }
        this.loading = false;
      }
    )
      .catch((e:string) => {
        this.loading = false;
        this.$message.warning(e)
      });
  }

  /* 分页查询工作站 */
  queryList() {
    this.loading = true;
    fzWorkstation.queryWorkstationListByPage(this.queryParams).then(
      (response:any) => {
        this.workstationList = response.list;
        this.total = Number(response.total);
        if (this.total === 0) {
          this.$message.warning('当前工作站为空，请添加工作站。')
          this.openAddModal()
        }
        this.loading = false;
      }
    )
      .catch((e:string) => {
        this.loading = false;
        this.$message.warning(e)
      });
  }

  /* 分页查询工作站 */
  search() {
    this.loading = true;
    if (this.queryParams.workstationMachineCode) {
      this.$set(this.queryParams, 'workstationMachineCode', this.queryParams.workstationMachineCode.replace(new RegExp(' ', 'g'), ''))
    }
    fzWorkstation.queryWorkstationListByPage(this.queryParams).then(
      (response:any) => {
        console.log(this.queryParams);
        this.workstationList = response.list;
        this.total = Number(response.total);
        this.loading = false;
      }
    )
      .catch((e:string) => {
        this.loading = false;
        this.$message.warning(e)
      });
  }

  /* 查询屏幕下拉列表 */
  getScreenList() {
    fzScreen
      .getFzScreenList({})
      .then((response: any) => {
        response.forEach((element: any) => {
          if (element.screenCategory === 2) {
            this.screenList.push(element)
          }
        });
      })
  }

  /* 诊区下拉列表 */
  getFzClinicAreaList() {
    fzClinicArea
      .getFzClinicAreaList({})
      .then((response: any) => {
        this.clinicAreaList = response
      })
  }

  handleProvinceChange() {
    this.queryParams.roomId = ''
    this.getRooms()
  }

  /* 查询诊区下诊室 */
  getRooms() {
    fzRoom
      .getRoomsList(this.queryParams.clinicAreaId)
      .then((response: any) => {
        this.roomList = response
      })
  }

  /* 选择场景类型 */
  querySceneSubtype(formModify: any) {
    this.sceneSubTypeParams.sceneId = formModify.sceneTypeStr.split('|')[1]
    this.getSceneSubtype()
    this.formModify.subTypeStr = undefined
  }

  /* 查询场景子类型 */
  getSceneSubtype() {
    sceneType
      .getSceneSubTypeList(this.sceneSubTypeParams)
      .then((response: any) => {
        this.sceneSubtypeList = response
      })
  }

  /* 打开新增modal */
  openAddModal() {
    if (this.roomList.length === 0) {
      this.$message.warning('当前诊室为空，请先添加诊室，添加诊室之后才可以添加工作站。')
    }
    this.open = true
    this.title = '新增工作站'
    this.getConfigValue()
  }

  /* 关闭modal按钮 */
  cancel() {
    this.open = false;
    this.reset();
    this.machineLoading = false
    this.loadingSubmit = false;
  }

  /* 表单重置 */
  reset() {
    this.formModify = {
      workstationName: '',
      dictCode: undefined,
      sceneTypeStr: undefined,
      sceneType: undefined,
      sceneTypeName: undefined,
      subTypeStr: undefined,
      sceneSubtype: undefined,
      subtypeName: undefined,
      subtypeCode: undefined,
      roomStr: undefined,
      roomName: undefined,
      roomId: undefined,
      roomList: undefined,
      clinicAreaList: undefined,
      clinicAreaId: undefined,
      workstationMac: '',
      workstationMachineCode: '',
      screenIds: [],
      screenMac: undefined,
      screenName: undefined,
      missionaryText: '',
      imageUrl: '',
      sortNo: 0
    };
    const form:any = this.$refs.formRef
    if (form !== undefined && form != null) {
      form.resetFields()
    }
  }

  /* 搜索按钮操作 */
  handleQuery() {
    this.queryParams.pageNum = 1;
    this.search();
  }

  /* 删除 */
  confirm(row: any) {
    this.delParams.workstationId = row.workstationId
    fzWorkstation
      .del(this.delParams)
      .then((response: any) => {
        this.$message.success('删除成功');
        this.queryList()
      })
  }

  /* 停用医生 */
  confirmDoc(row: any) {
    this.delParams.workstationId = row.workstationId
    fzWorkstation
      .delDoc(this.delParams)
      .then((response: any) => {
        this.$message.success('下线成功');
        this.queryList()
      })
  }

  cancelPop() {
    this.$message.warning('已取消删除');
  }

  /* 搜索重置按钮操作 */
  resetQuery() {
    this.queryParams = {
      workstationName: undefined,
      sceneType: undefined,
      roomStr: undefined,
      roomName: undefined,
      roomId: undefined,
      roomList: [],
      pageNum: 1,
      pageSize: 10,
      workstationMachineCode: '',
      screenName: ''
    }
    this.getMedicalRoomList();
    this.handleQuery();
  }

  /** 编辑 */
  handleUpdate(row:any) {
    this.open = true
    this.getConfigValue()
    if (row !== undefined) {
      this.formModify = Object.assign({}, row); // 回填
      this.sceneSubTypeParams.sceneId = this.formModify.sceneType
      this.getSceneSubtype()
      this.$set(this.formModify, 'sceneTypeStr', this.formModify.sceneTypeName + '|' + this.formModify.sceneType)
      this.$set(this.formModify, 'subTypeStr', this.formModify.sceneSubtype + '|' + this.formModify.subtypeName)
      this.$set(this.formModify, 'roomStr', this.formModify.roomId + '|' + this.formModify.roomName)
      this.$set(this.formModify, 'screenIds', [])
      if (row.fzScreenVOS && row.fzScreenVOS.length !== 0) {
        row.fzScreenVOS.forEach((element: any) => {
          this.formModify.screenIds.push(element.screenId)
        });
      }
    }
    this.title = '编辑工作站';
  }

  /** 新增修改提交按钮 */
  submitForm() {
    this.loadingSubmit = true
    const form:any = this.$refs.formRef
    form.validate((valid :any) => {
      if (valid) {
        this.formModify.sceneType = (this.formModify.sceneTypeStr.split('|'))[1]
        this.formModify.sceneTypeName = (this.formModify.sceneTypeStr.split('|'))[0]
        this.formModify.sceneSubtype = (this.formModify.subTypeStr.split('|'))[0]
        this.formModify.sceneSubtypeName = (this.formModify.subTypeStr.split('|'))[1]
        this.formModify.roomId = (this.formModify.roomStr.split('|'))[0]
        this.formModify.roomName = (this.formModify.roomStr.split('|'))[1]
        if (this.formModify.workstationId) {
          fzWorkstation.update(this.formModify)
            .then(() => {
              this.$message.success('修改成功');
              this.open = false;
              this.reset()
              this.queryList()
              this.loadingSubmit = false
            })
            .catch((e:string) => {
              this.$message.warning(e)
              this.loadingSubmit = false
            })
        } else {
          fzWorkstation.save(this.formModify)
            .then(() => {
              this.$message.success('保存成功');
              this.open = false;
              this.reset()
              this.queryList()
              this.loadingSubmit = false
            })
            .catch((e:string) => {
              this.$message.warning(e)
              this.loadingSubmit = false
            })
        }
      } else {
        this.loadingSubmit = false
        return false
      }
    })
  }

  // 诊室 下拉列表
  getMedicalRoomList() {
    fzRoom
      .getFzRoomList(this.emptyParams)
      .then((res:any) => {
        this.roomList = res
      })
  }

  uploadExcel(file:any) {
    console.log('file', file.file);
    if (file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.file.type === 'application/vnd.ms-excel') {
      // 只允许上传excel格式的文件
      const formData = new FormData();
      formData.append('file', file.file);
      // 请求接口
      fzWorkstation.export2Excel(formData).then((response:any) => {
        this.$message.success('导入成功');
      }).catch((e:string) => {
        this.$message.error(e);
      });
    } else {
      this.$message.error('请选择表格类型文件！');
    }
  }

  handleChange(value:any) {
  }

  // msun-lib 提供的，不能管理websocket
  async handleWebSocket() {
    this.machineLoading = true
    const workstationPlugin:any = this.$trayApplication.getPlugin('workstation');
    workstationPlugin.init();
    const code = await workstationPlugin.request('GetMachineCode');
    this.formModify.workstationMachineCode = code
    this.machineLoading = false
    console.log(code)
    console.log(workstationPlugin)
  }
}
</script>
<style lang="less" src="./workstation.less" scoped></style>
