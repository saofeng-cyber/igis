<template>
    <a-menu size="large" :selected-keys="selectedKeys" :open-keys="openKeys" selectable theme="dark"
        :inline-collapsed="collapsed" mode="inline" :style="{ borderRight: 0 }" @click="handleClick"
        @openChange="openChange">
        <template v-for="(item) in routesList">
            <sub-menu v-if="item.children.length > 0" :key="item.menuId" :menu-info="item" />
            <a-menu-item v-else :key="item.path">
                <a-icon :type="item.icon" style="font-size: 18px;" />
                <span class="nav-text">{{ item.menuName }}</span>
            </a-menu-item>
        </template>
    </a-menu>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Route } from '@/types/route'
import SubMenu from './SubMenu.vue';
import { RoutesModule } from '@/store/modules/routes';
import { LayoutModule } from '@/store/modules/layout';
import { ReuseTabModule } from '@/store/modules/reuse-tab';
interface RouterList {
    selectedKeys: string[];
    openKeys: string[];
    routesList: Route.RouteItem[]
}
export default defineComponent({
    name: 'AppMenu',
    components: {
        SubMenu
    },
    data() {
        return {
            selectedKeys: [],
            openKeys: [],
            routesList: []
        } as RouterList
    },
    computed: {
        collapsed() {
            return LayoutModule.sidebar.opened
        }
    },
    watch: {
        $route: {
            handler(val) {
                console.log(555, val);
                this.selectedKeys = [val.path]
                ReuseTabModule.AddView(
                    {
                        title: val.meta.title,
                        path: val.path,
                        badge: 0,
                        affix: val.meta.title === '首页'
                    }
                );
            },
            immediate: true
        }
    },
    mounted() {
        this.getRoutes()
        const openKeys = window.sessionStorage.getItem('openKeys')
        if (openKeys) {
            this.openKeys = JSON.parse(openKeys)
        }
    },
    methods: {
        handleClick(item: any) {
            this.$router.push({
                path: item.key
            }, () => { })
            if (item.keyPath.length === 1) {
                window.sessionStorage.removeItem('openKeys')
                this.openKeys = []
            }
            this.selectedKeys = item.keyPath;
        },
        openChange(openKeys: string[]) {
            let keyPath = []
            if (openKeys.length > 0) {
                keyPath.push(openKeys[openKeys.length - 1])
            }
            this.openKeys = keyPath
            window.sessionStorage.setItem('openKeys', JSON.stringify(keyPath))
        },
        getRoutes() {
            this.routesList = RoutesModule.routes
        },
    }
})
</script>
<style lang="less">
// @import 'msun-lib-ui/dist/theme/msun-lib-ui.less';

// .ant-menu.ant-menu-dark .ant-menu-item-selected,
// .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
//     background-color: @msun-selected-item-color !important;
// }

// .ant-menu-dark.ant-menu-inline .ant-menu-item,
// .ant-menu-dark.ant-menu-inline .ant-menu-submenu-title {
//     color: #fff;
//     font-size: 16px;
// }

// .ant-menu-dark,
// .ant-menu-dark .ant-menu-sub {
//     color: #fff !important;
// }

// .ant-menu-dark .ant-menu-item,
// .ant-menu-dark .ant-menu-item-group-title,
// .ant-menu-dark .ant-menu-item>a {
//     color: #fff !important;
// }
</style>