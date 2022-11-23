import React from 'react'
import DetailLayout from 'src/components/Common/DetailLayout'
import { Breadcrumb, Tag } from 'infrad'
import { CLUSTER } from 'src/constants/routes/routes'
import { CollapsibleSpace } from '@infra/components'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { parseSecretId, buildClusterDetailRoute, buildSecretDetailRoute } from 'src/helpers/route'
import { timestampToLocalTime } from 'src/helpers/time'

import { eksClusterController_getClusterDetail } from 'src/swagger-api/apis/EksCluster'
import { eksSecretController_getEksSecret } from 'src/swagger-api/apis/EksSecret'
import { useRequest } from 'ahooks'
import SecretDetailTable from 'src/components/App/Cluster/ClusterDetail/Configuration/SecretDetail/SecretDetailTable'

const StyledTag = styled(Tag)`
  margin: 0;
`

const SecretDetail: React.FC = () => {
  const { clusterId, secretId } = useParams<Record<string, string>>()
  const { namespace, secretName } = parseSecretId(secretId)

  const { data: clusterDetail } = useRequest(() =>
    eksClusterController_getClusterDetail({ clusterId: Number(clusterId) }),
  )
  const { data: secretDetail } = useRequest(() =>
    eksSecretController_getEksSecret({ clusterId, namespace, secretName }),
  )

  const { type, updateTime, labels = [] } = secretDetail || {}

  const breadcrumb = (
    <Breadcrumb>
      <Breadcrumb.Item>
        <a href={CLUSTER}>Cluster List</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <a href={buildClusterDetailRoute({ clusterId })}>Cluster: {clusterDetail?.clusterName}</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <a href={buildSecretDetailRoute({ clusterId, namespace, secretName })}>
          Secret: {secretName}
        </a>
      </Breadcrumb.Item>
    </Breadcrumb>
  )

  const tabs = [
    {
      name: 'Details',
      Component: SecretDetailTable,
      props: {
        namespace,
        secretName,
      },
    },
  ]

  return (
    <DetailLayout
      title={secretName}
      breadcrumb={breadcrumb}
      descriptionItems={[
        {
          label: 'Namespace',
          text: namespace || '-',
        },
        {
          label: 'Type',
          text: type || '-',
        },
        {
          label: 'Update Time',
          text: updateTime ? timestampToLocalTime(updateTime) : '-',
        },
        {
          label: 'Label',
          text:
            labels.length > 0 ? (
              <CollapsibleSpace wrap size={[2, 8]}>
                {labels.map((label) => (
                  <StyledTag key={label}>{label}</StyledTag>
                ))}
              </CollapsibleSpace>
            ) : (
              <>-</>
            ),
        },
      ]}
      tabs={tabs}
    />
  )
}

export default SecretDetail
