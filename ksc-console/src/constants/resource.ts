export interface IResource {
  before: string
  suffix: string
  key: string
}

export const RESOURCE_CONFIG_LIST: Array<IResource> = [
  {
    before: 'CPU',
    suffix: 'Cores',
    key: 'cpu',
  },
  {
    before: 'Memory',
    suffix: 'GiB',
    key: 'memory',
  },
  {
    before: 'GPU',
    suffix: 'Units',
    key: 'gpu',
  },
]

export enum RESOURCE_INDICATORS {
  USED = 'Used',
  ASSIGNED = 'Assigned',
  QUOTA = 'Quota',
  USAGE = 'Usage',
}

export const RESOURCE_FORM_RULES = {
  cpu: [
    {
      required: true,
      message: 'Please input cpu',
    },
    {
      validator: (_, value) => {
        if (value && Number(value) > 0) {
          return Promise.resolve()
        }
        return Promise.reject(new Error('The value should be larger than 0'))
      },
    },
  ],
  memory: [
    {
      required: true,
      message: 'Please input cpu',
    },
    {
      validator: (_, value) => {
        if (value && Number(value) > 0) {
          return Promise.resolve()
        }
        return Promise.reject(new Error('The value should be larger than 0'))
      },
    },
  ],
  gpu: [],
}
