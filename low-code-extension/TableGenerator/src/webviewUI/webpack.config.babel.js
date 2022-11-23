import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'

const cssUse = [MiniCssExtractPlugin.loader].concat('css-loader')
const cssUseDebug = ['style-loader', 'css-loader']

export default (env = {}, argv) => {
  const isProductionMode = argv.mode === 'production'
  return {
    target: 'web',
    entry: {
      app: ['./src/index.tsx']
    },
    output: {
      // filename: isProductionMode ? '[name].[hash].js' : '[name].js',
      path: path.resolve(__dirname, '../../distWebview/'),
      // chunkFilename: '[name].[hash].js',
      publicPath: '/'
    },
    optimization: {
      chunkIds: 'named',
      minimizer: [
        new TerserPlugin({
          parallel: true
        })
      ]
      // splitChunks: {
      //   chunks: 'all'
      // }
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
          test: /\.less$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  modifyVars: {
                    'primary-color': '#2673DD',
                    'link-color': '#2673DD'
                  },
                  javascriptEnabled: true
                }
              }
            }
          ]
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
          test: /\.(png|jpg|gif|woff2|svg?)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    plugins: [
      new CleanWebpackPlugin(),
      // !isProductionMode &&
      new ForkTsCheckerWebpackPlugin({
        reportFiles: ['src/**/*.{ts,tsx}']
      }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: isProductionMode ? 'production' : 'development'
      }),
      new webpack.DefinePlugin({
        __SERVER_ENV__: JSON.stringify(env.server || 'dev')
        // __RELEASE__: JSON.stringify(releaseNotes.version || 'platform')
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: path.resolve(__dirname, './src/favicon.ico'),
        inject: true,
        minify: {
          html5: true,
          minifyCSS: false,
          minifyJS: false,
          removeComments: false,
          collapseWhitespace: false,
          preserveLineBreaks: true
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: isProductionMode ? '[name].[hash].css' : '[name].css',
        chunkFilename: isProductionMode ? '[id].[hash].css' : '[id].css'
      })
    ],
    devServer: {
      historyApiFallback: {
        disableDotRule: true
      },
      hot: true,
      compress: true,
      port: 5000
    },
    devtool: isProductionMode ? false : 'source-map'
  }
}
