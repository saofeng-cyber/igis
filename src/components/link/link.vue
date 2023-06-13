<template src="./link.html"></template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { IRoutes } from '@/store/modules/routes';
import { ReuseTabModule } from '@/store/modules/reuse-tab';

@Component({})
export default class Link extends Vue {
  @Prop({ required: true }) route!: IRoutes;

  mClick(route: IRoutes) {
    ReuseTabModule.AddView(route);
  }
}
</script>
