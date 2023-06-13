<template>
    <a-sub-menu :key="menuInfo.key" v-bind="$props" v-on="$listeners">
        <span slot="title">
            <a-icon :type="menuInfo.icon" style="font-size: 18px;" />
            <span>{{ menuInfo.menuName }}</span>
        </span>
        <template v-for="item in menuInfo.children">
            <sub-menu v-if="item.children.length > 0" :key="item.path" :menu-info="item" />
            <a-menu-item v-else :key="item.path">
                <a-icon :type="item.icon" style="font-size: 18px;" />
                <span>{{ item.menuName }}</span>
            </a-menu-item>
        </template>
    </a-sub-menu>
</template>
<script lang="ts">
import { Menu } from 'ant-design-vue';
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
    name: 'SubMenu',
    isSubMenu: true,
    props: {
        ...(Menu.SubMenu as any).props,
        menuInfo: {
            type: Object,
            default: () => ({}),
        }
    }
})

</script>