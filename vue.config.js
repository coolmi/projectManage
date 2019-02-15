const vuxLoader = require('vux-loader')
// const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // baseUrl: '/rctb/',
  lintOnSave: false,
  devServer: {
    // port: 10086,
    disableHostCheck: true
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
  },
  configureWebpack: config => {
    vuxLoader.merge(config, {
      options: {},
      plugins: [
        {
          name: 'vux-ui'
        },
        {
          name: 'duplicate-style'
        },
        {
          name: 'less-theme',
          path: 'src/styles/theme.less'
        }
      ]
    })
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
          }),
          new BundleAnalyzerPlugin()
        ]
      }
    }
    // config.plugins = []
  }
}
