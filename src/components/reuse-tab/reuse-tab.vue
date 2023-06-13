<template src="./reuse-tab.html"></template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { ReuseTabModule, IReuseTab } from '@/store/modules/reuse-tab';
import { RoutesModule, IRoutes } from '@/store/modules/routes';
import path from 'path';

@Component({})
export default class ReuseTabEmbed extends Vue {
  private visible: boolean = false;
  private top: number = 0;
  private left: number = 0;
  private selectedTag: any = {};
  private affixTags: any[] = [];

  get visitedViews() {
    return ReuseTabModule.visitedViews;
  }

  get routes(): IRoutes[] {
    return RoutesModule.routes;
  }

  @Watch('visible')
  onVisibleChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu);
    } else {
      document.body.removeEventListener('click', this.closeMenu);
    }
  }

  isActive(route: any) {
    return route.path === this.$route.path;
  }

  isAffix(tag: any) {
    return tag && tag.affix;
  }

  filterAffixTags(routes: any, basePath = '/') {
    let tags: any[] = [];
    routes.forEach((route: any) => {
      if (route.meta && route.meta.affix) {
        const tagPath = path.resolve(basePath, route.path);
        tags.push({
          path: tagPath,
          title: route.name,
          affix: true
        });
      }
      if (route.children) {
        const childTags = this.filterAffixTags(route.children, route.path);
        if (childTags.length >= 1) {
          tags = [...tags, ...childTags];
        }
      }
    });
    return tags;
  }

  moveToCurrentTag() {
    const tags = this.$refs.tag as any[];
    this.$nextTick(() => {
      for (const tag of tags) {
        if (tag.to.path === this.$route.path) {
          if (tag.to.path !== this.$route.fullPath) {
            ReuseTabModule.UpdateVisitedView(this.$route);
          }
          break;
        }
      }
    });
  }

  refreshSelectedTag(view: any) {
    ReuseTabModule.DelCachedView(view);
    const { path } = view;
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + path
      });
    });
  }

  closeSelectedTag(view: any) {
    ReuseTabModule.DelView(view);
    if (this.isActive(view)) {
      this.toLastView(ReuseTabModule.visitedViews, view);
    }
  }

  closeOthersTags() {
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + this.selectedTag.path
      });
    });
    ReuseTabModule.DelOthersViews(this.selectedTag);
    this.moveToCurrentTag();
  }

  closeAllTags(view: any) {
    ReuseTabModule.DelAllViews();
    if (this.affixTags.some(tag => tag.path === this.$route.path)) {
      return;
    }
    this.toLastView(ReuseTabModule.visitedViews, view);
  }

  toLastView(visitedViews: any[], view: any) {
    const latestView = visitedViews.slice(-1)[0];
    if (latestView) {
      this.$router.push(latestView.path);
    } else {
      if (view.title === 'Dashboard') {
        this.$router.replace({ path: '/redirect' + view.path });
      } else {
        this.$router.push('/');
      }
    }
  }

  /**
   * 打开下拉框, 并初始化下拉框位置
   */
  openMenu(tag: any, e: MouseEvent) {
    const menuMinWidth = 105;
    const offsetLeft = this.$el.getBoundingClientRect().left;
    const offsetWidth = (this.$el as HTMLElement).offsetWidth;
    const maxLeft = offsetWidth - menuMinWidth;
    this.left = e.clientX;
    this.top = e.clientY + 20;
    this.visible = true;
    this.selectedTag = tag;
  }

  closeMenu() {
    this.visible = false;
  }
}
</script>
<style lang="less" scoped src="./reuse-tab.less"></style>
