import { atom } from 'recoil'

import { IListPipelines, IPipelineRunHistories, IPipelineRunDetail } from 'api/types/application/pipeline'

export const selectedTenantPipelines = atom<IListPipelines>({
  key: 'selectedTenantPipelines',
  default: {}
})

export const selectedPipeline = atom<IPipelineRunHistories>({
  key: 'selectedPipeline',
  default: {}
})

export const selectedPipelineRun = atom<IPipelineRunDetail>({
  key: 'selectedPipelineRun',
  default: {}
})
