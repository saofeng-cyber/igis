<template>
  <div class="com-card">
    <div class="title">
      <slot name="title">
昨日预约人数
</slot>
    </div>
    <div class="value">
      <slot name="value"></slot>
    </div>
    <div class="chart" style="width: 100%;">
      <slot name="chart"></slot>
    </div>
    <div class="line">
      <slot name="line">
        <!-- <el-divider></el-divider> -->
        <a-divider />
      </slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
@Component
export default class ComCard extends Vue {
}
</script>
<style lang="less" scoped>
.com-card{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 10px;
}
.title{
  font-size: 13px;
}
.value{
  font-size: 20px;
  color: #333;
  font-weight: 500;
}
.line{
  width: 100%;
  & /deep/ .ant-divider-horizontal{
    margin:8px 0;
  }
}
.footer{
  font-size: 13px;
  color:#999;
}
</style>
