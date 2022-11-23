import * as React from 'react'

import { StyledTable, Text } from './style'

const WildcardTable: React.FC = () => {
  const dataSource = React.useMemo(
    () => [
      {
        name: '{{kube_cluster}}',
        value: [
          'kube-general-ctl-live.k8s.cluster',
          'kube-general-sg2.test.i.devops.shopee.io',
          'kube-general-sg-live.k8s.cluster',
          'kube-ds-sg3-live.k8s.cluster'
        ]
      },
      {
        name: '{{cid}}',
        value: ['sg', 'my', 'ph', 'th', 'vn', 'id', 'tw', 'cn', 'br', 'mx', 'xx']
      },
      {
        name: '{{domain_cid_suffix}}',
        value: ['sg', 'com.my', 'ph', 'co.th', 'vn', 'co.id', 'tw', 'cn', 'com.br', 'com.mx', 'system']
      },
      {
        name: '{{env}}',
        value: ['test', 'stable', 'uat', 'staging', 'liveish', 'live']
      },
      {
        name: '{{domain_env_flag}}',
        value: ['test.', 'test-stable.', 'uat.', 'staging.', 'live-test.', '<empty for live>']
      }
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        title: 'Variable name',
        dataIndex: 'name'
      },
      {
        title: 'Actual value',
        dataIndex: 'value',
        render: variableList => {
          return (
            <>
              {variableList.map(variable => (
                <Text key={variable}>{variable}</Text>
              ))}
            </>
          )
        }
      }
    ],
    []
  )

  return <StyledTable rowKey='name' columns={columns} dataSource={dataSource} pagination={false} />
}

export default WildcardTable
