<template src="./room.html"></template>
<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { fzRoom } from '@/api';
import SceneTypeMixin from '@/mixins/scene/scenemixins';
import { sceneType } from '@/api/common-scene-type/scene-type'
import { fzClinicArea } from '@/api/fz-clinic-area/fz-clinic-area'
import editableCell from '@/components/edit-table-cell/edit-table-cell.vue'
import { tmTemplateManage } from '@/api/tm-template-manage/template-manage';
import moment from 'moment';
moment.locale('zh-cn');
const columns = [
  {
    title: '诊室/窗口名称',
    dataIndex: 'roomName',
    align: 'center',
    ellipsis: true
  },
  // {
  //   title: '别名',
  //   align: 'center',
  //   dataIndex: 'roomNameAlias'
  // },
  {
    title: '所属诊区',
    align: 'center',
    dataIndex: 'clinicAreaName'
  },
  {
    title: '诊区分诊权限',
    align: 'center',
    scopedSlots: { customRender: 'deptNameRender' }
  },
  {
    title: '场景类型',
    align: 'center',
    dataIndex: 'sceneTypeName'
  },
  {
    title: '场景子类型',
    align: 'center',
    dataIndex: 'subtypeName'
  },
  // {
  //   title: '诊室地点',
  //   align: 'center',
  //   dataIndex: 'roomAddress',
  //   ellipsis: true,
  //   width: 300,
  //   scopedSlots: { customRender: 'roomAddress' }
  // },
  {
    title: '排序号',
    align: 'center',
    dataIndex: 'sortNo',
    width: 80
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'enableFlag',
    scopedSlots: { customRender: 'enableFlag' }
  },
  {
    title: '分诊限制',
    align: 'center',
    dataIndex: 'allowOnlineRoomDoc',
    scopedSlots: { customRender: 'allowOnlineRoomDoc' }
  },
  {
    title: '诊室标识',
    align: 'center',
    dataIndex: 'roomSign'

  },
  {
    title: '是否提前分诊',
    align: 'center',
    dataIndex: 'shiftCodeJudge',
    scopedSlots: { customRender: 'shiftCodeJudge' }
  },
  {
    title: '超时时间',
    align: 'center',
    dataIndex: 'overTimeBanTriage',
    scopedSlots: { customRender: 'overTimeBanTriage' }
  },
  {
    title: '上午接诊时间',
    align: 'center',
    dataIndex: 'morningAppointmentTime'
  },
  {
    title: '下午接诊时间',
    align: 'center',
    dataIndex: 'afternoonAppointmentTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
@Component({ components: { editableCell } })
export default class TemplateManager extends Vue {
  emis = true;
  columns:any = columns;
  loading:boolean = false; // 遮罩层
  loadingSync:boolean = false; // 设备同步按钮loading
  showSearch:boolean = true; // 是否开启时间
  total:number = 0;// 总条数
  roomList:any = [];
  departmentList:any = [];// 诊区科室下拉列表
  activeKey: string[] = ['1', '2'];
  title:string = '';// 弹出层标题
  open:boolean = false;// 是否显示弹出层
  visibleHelp:boolean = false
  sceneSubTypeList: any = [] // 场景子类型列表
  clinicAreaList: any = [] // 诊区下拉列表
  sceneTypeListExcludeMedical: any = [] // 排除医技场景类型的类型列表
  loadingSubmit:boolean = false; // 数据提交按钮loading
  moment:any = moment;// 转换 日期/时间 格式
  sceneTypeList: any = [] // 场景类型列表
  previewSrcList: any = [
    require('@/assets/help/fz_clinic_action.png'),
    require('@/assets/help/fz_room_action.png'),
    require('@/assets/help/fz_room_form.png'),
    require('@/assets/help/fz_room_cs.png'),
    require('@/assets/help/fz_room_tqfz.png')
  ]

  openHelpReadMe() {
    console.log(555);
    this.visibleHelp = true
  }

  onCloseHelp() {
    this.visibleHelp = false
  }

  modalTypeList: any = [
    {
      name: 'VC',
      value: 'VC'
    },
    {
      name: 'ES',
      value: 'ES'
    },
    {
      name: 'US',
      value: 'US'
    },
    {
      name: 'XA',
      value: 'XA'
    },
    {
      name: 'PX',
      value: 'PX'
    },
    {
      name: 'PF',
      value: 'PF'
    },
    {
      name: 'EEG',
      value: 'EEG'
    },
    {
      name: 'CT',
      value: 'CT'
    },
    {
      name: 'CS',
      value: 'CS'
    },
    {
      name: 'TCD',
      value: 'TCD'
    },
    {
      name: 'MR',
      value: 'MR'
    },
    {
      name: 'CR',
      value: 'CR'
    },
    {
      name: 'RF',
      value: 'RF'
    },
    {
      name: 'BMD',
      value: 'BMD'
    },
    {
      name: 'MG',
      value: 'MG'
    },
    {
      name: 'OT',
      value: 'OT'
    },
    {
      name: 'ESENT',
      value: 'ESENT'
    },
    {
      name: 'LS',
      value: 'LS'
    },
    {
      name: 'FOB',
      value: 'FOB'
    },
    {
      name: 'NM',
      value: 'NM'
    },
    {
      name: 'DX',
      value: 'DX'
    }
  ] // 场景类型列表

  sceneTypeParams: any = {
    dictGroup: 'SceneType'
  }

  queryParams:any = { // 查询参数
    roomName: '',
    clinicAreaId: undefined,
    roomNameAlias: '',
    pageNum: 1,
    pageSize: 10,
    deptIds: [],
    sceneType: '',
    sceneSubtype: ''
  };

  updateParams: any = { // 更新参数
    roomId: undefined,
    roomAddress: undefined
  }

  headers: any = {
    authorization: 'authorization-text'
  }

  formModify:any = {
    roomId: undefined,
    roomName: '',
    roomNameAlias: '',
    clinicAreaStr: undefined,
    clinicAreaId: undefined,
    clinicAreaName: undefined,
    dictCode: undefined,
    sceneTypeStr: undefined,
    catagoryIds: undefined,
    sceneType: undefined,
    sceneSubtype: undefined,
    sceneTypeName: undefined,
    subTypeStr: undefined,
    sceneSubtypeName: undefined,
    subtypeCode: undefined,
    morningAppointmentStartTime: '',
    morningAppointmentEndTime: '',
    morningAppointmentTime: '',
    afternoonAppointmentStartTime: '',
    afternoonAppointmentEndTime: '',
    afternoonAppointmentTime: '',
    sortNo: 0,
    roomAddress: '',
    enableFlag: '1',
    checkModal: undefined,
    overTimeBanTriage: 0,
    shiftCodeJudge: 0,
    allowOnlineRoomDoc: '1',
    roomSign: '',
    ofSexTriage: '0',
    ofAgeTriage: 0
  };

  sceneSubTypeParams: any = {
    sceneId: undefined
  }

  rules:any = {
    roomName: [
      { required: true, message: '诊室/窗口名称 不能为空', trigger: 'blur' }
    ],
    roomNameAlias: [
      { required: true, message: '别名 不能为空', trigger: 'blur' }
    ],
    clinicAreaStr: [
      { required: true, message: '所属诊区 不能为空', trigger: 'change' }
    ],
    allowOnlineRoomDoc: [
      { required: true, message: '分诊限制 不能为空', trigger: 'change' }
    ],
    sceneTypeStr: [
      { required: true, message: '场景类型 不能为空', trigger: 'change' }
    ],
    subTypeStr: [
      { required: true, message: '场景子类 不能为空', trigger: 'change' }
    ],
    roomAddress: [
      { required: true, message: '诊室地点 不能为空', trigger: 'blur' }
    ],
    checkModal: [
      { required: true, message: '检查模态 不能为空', trigger: 'change' }
    ],
    deptIds: [
      { required: true, message: '科室名称 不能为空', trigger: 'change' }
    ],
    catagoryIds: [
      { required: true, message: '药材名称 不能为空', trigger: 'change' }
    ],
    ofAgeTriage: [
      { required: true, message: '分诊年龄限制 不能为空', trigger: 'blur' }
    ]
  }

  created() {
    this.queryList();
    this.getFzClinicAreaList();
    this.getDepartmentList();
    this.getSceneTypeList()
    this.getMainCatagory()
  }

  catagoryIdList: any = []

  changeSelectCatagory(value: string[]) {
    console.log(value);
  }

  /* 查询药材类型接口*/
  async getMainCatagory() {
    await sceneType
      .queryDictDrugBasicMainCatagory()
      .then((response: any) => {
        console.log(response);
        this.catagoryIdList = response || []
        this.catagoryIdList.unshift({
          catagoryName: '全部',
          catagoryId: '0'
        })
      })
  }

  /* 查询场景类型列表 */
  async getSceneTypeList() {
    await sceneType
      .getSceneTypeList(this.sceneTypeParams)
      .then((response: any) => {
        this.sceneTypeList = response
        this.excludeMedical()
      })
  }

  /* 查询科室下拉列表 */
  getDepartmentList() {
    tmTemplateManage
      .getDept({})
      .then((response: any) => {
        this.departmentList = [];
        response.forEach((element: any) => {
          this.departmentList.push(element)
          // if (element.screenCategory === 1) {
          //   this.departmentList.push(element)
          // }
        });
      })
  }

  /* 选择场景类型 */
  querySceneSubtype(formModify: any) {
    this.sceneSubTypeParams.sceneId = formModify.sceneTypeStr.split('|')[1]
    this.getSceneSubtype()
    this.formModify.subTypeStr = undefined
  }

  /* 选择场景类型 */
  querySceneSubtypeTwo(data: any) {
    this.sceneSubTypeParams.sceneId = data.dictCode
    this.getSceneSubtype()
  }

  /* 诊区下拉列表 */
  async getFzClinicAreaList() {
    await fzClinicArea
      .getFzClinicAreaList({})
      .then((response: any) => {
        this.clinicAreaList = response
      })
  }

  getAllowCallFlag(clinicAreaId : any) {
    for (var i = 0; i < this.clinicAreaList.length; i++) {
      if (this.clinicAreaList[i].clinicAreaId === clinicAreaId && this.clinicAreaList[i].allowCallFlag === '1') {
        console.log(this.clinicAreaList[i])
        this.emis = false
      }
    }
  }

  /* 同步数据 */
  confirmSync() {
    this.loadingSync = true
    fzRoom
      .syncData({ })
      .then((response: any) => {
        this.loadingSync = false
        // this.$message.success('数据同步成功！')
        this.$message.success('数据同步成功！' + '新增了' +
          response.insertCount + '条数据，更新了' + response.updateCount + '条数据');
        this.queryList()
      }).catch((e: any) => {
        this.loadingSync = false
        this.$message.error(e);
      })
  }

  /* 删除 */
  confirm(row: any) {
    const roomId = row.roomId
    fzRoom
      .deleteFzRoom({ roomId })
      .then((response: any) => {
        this.$message.success('删除成功');
        this.queryParams.roomName = ''
        this.queryParams.clinicAreaId = undefined
        this.queryParams.roomNameAlias = ''
        this.queryParams.deptIds = undefined
        this.queryParams.sceneType = ''
        this.queryParams.sceneSubtype = ''
        this.queryList()
      })
      .catch((e:any) => {
        this.loading = false
        this.$message.warning(e)
      })
  }

  cancelPop() {
    this.$message.warning('已取消删除');
  }

  cancelSync() {
    this.$message.warning('已取消同步数据操作');
  }

  /* 表格项保存 */
  onCellChange(key: any, dataIndex: any, value: any) {
    if (dataIndex === 'roomAddress') {
      this.updateParams.roomId = key
      this.updateParams.roomAddress = value
    }
    fzRoom
      .updateFzRoom(this.updateParams)
      .then((response: any) => {
        this.queryList()
        this.$message.success('修改成功')
      })
  }

  /* 查询场景子类型 */
  getSceneSubtype() {
    sceneType
      .getSceneSubTypeList(this.sceneSubTypeParams)
      .then((response: any) => {
        this.sceneSubTypeList = response
      })
  }

  /** 科室 多选下拉框 模糊搜索 */
  filterOption(input:any, option:any) {
    const text = option.componentOptions.children[0].componentOptions.children[0].componentOptions.children[0].text;
    return text.indexOf(input) >= 0;
  }

  /** 科室 多选下拉框 模糊搜索 */
  filterOptionRoom(input:any, option:any) {
    const text = option.componentOptions.children[0].text;
    // const text = option.componentOptions.children[0].componentOptions.children[0].componentOptions.children[0].text;
    return text.indexOf(input) >= 0;
  }

  /* 遍历踢出医技场景类型 */
  excludeMedical() {
    this.sceneTypeListExcludeMedical = []
    this.sceneTypeList.forEach((element: any) => {
      // if (element.dictCode !== '2') {
      this.sceneTypeListExcludeMedical.push(element)
      // }
    });
    // this.open = true
  }

  showSizeChange() {
    this.loading = true;
    this.queryParams.pageNum = 1
    fzRoom.getFzRoomListByPage(this.queryParams).then(
      (response:any) => {
        this.roomList = response.list;
        this.total = Number(response.total);
        if (this.total === 0) {
          this.$message.warning('当前诊室为空，请添加诊室。')
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

  /* 分页查询诊室列表 */
  queryList() {
    this.loading = true;
    fzRoom.getFzRoomListByPage(this.queryParams).then(
      (response:any) => {
        this.roomList = response.list;
        this.total = Number(response.total);
        if (this.total === 0) {
          this.$message.warning('当前诊室为空，请添加诊室。')
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

  /* 分页查询诊室列表 */
  search() {
    this.loading = true;
    fzRoom.getFzRoomListByPage(this.queryParams).then(
      (response:any) => {
        this.roomList = response.list;
        this.total = Number(response.total);
        this.loading = false;
      }
    )
      .catch((e:string) => {
        this.loading = false;
        this.$message.warning(e)
      });
  }

  // 打开新增modal
  async openAddModal() {
    await this.getSceneTypeList()
    this.title = '新增诊室/窗口'
    await this.getFzClinicAreaList();
    this.open = true
    if (this.clinicAreaList.length === 0) {
      this.$message.warning('当前没有诊区，请先添加诊区，添加诊区之后才能添加诊室。')
    }
  }

  /** 关闭modal按钮 */
  cancel() {
    this.open = false;
    this.reset();
    // this.handleQuery()
    this.loadingSubmit = false;
  }

  /** 表单重置 */
  reset() {
    this.sceneSubTypeList = []
    const form:any = this.$refs.formRef
    if (form !== undefined && form != null) {
      form.resetFields()
    }
    this.formModify = {
      roomId: undefined,
      roomName: '',
      roomNameAlias: '',
      clinicAreaStr: undefined,
      clinicAreaId: undefined,
      clinicAreaName: undefined,
      catagoryIds: undefined,
      dictCode: undefined,
      sceneTypeStr: undefined,
      sceneType: undefined,
      sceneSubtype: undefined,
      sceneTypeName: undefined,
      subTypeStr: undefined,
      sceneSubtypeName: undefined,
      subtypeCode: undefined,
      roomAddress: '',
      morningAppointmentStartTime: '',
      morningAppointmentEndTime: '',
      morningAppointmentTime: '',
      afternoonAppointmentStartTime: '',
      afternoonAppointmentEndTime: '',
      afternoonAppointmentTime: '',
      enableFlag: '1',
      allowOnlineRoomDoc: '',
      roomSign: '',
      ofSexTriage: '0',
      ofAgeTriage: 0
    };
  }

  /** 搜索按钮操作 */
  handleQuery() {
    this.queryParams.pageNum = 1;
    this.search();
  }

  /** 搜索重置按钮操作 */
  resetQuery() {
    this.queryParams = { // 查询参数
      roomName: '',
      roomNameAlias: '',
      pageNum: 1,
      pageSize: 10,
      deptIds: [],
      sceneType: '',
      sceneSubtype: ''
    };
    this.sceneSubTypeList = []
    this.handleQuery();
  }

  /** 搜索按钮操作 */
  handleQueryTime() {
    this.queryParams.pageNum = 1;
    this.queryList();
  }

  /** 重置按钮 */
  resetQueryTime() {
    this.queryParams = { // 查询参数
      detailTime: null,
      roomName: '',
      roomNameAlias: '',
      pageNum: 1,
      pageSize: 10
    };
    this.handleQueryTime();
  }

  /** 编辑 */
  handleUpdate(row:any) {
    console.log(666, row);
    this.getFzClinicAreaList();
    if (row !== undefined) {
      this.formModify = Object.assign({}, row); // 回填
      console.log(this.formModify.dictCode);
      // 科室
      let deptIds:any = [];
      if (row.departmentVOS && row.departmentVOS.length) {
        deptIds = row.departmentVOS.map((element: any) => {
          return element.deptId;
        });
      }

      let catagoryIds: any = []

      if (row.dictDrugCategoryVOs && row.dictDrugCategoryVOs.length) {
        catagoryIds = row.dictDrugCategoryVOs.map((element: any) => {
          return element.catagoryId;
        });
      }

      this.sceneSubTypeParams.sceneId = this.formModify.sceneType
      this.getSceneSubtype()
      this.getSceneTypeList()
      // this.formModify.subtypeCode = this.formModify.sceneSubtype
      this.$set(this.formModify, 'deptIds', deptIds)
      this.$set(this.formModify, 'catagoryIds', catagoryIds)
      this.$set(this.formModify, 'sceneTypeStr', this.formModify.sceneTypeName + '|' + this.formModify.sceneType)
      this.$set(this.formModify, 'subTypeStr', this.formModify.sceneSubtype + '|' + this.formModify.subtypeName)
      this.$set(this.formModify, 'clinicAreaStr', this.formModify.clinicAreaId + '|' + this.formModify.clinicAreaName)
      if (this.formModify.morningAppointmentTime !== null && this.formModify.morningAppointmentTime !== '' && this.formModify.morningAppointmentTime !== undefined) {
        this.$set(this.formModify, 'morningAppointmentStartTime', moment(this.formModify.morningAppointmentTime.split('-')[0], 'HH:mm'))
        this.$set(this.formModify, 'morningAppointmentEndTime', moment(this.formModify.morningAppointmentTime.split('-')[1], 'HH:mm'))
      } else {
        this.$set(this.formModify, 'morningAppointmentStartTime', moment('00:00', 'HH:mm'))
        this.$set(this.formModify, 'morningAppointmentEndTime', moment('00:00', 'HH:mm'))
      }
      if (this.formModify.afternoonAppointmentTime !== null && this.formModify.afternoonAppointmentTime !== '' && this.formModify.afternoonAppointmentTime !== undefined) {
        this.$set(this.formModify, 'afternoonAppointmentStartTime', moment(this.formModify.afternoonAppointmentTime.split('-')[0], 'HH:mm'))
        this.$set(this.formModify, 'afternoonAppointmentEndTime', moment(this.formModify.afternoonAppointmentTime.split('-')[1], 'HH:mm'))
      } else {
        this.$set(this.formModify, 'afternoonAppointmentStartTime', moment('00:00', 'HH:mm'))
        this.$set(this.formModify, 'afternoonAppointmentEndTime', moment('00:00', 'HH:mm'))
      }
    }
    this.title = '编辑诊室/窗口';
    this.open = true
  }

  uploadExcel(file:any) {
    console.log('file', file.file);
    if (file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.file.type === 'application/vnd.ms-excel') {
      // 只允许上传excel格式的文件
      const formData = new FormData();
      formData.append('file', file.file);
      // 请求接口
      fzRoom.export2Excel(formData).then((response:any) => {
        this.$message.success('导入成功');
      }).catch((e:string) => {
        this.$message.error(e);
      });
    } else {
      this.$message.error('请选择表格类型文件！');
    }
  }

  /** 新增修改提交按钮 */
  submitForm() {
    this.loadingSubmit = true
    const form:any = this.$refs.formRef
    console.log(this.formModify);
    form.validate((valid :any) => {
      if (valid) {
        this.formModify.sceneType = (this.formModify.sceneTypeStr.split('|'))[1]
        this.formModify.sceneTypeName = (this.formModify.sceneTypeStr.split('|'))[0]
        this.formModify.sceneSubtype = (this.formModify.subTypeStr.split('|'))[0]
        this.formModify.sceneSubtypeName = (this.formModify.subTypeStr.split('|'))[1]
        this.formModify.clinicAreaId = (this.formModify.clinicAreaStr.split('|'))[0]
        this.formModify.clinicAreaName = (this.formModify.clinicAreaStr.split('|'))[1]
        this.getAllowCallFlag(this.formModify.clinicAreaId)
        if (this.formModify.sceneType === '6' && !this.emis) {
          this.$message.error('当前维护的诊区开启了一叫一侯。急诊诊室不支持一叫一侯')
          this.loadingSubmit = false;
        } else {
          if (this.formModify.morningAppointmentStartTime !== null && this.formModify.morningAppointmentStartTime !== '' && this.formModify.morningAppointmentEndTime !== null && this.formModify.morningAppointmentEndTime !== '') {
            var morningAppointmentStartTime = new Date(this.formModify.morningAppointmentStartTime)
            var morningAppointmentStartTimeHours = morningAppointmentStartTime.getHours() < 10 ? '0' + morningAppointmentStartTime.getHours() : morningAppointmentStartTime.getHours()
            var morningAppointmentStartTimeMinutes = morningAppointmentStartTime.getMinutes() < 10 ? '0' + morningAppointmentStartTime.getMinutes() : morningAppointmentStartTime.getMinutes()
            const morningAppointmentStartTimeLet = morningAppointmentStartTimeHours + ':' + morningAppointmentStartTimeMinutes

            var morningAppointmentEndTime = new Date(this.formModify.morningAppointmentEndTime)
            var morningAppointmentEndTimeHours = morningAppointmentEndTime.getHours() < 10 ? '0' + morningAppointmentEndTime.getHours() : morningAppointmentEndTime.getHours()
            var morningAppointmentEndTimeMinutes = morningAppointmentEndTime.getMinutes() < 10 ? '0' + morningAppointmentEndTime.getMinutes() : morningAppointmentEndTime.getMinutes()
            const morningAppointmentEndTimeLet = morningAppointmentEndTimeHours + ':' + morningAppointmentEndTimeMinutes
            this.formModify.morningAppointmentTime = (morningAppointmentStartTimeLet + '-' + morningAppointmentEndTimeLet)
          } else {
            this.formModify.morningAppointmentTime = '00:00-00:00';
          }

          if (this.formModify.afternoonAppointmentStartTime !== null && this.formModify.afternoonAppointmentStartTime !== '' && this.formModify.afternoonAppointmentEndTime !== null && this.formModify.afternoonAppointmentEndTime !== '') {
            var afternoonAppointmentStartTime = new Date(this.formModify.afternoonAppointmentStartTime)
            var afternoonAppointmentStartTimeHours = afternoonAppointmentStartTime.getHours() < 10 ? '0' + afternoonAppointmentStartTime.getHours() : afternoonAppointmentStartTime.getHours()
            var afternoonAppointmentStartTimeMinutes = afternoonAppointmentStartTime.getMinutes() < 10 ? '0' + afternoonAppointmentStartTime.getMinutes() : afternoonAppointmentStartTime.getMinutes()
            const afternoonAppointmentStartTimeLet = afternoonAppointmentStartTimeHours + ':' + afternoonAppointmentStartTimeMinutes

            var afternoonAppointmentEndTime = new Date(this.formModify.afternoonAppointmentEndTime)
            var afternoonAppointmentEndTimeHours = afternoonAppointmentEndTime.getHours() < 10 ? '0' + afternoonAppointmentEndTime.getHours() : afternoonAppointmentEndTime.getHours()
            var afternoonAppointmentEndTimeMinutes = afternoonAppointmentEndTime.getMinutes() < 10 ? '0' + afternoonAppointmentEndTime.getMinutes() : afternoonAppointmentEndTime.getMinutes()
            const afternoonAppointmentEndTimeLet = afternoonAppointmentEndTimeHours + ':' + afternoonAppointmentEndTimeMinutes
            this.formModify.afternoonAppointmentTime = (afternoonAppointmentStartTimeLet + '-' + afternoonAppointmentEndTimeLet)
          } else {
            this.formModify.afternoonAppointmentTime = '00:00-00:00';
          }

          if (this.formModify.roomId) {
            fzRoom.updateFzRoom(this.formModify)
              .then(() => {
                this.$message.success('修改成功');
                this.open = false;
                this.reset()
                this.queryList()
                this.loadingSubmit = false
              })
              .catch((e: string) => {
                this.$message.warning(e)
                this.loadingSubmit = false
              })
          } else {
            fzRoom.saveFzRoom(this.formModify)
              .then(() => {
                this.$message.success('保存成功');
                this.open = false;
                this.reset()
                this.queryList()
                this.loadingSubmit = false
              })
              .catch((e: string) => {
                this.$message.warning(e)
                this.loadingSubmit = false
              })
          }
        }
      } else {
        this.loadingSubmit = false
        return false
      }
    })
  }
}
</script>
<style lang="less" src="./room.less" scoped></style>
