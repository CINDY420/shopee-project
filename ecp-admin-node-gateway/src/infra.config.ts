import { CONFIG_FILE_TYPE } from '@infra-node-kit/config'
import { resolve } from 'path'

export const InfraConfig = {
  config: {
    loadEnvConfig: {
      enable: true,
    },
    configMap: [
      {
        namespace: 'ecpGlobalConfig',
        filePath:
          process.env.NODE_ENV === 'local'
            ? resolve(process.cwd(), 'src/configs/config.yaml')
            : '/etc/configs/config.yaml',
        fileType: CONFIG_FILE_TYPE.YAML,
      },
    ],
    isGlobal: true,
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
