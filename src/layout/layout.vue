<template>
    <a-layout class="app-mian">
        <AppSider />
        <a-layout>
            <AppHeader />
            <AppTab />
            <AppContent />
        </a-layout>
    </a-layout>
</template>
<script lang="ts">
import AppSider from './sidebar/AppSider.vue'
import AppHeader from './header/AppHeader.vue'
import AppContent from './main/AppContent.vue'
import AppTab from './tabbar/AppTab.vue';
import { defineComponent } from 'vue';
export default defineComponent({
    components: {
        AppSider,
        AppHeader,
        AppContent,
        AppTab
    },
    setup() {
        return {}
    }
})
</script>
<style scoped lang="less">
.app-mian {
    display: flex;
    width: 100%;
    max-height: 100%;
    background-color: #f4f7f9;
    overflow-x: hidden;
    overflow-y: auto;
}

#components-layout-demo-responsive .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
}

.site-layout-sub-header-background {
    background: #fff;
}

.site-layout-background {
    background: #fff;
}
</style>
  