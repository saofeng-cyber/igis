<template>
    <a-layout-sider theme="dark" :collapsed="collapsed" :trigger="null" collapsible :collapsed-width="80" width="220">
        <div class="app-logo" @click="jumpMain">
            <img src="@/assets/logo.png" />
            <div v-show="!collapsed" class="app-title">
                {{ title }}
            </div>
        </div>
        <div class="app-menu">
            <AppMenu />
        </div>
        <SiderFoot />
        <!-- <div slot="trigger">
            <a-button icon="export" shape="circle" type="link" style="color: #fff;font-size: 18px; " />
        </div> -->
    </a-layout-sider>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import AppMenu from '../menu/AppMenu.vue';
import SiderFoot from './SiderFoot.vue';
import { LayoutModule } from '@/store/modules/layout';
export default defineComponent({
    name: 'AppSider',
    components: {
        AppMenu,
        SiderFoot
    },
    data() {
        return {
            title: '智能导检系统',

        }
    },
    computed: {
        collapsed() {
            return LayoutModule.sidebar.opened
        }
    },
    methods: {
        jumpMain() {
            this.$router.push({
                path: '/home/index'
            }, () => { })
        },
    }
})
</script>
<style scoped lang="less">
.app-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    white-space: nowrap;
    cursor: pointer;

    img {
        width: 32px;
        height: 32px;
    }

    .app-title {
        margin-left: 0.5rem;
        font-weight: 700;
        font-size: 18px;
        transition: all 0.2s ease;
        color: #fff;
        letter-spacing: 0.25rem;
    }
}

.app-menu {
    height: calc(100vh - 64px);
    overflow-x: hidden;
    overflow-y: auto;
}
</style>