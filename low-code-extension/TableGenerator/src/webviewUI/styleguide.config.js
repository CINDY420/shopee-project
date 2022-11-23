const path = require('path')

const webpackConfig = {
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
        use: ['style-loader', 'css-loader']
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
  }
}

module.exports = {
  usageMode: 'expand',
  pagePerSection: true,
  exampleMode: 'expand',
  // skipComponentsWithoutExample: true,
  webpackConfig,
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json').parse,
  compilerConfig: {
    target: { ie: 11 },
    transforms: {
      modules: false,
      // to make async/await work by default (no transformation)
      asyncAwait: false
    }
  },
  sections: [
    {
      name: 'Typedoc',
      external: true,
      href: 'http://localhost:6060/docs/'
    },
    {
      name: 'Components',
      components: [
        'src/components/Common/*/*.tsx',
        'src/components/Common/Charts/Area/*.tsx',
        'src/components/Common/Charts/Doughnut/*.tsx',
        'src/components/Common/Charts/NestedDoughnut/*.tsx'
      ]
    }
  ]
}
