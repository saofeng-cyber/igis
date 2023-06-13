<template>
  <div class="xt_card_content">
    <div class="xt_card">
      <div class="xt_card_list">
        <div
          v-for="(item, index) in patPreorderInoList"
          :key="index"
          class="xt_card_child"
        >
          <div class="card_top">
            <span class="patient_order">{{ item.bedNo }}</span>
            <span style="color: #fff700;font-size: 2.2vh;">{{
              item.hdStatus
            }}</span>
          </div>
          <div class="card_top">
            <span>{{ item.patName }}</span>
            <span style="color: #e1a76b;"
              >脱水量：
              <span v-if="item.hdUfTotal && item.hdUfTotal.length >= 9">{{
                item.hdUfTotal.substring(0, 9)
              }}</span>
              <span v-if="item.hdUfTotal && item.hdUfTotal.length < 9">{{
                item.hdUfTotal
              }}</span>
              <span v-if="!item.hdUfTotal">无</span>
            </span>
            <span>{{ item.hdEndTime }} 结束</span>
          </div>
          <div class="card_top">
            <span style="color: pink">{{ item.hdStatusSlogan }}</span>
          </div>
          <div class="card_top">
            <span
              >下次：{{ item.nextPreorderDate }}
              {{
                item.nextPreorderDateSection === '1'
                  ? '上午'
                  : item.nextPreorderDateSection === '2'
                  ? '下午'
                  : item.nextPreorderDateSection === '3'
                  ? '晚上'
                  : ''
              }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="fz_screen_xt_content_watting">
      <p class="title">
        待接诊列表(请先刷卡测量)
      </p>
      <div class="fz_watting_list_container">
        <div class="fz_watting_container">
          <div class="watting_list">
            <div
              v-for="(item, index) in docVOS"
              :key="index"
              style="display: flex;justify-content: space-between;align-items: center;width: 100%;"
            >
              <span style="width: 25%;text-align: left;white-space: nowrap;">{{
                item.roomSign + item.serialNumber
              }}</span>
              <span
                style="flex: 1;text-align: left;white-space: nowrap;color: #fff;"
                :style="{
                  color:
                    item.type === '就诊中'
                      ? 'var(--tigc_area_screen_zzjz)'
                      : item.type === '待诊中'
                      ? 'var(--tigc_area_screen_ddjz)'
                      : item.type === '已过号'
                      ? 'var(--tigc_area_screen_ghhz)'
                      : ''
                }"
                >{{ item.patientName }}</span
              >
              <span
                style="width: 32%;text-align: right;white-space: nowrap;"
                :style="{
                  color:
                    item.type === '就诊中'
                      ? 'green'
                      : item.type === '待诊中'
                      ? 'orange'
                      : item.type === '已过号'
                      ? 'red'
                      : ''
                }"
                >{{ item.type }}</span
              >
            </div>
          </div>
          <div class="watting_list_copy"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  getMacAddr,
  getScreenQueue,
  getHdPatPreorderIno
} from '@/api/fz_screen_xt/fz_screen';
interface ScreenInfo {
  clinicAreaName: string; // 诊区名字
  missionaryText: string; // 屏幕宣教
  screenName: string; // 屏幕名字
  screenId: string; // 屏幕id
}

interface RoomId {
  roomid: string;
}
@Component
export default class XtCard extends Vue {
  @Prop({ type: String, default: '', required: false }) macAddr!: string;
  private screenInfo: ScreenInfo = {
    clinicAreaName: '', // 诊区名字
    missionaryText: '', // 屏幕宣教
    screenName: '', // 屏幕名字
    screenId: '' // 屏幕id
  };

  private RoomIds: Array<RoomId> = [];
  private screenStyle: any = {};
  private infoTimer: any = 0;
  private timer: any = 0;

  private changeTheme(screenStyle: any) {
    screenStyle.forEach((item: any) => {
      document.documentElement.style.setProperty(`--${item.alias}`, item.color);
    });
  }

  // 根据屏幕Mac地址获取诊室信息合屏幕信息
  private async getRoomidsByMacAddr(macAddr: string) {
    await getMacAddr({ macAddr }).then((response: any) => {
      if (
        response.fzScreenStyleVO &&
        response.fzScreenStyleVO.screenStyleUrl &&
        response.fzScreenStyleVO.screenStyleUrl !== this.$route.path
      ) {
        window.clearInterval(this.infoTimer);
        window.clearInterval(this.timer);
        this.$emit('stopTimer')
        this.$router.push(response.fzScreenStyleVO.screenStyleUrl)
        return;
      }
      if (response.fzScreenStyleVO && response.fzScreenStyleVO.screenStyle) {
        this.screenStyle = JSON.parse(response.fzScreenStyleVO.screenStyle);
        this.changeTheme(this.screenStyle);
      }
      else {
        this.changeTheme([
          {
            color: '#fffffff',
            alias: 'tigc_area_screen_clinicAreaName'
          },
          {
            color: '#ffffff',
            alias: 'tigc_area_screen_roomName'
          },
          {
            color: '#ffffff',
            alias: 'tigc_area_screen_zzjz'
          },
          {
            color: '#ffffff',
            alias: 'tigc_area_screen_ddjz'
          },
          {
            label: '过号患者',
            color: '#ffffff',
            alias: 'tigc_area_screen_ghhz'
          },
          {
            color: '#ffffff',
            alias: 'tigc_area_screen_missionary'
          }
        ]);
      }

      const {
        clinicAreaName,
        missionaryText,
        screenName,
        screenId,
        roomVOS
      } = response;
      this.screenInfo.clinicAreaName = clinicAreaName;
      this.screenInfo.missionaryText = missionaryText;
      this.screenInfo.screenName = screenName;
      this.screenInfo.screenId = screenId;
      this.RoomIds = roomVOS.map((item: any) => {
        return item.roomId;
      });
      console.log(this.RoomIds);
      this.$emit('getScreenInfo', this.screenInfo);
    });
  }

  public docVOS: any = [];

  // 根据诊室新获取队列信息
  private async getQueueList(roomIds: string) {
    await getScreenQueue({ roomIds }).then((response: any) => {
      this.docVOS = [];
      if (response.length > 0) {
        for (let i = 0; i < response.length; i++) {
          const ysList = response[i].doctorVOS;
          if (ysList !== null && ysList.length !== 0) {
            for (let j = 0; j < ysList.length; j++) {
              // 正在就诊的队列信息
              const jzhzList = ysList[j].fzCallingQueueVOS;
              if (jzhzList && jzhzList.length > 0) {
                for (let k = 0; k < jzhzList.length; k++) {
                  const peopleList = {
                    roomSign: jzhzList[k].roomSign,
                    serialNumber: jzhzList[k].serialNumber,
                    patientName: jzhzList[k].patientName,
                    type: '就诊中'
                  };
                  this.docVOS.push(peopleList);
                }
              }
              // 等待就诊的患者
              const ddjzList = ysList[j].fzWattingQueueVOS;
              if (ddjzList && ddjzList.length > 0) {
                for (let k = 0; k < ddjzList.length; k++) {
                  const peopleList = {
                    roomSign: ddjzList[k].roomSign,
                    serialNumber: ddjzList[k].serialNumber,
                    patientName: ddjzList[k].patientName,
                    type: '待诊中'
                  };
                  this.docVOS.push(peopleList);
                }
              }
              // 过号的患者
              const ghList = ysList[j].fzOverQueueVOS;
              if (ghList && ghList.length > 0) {
                for (let k = 0; k < ghList.length; k++) {
                  const peopleList = {
                    roomSign: ghList[k].roomSign,
                    serialNumber: ghList[k].serialNumber,
                    patientName: ghList[k].patientName,
                    type: '已过号'
                  };
                  this.docVOS.push(peopleList);
                }
              }
            }
            console.log('docVOS', this.docVOS);
          }
        }
      }
    });
  }

  public patPreorderInoList: any = [];
  private pageNum: number = 1;
  private total: number = 0;
  // 获取患者预约信息
  private getHdPatPreorderIno(pageNum: number) {
    const params = {
      hospitalId: '',
      pageNum,
      pageSize: 16,
      screenMac: this.macAddr
    };
    getHdPatPreorderIno(params).then((res: any) => {
      console.log(res);
      this.patPreorderInoList = res.list;
      this.total = res.total;
      if (Number(res.nextPage) !== 0) {
        this.pageNum++;
      } else if (Number(res.nextPage) === 0) {
        this.pageNum = 1;
      }
    });
  }

  private async getInfoMation() {
    await this.getRoomidsByMacAddr(this.macAddr);
    await this.getQueueList(this.RoomIds.join(','));
    this.getHdPatPreorderIno(this.pageNum);
    window.clearInterval(this.timer);
    this.watchScroll();
  }

  // 获取队列
  public async getAllData() {
    window.clearInterval(this.infoTimer);
    this.getInfoMation();
    this.infoTimer = window.setInterval(this.getInfoMation, 30 * 1000);
  }

  public wattingListCopy: any = '';
  public wattingList: any = '';
  // 待诊队列滚动监听
  public watchScroll() {
    window.clearInterval(this.timer);
    this.$nextTick(() => {
      const wattingListContainer = document.querySelector(
        '.fz_watting_container'
      ) as HTMLDivElement;
      this.wattingList = document.querySelector(
        '.watting_list'
      ) as HTMLDivElement;
      this.wattingListCopy = document.querySelector(
        '.watting_list_copy'
      ) as HTMLDivElement;
      if (wattingListContainer.offsetHeight >= this.wattingList.offsetHeight) {
        this.wattingListCopy.innerHTML = '';
        return;
      }
      this.wattingListCopy.innerHTML += this.wattingList.innerHTML;
      this.timer = window.setInterval(() => {
        // console.log(wattingListContainer.scrollTop, wattingList.offsetHeight);
        if (
          Math.ceil(wattingListContainer.scrollTop) >=
          Math.floor(this.wattingList.offsetHeight)
        ) {
          wattingListContainer.scrollTop -= this.wattingList.offsetHeight;
        } else {
          wattingListContainer.scrollTop++;
        }
      }, 20);
    });
  }

  mounted() {
    // this.watchScroll()
  }
}
</script>
<style scoped lang="less">
.xt_card_content {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;

  .xt_card {
    position: relative;
    width: 100%;
    height: 100%;

    .xt_card_list {
      display: flex;
      flex-wrap: wrap;
      height: calc(25% - 1vh);
      width: 100%;

      .xt_card_child {
        width: calc(25% - 2vh);
        height: calc(100% - 1vh);
        margin: 1vh;
        background-color: #317ff4;
        border-radius: 1vh;
        padding: 0.5vh;
        font-size: 2.5vh;
        font-weight: bold;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .card_top {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .patient_order {
            display: flex;
            align-items: center;
            justify-content: center;
            width: auto;
            min-width: 6vh;
            min-height: 6vh;
            background-color: #f06292;
            padding: 0 5px;
            border-bottom-left-radius: 50%;
            border-bottom-right-radius: 50%;
          }
        }
      }
    }
  }

  .fz_screen_xt_content_watting {
    height: 100%;
    width: 24vw;
    overflow: hidden;
    text-align: center;
    color: #fff;
    padding-left: 1vh;

    .title {
      font-size: 2.7vh;
      font-weight: bold;
      height: 3vh;
      line-height: 3vh;
      margin-bottom: 1.6vh;
      white-space: nowrap;
    }

    .fz_watting_list_container {
      position: relative;
      height: calc(100% - 4.6vh);
      font-size: 3vh;
      font-weight: bold;

      .fz_watting_container {
        height: 100%;
        overflow: hidden;

        .watting_list,
        .watting_list_copy {
          div {
            width: 100%;
            height: 8vh;
            line-height: 8vh;
          }
        }
      }

      // background-color: aqua;
    }
  }
}
</style>
