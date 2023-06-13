<template>
    <a-layout-header class="app-header">
        <div style="display: flex;align-items: center;">
            <div class="hamburger-container" @click="toggleCollapsed">
                <a-icon v-if="!collapsed" type="menu-fold" style="font-size: 18px;" />
                <a-icon v-if="collapsed" type="menu-unfold" style="font-size: 18px;" />
            </div>
            <a-breadcrumb>
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item v-for="(item, index) in routes" :key="index">
                    <router-link :to="item.path">
                        {{ item.meta.title }}
                    </router-link>
                </a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <div class="right-menu">
            <div class="user-menu">
                <a-avatar src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" />
                <span style="margin-left: 6px;">{{ deptName }}</span>
                <a-divider type="vertical" />
                <span>{{ username }}</span>
            </div>
            <a-dropdown :trigger="['click']">
                <a-icon type="caret-down" theme="filled" />
                <a-menu slot="overlay" @click="loginOut">
                    <a-menu-item key="0">
                        退出登录
                    </a-menu-item>
                </a-menu>
            </a-dropdown>
        </div>
    </a-layout-header>
</template>
<script lang="ts">
interface AppData {
    routes: RouteCustom[],
    username: string,
    deptName: string,
}
interface RouteCustom {
    meta: {
        title: string
    },
    path: string,
}
import { defineComponent } from '@vue/composition-api';
import { LayoutModule } from '@/store/modules/layout';
export default defineComponent({
    name: 'AppHeader',
    data() {
        return {
            routes: [],
            username: '',
            deptName: '',
        } as AppData
    },
    computed: {
        collapsed() {
            return LayoutModule.sidebar.opened
        }
    },
    watch: {
        $route: {
            handler(route) {
                this.routes = (route.matched as RouteCustom[]).filter(item => item.meta && item.meta.title && item.meta.title !== '首页')
                console.log(route);
            },
            immediate: true
        }
    },
    mounted() {
        console.log(this.$store.state);
        const { userInfo } = this.$store.state.UserInfo
        this.username = userInfo.userName || ''
        this.deptName = userInfo.deptName || ''
    },
    methods: {
        toggleCollapsed() {
            LayoutModule.ToggleSideBar(this.collapsed)
        },
        loginOut(e: any) {
            if (e.key === '0') {
                this.$message.success('退出登录成功')
                setTimeout(() => {
                    window.location.href = window.location.origin + '/portal/';
                }, 1000);
            }
        }
    }
})
</script>
<style lang="less" scoped>
.app-header {
    height: 50px;
    background-color: #fff;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    width: 100%;
    justify-content: space-between;
    padding: 0;
    overflow: hidden;
}

.hamburger-container {
    padding: 0 15px;
    cursor: pointer;

    &:hover {
        background-color: #f9f9f9;
    }
}

.right-menu {
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 100%;

    .user-menu {
        display: flex;
        align-items: center;
        height: 100%;
        cursor: pointer;
        width: 100%;
        padding: 0 12px;

        &:hover {
            background-color: #f9f9f9;
        }
    }
}

.trigger {
    font-size: 18px;
}
</style>