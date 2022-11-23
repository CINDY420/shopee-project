import { CONFIG_FILE_TYPE } from '@infra-node-kit/config'
import { resolve } from 'path'

export const InfraConfig = {
  config: {
    loadEnvConfig: {
      enable: true,
    },
    isGlobal: true,
    configMap: [
      {
        namespace: 'ecpGlobalConfig',
        filePath:
          process.env.NODE_ENV === 'local'
            ? resolve(process.cwd(), 'src/configs/global-config.yaml')
            : '/etc/global-config/global-config.yaml',
        fileType: CONFIG_FILE_TYPE.YAML,
      },
    ],
  },
  logger: true,
  context: true,
  filter: {
    custom: true,
    http: true,
    unknow: true,
  },
  interceptor: {
    standardResponse: true,
  },
  middleware: {
    accessLog: true,
  },
  apm: {
    prom: false,
  },
}
