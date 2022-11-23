import React from 'react'
import { StyledCascader } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/CopyRuleModal/DeploymentSelector/style'
import { Alert, Form, Divider, Button, Row, Col, Tag } from 'infrad'
import { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { HorizontalDivider, VerticalDivider } from 'common-styles/divider'
import { IAzSdu } from 'swagger-api/v1/models'
import { FormInstance } from 'infrad/lib/form'

interface IDeploymentSelectorProps {
  form: FormInstance
  allAzSdus: IAzSdu[]
  selectedAzSdus: IAzSdu[]
  onSelectDeploymentChange: () => void
  onSelectAll: () => void
  onClearCascader: () => void
}

const DeploymentSelector: React.FC<IDeploymentSelectorProps> = ({
  form,
  allAzSdus,
  selectedAzSdus,
  onSelectDeploymentChange: handleSelectDeploymentChange,
  onSelectAll: handleSelectAll,
  onClearCascader: handleClearCascader
}) => {
  const options = allAzSdus.map(item => {
    const currentAzSdusCount = item.sdus.length

    const currentSelectedAzSdus = selectedAzSdus.find(electedAzSdu => {
      return electedAzSdu.azName === item.azName
    })

    const currentSelectedAzSdusCount = currentSelectedAzSdus !== undefined ? currentSelectedAzSdus.sdus.length : 0

    return {
      label: (
        <Row justify='space-between' wrap={false} style={{ width: '200px' }} key={item.azName}>
          <div>{item.azName}</div>
          <div>{`(${currentSelectedAzSdusCount}/${currentAzSdusCount})`}</div>
        </Row>
      ),
      value: item.azName,
      children: item.sdus.map(sdu => ({
        label: <div style={{ width: '200px' }}>{sdu.sduName}</div>,
        value: sdu.sduName
      }))
    }
  })

  const tagRender = (props: CustomTagProps) => {
    const { closable, onClose, value } = props
    const onPreventMouseDown = event => {
      event.preventDefault()
      event.stopPropagation()
    }
    const tagText = value.split('__')[value.split('__').length - 1]
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, marginTop: 4, height: 24 }}
        key={value}
      >
        {tagText}
      </Tag>
    )
  }

  const dropdownRender = (menus: React.ReactElement) => {
    let allAzSdusCount = 0
    let selectedAzSdusCount = 0

    allAzSdus.forEach(azSdus => {
      allAzSdusCount += azSdus.sdus.length
    })

    selectedAzSdus.forEach(selectedAzSdus => {
      selectedAzSdusCount += selectedAzSdus.sdus.length
    })

    return (
      <div style={{ width: '500px' }}>
        {menus}
        <Divider style={{ margin: 0, padding: 0 }} />
        <VerticalDivider size='12px' />
        <Row align='middle'>
          <HorizontalDivider size='16px' />
          <Col>
            <Button onClick={handleSelectAll}>Select All</Button>
          </Col>
          <HorizontalDivider size='8px' />
          <Col>
            <Button onClick={handleClearCascader}>Clear</Button>
          </Col>
          <HorizontalDivider size='23px' />
          <Row>
            <Col style={{ color: '#2673DD' }}>
              {selectedAzSdusCount}/{allAzSdusCount}
            </Col>
            <HorizontalDivider size='8px' />
            <Col>deployment selected</Col>
          </Row>
        </Row>
        <VerticalDivider size='12px' />
      </div>
    )
  }

  return (
    <>
      <Alert message='HPA Rules will be overwritten if exist.' type='warning' showIcon />
      <VerticalDivider size='32px' />
      <Form
        form={form}
        labelCol={{
          span: 8
        }}
      >
        <Form.Item label='Deployment' name='deployment'>
          <StyledCascader
            options={options}
            placeholder='Please select deployment'
            tagRender={tagRender}
            style={{ width: '100%' }}
            onChange={handleSelectDeploymentChange}
            multiple
            dropdownRender={dropdownRender}
            placement='topLeft'
          />
        </Form.Item>
      </Form>
    </>
  )
}

export default DeploymentSelector
