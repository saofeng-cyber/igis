<template>
  <div class="msun-source__main">
    <div class="msun-source__header">
      <div class="msun-source__header_left">
        <a-form layout="inline" :form="igisForm">
          <a-form-item>
            <a-button class="link_text" type="link" icon="plus">
              新增
            </a-button>
            <a-button class="link_text" type="link" icon="dashboard">
              定位
            </a-button>
            <a-button class="link_text" type="link" icon="sync">
              刷新
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-input placeholder="体检编号"></a-input>
          </a-form-item>
          <a-form-item>
            <a-select style="width: 120px;" placeholder="接口编码">
              <a-select-option value="male">
                male
              </a-select-option>
              <a-select-option value="female">
                female
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select style="width: 120px;" placeholder="类型">
              <a-select-option value="male">
                male
              </a-select-option>
              <a-select-option value="female">
                female
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-select style="width: 120px;" placeholder="区域">
              <a-select-option value="male">
                male
              </a-select-option>
              <a-select-option value="female">
                female
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-checkbox style="color: #fff;">
              仅显示
            </a-checkbox>
          </a-form-item>
          <a-form-item>
            <a-switch />
            <span style="color: #fff;margin-left: 8px;">强制刷新</span>
          </a-form-item>
        </a-form>
      </div>
      <div class="msun-source__header_right">
        <a-button class="link_text" type="link" icon="ellipsis" />
      </div>
    </div>
    <div class="msun-source__card">
      <div v-for="item in 10" :key="item" class="msun-source__card_item">
        <IgisCard title="刘群" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import IgisCard from '@/components/Table/IgisCard.vue'
import { ref } from 'vue';

// import { Component, Vue } from 'vue-property-decorator';
// @Component({})
// export default class Redirect extends Vue {}
const igisForm = ref({})
</script>
<style lang="less" src="./triage-table.less" scoped></style>
<style scoped>
.ant-table-fixed-header .ant-table-scroll .ant-table-header {
  width: calc(100% - 8px);
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}
</style>
