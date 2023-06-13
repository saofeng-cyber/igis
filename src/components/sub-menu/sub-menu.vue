<template src="./sub-menu.html"></template>
<script>
import { Menu } from 'ant-design-vue';
import link from '../link/link.vue';

export default {
  name: 'SubMenu',
  isSubMenu: true,
  components: {
    'ms-link': link
  },
  props: {
    ...Menu.SubMenu.props,
    route: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
