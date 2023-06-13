const devServerPort = 5175;
const name = '智能导诊前端代码';
module.exports = {
  parallel: false,
  publicPath: process.env.VUE_APP_BASE_URL,
  productionSourceMap: false,
  transpileDependencies: [],
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    progress: false,
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [],
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1DA57A',
            'link-color': '#1DA57A',
            'border-radius-base': '6px',
            'box-shadow-base': '0 2px 16px 4px rgba(0, 0, 0, 0.15)',

          },
          javascriptEnabled: true,
        },
      },
    },
  },
  chainWebpack(config) {
    config.set('name', name);

    // https://webpack.js.org/configuration/devtool/#development
    config.when(process.env.NODE_ENV === 'development', (config) =>
      config.devtool('cheap-eval-source-map')
    );

    // remove vue-cli-service's progress output
    config.plugins.delete('progress');
    // replace with another progress output plugin to solve the this bug:
    // https://github.com/vuejs/vue-cli/issues/4557
    config
      .plugin('simple-progress-webpack-plugin')
      .use(require.resolve('simple-progress-webpack-plugin'), [
        {
          format: 'compact',
        },
      ]);

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
          },
        },
      });
      config.optimization.runtimeChunk('single');
    });
  },
};
