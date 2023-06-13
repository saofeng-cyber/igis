<template>
  <div id="left" class="left">
    <a-menu :default-selected-keys="[defaultSelectKey]" :open-keys.sync="openKeys" mode="inline" style="border-right: none;">
      <a-sub-menu v-for="(menu,index) in menus" :key="index+'father'" style="background-color:rgba(242, 242, 242, 1);border:none;border-radius: 5px;">
        <span slot="title">
          <span class="title">{{ menu.clinicAreaName }}</span>
        </span>
        <a-menu-item v-for="(item,ind) in menu.child" :key="index+'child'+ind" class="inner" @click="changeRoom(item.roomId,item.roomName,menu.clinicAreaId)">
          {{ item.roomName }}
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// import { selectAreaDictAndRoom } from "@/api/call/callFz";
// import { getlistDocLogin } from "@/api/call/callMzQueue";

@Component
export default class Left extends Vue {
  changeRoom:any = {
    type: Function,
    required: true
  }

  clinicAreaId:any = {
    type: [String, Number]
  }

  roomId: any = {
    type: [String, Number]
  }

  current: any = ['']
  openKeys: any = ['0father']
  menus: any = []
  defaultSelectKey: any = '0child0'
  timer: any = ''

  created() {
    // this.getSelectAreaDictAndRoom()
  }

  /* getSelectAreaDictAndRoom() {
    return selectAreaDictAndRoom({}).then((response:any) => {
      const data = response.data;
      const areas = [];
      const areaIdList = data.map(function(x:any) {
        return x.clinicAreaId
      })
      const areaIds = [...new Set(areaIdList)].sort();
      for (let i = 0; i < areaIds.length; i++) {
        const area = data.find(obj: any => obj.clinicAreaId == areaIds[i]);
        const areaObj = {
          clinicAreaId: area.clinicAreaId,
          clinicAreaName: area.clinicAreaName
        }
        areaObj.child = data.filter(item => item.clinicAreaId == areaIds[i]);
        areas.push(areaObj);
      }
      this.menus = areas;
      if (areas && areas[0] && areas[0].child) {
        // let openKey = '0father' + areas[0].clinicAreaId;
        // this.clinicAreaId = areas[0].clinicAreaId;
        // this.roomId=areas[0].child[0].roomId;
        // this.openKeys.push(openKey);
        this.changeRoom(areas[0].child[0].roomId, areas[0].child[0].roomName, areas[0].clinicAreaId)
      }
      return Promise.resolve()
    })
  } */

  // 弃用
  /* queryDocList() {
    // 循环 更新y医生在线时间，并发执行 ，想使用for of 需要线获取一个数组，循环它
    // 使用let 块级作用域，避免bug
    const len = this.menus.length // 诊区
    for (let i = 0; i < len; i++) {
      const roomsList = this.menus[i].child // 诊室
      for (let j = 0; j < roomsList.length; j++) {
        getlistDocLogin({ roomId: roomsList[j].roomId })
          .then((response: any) => {})
          .catch((e: any) => { console.log(e) })
      }
    }
  } */
}
</script>

<style scoped lang="less">
  .left {
    background-color: #fff;
    // height: 100%;
    border-top: #BFCBD9 solid;
    padding: 3px;

    & /deep/ .is-active {
      background-color: red !important;
    }
  }

  .title {
    font-family: "微软雅黑";
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
  }

  .inner {
    font-family: "微软雅黑";
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    color: #666666;
    border-radius: 3px;
  }

  .ant-menu-submenu-selected {
    color: #666 !important;
  }

  .ant-menu-submenu-active:hover span>span {
    color: #666;
  }

  .ant-menu-item-selected {
    color: #fff;
    background-color: #459DF5 !important;
  }
  .ant-menu-vertical .ant-menu-item::after,
  .ant-menu-vertical-left .ant-menu-item::after,
  .ant-menu-vertical-right .ant-menu-item::after,
  .ant-menu-inline .ant-menu-item::after {
    border-right: none;
  }

  .u195 {
    border-width: 0px;
    position: absolute;
    left: 5px;
    top: 3px;
    width: 30px;
    height: 30px;
    display: flex;
    font-family: '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 18px;
  }

  .primary_button {
    color: #FFFFFF;
  }

  .ax_default {
    font-family: 'Arial Normal', 'Arial';
    font-weight: 400;
    font-style: normal;
    font-size: 13px;
    letter-spacing: normal;
    color: #333333;
    vertical-align: none;
    text-align: center;
    line-height: normal;
    text-transform: none;
  }

  .u195_div {
    border-width: 0px;
    position: absolute;
    left: 0px;
    top: 0px;
    width: 35px;
    height: 35px;
    background: inherit;
    background-color: rgba(245, 154, 35, 1);
    border: none;
    border-radius: 20px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-family: '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 18px;
  }

  .u195_text {
    position: absolute;
    align-self: center;
    padding: 14px 0px 0px 5px;
    box-sizing: border-box;
    width: 100%;
    border-width: 0px;
    word-wrap: break-word;
    text-transform: none;
  }

  .u195_span {
    text-decoration: none;
    color: #fff;
    font-size: 18px;
  }
</style>
