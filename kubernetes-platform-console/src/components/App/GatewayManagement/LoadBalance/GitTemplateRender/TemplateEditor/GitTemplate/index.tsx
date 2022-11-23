import * as React from 'react'

import { ENVS } from '../index'
import { IGetInfoResponseDto } from 'swagger-api/v3/models'

import TemplateTextAreas from './TemplateTextAreas'
import EnvCidClusterSelector from './EnvCidClusterSelector'

interface IProps {
  selectedEnv: ENVS
}

const GitTemplate: React.FC<IProps> = ({ selectedEnv }) => {
  const localStorageKey = `Load Balance Env-Cid-Cluster ${selectedEnv}`
  const defaultCidsEnvsClusters = JSON.parse(window.localStorage.getItem(localStorageKey)) || {}

  const [cidsEnvsClusters, setCidsEnvsClusters] = React.useState<IGetInfoResponseDto>(defaultCidsEnvsClusters)

  const handleCidsEnvsClustersChange = React.useCallback((value: IGetInfoResponseDto) => {
    setCidsEnvsClusters(value)
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(cidsEnvsClusters))
  }, [cidsEnvsClusters, localStorageKey])

  return (
    <div style={{ marginTop: '24px' }}>
      <EnvCidClusterSelector
        selectedEnv={selectedEnv}
        defaultValue={cidsEnvsClusters}
        onCidsEnvsClustersChange={handleCidsEnvsClustersChange}
      />
      <TemplateTextAreas selectedEnv={selectedEnv} cidsEnvsClusters={cidsEnvsClusters} />
    </div>
  )
}

export default GitTemplate
