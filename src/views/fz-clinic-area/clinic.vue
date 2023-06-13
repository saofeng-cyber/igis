<template src="./clinic.html"></template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { fzClinicArea } from '@/api/fz-clinic-area/fz-clinic-area';
import { tmTemplateManage } from '@/api/tm-template-manage/template-manage';
import { fzScreen } from '@/api';

const columns = [
  {
    title: '诊区名称',
    align: 'center',
    dataIndex: 'clinicAreaName',
    ellipsis: true
  },
  // {
  //   title: '诊区别名',
  //   align: 'center',
  //   width: 100,
  //   dataIndex: 'clinicAreaAliasName'
  // },
  {
    title: '诊区分诊权限',
    align: 'center',
    scopedSlots: { customRender: 'deptName' }
  },
  {
    title: '诊区屏幕名称',
    align: 'center',
    scopedSlots: { customRender: 'screenName' },
  },
  {
    title: '屏幕MAC',
    align: 'center',
    scopedSlots: { customRender: 'screenMAC' }
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'enableFlag',
    scopedSlots: { customRender: 'enableFlag' }
  },
  {
    title: '是否线上分诊',
    align: 'center',
    dataIndex: 'allowOnlineFlag',
    scopedSlots: { customRender: 'allowOnlineFlag' }
  },
  {
    title: '开启一叫一侯',
    align: 'center',
    dataIndex: 'allowCallFlag',
    scopedSlots: { customRender: 'allowCallFlag' }
  },
  {
    title: '是否自动分诊',
    align: 'center',
    dataIndex: 'isAutoTriage',
    scopedSlots: { customRender: 'isAutoTriage' }
  },
  {
    title: '验证收费',
    align: 'center',
    dataIndex: 'areaWhetherPay',
    scopedSlots: { customRender: 'areaWhetherPay' }
  },
  {
    title: '挂号后是否立即分诊',
    align: 'center',
    dataIndex: 'isPromptlyTriage',
    scopedSlots: { customRender: 'isPromptlyTriage' }
  },
  {
    title: '当日预约是否立即分诊',
    align: 'center',
    dataIndex: 'todaySmcTriage',
    scopedSlots: { customRender: 'todaySmcTriage' }
  },
  {
    title: '排序号',
    align: 'center',
    dataIndex: 'sortNo',
    width: 60
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    // width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
@Component
export default class Fzdoctor extends Vue {
  columns:any = columns;
  loading:boolean = false; // 遮罩层
  loadingSync:boolean = false; // 设备同步按钮loading
  loadingSubmit:boolean = false; // 数据提交按钮loading
  total:number = 0;// 总条数
  clinicList:any = [];
  title:string = '';// 弹出层标题
  open:boolean = false;// 是否显示弹出层
  visibleHelp: boolean = false
  departmentList:any = [];// 诊区科室下拉列表
  activeKey: string[] = ['1', '2'];
  screenList: any = [] // 诊区屏幕下拉列表
  previewSrcList: any = [
    require('@/assets/help/fz_clinic_tb.png'),
    require('@/assets/help/fz_clinic_add.png'),
    require('@/assets/help/fz_clinic_form.png')
  ]

  queryParams:any = { // 查询参数
    clinicAreaName: '',
    clinicAreaAliasName: '',
    pageNum: 1,
    pageSize: 10,
    deptIds: []
  };

  editStatus:boolean = true; // true:点击编辑 false:点击新增

  formModify:any = {
    clinicAreaId: undefined,
    clinicAreaName: '',
    clinicAreaAliasName: '',
    deptIds: [],
    screenIds: [],
    screenMac: undefined,
    screenName: undefined,
    sortNo: 0,
    enableFlag: '1',
    allowOnlineFlag: '1',
    allowCallFlag: '0',
    deptToRoomFlag: '0',
    isAutoTriage: '1',
    areaWhetherPay: '0',
    isPromptlyTriage: '0',
    todaySmcTriage: '0',
    areaSignalModel: '5'
  };

  rules:any = {
    clinicAreaName: [
      { required: true, message: '诊区名称 不能为空', trigger: 'blur' }
    ],
    clinicAreaAliasName: [
      { required: true, message: '诊区别名 不能为空', trigger: 'blur' }
    ],
    areaWhetherPay: [
      { required: true, message: '是否收费 不能为空', trigger: 'change' }
    ],
    isPromptlyTriage: [
      { required: true, message: '挂号后是否立即分诊 不能为空', trigger: 'change' }
    ],
    todaySmcTriage: [
      { required: true, message: '当日预约是否立即分诊 不能为空', trigger: 'change' }
    ],
    areaSignalModel: [
      { required: true, message: '排队模式 不能为空', trigger: 'change' }
    ]
  }

  openHelpReadMe() {
    console.log(555);
    this.visibleHelp = true
  }

  onCloseHelp() {
    this.visibleHelp = false
  }

  headers: any = {
    authorization: 'authorization-text'
  }

  created() {
    this.queryList();
    this.getScreenList();
    this.getDepartmentList();
  }

  showSizeChange() {
    this.loading = true;
    this.queryParams.pageNum = 1
    fzClinicArea.getFzClinicAreaListByPage(this.queryParams).then(
      (response:any) => {
        this.clinicList = response.list;
        this.total = Number(response.total);
        if (this.total === 0) {
          this.$message.warning('当前诊区为空，请添加诊区。')
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

  /** 查询诊区列表 */
  queryList() {
    this.loading = true;
    fzClinicArea.getFzClinicAreaListByPage(this.queryParams).then(
      (response:any) => {
        this.clinicList = response.list;
        this.total = Number(response.total);
        if (this.total === 0) {
          this.$message.warning('当前诊区为空，请添加诊区。')
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

  /** 查询诊区列表 */
  search() {
    this.loading = true;
    fzClinicArea.getFzClinicAreaListByPage(this.queryParams).then(
      (response:any) => {
        this.clinicList = response.list;
        this.total = Number(response.total);
        this.loading = false;
      }
    )
      .catch((e:string) => {
        this.loading = false;
        this.$message.warning(e)
      });
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

  /* 查询屏幕下拉列表 */
  getScreenList() {
    fzScreen
      .getFzScreenList({})
      .then((response: any) => {
        this.screenList = []
        response.forEach((element: any) => {
          if (element.screenCategory === 1) {
            this.screenList.push(element)
          }
        });
      })
  }

  // 打开新增modal
  openAddModal() {
    this.getDepartmentList();
    this.editStatus = false
    // this.reset()
    this.title = '新增诊区'
    this.open = true
    this.getScreenList();
  }

  /** 取消关闭 modal按钮 会清空数据 */
  cancel() {
    this.open = false;
    this.reset();
    // this.handleQuery()
    this.loadingSubmit = false;
  }

  /** 关闭 modal按钮 不会清空数据 */
  closeClinicModal() {
    this.open = false;
    this.reset();
    this.loadingSubmit = false;
  }

  /** 表单重置 */
  reset() {
    this.getScreenList();
    this.formModify = {
      clinicAreaId: undefined,
      clinicAreaName: '',
      clinicAreaAliasName: '',
      deptIds: [],
      screenIds: [],
      screenMac: undefined,
      screenName: undefined,
      enableFlag: '1',
      allowOnlineFlag: '1',
      allowCallFlag: '0',
      deptToRoomFlag: '0',
      isAutoTriage: '1',
      areaWhetherPay: '0',
      isPromptlyTriage: '0',
      todaySmcTriage: '0',
      areaSignalModel: '5'
    };
    const form:any = this.$refs.formRef
    if (form !== undefined && form != null) {
      form.resetFields()
    }
  }

  /** 搜索按钮操作 */
  handleQuery() {
    this.queryParams.pageNum = 1;
    this.search();
  }

  /** 搜索重置按钮操作 */
  resetQuery() {
    this.queryParams.clinicAreaName = '';
    this.queryParams.clinicAreaAliasName = '';
    this.queryParams.deptIds = []
    this.handleQuery();
  }

  /** 科室 多选下拉框 模糊搜索 */
  filterOption(input:any, option:any) {
    const text = option.componentOptions.children[0].componentOptions.children[0].componentOptions.children[0].text;
    return text.indexOf(input) >= 0;
  }

  /** 编辑 */
  handleUpdate(row:any) {
    this.editStatus = true
    this.reset()
    this.getDepartmentList();
    if (row !== undefined) {
      this.formModify = Object.assign({}, row); // 回填
      this.$set(this.formModify, 'deptToRoomFlag', '0')
      // 科室
      let deptIds:any = [];
      if (row.departmentVOS && row.departmentVOS.length) {
        deptIds = row.departmentVOS.map((element: any) => {
          return element.deptId;
        });
      }
      this.$set(this.formModify, 'deptIds', deptIds) // 使用 $set 解决 v-model 数据刷新，页面未更新的问题

      // 屏幕
      let screenIds:any = [];
      if (row.fzScreenVOS && row.fzScreenVOS.length) {
        screenIds = row.fzScreenVOS.map((element: any) => {
          return element.screenId;
        });
      }
      this.$set(this.formModify, 'screenIds', screenIds) // 使用 $set 解决 v-model 数据刷新，页面未更新的问题
    }
    this.title = '编辑诊区';
    this.open = true;
  }

  /** 新增修改 提交按钮 */
  submitForm() {
    this.loadingSubmit = true
    const form:any = this.$refs.formRef
    form.validate((valid :any) => {
      if (valid) {
        if (this.formModify.clinicAreaId) {
          fzClinicArea.updateFzClinicArea(this.formModify)
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
        }
        if (!this.formModify.clinicAreaId) {
          fzClinicArea.saveFzClinicArea(this.formModify)
            .then(() => {
              this.$message.success('新增成功');
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
        // else {
        //   fzClinicArea.saveFzClinicArea(this.formModify)
        //     .then(() => {
        //       this.$message.success('新增成功');
        //       this.open = false;
        //       this.reset()
        //       this.queryList()
        //       this.loadingSubmit = false
        //     })
        //     .catch((e:string) => {
        //       this.$message.warning(e)
        //       this.loadingSubmit = false
        //     })
        // }
      } else {
        this.loadingSubmit = false
        return false
      }
    })
  }

  beforeUpload(value: any) {
    console.info(value);
  }

  handleChange(value:any) {
    console.info(value);
  }

  deselectSearch(value: any) {
    console.log(value);
    this.handleQuery()
  }

  uploadExcel(file:any) {
    console.log('file', file.file);
    if (file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.file.type === 'application/vnd.ms-excel') {
      // 只允许上传excel格式的文件
      const formData = new FormData();
      formData.append('file', file.file);
      // 请求接口
      fzClinicArea.export2Excel(formData).then((response:any) => {
        this.$message.success('导入成功');
      }).catch((e:string) => {
        this.$message.error(e);
      });
    } else {
      this.$message.error('请选择表格类型的文件！');
    }
  }

  // 诊区管理 删除
  handleUpdataFlag(record:any) {
    this.loading = true
    fzClinicArea.deleteFzClinicArea({ clinicAreaId: record.clinicAreaId })
      .then(() => {
        this.loading = false
        this.$message.success('删除成功')
        this.queryParams.clinicAreaName = ''
        this.queryParams.clinicAreaAliasName = ''
        this.queryList()
      })
      .catch((e:any) => {
        this.loading = false
        this.$message.warning(e)
      })
  }
}
</script>
<style lang="less" src="./clinic.less" scoped></style>
