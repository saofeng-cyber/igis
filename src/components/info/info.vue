<template src="./info.html"></template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Info extends Vue {
  @Prop({ type: String, default: null }) title!: string;

  @Prop({ type: String, default: null }) value!: string;

  @Prop({ type: Boolean, default: false }) bordered!: boolean;

  @Prop({ type: String, default: 'rgba(0, 0, 0, 0.85)' }) color!: string;
}
</script>
<style lang="less" scoped src="./info.less"></style>
