<template src="./guidance.html"></template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { SysConfigApi, guidanceApi } from '@/api';
import { Modal, message } from 'ant-design-vue';
@Component({})
export default class Guidance extends Vue {
  defaultCurrent: any = 1
  defaultPageSize: any = 5
  stateTotal: any = 0
  pageSizeOptions: any = ['5', '10', '15', '20']
  // 定义分页参数
  pageParams: any = {
    pageNum: this.defaultCurrent,
    pageSize: this.defaultPageSize
  }

  arealogo: any = require('@/assets/home.png')
  isVisible: boolean = false;
  visibleHelp: boolean = false
  open: boolean = false;
  ischecked: boolean = false;
  checked: boolean = false;
  checkedInfo: boolean = false
  isShow: boolean = false;
  isSysVisable: boolean = false;
  loading: boolean = false;
  sysTitle: string = '';
  programName: string = '非预约挂号分诊模式详情';
  guidanceTitle: string = '';
  customTitle: string = ''
  customSysVisable: boolean = false
  hospitalList: any = []; // 排班表格数据
  disableList: any = ['血透配置', '心电配置']; // 禁用列表
  title: string = '';
  sysType: string = '门诊配置'
  formModify: any = {
    // 表单参数
    configCode: '',
    configValue: '',
    configStatus: '',
    memo: '',
    sortNo: ''
  };

  form: any = {
    name: '',
    desc: '',
    domain: '',
    domains: []
  }

  customSysConfig(data: any) {
    this.customTitle = data.sceneName
    this.customSysVisable = true;
    this.sysType = data.sceneName
  }

  onCloseCustom() {
    this.customSysVisable = false
  }

  labelCol: any = { span: 8 }
  wrapperCol: any = { span: 16 }

  plainOptions = ['非预约挂号分诊模式', '预约挂号分诊模式'];
  plainValue: string = '';

  total: number = 0; // 总条数
  queryParams: any = {
    // 查询参数
    configCode: '',
    configValue: '',
    configStatus: '',
    memo: '',
    pageNum: 1,
    pageSize: 10
  };

  listData: any[] = [
    {
      title: '屏幕配置',
      content: '统一管理叫号屏，使用分诊系统前，请根据医院的叫号设备分布情况，首先进行屏幕信息的维护。',
      careFor: `（1）屏幕名称：维护的名称需要具有明确清晰的场景、分布、设备类型等信息。如：儿科诊区大屏、儿科1诊室小屏、儿科2诊室小屏、B超诊区大屏、B超1诊室小屏等。<br />
      （2）屏幕MAC：通过屏幕设备的设置等功能，查看设备的标准Mac地址，将Mac地址维护到对应的屏幕信息中。维护的Mac地址不可重复。<br />
      （3）诊区/工作站：叫号屏在诊区的大屏，维护为“诊区”。叫号屏在诊室的小屏，维护为“工作站”。<br />
      （4）屏幕类型：叫号屏的系统类型，安卓系统需要联系研发获取安卓Apk叫号安装包，window系统需要安装众阳浏览器。<br />`,
      url: '/triageManage/fzScreen'
    },
    {
      title: '诊区配置',
      content: '使用分诊系统前，请根据医院的诊区分布情况，首先进行诊区信息的维护。',
      careFor: `（1）诊区权限：根据当前分诊诊区的实际对应科室进行维护。设置对应关系的科室后，当前诊区下则具有了已设置科室的分诊数据权限。<br />
      （2）屏幕名称/屏幕MAC：选中的屏幕MAC地址。<br />
      （3）是否线上分诊：是否需要在医院公众号的“线上分诊”菜单中展示该诊区，并且满足让患者在公众号进行分诊的需求。<br />
      （4）开启一叫一侯：如果当前诊区叫号呼叫患者的时候，同时呼叫下一位患者的等待候诊的语音提示。`,
      url: '/triageManage/fzClinicArea'
    },
    {
      title: '诊室配置',
      content: '预检分诊叫号系统的“诊室管理”功能，是用来对医院内需要进行分诊业务的诊室基本信息，进行统一管理的功能。使用分诊系统前，请根据医院的诊室分区情况，首先进行诊室信息的维护。',
      careFor: `（1）所属诊区：维护当前诊室的归属诊区信息。诊区数据即为“诊区管理”中维护的诊区信息。<br />
      （2）场景类型：根据当前诊室的分诊场景归属，选择对应的场景类型。<br />
      （3）场景子类型：根据当前诊室的分诊场景归属，选择对应的二级场景类型。<br />
      （4）分诊限制：维护为“医生”，则分诊系统可以将患者的分诊信息，分诊到当前诊室的上线医生权限下，也可以只分诊到诊室下，不分诊到医生。维护为“诊室”，则患者的分诊信息，只能分诊到诊室权限下作为诊室队列展示，不能选择医生进行分诊。<br />
      （5）诊室标识：一般维护成A、B、C等区分队列的标识，在PACS，LIS和药房分诊场景下，屏幕会显示此处设置的“诊室标识”作为患者分诊队列序号的前缀，可以更方便的区分不同诊室下的队列信息。<br />
      （6）科室名称：根据当前分诊诊室的实际对应科室进行维护。设置对应关系的科室后，当前诊室下则具有了已设置科室的分诊数据权限。在自动分诊逻辑、自助报道机分诊逻辑中，如果院内启用的是科室号源，则会按照科室对应的诊室关系进行分诊业务流转。<br />
      （7）上午接诊时间、下午接诊时间：按照正常的门诊医生上班坐诊时间进行维护。不设置的话，则全天任何时间点都可以进行分诊。设置了时间范围后，门诊分诊业务只能在设置的时间点范围内，进行分诊。`,
      url: '/triageManage/fzRoom'
    },
    {
      title: '工作站',
      content: '预检分诊叫号系统的“工作站管理”功能，是用来对医院内需要进行分诊业务的诊室内医生坐诊使用的电脑设备的基本信息，进行统一管理的功能。使用分诊系统前，请根据医院的工作站电脑分区情况，首先进行工作站信息的维护。',
      careFor: `（1）所属诊室：维护当前诊室的归属诊室信息。诊室数据即为“诊室管理”中维护的诊室信息。<br />
      （2）绑定机器码：先通过诊室内医生坐诊使用的电脑设备，登录到系统中，找到对应的工作站信息。通过“点击绑定机器码”按钮，获取到当前设置电脑工作站的机器码信息。<br />
      （3）屏幕名称/屏幕MAC：维护当前诊室的诊室分诊队列信息，需要展示的屏幕。屏幕数据即为“屏幕管理”中维护的诊室屏幕信息。`,
      url: '/triageManage/fzWorkStation'
    }
  ]

  toJump(title: any, url: any) {
    console.log(url);
    this.isVisible = false
    this.$router.replace(url)
    this.isShow = true;
  }

  collapseChange(key: string) {
    if (key === '1') {
      this.programName = '非预约挂号分诊模式';
    }
    if (key === '2') {
      this.programName = '预约挂号分诊模式';
    }
  }

  checkExplain(configure: string) {
    if (configure === '非预约挂号分诊模式') {
      this.listData = [
        {
          title: '1.管理屏幕',
          content: '屏幕管理，包括对屏幕的名称，MAC地址，屏幕类型以及屏幕logo等等的配置'
        },
        {
          title: '2.诊区管理',
          content: '诊区管理，包括对诊区的名称，屏幕MAC地址，科室以及是否启用等等的配置'
        },
        {
          title: '3.诊室管理',
          content: '诊室管理，包括对诊室的名称，所属诊区，分诊限制以及接诊时间等等的配置'
        },
        {
          title: '4.工作站',
          content: '工作站，包括对工作站的名称，场景类型，屏幕MAC地址以及绑定机器码等等的配置'
        }
      ];
      return true;
    }
    if (configure === '预约挂号分诊模式') {
      this.listData = [
        {
          title: '1.管理屏幕',
          content: '屏幕管理，包括对屏幕的名称，MAC地址，屏幕类型以及屏幕logo等等的配置'
        },
        {
          title: '2.诊区管理',
          content: '诊区管理，包括对诊区的名称，屏幕MAC地址，科室以及是否启用等等的配置'
        },
        {
          title: '3.诊室管理',
          content: '诊室管理，包括对诊室的名称，所属诊区，分诊限制以及接诊时间等等的配置'
        },
        {
          title: '4.工作站',
          content: '工作站，包括对工作站的名称，场景类型，屏幕MAC地址以及绑定机器码等等的配置'
        }
      ];
      return true;
    }
    this.listData = [
      {
        title: `${configure}说明`,
        content: `这里是${configure}的说明信息`
      }
    ];
  }

  steps: any = [
    // {
    //   title: '医生配置',
    //   content: ''
    // },
    {
      title: '屏幕配置',
      content: '预检分诊叫号系统的“屏幕管理”功能，是用来对全部分诊场景的“诊区叫号大屏”和“诊室叫号小屏”等设备，进行叫号设备信息统一管理的功能。使用分诊系统前，请根据医院的叫号设备分布情况，首先进行屏幕信息的维护。'
    },
    {
      title: '诊区配置',
      content: '预检分诊叫号系统的“诊区管理”功能，是用来对医院内需要进行分诊业务的诊区基本信息，进行统一管理的功能。使用分诊系统前，请根据医院的诊区分布情况，首先进行诊区信息的维护。'
    },
    {
      title: '诊室配置',
      content: '预检分诊叫号系统的“诊室管理”功能，是用来对医院内需要进行分诊业务的诊室基本信息，进行统一管理的功能。使用分诊系统前，请根据医院的诊室分区情况，首先进行诊室信息的维护。'
    },
    {
      title: '工作站',
      content: '预检分诊叫号系统的“工作站管理”功能，是用来对医院内需要进行分诊业务的诊室内医生坐诊使用的电脑设备的基本信息，进行统一管理的功能。使用分诊系统前，请根据医院的工作站电脑分区情况，首先进行工作站信息的维护。'
    }
  ]

  current: number = 0
  routeSrc: any = ''
  next() {
    if (this.current === 0) {
      // this.$router.push({ path: '/home/main' })
    }
    this.current++;
  }

  prev() {
    this.current--;
  }

  rules: any = {
    configCode: [{ required: true, message: '医院编码不能为空', trigger: 'blur' }],
    configValue: [{ required: true, message: '医院编码值不能为空', trigger: 'blur' }],
    memo: [{ required: true, message: '配置说明不能为空', trigger: 'blur' }],
    configStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
  };

  guidanceList: any = [
    {
      sceneName: '门诊配置',
      content: '这是门诊配置',
      alias: '门',
      color: '#5f89f0',
      planName: '暂无指定方案',
      hisUpdateTime: '暂无修改时间',
      configureSet: false,
      baseData: false
    },
    {
      sceneName: 'PACS配置',
      content: '这是PACS配置',
      alias: 'P',
      color: '#7455bc',
      planName: '暂无指定方案',
      hisUpdateTime: '暂无修改时间',
      configureSet: true,
      baseData: false
    },
    {
      sceneName: '药房配置',
      content: '这是药房配置',
      alias: '药',
      color: '#5fbc21',
      planName: '暂无指定方案',
      hisUpdateTime: '暂无修改时间',
      configureSet: false,
      baseData: false
    },
    {
      sceneName: 'LIS配置',
      content: '这是LIS配置',
      alias: '验',
      color: '#d64d92',
      planName: '暂无指定方案',
      hisUpdateTime: '暂无修改时间',
      configureSet: true,
      baseData: false
    },
    {
      sceneName: '心电配置',
      content: '这是心电配置',
      alias: '心',
      color: '#e7bcf3',
      planName: '暂无指定方案',
      hisUpdateTime: '暂无修改时间',
      configureSet: true,
      baseData: false
    },
    {
      sceneName: '血透配置',
      content: '这是血透配置',
      alias: '血',
      color: '#f5222d',
      planName: '暂无指定方案',
      hisUpdateTime: '暂无修改时间',
      configureSet: true,
      baseData: false
    },
    // {
    //   sceneName: '报道机配置',
    //   content: '这是报道机配置',
    //   alias: '报',
    //   color: '#f9a13c',
    //   planName: '暂无指定方案',
    //   hisUpdateTime: '暂无修改时间',
    //   disable: true
    // },
    {
      sceneName: '百灵配置',
      content: '这是百灵配置',
      alias: '百',
      color: '#26deca',
      planName: '暂无指定方案',
      hisUpdateTime: '暂无修改时间',
      configureSet: false,
      baseData: true
    }
  ];

  guidanceSetList: any = [
    {
      sceneName: 'SF 刚才把系统配置页面随便写了一些，凑合能看了！',
      updateRecord: ''
    },
    {
      sceneName: 'SF 刚才把系统配置页面随便写了一些，凑合能看了！',
      updateRecord: ''
    },
    {
      sceneName: 'SF 刚才把系统配置页面随便写了一些，凑合能看了！',
      updateRecord: ''
    },
    {
      sceneName: 'SF 刚才把系统配置页面随便写了一些，凑合能看了！',
      updateRecord: ''
    },
    {
      sceneName: 'SF 刚才把系统配置页面随便写了一些，凑合能看了！',
      updateRecord: ''
    }
  ];

  timelineSetList: any = [
    {
      stepName: '第二步',
      content: '预检分诊叫号系统的“屏幕管理”功能，是用来对全部分诊场景的“诊区叫号大屏”和“诊室叫号小屏”等设备，进行叫号设备信息统一管理的功能。使用分诊系统前，请根据医院的叫号设备分布情况，首先进行屏幕信息的维护。',
      timelineName: '屏幕管理',
      url: '/triageManage/fzScreen'
    },
    {
      stepName: '第三步',
      content: '预检分诊叫号系统的“诊区管理”功能，是用来对医院内需要进行分诊业务的诊区基本信息，进行统一管理的功能。使用分诊系统前，请根据医院的诊区分布情况，首先进行诊区信息的维护。',
      timelineName: '诊区管理',
      url: '/triageManage/fzClinicArea'
    },
    {
      stepName: '第四步',
      content: '预检分诊叫号系统的“诊室管理”功能，是用来对医院内需要进行分诊业务的诊室基本信息，进行统一管理的功能。使用分诊系统前，请根据医院的诊室分区情况，首先进行诊室信息的维护。',
      timelineName: '诊室管理',
      url: '/triageManage/fzRoom'
    },
    {
      stepName: '第五步',
      content: '预检分诊叫号系统的“工作站管理”功能，是用来对医院内需要进行分诊业务的诊室内医生坐诊使用的电脑设备的基本信息，进行统一管理的功能。使用分诊系统前，请根据医院的工作站电脑分区情况，首先进行工作站信息的维护。',
      timelineName: '工作站',
      url: '/triageManage/fzWorkStation'
    }
  ];

  columns = [
    {
      title: '配置编码',
      align: 'center',
      dataIndex: 'configCode'
    },
    {
      title: '配置值',
      align: 'center',
      dataIndex: 'configValue',
      scopedSlots: { customRender: 'configValue' }
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'configStatus',
      // width: '130px',
      scopedSlots: { customRender: 'configStatus' }
    },
    {
      title: '配置说明',
      align: 'center',
      dataIndex: 'memo',
      scopedSlots: { customRender: 'memo' }
    },
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      dataIndex: 'configSort'
      // width: '100px'
    },
    {
      title: '操作',
      dataIndex: 'action',
      // width: '150px',
      align: 'center',
      scopedSlots: { customRender: 'action' }
    }
  ];

  handleList = [
    { name: '场景管理' },
    { name: '系统配置' },
    { name: '屏幕管理' },
    { name: '诊区管理' },
    { name: '诊室管理' },
    { name: '工作站' }
  ];

  checkboxValue: any = []
  // showType: 0=输入框，1=下拉框
  optionsList: any = [
    {
      sceneId: 10000001,
      planId: 10000002,
      planName: '非预约挂号分诊模式',
      sceneName: '门诊配置',
      desc: '这是非预约挂号分诊模式',
      configs: [{ configCode: 'pacs_call_text', configDetail: '屏幕配置：pacs叫号文本', configValue: '请，||patientNum||，号，||patientName||，到，||roomNum||，检查', showType: 0, showFormat: 'string' }, {
        configCode: 'drug_zzj_config',
        configDetail: '药房是否开启自动分诊配置',
        configValue: 1,
        showType: 1,
        showFormat: 'number',
        optionList: [
          {
            value: 0
          },
          {
            value: 1
          }
        ]
      }]
    },
    {
      sceneId: 10000001,
      planId: 10000004,
      planName: '预约挂号分诊模式',
      sceneName: '门诊配置',
      desc: '这是预约挂号分诊模式',
      configs: [{
        configCode: 'queue_show_model',
        configDetail: '分诊台队列排队',
        configValue: 0,
        showType: 1,
        showFormat: 'number',
        optionList: [
          {
            value: 0
          },
          {
            value: 1
          }
        ]
      }, { configCode: 'queue_rule_conf_item', configDetail: '队列规则配置', configValue: 5, showType: 0, showFormat: 'number' }]
    }
  ]

  onSumbit() {
    if (this.checkboxValue.length === 0) {
      this.$message.warning('请先选择一个方案')
    } else {
      const _this = this
      this.$confirm({
        title: '选择方案',
        content: '是否要选择' + this.checkboxValue[0],
        okText: '确认',
        cancelText: '取消',
        onOk() {
          let isFlag = true
          _this.optionsList.forEach((parmas: any) => {
            if (parmas.planName === _this.checkboxValue[0]) {
              const { configs } = parmas
              for (let i = 0; i < configs.length; i++) {
                const configItem = configs[i];
                if (configItem.configCode === 'auto_triage_time') {
                  console.log(typeof Number(configItem.configValue), Number(configItem.configValue))
                  if (parseInt(configItem.configValue) < 10 || parseInt(configItem.configValue) > 480) {
                    _this.$message.warning('输入范围应该在10~480之间')
                    isFlag = false
                    return
                  }
                } else if (configItem.configCode === 'register_effective') {
                  if (parseInt(configItem.configValue) < 0 || parseInt(configItem.configValue) > 31) {
                    _this.$message.warning('输入范围应该在0~31之间')
                    isFlag = false
                    return
                  }
                }
              }
              if (!isFlag) return false;
              guidanceApi.changeModel(parmas).then((res: any) => {
                if (!res) {
                  _this.$message.success('提交成功')
                  _this.getSelectSceneList()
                  _this.getEditStateList(_this.pageParams)
                  setTimeout(() => {
                    _this.isSysVisable = false
                  }, 500);
                }
              }).catch(err => _this.$message.error(err))
            }
          });
        }
      });
    }
  }

  onChange(checkedValues: any, options: any) {
    if (this.checkboxValue.length > 1) {
      this.checkboxValue.shift()
    }
    console.log(this.checkboxValue);
  }

  openHelpReadMe() {
    console.log(666);
    this.visibleHelp = true
  }

  onCloseHelp() {
    this.visibleHelp = false
  }

  handleChange(value: any) {
    if (value.name === '系统配置') {
      this.$router.replace('/systemManage/sysConfig');
    }
    if (value.name === '屏幕管理') {
      this.$router.replace('/triageManage/fzScreen');
    }
    if (value.name === '诊区管理') {
      this.$router.replace('/triageManage/fzClinicArea');
    }
    if (value.name === '诊室管理') {
      this.$router.replace('/triageManage/fzRoom');
    }
    if (value.name === '工作站') {
      this.$router.replace('/triageManage/fzWorkStation');
    }
  }

  plainChange(e: any) {
    // alert(e.target.value);
  }

  applicationPlain() {
    console.log(this.plainValue);
    if (this.plainValue === '') {
      this.$message.warning('请选择要开启的方案');
      return false;
    }
    Modal.confirm({
      title: '是否确定开启' + this.plainValue,
      onOk() {
        message.success('开启成功');
      },
      onCancel() {
        message.warning('您已取消应用');
      }
    });
  }

  /** 查询配置列表 */
  getHospitalList() {
    // alert(this.guidanceTitle)
    this.queryParams.memo = this.guidanceTitle.substring(0, this.guidanceTitle.length - 2);
    this.loading = true;
    SysConfigApi.getAppointConfigByPage(this.queryParams)
      .then((response: any) => {
        this.hospitalList = response.list;
        this.total = Number(response.total);
        this.loading = false;
      })
      .catch((e: string) => {
        this.loading = false;
        this.$message.warning(e);
      });
  }

  /** 修改按钮操作 */
  handleUpdate(row: any) {
    if (row !== undefined) {
      this.formModify = Object.assign({}, row); // 回填
      this.formModify.configStatus = this.formModify.configStatus.toString();
    }
    this.title = '修改配置信息';
    this.open = true;
  }

  /** 平台修改提交按钮 */
  submitForm() {
    const form: any = this.$refs.formRef;
    form.validate((valid: any) => {
      if (valid) {
        if (this.formModify.configId) {
          SysConfigApi.upDateConfig(this.formModify)
            .then(() => {
              this.$message.success('修改成功');
              this.open = false;
            })
            .catch((e: string) => this.$message.warning(e));
        } else {
          SysConfigApi.addConfig(this.formModify)
            .then(() => {
              this.$message.success('新增成功');
              this.open = false;
            })
            .catch((e: string) => this.$message.warning(e));
        }
      } else {
        return false;
      }
    });
  }

  toRoute(item: any) {
    if (item !== '系统配置') {
      this.$router.replace(item.url);
      this.isVisible = false;
    } else {
      this.sysTitle = this.guidanceTitle;
      this.isSysVisable = true;
      this.getHospitalList();
    }
  }

  SysVisableCancel() {
    this.isSysVisable = false;
  }

  toSysConfig(value: any) {
    // alert(value);
    this.guidanceTitle = value.name;
    this.isVisible = true;
    this.isShow = true;
    this.current = 0
  }

  async toSysConfig2(value: any) {
    console.log(value);
    this.sysTitle = value.sceneName;
    // this.open = true;
    this.isSysVisable = true;
    this.checkboxValue = [value.planName]
    console.log(this.checkboxValue);
    if (value.sceneName === '门诊配置') {
      // sceneId: 10000001
      const result: any = await guidanceApi.findByPageList({ codeList: ['auto_triage_time', 'register_effective'] })
      console.log(result);
      this.optionsList = [
        {
          sceneId: 10000001,
          planId: 100000001,
          planName: '号源模式',
          sceneName: '门诊配置',
          desc: '预检分诊叫号系统的“号源模式”可以满足医院内需要按照号源序号进行排队的队列展示需求。患者在预约挂号流程完成后，可以在门诊分诊台、门诊分诊报道机、微信等分诊平台进行分诊，系统会根据患者预约挂号的号源序号和预约挂号的号源时间，按照小号在前、时间早在前的规则，进行分诊队列的排队。回诊、过号等插队类型患者，按当前分诊时间排序。',
          configs: [{
            configCode: 'queue_show_model',
            configDetail: '门诊是否按照号源排序',
            memo: '按照号源排序',
            configValue: '1'
          }, {
            configCode: 'queue_rule_conf_item',
            configDetail: '分诊排序排队规则:',
            memo: '按预约挂号号源时间排序，回诊过号患者按当前分诊时间排序(必须开启号源模式)',
            configValue: '3'
          },
          {
            configCode: 'is_open_auto_triage',
            configDetail: '门诊电子病历会诊患者是否开启自动分诊:',
            memo: '关闭',
            configValue: '0'
          },
          {
            configCode: 'appointment_move_time',
            configDetail: '预约患者临近预约时间:',
            memo: '10分钟',
            configValue: 10
          },
          // {
          //   configCode: 'auto_triage_time',
          //   configDetail: '【自动分诊】预约挂号记录-时间设定[分钟]:',
          //   configValue: result[1].configValue
          // },
          {
            configCode: 'register_effective',
            configDetail: '【预约、挂号、分诊记录】有效期[天]:',
            memo: '',
            configValue: result[0].configValue
          }
          ]
        },
        {
          sceneId: 10000001,
          planId: 100000002,
          planName: '非号源模式',
          sceneName: '门诊配置',
          desc: '预检分诊叫号系统的“非号源模式”可以满足医院内门诊业务不启用预约、不启用挂号，患者在门诊就诊无需使用排班号源的情况下。需要按照患者分诊时间进行排队的队列展示需求。患者可以在门诊分诊台、门诊分诊报道机、微信等分诊平台进行分诊，系统会根据患者分诊时间，按照分诊时间早在前的规则，进行分诊队列的排队。回诊、过号等插队类型患者，按照队列类型插队步数插队。',
          configs: [{
            configCode: 'queue_show_model',
            configDetail: '门诊是否按照号源排序',
            memo: '分诊时间排队',
            configValue: '0'
          },
          {
            configCode: 'queue_rule_conf_item',
            configDetail: '队列规则配置项',
            memo: '预约挂号按分诊时间排序，回诊过号患者按照队列类型插队步数插队(普通/预约患者不可以插队)(非号源模式)',
            configValue: '5'
          }
          ]
        }
      ]
    }
    if (value.sceneName === 'PACS配置') {
      // sceneId: 10000002
      this.optionsList = []
    }
    if (value.sceneName === '药房配置') {
      // sceneId: 10000003
      this.optionsList = [
        {
          sceneId: 10000003,
          planId: 100000003,
          planName: '自动分诊模式',
          sceneName: '药房配置',
          desc: '预检分诊叫号系统的“药房自动分诊模式”可以满足院内药房给患者进行开药，患者完成缴费流程后，自动生成分诊队列，患者无需再次进行手动分诊报道操作的需求。预检分诊叫号系统收到需要分诊排队的患者信息，按照分诊时间进行排队。系统会根据患者分诊时间，按照分诊时间早的患者在队列前排队的规则，进行分诊队列的排队展示。',
          configs: [{
            configCode: 'drug_zzj_config',
            configDetail: '药房是否开启自动分诊配置',
            memo: '开启自动分诊',
            configValue: '0'
          }]
        },
        {
          sceneId: 10000003,
          planId: 100000004,
          planName: '自助机分诊模式',
          sceneName: '药房配置',
          desc: '预检分诊叫号系统的“药房自助机分诊模式”可以满足院内药房给患者进行开药，患者完成缴费流程后，患者需要在”药房自助机“进行手动分诊报道的需求。预检分诊叫号系统按照分诊时间进行排队。系统会根据患者分诊时间，按照分诊时间早的患者在队列前排队的规则，进行分诊队列的排队展示。',
          configs: [
            {
              configCode: 'drug_zzj_config',
              configDetail: '是否开启自助机分诊模式',
              memo: '关闭自动分诊',
              configValue: '1'
            }]
        }
      ]
    }
    if (value.sceneName === 'LIS配置') {
      // sceneId: 10000004
      this.optionsList = []
    }
    if (value.sceneName === '心电配置') {
      // sceneId: 10000005
      this.optionsList = []
    }
    if (value.sceneName === '血透配置') {
      // sceneId: 10000006
      this.optionsList = []
    }
    if (value.sceneName === '报道机配置') {
      // sceneId: 10000007
      this.optionsList = []
    }
    if (value.sceneName === '百灵配置') {
      // sceneId: 10000008
      this.optionsList = [
        {
          sceneId: 10000008,
          planId: 100000005,
          planName: '先分诊后挂号模式',
          sceneName: '百灵配置',
          desc: '预检分诊叫号系统的“先分诊后挂号模式”可以满足院内门诊分诊业务下，患者在微信公众号客户端，通过使用”线上分诊“功能自助分诊进入队列的需求。患者可以在不预约挂号的情况下，直接进行分诊。',
          configs: [{
            configCode: 'bailing_pattern_config',
            configDetail: '百灵公众号分诊配置',
            memo: '开启线上分诊(不预约挂号也可以分诊)',
            configValue: '0'
          }]
        },
        {
          sceneId: 10000008,
          planId: 100000006,
          planName: '先挂号后分诊模式',
          sceneName: '百灵配置',
          desc: '预检分诊叫号系统的“先挂号后分诊模式”可以满足院内门诊分诊业务下，患者在微信公众号客户端，通过使用”预约签到“功能自助分诊进入队列的需求。患者需要在预约挂号的情况下，才能进行报道签到。',
          configs: [
            {
              configCode: 'bailing_pattern_config',
              configDetail: '百灵公众号分诊配置',
              memo: '开启预约签到(必须预约挂号才能分诊)',
              configValue: '1'
            }]
        }
      ]
    }
  }

  handleCancel() {
    this.isVisible = false;
    this.isShow = false;
  }

  infoCancel() {
    this.open = false;
  }

  @Watch('$route')
  onRouteChange() {
    if (this.$route.path === '/guidance/guidance' && this.isShow === true) {
      this.isVisible = true;
    }
  }

  /* 系统配置跳转路由 */
  sysConfig() {
    this.$router.replace('/systemManage/sysConfig');
  }

  /* 医生维护跳转路由 */
  fzDoctorManage() {
    this.$router.replace('/triageManage/fzDoctorManage');
  }

  /* 屏幕维护跳转路由 */
  fzScreen() {
    this.$router.replace('/triageManage/fzScreen');
  }

  /* 诊区维护跳转路由 */
  fzClinicArea() {
    this.$router.replace('/triageManage/fzClinicArea');
  }

  /* 诊室维护跳转路由 */
  fzRoom() {
    this.$router.replace('/triageManage/fzRoom');
  }

  /* 工作站维护跳转路由 */
  fzWorkStation() {
    this.$router.replace('/triageManage/fzWorkStation');
  }

  /* 分诊权限维护跳转路由 */
  sysPermissions() {
    this.$router.replace('/systemManage/sysPermissions');
  }

  // 得到配置列表
  getSelectSceneList() {
    guidanceApi.selectScene({}).then((res: any) => {
      console.log(res);
      const data = res
      const guidanceList = this.guidanceList
      const newData = []
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < guidanceList.length; j++) {
          if (data[i].sceneName === guidanceList[j].sceneName) {
            guidanceList[j].planName = data[i].planName
            guidanceList[j].hisUpdateTime = data[i].hisUpdateTime
            newData.push(guidanceList[j])
          }
        }
      }
      this.guidanceList = guidanceList
      console.log(this.guidanceList);
    }).catch((err: any) => this.$message.error(err))
  }

  // 刷新修改记录
  refreshEditStateList() {
    this.getEditStateList(this.pageParams)
  }

  // 获取修改状态
  getEditStateList(parmas: any) {
    guidanceApi.findByPage(parmas).then((res: any) => {
      console.log(res);
      this.guidanceSetList = res.list
      this.stateTotal = Number(res.total)
    })
  }

  // 分页查询
  onStatePageChange(page: number, pageSize: number) {
    console.log(page, pageSize);
    this.pageParams.pageNum = page
    this.pageParams.pageSize = pageSize
    this.getEditStateList(this.pageParams)
  }

  onShowSizeChange(current: number, size: any) {
    this.pageParams.pageNum = current
    this.pageParams.pageSize = size
    this.getEditStateList(this.pageParams)
  }

  mounted() {
    this.getSelectSceneList()
    this.getEditStateList(this.pageParams)
  }
}
</script>

<style lang="less" scoped src="./guidance.less"></style>
<style lang="less" scoped></style>
