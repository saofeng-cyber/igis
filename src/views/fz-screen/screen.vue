<template src="./screen.html"></template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { fzScreen } from '@/api';
import { screenTypeSet } from '@/api/screenTypeSet/screenTypeSet'

const columns = [
  {
    title: '屏幕名称',
    align: 'center',
    dataIndex: 'screenName'
  },
  {
    title: '屏幕MAC',
    align: 'center',
    dataIndex: 'screenMac',
    scopedSlots: { customRender: 'screenMacRender' }
  },
  {
    title: '屏幕IP',
    align: 'center',
    dataIndex: 'screenIp',
    scopedSlots: { customRender: 'screenIpRender' }
  },
  {
    title: '屏幕类型',
    align: 'center',
    dataIndex: 'screenCategory',
    scopedSlots: { customRender: 'screenCategory' }
  },
  {
    title: '系统类型',
    align: 'center',
    dataIndex: 'screenType',
    scopedSlots: { customRender: 'screenType' }
  },
  // {
  //   title: '屏幕LOGO',
  //   align: 'center',
  //   dataIndex: 'logoUrl',
  //   scopedSlots: { customRender: 'logoUrl' }
  // },
  {
    title: '屏幕宣教',
    align: 'center',
    ellipsis: true,
    dataIndex: 'missionaryText'
  },
  {
    title: '序号',
    align: 'center',
    ellipsis: true,
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
export default class Fzdoctor extends Vue {
  columns: any = columns;
  loading: boolean = false; // 遮罩层
  loadingSync: boolean = false; // 设备同步按钮loading
  loadingSubmit: boolean = false; // 数据提交按钮loading
  total: number = 0;// 总条数
  styleOpen: boolean = false
  value1: string = ''
  screenStyleTitle: string = ''
  screenVisible: boolean = false
  screenList: any = [];
  activeKey: string[] = ['1', '2'];
  title: string = '';// 弹出层标题
  open: boolean = false;// 是否显示弹出层
  screenCategoryDrop = [
    { key: '1', value: '诊区' },
    { key: '2', value: '工作站' }
  ];

  plainOptions = [
    {
      name: '样式1',
      value: 1,
      imgSrc: 'zqdp'
    },
    {
      name: '样式2',
      value: 2,
      imgSrc: 'zqdp_sa'
    },
    {
      name: '样式3',
      value: 3,
      imgSrc: 'zqdp_ss'
    }
  ]

  screenTypeDrop = [
    { key: '1', value: '安卓屏' },
    { key: '2', value: 'Windows屏' }
  ];

  uploadLoading: boolean = false;// 上传图片loading

  queryParams: any = { // 查询参数
    screenName: '',
    screenMac: '',
    screenIp: '',
    screenCategory: '',
    pageNum: 1,
    pageSize: 10
  };

  headers: any = {
    authorization: 'authorization-text'
  }

  formModify: any = {
    screenId: '',
    screenName: '',
    screenMac: '',
    screenCategory: undefined,
    screenType: undefined,
    logoUrl: '',
    sortNo: 0,
    missionaryText: '',
    communicationMode: 1,
    docQueue: 1,
    nameAntianaphylaxis: 1,
    callAntianaphylaxis: -1,
    isScreenScroll: '1',
    screenShowShift: '0',
    roomQueue: 0,
    screenStyleId: '',
    callTimes: -1,
    screenShowPage: -1,
    screenShowNumber: -1
  };

  screenMacValidator =  (rule: any, value: any, callback: any) => {
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
    screenName: [
      { required: true, message: '屏幕名称 不能为空', trigger: 'blur' }
    ],
    screenMac: [
      { required: true, validator: this.screenMacValidator, trigger: 'blur' }
    ],
    screenCategory: [
      { required: true, message: '诊区/工作站 不能为空', trigger: 'change' }
    ],
    screenType: [
      { required: true, message: '系统类型 不能为空', trigger: 'change' }
    ],
    communicationMode: [
      { required: true, message: '屏幕的叫号方式 不能为空', trigger: 'change' }
    ],
    docQueue: [
      { required: false, message: '是否展示在线医生 不能为空', trigger: 'change' }
    ],
    roomQueue: [
      { required: false, message: '是否展示没有队列的诊室 不能为空', trigger: 'change' }
    ],
    screenStyleId: [
      { required: true, message: '屏幕样式 不能为空', trigger: 'change' }
    ]
  }

  handleMacChange(value: any) {
    console.log(value);
  }

  cusFilterOption(inputValue: string, option: any) {
    return (
      option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    );
  }
  macList: any = []
  async getScreenMacList(params: any) {
    await screenTypeSet.findMacList(params).then((res: any) => {
      console.log(res);
      this.macList = res
    })
  }

  // message: '屏幕MAC 不能为空',
  selectPlainOptions: any = []
  created() {
    this.getScreenMacList({});
    this.queryList();
    screenTypeSet.findList({}).then((res: any) => {
      this.selectPlainOptions = res
    })
  }

  /* 分页查询屏幕列表 */
  queryList() {
    this.loading = true;
    fzScreen.getFzScreenListByPage(this.queryParams).then(
      (response: any) => {
        this.screenList = response.list;
        this.total = Number(response.total);
        if (this.total === 0) {
          this.$message.warning('当前没有屏幕，请添加屏幕。')
          this.open = true
        }
        this.loading = false;
      }
    )
      .catch((e: string) => {
        this.loading = false;
        this.$message.warning(e)
      });
  }

  /* 分页查询屏幕列表 */
  search() {
    this.loading = true;
    fzScreen.getFzScreenListByPage(this.queryParams).then(
      (response: any) => {
        this.screenList = response.list;
        this.total = Number(response.total);
        this.loading = false;
      }
    )
      .catch((e: string) => {
        this.loading = false;
        this.$message.warning(e)
      });
  }

  validateScreenMac(macAddress: any) {
    console.info(macAddress);
    // var regex = "([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}";
  }

  styleList: any = []
  isAdd: boolean = false
  visibleHelp: boolean = false
  screenStyleName: string = ''
  screenStyleUrl: string = ''
  screenStyleId: string = ''

  screenSubmitForm() {
    console.log(this.formModify.screenMac);
    const screenStyle = JSON.stringify(this.styleList)
    const params = {
      deleteFlag: '0',
      screenStyle,
      screenStyleId: this.screenStyleId,
      screenStyleName: this.screenStyleName,
      screenStyleUrl: this.screenStyleUrl
    }
    screenTypeSet.update(params).then(res => {
      console.log(res);
      if (res.data) {
        console.log(res.data);
        this.$message.success('提交成功')
        setTimeout(() => {
          this.screenVisible = false
          this.findByPage()
        }, 500);
      }
    })
  }

  screenEdit(data: any) {
    if (data) {
      this.screenStyleTitle = data.screenStyleName
      this.screenStyleName = data.screenStyleName
      this.screenStyleId = data.screenStyleId
      this.screenStyleUrl = data.screenStyleUrl
      console.log(data.screenStyle);
      if (data.screenStyle) {
        this.styleList = JSON.parse(data.screenStyle)
      } else {
        this.styleList = []
      }
      this.screenVisible = true
    }
  }

  // 屏幕样式管理开关
  screenStyleOpen() {
    this.styleOpen = true
    this.findByPage()
  }

  onClose() {
    this.screenVisible = false
  }

  // 获取屏幕样式列表

  findByPage() {
    screenTypeSet.findList({}).then((res: any) => {
      console.log(res);
      const list = res
      this.plainOptions = list
    })
  }

  closeStyle() {
    this.styleOpen = false
  }

  isEdit: boolean = false

  /* 打开新增modal */
  openAddModal() {
    this.reset()
    this.open = true
    this.isEdit = false
    this.title = '新增屏幕'
    this.getScreenMacList({})
  }

  /* 关闭modal按钮 */
  cancel() {
    this.open = false;
    this.reset();
    this.loadingSubmit = false;
  }

  /** 关闭 modal按钮 不会清空数据 */
  closeScreenModal() {
    this.open = false;
    this.loadingSubmit = false;
  }

  /* 表单重置 */
  reset() {
    this.formModify = {
      screenId: '',
      screenName: '',
      screenMac: '',
      screenCategory: 1,
      screenType: 1,
      logoUrl: '',
      sortNo: 0,
      missionaryText: '',
      communicationMode: 1,
      docQueue: 1,
      roomQueue: 0,
      callTimes: -1,
      nameAntianaphylaxis: '1',
      callAntianaphylaxis: '-1',
      isScreenScroll: '1',
      screenShowShift: '0'
    };
    const form: any = this.$refs.formRef
    if (form !== undefined && form != null) {
      form.resetFields()
    }
  }

  openHelpReadMe() {
    console.log(555);
    this.visibleHelp = true
  }

  onCloseHelp() {
    this.visibleHelp = false
  }

  /* 搜索按钮操作 */
  handleQuery() {
    this.queryParams.pageNum = 1;
    this.search();
  }

  /* 搜索重置按钮操作 */
  resetQuery() {
    this.queryParams = { // 查询参数
      screenName: '',
      pageNum: 1,
      pageSize: 10
    };
    this.handleQuery();
  }

  /** 编辑 */
  handleUpdate(row: any) {
    this.isEdit = true
    this.reset()
    if (row !== undefined) {
      console.log(555, row);
      if (row.screenStyleId === '0') {
        row.screenStyleId = undefined
      }
      this.formModify = Object.assign({}, row); // 回填
    }
    // 查询图片信息
    fzScreen.getFzScreenById(this.formModify.screenId).then(
      (response: any) => {
        if (response) {
          this.formModify.logoUrl = response.logoUrl
        }
      }
    )
      .catch((e: string) => {
      });
    this.title = '编辑屏幕';
    this.open = true;
  }

  /* 上传图片限制 */
  beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.$message.error('仅支持上传jpg/png格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.$message.error('图片大小不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  /* 文件处理为base64 */
  getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  /** 上传文件 */
  uploadFiles(info: any) {
    if (this.beforeUpload(info.file)) {
      this.uploadLoading = true;
      this.getBase64(info.file, (imgUrl: any) => {
        this.uploadLoading = false;
        this.formModify.logoUrl = imgUrl;
        this.$message.success('上传成功!');
      });
    }
  }

  /** 新增修改 提交按钮 */
  submitForm() {
    this.loadingSubmit = true
    const form: any = this.$refs.formRef
    form.validate((valid: any) => {
      if (valid) {
        const regSingleByte = new RegExp('-', 'g');
        const regDoubleByte = new RegExp('：', 'g');
        const mac = this.formModify.screenMac.toLowerCase().replace(regSingleByte, ':').replace(regDoubleByte, ':');
        console.info(mac)
        console.log(555, this.formModify.screenStyleId);
        if (!this.formModify.screenStyleId) {
          this.formModify.screenStyleId = 0
        }
        this.formModify.screenMac = mac
        this.formModify.screenMac = this.formModify.screenMac.trim()
        if (this.formModify.screenId) {
          fzScreen.updateFzScreen(this.formModify)
            .then(() => {
              this.$message.success('修改成功：屏幕更新配置可能会出现延迟，请稍等几分钟！');
              this.open = false;
              this.reset()
              this.queryList()
              this.loadingSubmit = false
            })
            .catch((e: string) => {
              this.loadingSubmit = false
              this.$message.warning(e)
            })
        } else {
          fzScreen.saveFzScreen(this.formModify)
            .then(() => {
              this.$message.success('保存成功：屏幕更新配置可能会出现延迟，请稍等几分钟！');
              this.open = false;
              this.reset()
              this.queryList()
              this.loadingSubmit = false
            })
            .catch((e: string) => {
              this.loadingSubmit = false
              this.$message.warning(e)
            })
        }
      } else {
        this.loadingSubmit = false
        return false
      }
    })
  }

  handleChange(info: any) {
    console.log('info', info);
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.$message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.$message.error(`${info.file.name} file upload failed.`);
    }
  }

  uploadExcel(file: any) {
    console.log('file', file.file);
    if (file.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.file.type === 'application/vnd.ms-excel') {
      // 只允许上传excel格式的文件
      const formData = new FormData();
      formData.append('file', file.file);
      // 请求接口
      fzScreen.export2Excel(formData).then((response: any) => {
        this.$message.success('导入成功');
      }).catch((e: string) => {
        this.$message.error(e);
      });
    } else {
      this.$message.error('请选择表格类型文件！');
    }
  }

  /* beforeUploadExcel(file:any) {
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
      // 只允许上传excel格式的文件
      const formData = new FormData();
      formData.append('file', file);
      // 请求接口
      fzScreen.export2Excel(formData).then((response:any) => {
        this.$message.success('导入成功');
      });
    } else {
      this.$message.error('请选择表格类型文件！');
    }
  } */

  //  删除
  handleUpdataFlag(record: any) {
    this.loading = true
    fzScreen.deleteFzScreen({ screenId: record.screenId })
      .then(() => {
        this.loading = false
        this.$message.success('删除成功')
        this.queryList()
      })
      .catch((e: any) => {
        this.loading = false
        this.$message.warning(e)
      })
  }
}
</script>
<style lang="less" src="./screen.less" scoped></style>
<style lang="less" scoped></style>
