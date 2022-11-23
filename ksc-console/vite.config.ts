import { defineConfig, ConfigEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactSvgPlugin from 'vite-plugin-react-svg'
import generateAlias from './plugins/generateViteConfigAlias'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const config = {
    define: {
      'process.env.__SERVER_ENV__': JSON.stringify('dev'),
      'process.env.__RELEASE__': JSON.stringify('platform'),
      'process.env.__IS_LOCAL__': mode === 'development' || mode === 'mock'
    },
    plugins: [react(), reactSvgPlugin()],
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
    optimizeDeps: {},
    envDir: 'config'
  }
  if (command === 'serve') {
    // dev 独有配置
  } else {
    // command === 'build'
    // build 独有配置
  }
  return config
})
