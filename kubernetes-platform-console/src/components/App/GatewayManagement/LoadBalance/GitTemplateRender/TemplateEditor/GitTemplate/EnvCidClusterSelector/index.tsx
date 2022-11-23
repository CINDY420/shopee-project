import * as React from 'react'
import { Row, Col, Select } from 'infrad'

import { ENVS } from '../../index'
import useAsyncFn from 'hooks/useAsyncFn'
import { IGetInfoResponseDto } from 'swagger-api/v3/models'
import { loadBalanceControllerGetInfo } from 'swagger-api/v3/apis/LoadBalances'

import { StyledSpan } from './style'

interface IProps {
  selectedEnv: ENVS
  defaultValue: IGetInfoResponseDto
  onCidsEnvsClustersChange: (value: IGetInfoResponseDto) => void
}

const EnvCidClusterSelector: React.FC<IProps> = ({ selectedEnv, defaultValue, onCidsEnvsClustersChange }) => {
  const [getInfoState, getInfoFn] = useAsyncFn(loadBalanceControllerGetInfo)
  const [cidsEnvsClusters, setCidsEnvsClusters] = React.useState<IGetInfoResponseDto>(defaultValue)

  React.useEffect(() => {
    getInfoFn({ type: selectedEnv })
  }, [getInfoFn, selectedEnv])

  const isLoading = getInfoState.loading
  const value = getInfoState.value || {}

  const handleChange = React.useCallback((key, value) => {
    setCidsEnvsClusters(previousState => {
      return {
        ...previousState,
        [key]: value
      }
    })
  }, [])

  React.useEffect(() => {
    onCidsEnvsClustersChange(cidsEnvsClusters)
  }, [cidsEnvsClusters, onCidsEnvsClustersChange])

  const options = React.useMemo(
    () => [
      {
        key: 'envs',
        label: 'ENV',
        value: value.envs || []
      },
      {
        key: 'cids',
        label: 'CID',
        value: value.cids || []
      },
      {
        key: 'clusters',
        label: 'Cluster',
        value: value.clusters || []
      }
    ],
    [value.cids, value.clusters, value.envs]
  )

  return (
    <Row gutter={[24, 24]} align='middle'>
      {options.map(option => {
        const { label, value, key } = option
        return (
          <Col key={key}>
            <Row gutter={16} align='middle'>
              <Col>
                <StyledSpan>{label}</StyledSpan>
              </Col>
              <Col>
                <Select
                  allowClear
                  mode='multiple'
                  loading={isLoading}
                  style={{ minWidth: '200px' }}
                  placeholder={`Select ${label}`}
                  options={value.map(data => ({ label: data, value: data }))}
                  value={cidsEnvsClusters[key]}
                  onChange={value => handleChange(key, value)}
                />
              </Col>
            </Row>
          </Col>
        )
      })}
    </Row>
  )
}

export default EnvCidClusterSelector
