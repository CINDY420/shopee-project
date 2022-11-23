import { defineConfig, ConfigEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generateAlias from './plugins/generateViteConfigAlias'
import vitePluginReactSvg from './plugins/vitePluginReactSvg'
import releaseNotes from './releaseNotes.json'

// https://vitejs.dev/config/
export default defineConfig(
  ({ command, mode }: ConfigEnv): UserConfig => {
    const config = {
      define: {
        __SERVER_ENV__: JSON.stringify('dev'),
        __RELEASE__: JSON.stringify(releaseNotes.version || 'platform'),
        __IS_LOCAL__: mode === 'development' || mode === 'mock',
        __RELEASE_FEATURES__: JSON.stringify(releaseNotes.features),
        __RELEASE_BUGFIXES__: JSON.stringify(releaseNotes.bugfixes),
        __IS_VITE__: true
      },
      plugins: [react(), vitePluginReactSvg()],
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: generateAlias()
      },
      clearScreen: false,
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: {
              'primary-color': '#2673DD',
              'link-color': '#2673DD',
              'text-color': '#333333',
              'font-family': 'Roboto'
            },
            javascriptEnabled: true
          }
        }
      },
      server: {
        port: 4200,
        proxy: {
          // '/node-gateway': {
          //   target: 'https://bigcompute.infra.test.shopee.io',
          //   changeOrigin: true
          // }
        }
      },
      build: {
        sourcemap: true,
        rollupOptions: {},
        terserOptions: {
          sourceMap: true
        }
      },
      optimizeDeps: {}
    }
    if (command === 'serve') {
      // dev 独有配置
    } else {
      // command === 'build'
      // build 独有配置
    }
    return config
  }
)
