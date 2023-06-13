<template>
    <div class="app-tabs">
        <router-link v-for="tag in visitedViews" ref="tag" :key="tag.path"
            :class="[isActive(tag) ? 'active' : '', isAffix(tag) ? '' : 'close']" :to="{ path: tag.path }" tag="span"
            class="ms-reuse-tab__item" @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ' '"
            @contextmenu.prevent.stop.native="openMenu(tag, $event)">
            {{ tag.title }}
            <template v-if="tag.badge > 0">
                ({{ tag.badge }})
            </template>
            <span v-if="visitedViews.length > 1" class="iconfont icon-guanbi1 l-padding m-font"
                @click.prevent.stop="closeSelectedTag(tag)"></span>
        </router-link>
    </div>
</template>
<script lang="ts">
import { ReuseTabModule } from '@/store/modules/reuse-tab';
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
    name: 'AppTab',
    data() {
        return {}
    },
    computed: {
        visitedViews() {
            return ReuseTabModule.visitedViews;
        },
    },
    methods: {
        isActive(route: any) {
            return route.path === this.$route.path;
        },
        isAffix(tag: any) {
            return tag && tag.affix;
        },
        openMenu(tag: any, e: MouseEvent) {
            console.log(tag);
        },
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
        },
        closeSelectedTag(view: any) {
            ReuseTabModule.DelView(view);
            if (this.isActive(view)) {
                this.toLastView(ReuseTabModule.visitedViews, view);
            }
        }
    }
})
</script>
<style scoped lang="less">
.app-tabs {
    background-color: #fff;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.05);
}
.ms-reuse-tab {
    position: static !important;
    height: 34px;
    width: 100%;
    display: table;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    &__item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;
        margin-bottom: 4px;
    }
}

.router-link-exact-active {
    background-color: #42b983;
    color: #fff;
    border-color: #42b983;
}

.router-link-exact-active::before {
    content: "";
    background: #fff;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    margin-right: 2px;
}

.icon-guanbi1:before {
    transform: scale(.6);
    display: inline-block;
    vertical-align: -1px;
}
.contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 4px 0;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.3);

    li {
        margin: 0;
        padding: 8px 16px;
        cursor: pointer;

        &:hover {
            background: #eee;
        }
    }
}
</style>