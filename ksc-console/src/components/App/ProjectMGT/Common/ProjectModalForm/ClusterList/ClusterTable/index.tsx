import * as React from 'react'
import { Checkbox, Form, Row, Input, Col, Tag } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import {
  StyledTable,
  StyledInput,
  QuotaContentWrapper,
  QuotaItemWrapper,
  QuotaName,
} from 'components/App/ProjectMGT/Common/ProjectModalForm/ClusterList/ClusterTable/style'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { IEnvQuotas } from 'components/App/ProjectMGT/Common/ProjectModalForm'
import { gcd } from 'helpers/utils'

const QUOTA_MAPS = [
  {
    quotaName: 'CPU',
    unit: 'Cores',
    displayName: 'cpu',
  },
  {
    quotaName: 'Memory',
    unit: 'GiB',
    displayName: 'memory',
  },
  {
    quotaName: 'GPU',
    unit: 'Units',
    displayName: 'gpu',
  },
]
interface IPercentage {
  cpu: number
  memory: number
}
interface IClusterTableProps {
  fields: FormListFieldData[]
  clusterId: string
}
const ClusterTable: React.FC<IClusterTableProps> = ({ fields, clusterId }) => {
  const form = Form.useFormInstance()
  const [percentage, setPercentage] = React.useState<IPercentage>()
  const envQuotas: IEnvQuotas[] = form.getFieldValue(['clusters', clusterId, 'envQuotas'])

  React.useEffect(() => {
    if (envQuotas) {
      const percentage = envQuotas.reduce(
        (result: IPercentage, current) => {
          const { cpu, memory } = result
          const { isEnvChecked, quota } = current
          if (isEnvChecked) {
            return {
              cpu: cpu + Number(quota.cpu),
              memory: memory + Number(quota.memory),
            }
          }
          return result
        },
        {
          cpu: 0,
          memory: 0,
        },
      )
      const gcdNumber = gcd(percentage.cpu, percentage.memory)
      setPercentage({
        cpu: gcdNumber === 0 ? 0 : percentage.cpu / gcdNumber,
        memory: gcdNumber === 0 ? 0 : percentage.memory / gcdNumber,
      })
    }
  }, [envQuotas, clusterId])

  const columns: ColumnsType<FormListFieldData> = [
    {
      title: 'Environment',
      dataIndex: 'env',
      render: (_, record) => (
        <Form.Item noStyle>
          <Row align="middle">
            <Form.Item name={[record.name, 'isEnvChecked']} valuePropName="checked" noStyle>
              <Checkbox />
            </Form.Item>
            <Form.Item name={[record.name, 'env']} noStyle>
              <Input readOnly bordered={false} style={{ color: '#000000', width: '80px' }} />
            </Form.Item>
          </Row>
        </Form.Item>
      ),
    },
    {
      title: (
        <Row justify="space-between">
          <Col>Resource Applied (Quota)</Col>
          <Col>
            {percentage && (
              <Tag>
                CPU : Memory = {percentage.cpu} : {percentage.memory}
              </Tag>
            )}
          </Col>
        </Row>
      ),
      dataIndex: 'quota',
      render: (_, record) => (
        <Form.Item noStyle>
          <QuotaContentWrapper>
            {QUOTA_MAPS.map((quotaItem) => (
              <QuotaItemWrapper key={quotaItem.quotaName}>
                <QuotaName>{quotaItem.quotaName}</QuotaName>
                <Form.Item name={[record.name, 'quota', quotaItem.displayName]} noStyle>
                  <StyledInput
                    width="160px"
                    type="number"
                    suffix={quotaItem.unit}
                    bordered={false}
                  />
                </Form.Item>
              </QuotaItemWrapper>
            ))}
          </QuotaContentWrapper>
        </Form.Item>
      ),
    },
  ]

  return <StyledTable bordered columns={columns} pagination={false} dataSource={fields} />
}

export default ClusterTable
