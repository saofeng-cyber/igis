<template src="./fz-mz-realtime.html"></template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
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
    pageSize: 8,
    sceneType: ''
  };

  formBuild: any = {
    dateList: []
  }

  total: number = 0;
  roomList: any = [];// 诊区科室下拉列表
  departmentList:any = [];// 诊区科室下拉列表
  defaultShowTime:any =  {
    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment(moment(), 'HH:mm:ss')]
  }

  columns: any = [
    {
      title: '诊室',
      dataIndex: 'roomName',
      key: 'roomName',
      align: 'center'
    },
    {
      title: '科室',
      dataIndex: 'deptName',
      key: 'deptName',
      align: 'center'
    },
    {
      title: '总等待时间(分钟)',
      dataIndex: 'waitDate',
      key: 'waitDate',
      align: 'center',
      scopedSlots: { customRender: 'waitDate' }
    },
    {
      title: '平均等待时间(分钟)',
      dataIndex: 'avgWaitDate',
      key: 'avgWaitDate',
      align: 'center',
      slots: { title: 'avgWaitDateTip' },
      scopedSlots: { customRender: 'avgWaitDate' }
    },
    {
      title: '总预约等待时间(分钟)',
      dataIndex: 'smcWaitDate',
      key: 'smcWaitDate',
      align: 'center',
      scopedSlots: { customRender: 'smcWaitDate' }
    },
    {
      title: '预约平均等待时间(分钟)',
      dataIndex: 'smcAvgWaitDate',
      key: 'smcAvgWaitDate',
      align: 'center',
      scopedSlots: { customRender: 'smcAvgWaitDate' }
    },
    {
      title: '标准等待时间(分钟)',
      dataIndex: 'countryWaitDate',
      key: 'countryWaitDate',
      align: 'center'
    },
    {
      title: '统计人数',
      dataIndex: 'waitDateNumPeople',
      key: 'waitDateNumPeople',
      align: 'center'
    }
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

  getTableData() {
    console.log(this.formBuild);
    const params = {
      businessTypeId: 1001,
      roomId: this.formBuild.roomId,
      deptId: this.formBuild.deptId,
      createTimeStart: this.formBuild.dateList[0],
      createTimeEnd: this.formBuild.dateList[1]
    }
    commonRealtime.queryStatisticalAverageTime(params).then((res: any) => {
      console.log('666', res);
      this.dataSource = res.mzAvgDateList
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
    this.formBuild = { dateList: [] }
    this.getTableData()
  }

  created() {
    this.getMedicalRoomList();
    this.getDepartmentList();
  }

  // 诊室 下拉列表
  getMedicalRoomList() {
    fzRoom
      .getFzRoomList({})
      .then((res:any) => {
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
<style lang="less" scoped src="./fz-mz-realtime.less">

</style>
