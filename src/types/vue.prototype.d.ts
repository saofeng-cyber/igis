import Vue from 'vue';
// vue全局挂载并提示
declare module 'vue/types/vue' {
  interface Vue {
    $config: {
      name: string;
    };
  }
}
