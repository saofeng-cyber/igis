<template src="./scene-manage.html"></template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { fzScene } from '@/api/fz-scene/fz-scene'

const columns = [
  {
    title: '场景类型',
    align: 'center',
    dataIndex: 'sceneName'
  },
  {
    title: '场景子类',
    align: 'center',
    dataIndex: 'subtypeName'
  },
  {
    title: '是否开通',
    align: 'center',
    dataIndex: 'enableFlag',
    scopedSlots: { customRender: 'enableFlag' }
  }
  // {
  //   title: '操作',
  //   dataIndex: 'action',
  //   align: 'center',
  //   scopedSlots: { customRender: 'action' }
  // }
]
@Component
export default class Fzdoctor extends Vue {
  columns:any = columns;
  loading:boolean = false; // 遮罩层
  visibleHelp:boolean = false;
  total:number = 0;// 总条数
  sceneTypeList: any = []

  queryParams:any = { // 查询参数
    sceneTypeName: '',
    sceneSubtypeName: '',
    pageNum: 1,
    pageSize: 10
  };

  created() {
    this.queryList();
  }

  openHelpReadMe() {
    this.visibleHelp = true
  }

  onCloseHelp() {
    this.visibleHelp = false
  }

  /* 分页查询场景类型列表 */
  queryList() {
    this.loading = true;
    fzScene.getFzSceneTypeList(this.queryParams).then(
      (response:any) => {
        this.sceneTypeList = response.list
        this.total = Number(response.total);
        this.loading = false;
      }
    )
      .catch((e:string) => {
        this.loading = false;
        this.$message.warning(e)
      });
  }

  /** 搜索按钮操作 */
  handleQuery() {
    this.queryParams.pageNum = 1;
    this.queryList();
  }

  /** 搜索重置按钮操作 */
  resetQuery() {
    this.queryParams = { // 查询参数
      sceneTypeName: '',
      sceneSubtypeName: '',
      pageNum: 1,
      pageSize: 10
    };
    this.handleQuery();
  }

  /* 关闭 */
  confirm(row: any) {
    const dictCode = row.dictCode
    fzScene
      .update({ dictCode })
      .then((response: any) => {
        this.$message.success('关闭成功');
        this.queryList()
      })
  }

  cancelPop() {
    this.$message.warning('已取消关闭');
  }

  /* 开通 */
  confirm1(row: any) {
    const subtypeId = row.subtypeId
    const enableFlag = row.enableFlag
    console.log(subtypeId)
    fzScene
      .update({ subtypeId, enableFlag })
      .then((response: any) => {
        console.log(response)
        if (enableFlag === '1') {
          this.$message.success('取消开通成功');
        } else {
          this.$message.success('开通成功');
        }
        this.queryList()
      })
      .catch((e:any) => {
        this.loading = false
        this.$message.warning(e)
      })
  }

  cancelPop1() {
    this.$message.warning('已取消开通');
  }

  /* 开通提示 */
  confirmEnable(row: any) {
    this.$message.success('开通相应场景，请联系项目管理人员！');
  }
}
</script>
<style lang="less" src="./scene-manage.less" scoped></style>
<style lang="less" scoped>
</style>
