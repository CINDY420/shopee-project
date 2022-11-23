import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import HandleSourceMapPlugin from './plugins/handleSourcemap'

import * as releaseNotes from './releaseNotes.json'

// package for Sentry
import SentryWebpackPlugin from '@sentry/webpack-plugin'

const cssUse = [MiniCssExtractPlugin.loader].concat('css-loader')
const cssUseDebug = ['style-loader', 'css-loader']

export default (env = {}, argv) => {
  const isProductionMode = argv.mode === 'production'
  // Enable sentry in test, staging or live environment
  const shouldUseSentry = isProductionMode && env.server === 'live'
  const isLocal = env.isLocal
  const isGitlabCI = env.cypress === 'test'
  return {
    target: 'web',
    entry: {
      app: ['./src/index.tsx']
    },
    output: {
      filename: isProductionMode ? '[name].[hash].js' : '[name].js',
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: '[name].[hash].js',
      publicPath: '/'
    },
    optimization: {
      minimizer: [new TerserPlugin({
        parallel: true,
        sourceMap: true
      })]
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: true
            }
          }
        },
        {
          test: /\.css$/,
          use: isProductionMode ? cssUse : cssUseDebug
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'babel-loader'
            },
            {
              loader: '@svgr/webpack',
              options: {
                babel: false,
                icon: true
              }
            }
          ]
        },
        {
          // filter out .antd.svg image which is used for antd Icon
          test: /^(?!.*\.antd\.svg$)(?=.*\.(png|jpg|gif|woff2|svg?)$)/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader' // translates CSS into CommonJS
          }, {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              javascriptEnabled: true,
              modifyVars: {
                'primary-color': '#2673DD',
                'link-color': '#2673DD',
                'text-color': '#333333',
                'font-family': 'Roboto'
              }
            }
          }]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    plugins: [
      !isProductionMode && new ForkTsCheckerWebpackPlugin({
        reportFiles: ['src/**/*.{ts,tsx}']
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: isProductionMode ? 'production' : 'development'
      }),
      new webpack.DefinePlugin({
        __SERVER_ENV__: JSON.stringify(env.server || 'dev'),
        __RELEASE__: JSON.stringify(releaseNotes.version || 'platform'),
        __IS_LOCAL__: isLocal,
        __RELEASE_FEATURES__: JSON.stringify(releaseNotes.features),
        __RELEASE_BUGFIXES__: JSON.stringify(releaseNotes.bugfixes),
        __IS_VITE__: true
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: path.resolve(__dirname, './src/favicon.ico')
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: isProductionMode ? '[name].[hash].css' : '[name].css',
        chunkFilename: isProductionMode ? '[id].[hash].css' : '[id].css'
      }),
      // Upload source map to sentry3
      shouldUseSentry && new SentryWebpackPlugin({
        // webpack specific configuration
        configFile: '.sentryclirc',
        include: './dist',
        ignore: ['node_modules', 'webpack.config.babel.js'],
        debug: true,
        deploy: {
          env: env.server
        },
        release: releaseNotes.version
      }),
      shouldUseSentry && new HandleSourceMapPlugin()
    ].filter(plugin => plugin),
    devServer: {
      historyApiFallback: {
        disableDotRule: true
      },
      hot: !isGitlabCI,
      compress: true,
      port: 4200
      // proxy: {
      //   '/api': {
      //     target: 'https://kubernetes.devops.i.sz.shopee.io',
      //     changeOrigin: true,
      //     secure: false
      //   },
      // }
    },
    externals: {
      releaseNotes: JSON.stringify(require('./releaseNotes.json'))
    },
    devtool: isProductionMode ? (shouldUseSentry ? 'source-map' : '(none)') : 'source-map'
  }
}
