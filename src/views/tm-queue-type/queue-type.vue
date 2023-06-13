<template src="./queue-type.html"></template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { tmQueueType } from '@/api/tm-queue-type/queue-type'
import { sceneType } from '@/api/common-scene-type/scene-type';
const columns = [
  {
    title: '类型名称',
    dataIndex: 'queueTypeName',
    align: 'center'
  },
  {
    title: '类型简称',
    align: 'center',
    dataIndex: 'queueTypeAlias'
  },
  /* {
    title: '数量/占普通比例',
    dataIndex: 'specialRate',
    align: 'center',
    scopedSlots: { customRender: 'specialRate' }
  }, */
  {
    title: '默认规则',
    dataIndex: 'queueTypePlace',
    align: 'center',
    scopedSlots: { customRender: 'queueTypePlace' }
  },
  {
    title: '类型颜色',
    dataIndex: 'queueTypeColor',
    align: 'center',
    scopedSlots: { customRender: 'queueTypeColor' }
  },
  {
    title: '类型图例',
    dataIndex: 'typeLegend',
    align: 'center',
    scopedSlots: { customRender: 'typeLegend' }
  },
  {
    title: '使用场景',
    dataIndex: 'subtypeName',
    align: 'center',
    scopedSlots: { customRender: 'subtypeName' }
  },
  {
    title: '分诊台是否展示',
    dataIndex: 'triageDisplayType',
    align: 'center',
    scopedSlots: { customRender: 'triageDisplayType' }
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
];
@Component
export default class QueueType extends Vue {
  columns: any = columns;
  loading: boolean = false; // 遮罩层
  total: number = 0; // 总条数
  title: string = ''; // 弹出层标题
  modalAdd: boolean = false; // 是否显示弹出层
  visibleHelp:boolean = false
  queueTypeList: any = [] // 队列类型列表
  queueTypeData: any = [] // 队列类型分页查询列表
  sceneTypeList: any = [] // 场景类型列表
  sceneSubTypeList: any = [] // 场景子类型列表
  previewSrcList: any = [
    require('@/assets/help/fz_queue_fztype.png'),
    require('@/assets/help/fz_queue_type.png'),
    require('@/assets/help/fz_queue_edit.png')
  ]

  queryParams: any = {
    queueTypeName: undefined,
    queueTypeAlias: undefined,
    pageNum: 1,
    pageSize: 8
  };

  delParams: any = {
    queueTypeId: undefined
  }

  sceneTypeParams: any = {
    dictGroup: 'SceneType'
  }

  sceneSubTypeParams: any = {
    sceneId: undefined
  }

  /* 小方块内边距 */
  bodyCss: any = {
    paddingTop: '10px',
    paddingRight: '4px',
    paddingLeft: '4px'
  }

  emptyParams: any = {}
  formModify: any = {
    queueTypeId: undefined,
    queueTypeName: undefined,
    queueTypeAlias: undefined,
    specialRate: undefined,
    queueTypePlace: undefined,
    queueTypePriority: undefined,
    jumpStep: undefined,
    queueTypeCode: undefined,
    triageDisplayType: '1',
    queueTypeColor: '#409EFF',
    queueTypeFontColor: '#ff1e02',
    sceneType: '',
    sceneSubtype: '',
    sortNo: 0
  }; // 表单参数

  ruleForm: any = {
    queueTypeName: [{ required: true, message: '类型名称 不能为空', trigger: 'blur' }],
    queueTypeAlias: [{ required: true, message: '类型简称 不能为空', trigger: 'blur' }],
    queueTypePlace: [{ required: true, message: '请选择 插队步数', trigger: 'change' }],
    queueTypeColor: [{ required: true, message: '请选择类型颜色', trigger: 'blur' }],
    queueTypePriority: [{ required: true, message: '优先级不能为空', trigger: 'blur' }],
    queueTypeFontColor: [{ required: true, message: '请选择字体颜色', trigger: 'blur' }]
  };

  openHelpReadMe() {
    console.log(555);
    this.visibleHelp = true
  }

  onCloseHelp() {
    this.visibleHelp = false
  }

  created() {
    this.queryQueueTypeList()
    this.queryQueueTypeData()
    this.getSceneTypeList()
  }

  /* 查询场景类型列表 */
  async getSceneTypeList() {
    await sceneType
      .getDictItemListByGroupOfAll(this.sceneTypeParams)
      .then((response: any) => {
        this.sceneTypeList = response
        // this.excludeMedical()
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

  /* 选择场景类型 */
  querySceneSubtypeTwo(data: any) {
    this.sceneSubTypeParams.sceneId = data.dictCode
    this.getSceneSubtype()
  }

  /* 色块颜色选择 */
  headleChangeTypeColor() {
  }

  /* 字体颜色选择 */
  headleChangeFontColor() {
  }

  /* 点击编辑 */
  async editQueueType(row: any) {
    this.modalAdd = true
    // this.ordisabled = true
    this.title = '编辑队列类型'
    await this.getQueueTypeById(row.queueTypeId)
    this.sceneSubTypeParams.sceneId = this.formModify.sceneType
    this.getSceneTypeList()
    this.getSceneSubtype()
  }

  /* 根据id查询队列类型信息 */
  getQueueTypeById(id: any) {
    return tmQueueType
      .queryQueueTypeById(id)
      .then((response: any) => {
        this.formModify = response
      })
  }

  /* 分页查询队列类型 */
  queryQueueTypeData() {
    this.loading = true
    tmQueueType
      .queryQueueTypeData(this.queryParams)
      .then((response: any) => {
        this.total = parseInt(response.total)
        this.queueTypeData = response.list
        this.loading = false
      })
  }

  /* 查询队列类型列表 */
  queryQueueTypeList() {
    tmQueueType
      .queryQueueTypeList(this.emptyParams)
      .then((response) => {
        this.queueTypeList = response
      })
  }

  handleAdd() {
    this.modalAdd = true
    this.title = '新增队列类型'
  }

  /** 取消按钮 */
  cancel() {
    this.modalAdd = false;
    this.reset();
  }

  /** 表单重置 */
  reset() {
    this.formModify = {
      queueTypeName: undefined,
      queueTypeAlias: undefined,
      specialRate: undefined,
      queueTypePlace: undefined,
      queueTypeColor: '#409EFF',
      queueTypePriority: undefined,
      jumpStep: undefined,
      queueTypeFontColor: '#ff1e02'
    };
    // const form: any = this.$refs.formRef;
    // form.resetFields();
    (this.$refs.formRef as any).resetFields();
  }

  /* 搜索按钮操作 */
  handleQuery() {
    this.queryParams.pageNum = 1
    this.queryQueueTypeData()
  }

  /* 搜索重置按钮操作 */
  resetQuery() {
    this.queryParams = {
      queueTypeName: undefined,
      queueTypeAlias: undefined,
      pageNum: 1,
      pageSize: 10
    };
    this.handleQuery();
  }

  /* 删除队列类型 */
  confirm(row: any) {
    this.delParams.queueTypeId = row.queueTypeId
    tmQueueType
      .delQueueType(this.delParams)
      .then((response: any) => {
        this.$message.success('删除成功');
        this.queryQueueTypeData()
      })
  }

  cancelPop() {
    this.$message.warning('已取消删除');
  }

  /* 新增/编辑队列类型 提交按钮 */
  submitForm() {
    const form: any = this.$refs.formRef;
    form.validate((valid: any) => {
      if (valid) {
        if (this.formModify.queueTypeId) {
          if (this.formModify.queueTypePlace === 0 || this.formModify.queueTypePlace === 1 || this.formModify.queueTypePlace === 2) {
            this.formModify.jumpStep = 0
          } else if (this.formModify.queueTypePlace === 3) {
            this.formModify.jumpStep = 2
          } else if (this.formModify.queueTypePlace === 4) {
            this.formModify.jumpStep = 3
          } else if (this.formModify.queueTypePlace === 5) {
            this.formModify.jumpStep = 5
          }
          tmQueueType
            .update(this.formModify)
            .then(() => {
              this.$message.success('编辑成功');
              this.modalAdd = false;
              this.reset();
              this.queryQueueTypeData()
            })
            .catch((e: string) => this.$message.warning(e));
        } else {
          if (this.formModify.queueTypePlace === 0 || this.formModify.queueTypePlace === 1 || this.formModify.queueTypePlace === 2) {
            this.formModify.jumpStep = 0
          } else if (this.formModify.queueTypePlace === 3) {
            this.formModify.jumpStep = 2
          } else if (this.formModify.queueTypePlace === 4) {
            this.formModify.jumpStep = 3
          } else if (this.formModify.queueTypePlace === 5) {
            this.formModify.jumpStep = 5
          }
          tmQueueType
            .save(this.formModify)
            .then(() => {
              this.$message.success('添加成功');
              this.modalAdd = false;
              this.reset();
              this.queryQueueTypeData()
            })
            .catch((e: string) => this.$message.warning(e));
        }
      } else {
        return false;
      }
    });
  }
}
</script>
<style lang="less" src="./queue-type.less" scoped></style>
<style lang="less" scoped>
</style>
