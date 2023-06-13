<template src="./fz_tigc_doctor.html"></template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { commonRealtime } from '@/api/';
import { fzRoom } from '@/api/fz-room/fz-room'
import { tmTemplateManage } from '@/api/tm-template-manage/template-manage';
import moment from 'moment'

@Component
export default class FzLisRealTime extends Vue {
  timer: any = 0
  visibleHelp: boolean = false
  queryParams: any = {
    // 查询参数
    hospitalId: 0,
    orgId: 0,
    pageNum: 1,
    pageSize: 10,
    sceneType: ''
  };

  formBuild: any = {
    dateList: [],
    pageNum: 1,
    pageSize: 10,
  }

  total: number = 0;
  roomList: any = [];// 诊区科室下拉列表
  departmentList: any = [];// 诊区科室下拉列表
  defaultShowTime: any = {
    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment(moment(), 'HH:mm:ss')]
  }

  columns: any = [
    {
      title: '姓名',
      dataIndex: 'hisCreaterName',
      key: 'hisCreaterName',
      align: 'center'
    },
    {
      title: '诊室',
      dataIndex: 'roomName',
      key: 'roomName',
      align: 'center'
    },
    {
      title: '护士各诊室分诊人数',
      dataIndex: 'waitDateNumPeopleOfRoomAll',
      key: 'waitDateNumPeopleOfRoomAll',
      align: 'center',
      scopedSlots: { customRender: 'waitDateNumPeopleOfRoomAll' }
    },
    {
      title: '护士各诊室预约分诊人数',
      dataIndex: 'waitDateNumPeopleOfRoomSmc',
      key: 'waitDateNumPeopleOfRoomSmc',
      align: 'center',
      scopedSlots: { customRender: 'waitDateNumPeopleOfRoomSmc' }
    },
    {
      title: '护士各诊室手动分诊人数',
      dataIndex: 'waitDateNumPeopleOfRoomTigc',
      key: 'waitDateNumPeopleOfRoomTigc',
      align: 'center',
      scopedSlots: { customRender: 'waitDateNumPeopleOfRoomTigc' }
    },
    // {
    //   title: '护士分诊总人数',
    //   dataIndex: 'waitDateNumPeopleOfAll',
    //   key: 'waitDateNumPeopleOfAll',
    //   align: 'center',
    //   scopedSlots: { customRender: 'waitDateNumPeopleOfAll' }
    // }
  ];

  dataSource: any = [];

  openHelpReadMe() {
    console.log(555);
    this.visibleHelp = true
  }

  onCloseHelp() {
    this.visibleHelp = false
  }

  /** 科室 多选下拉框 模糊搜索 */
  filterOption(input: any, option: any) {
    const text = option.componentOptions.children[0].componentOptions.children[0].componentOptions.children[0].text;
    return text.indexOf(input) >= 0;
  }

  queryList(page: number, pageSize: number) {
    this.getTableData()
  }

  fontSize(res: any) {
    const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    const fontSize = clientWidth / 1920;
    return res * fontSize;
  }

  exportData() {
    /* 导出数据 */
    console.log(666);
  }

  onStatePageChange(page: number, pageSize: number) {
    this.formBuild.pageNum = page;
    this.formBuild.pageSize = pageSize;
    this.getTableData();
  }
  onShowSizeChange(current: number, pageSize: number) {
    this.formBuild.pageNum = current;
    this.formBuild.pageSize = pageSize;
    this.getTableData();
  }

  getTableData() {
    console.log(this.formBuild);
    const params = {
      hisCreaterName: this.formBuild.hisCreaterName,
      businessTypeId: 1001,
      pageNum: this.formBuild.pageNum,
      pageSize: this.formBuild.pageSize,
      roomId: this.formBuild.roomId,
      createTimeStart: this.formBuild.dateList[0],
      createTimeEnd: this.formBuild.dateList[1]
    }
    commonRealtime.queryNurseWorkload(params).then((res: any) => {
      this.dataSource = res.list
      this.total = Number(res.total)
    });
  }

  loadData() {
    this.getTableData()
  }

  mounted() {
    this.loadData()
    // this.timer = window.setInterval(() => {
    //   this.loadData()
    // }, 15 * 1000 * 60)
  }

  reset() {
    this.formBuild = { dateList: [], pageNum: 1, pageSize: 10, hisCreaterName: '' }
    this.getTableData()
  }

  created() {
    this.getMedicalRoomList();
  }

  // 诊室 下拉列表
  getMedicalRoomList() {
    fzRoom
      .getFzRoomList({})
      .then((res: any) => {
        this.roomList = res
      })
  }

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

  destroyed() {
    window.clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped src="./fz_tigc_doctor.less"></style>
