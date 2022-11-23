// https://github.com/visualfanatic/vite-svg/blob/master/packages/vite-plugin-react-svg/index.js

import * as svgr from '@svgr/core'
import { Config } from '@svgr/core'
import { readFileSync } from 'fs'

interface IPluginOptions extends Config {
  defaultExport?: string
}

async function compileSvg(source, id: string, options: Config): Promise<string> {
  const code = await svgr.transform(
    source,
    {
      ...options,
      runtimeConfig: false,
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      jsx: {
        babelConfig: {
          plugins: [
            [
              '@babel/plugin-transform-react-jsx',
              {
                useBuiltIns: true
              }
            ]
          ]
        }
      }
    },
    {
      filePath: id
    }
  )

  return code
}

export default (options: IPluginOptions = {}) => {
  const {
    defaultExport = 'url',
    svgoConfig,
    expandProps,
    svgo,
    ref,
    memo,
    replaceAttrValues,
    svgProps,
    titleProp
  } = options

  const cache: Map<string, unknown> = new Map()
  const svgRegex = /\.svg(?:\?(component|url))?$/

  return {
    name: 'react-svg',
    async transform(source: string, id: string, isBuild: boolean): Promise<unknown> {
      const result: string[] = id.match(svgRegex)

      if (result) {
        const type = result[1]

        if ((defaultExport === 'url' && typeof type === 'undefined') || type === 'url') {
          return source
        }

        if ((defaultExport === 'component' && typeof type === 'undefined') || type === 'component') {
          const idWithoutQuery: string = id.replace('.svg?component', '.svg')
          let result: unknown = cache.get(idWithoutQuery) || ''

          if (!result) {
            const code = readFileSync(idWithoutQuery)

            result = await compileSvg(code, idWithoutQuery, {
              svgoConfig,
              expandProps,
              svgo,
              ref,
              memo,
              replaceAttrValues,
              svgProps,
              titleProp
            })

            if (isBuild) {
              cache.set(idWithoutQuery, result)
            }
          }

          return result
        }
      }
    }
  }
}
