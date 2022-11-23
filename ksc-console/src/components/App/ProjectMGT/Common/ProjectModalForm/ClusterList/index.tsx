import * as React from 'react'
import ClusterTable from 'components/App/ProjectMGT/Common/ProjectModalForm/ClusterList/ClusterTable'
import { VerticalDivider, HorizontalDivider } from 'common-styles/divider'
import { StyledCheckbox } from 'components/App/ProjectMGT/Common/ProjectModalForm/ClusterList/style'
import { Row, Form } from 'infrad'
import { IFormattedClusters } from 'components/App/ProjectMGT/Common/ProjectModalForm'

interface IClusterListProps {
  clusterId: string
  clusterItem: IFormattedClusters
}

const ClusterList: React.FC<IClusterListProps> = ({ clusterId, clusterItem }) => {
  const form = Form.useFormInstance()
  const [isClusterChecked, setIsClusterChecked] = React.useState(false)
  const [isClusterCheckIndeterminate, setIsClusterCheckIndeterminate] = React.useState(false)
  const envQuotas = Form.useWatch(['clusters', clusterId, 'envQuotas'], form) ?? []

  React.useEffect(() => {
    const checkedEnvs = envQuotas.filter((item) => item.isEnvChecked)
    if (envQuotas.length > 0 && checkedEnvs.length === envQuotas.length) {
      setIsClusterChecked(true)
      setIsClusterCheckIndeterminate(false)
    } else if (checkedEnvs.length > 0) {
      setIsClusterChecked(false)
      setIsClusterCheckIndeterminate(true)
    } else {
      setIsClusterChecked(false)
      setIsClusterCheckIndeterminate(false)
    }
  }, [envQuotas])

  const handleClusterCheckChange = (clusterId: string, checked: boolean) => {
    const clusters = form.getFieldValue('clusters')
    clusters[clusterId].envQuotas.forEach((item) => {
      item.isEnvChecked = checked
    })
    form.setFieldsValue({ clusters })
  }

  return (
    <>
      <Form.Item noStyle>
        <StyledCheckbox
          checked={isClusterChecked}
          indeterminate={isClusterCheckIndeterminate}
          onChange={(e) => handleClusterCheckChange(clusterId, e.target.checked)}
        >
          {clusterItem.clusterName}
        </StyledCheckbox>
        <VerticalDivider size="8px" />
        <Row>
          <HorizontalDivider size="24px" />
          <Form.List name={['clusters', clusterId, 'envQuotas']}>
            {(fields) => <ClusterTable fields={fields} clusterId={clusterId} />}
          </Form.List>
        </Row>
      </Form.Item>
    </>
  )
}

export default ClusterList
