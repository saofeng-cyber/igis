<template>
  <div ref="box" class="listScroll">
    <slot></slot>
    <slot v-if="isShow"></slot>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component
export default class FzScroll extends Vue {
  @Prop({ type: Number, default: 5 }) speed!: Number;
  @Prop({ type: Number, default: 5 }) numberLength!: Number;
  @Prop({ type: Number, default: 5 }) totalnumber!: Number;
  isScroll: boolean = true;
  parentHeight: any = 0;
  boxHeight: number = 0;
  childHeight: number = 0;
  height: number = 0;
  ele0: any = '';
  ele1: any = '';
  isShow: boolean = true;
  isTimerShow: boolean = false
  timer: any = 0;
  mounted() {
    this.reload()
  }

  @Watch('numberLength')
  watchHeigh() {
    this.ele0 = (this.$refs.box as HTMLElement).children[0]; // 500
    if (this.numberLength <= this.totalnumber) {
      this.isScroll = false;
      this.isShow = false;
      this.height = 0
    } else {
      if (this.isScroll) {
        return 0
      } else {
        console.log(this.numberLength, this.totalnumber);
        this.isScroll = true;
        this.isShow = true;
        this.$nextTick(() => {
          this.ele1 = (this.$refs.box as HTMLElement).children[1]; // 500
          this.startScroll(this.height);
        })
      }
    }
  }

  reload() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
    this.ele0 = (this.$refs.box as HTMLElement).children[0]; // 500
    this.boxHeight = (this.$refs.box as HTMLElement).clientHeight; // 1044
    this.ele1 = (this.$refs.box as HTMLElement).children[1]; // 500
    // this.parentHeight = (this.$refs.box as HTMLElement).parentElement?.clientHeight;
    // console.log(this.ele0.clientHeight, this.boxHeight, this.parentHeight);
    // 在盒子内容高度小于可视高度时不滚动
    console.log(this.numberLength, this.totalnumber);
    if (this.numberLength <= this.totalnumber) {
      this.isScroll = false;
      this.isShow = false;
    } else {
      this.startScroll(this.height);
      // this.setListenEvent();
    }
  }

  // setListenEvent() {
  //   (this.$refs.box as HTMLElement).onmouseenter = () => {
  //     this.isScroll = false;
  //   };
  //   (this.$refs.box as HTMLElement).onmouseleave = () => {
  //     if (this.numberLength >= this.totalnumber) {
  //       this.isScroll = true;
  //       this.$nextTick(() => {
  //         this.startScroll(this.height);
  //       });
  //     }
  //   };
  // }

  startScroll(height: number): boolean {
    this.ele0.style = `transform:translateY(-${height}px);`;
    this.ele1.style = `transform:translateY(-${height}px);overflow: hidden;`;
    if (height >= this.ele0.clientHeight) {
      this.height = 0;
    } else {
      this.height += this.speed as number;
    }
    if (!this.isScroll) {
      if (this.timer) {
        window.clearInterval(this.timer)
      }
      return false
    }
    if (this.timer) {
      window.clearInterval(this.timer);
    }
    this.timer = window.setInterval(() => {
      this.startScroll(this.height);
    }, 10);
    return true;
  }

  destroyed() {
    window.clearInterval(this.timer);
  }
}
</script>
<style>
.listScroll {
  height: auto;
  overflow: hidden;
}
</style>
