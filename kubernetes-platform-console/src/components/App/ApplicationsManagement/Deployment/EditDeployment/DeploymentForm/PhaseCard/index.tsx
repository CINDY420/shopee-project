import React, { useState } from 'react'
import { Card, Form, Input, Radio, Select } from 'infrad'

import { StyledTitleWrapper, UnitWrapper } from './style'
import { IClusterFlavor } from 'api/types/cluster/cluster'
import { FLAVOR_OPTION } from 'constants/deployment'
import { FTE_CONTAINER_NAME } from 'constants/application'

interface IContainerDetail {
  container: string
  cpuLimit: number
  memLimit: number
}

interface IPhaseCard {
  disable?: boolean
  fieldKey?: number // infrad@4.18.5 no need
  fatherName: number
  flavors: IClusterFlavor[]
  index: number
  containerDetail: IContainerDetail
  canCustomSetFlavor: boolean
}

const PhaseCard: React.FC<IPhaseCard> = ({
  disable,
  fatherName,
  fieldKey,
  flavors,
  index,
  containerDetail,
  canCustomSetFlavor
}) => {
  const Title = (
    <StyledTitleWrapper>
      Container {index + 1}: {containerDetail.container}
    </StyledTitleWrapper>
  )
  const [selectedOption, setSelectedOption] = useState<FLAVOR_OPTION>(FLAVOR_OPTION.DEFAULT_CONFIGURATION)

  const DefaultConfiguration = (
    <>
      <Form.Item label='CPU / Memory' name={[fatherName, 'flavor']}>
        <Select style={{ width: '288px' }} disabled={disable || containerDetail.container === FTE_CONTAINER_NAME}>
          {flavors.map(({ cpu, memory }) => {
            const flavor = `${cpu} Cores/${memory} GiB`
            const flavorText = `${cpu} Cores/${memory} GiB`
            return (
              <Select.Option key={flavor} value={flavor}>
                {flavorText}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>
    </>
  )

  const CustomSetting = (
    <>
      <Form.Item
        label='CPU'
        fieldKey={[fieldKey, 'cpu']}
        name={[fatherName, 'cpuLimit']}
        rules={[
          {
            type: 'number',
            min: 0,
            transform: val => Number(val),
            message: 'cpu must be a positive number'
          }
        ]}
      >
        <Input suffix={<UnitWrapper>Cores</UnitWrapper>} disabled={disable} />
      </Form.Item>
      <Form.Item
        label='Memory'
        style={{ marginLeft: '8px' }}
        fieldKey={[fieldKey, 'mem']}
        name={[fatherName, 'memLimit']}
        rules={[
          {
            type: 'number',
            min: 0,
            transform: val => Number(val),
            message: 'memory must be a positive number'
          }
        ]}
      >
        <Input suffix={<UnitWrapper>GiB</UnitWrapper>} disabled={disable} />
      </Form.Item>
    </>
  )

  const FlavorOptionsMap = {
    [FLAVOR_OPTION.DEFAULT_CONFIGURATION]: DefaultConfiguration,
    [FLAVOR_OPTION.CUSTOM_SETTING]: CustomSetting
  }
  return (
    <Card title={Title} style={{ backgroundColor: '#f6f6f6', marginBottom: '10px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Form.Item name={[fatherName, 'flavorOption']}>
          <Radio.Group
            defaultValue={FLAVOR_OPTION.DEFAULT_CONFIGURATION}
            onChange={e => setSelectedOption(e.target.value)}
            disabled={disable}
          >
            <Radio value={FLAVOR_OPTION.DEFAULT_CONFIGURATION}>Default Configuration</Radio>
            <Radio value={FLAVOR_OPTION.CUSTOM_SETTING} disabled={!canCustomSetFlavor}>
              Custom Setting
            </Radio>
          </Radio.Group>
        </Form.Item>
      </div>
      <div style={{ display: 'flex' }}>{FlavorOptionsMap[selectedOption]}</div>
    </Card>
  )
}

export default PhaseCard
