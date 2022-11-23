import * as React from 'react'
import { Col, Divider, Form, FormInstance, FormItemProps, Row } from 'infrad'
import ExpandGroupForm from 'components/App/ResourceManagement/common/ResourceTableExpand/ExpandGroupForm'
import { Rule } from 'infrad/lib/form'
import { EVALUATION_METRICS_TYPE } from 'components/App/ResourceManagement/common/ResourceTable/columnGroups'
import { RESOURCE_MANAGEMENT_TYPE } from 'components/App/ResourceManagement'

export enum FormItemType {
  INPUT,
  INPUT_NUMBER,
  SELECT,
  CALCULATED,
  CONDITIONAL_EVALUATION_METRICS_RENDER
}

export interface IGroupFormItem extends FormItemProps {
  label: string
  name: string
  options?: {
    label: string
    key: string
    value: string | number
  }[]
  type?: FormItemType // default to input
  editable?: boolean // default to false
  visible?: boolean // default to true
  dependency?: string // default to undefined
  rules?: Rule[] // default to []
  conditions?: EVALUATION_METRICS_TYPE[] // default to []
  component?: ({ isItemEditing }) => JSX.Element
}

export interface IExpandGroup {
  name: string
  title: string
  flexValue?: string
  items: IGroupFormItem[]
}

interface IData {
  [key: string]: Record<string, string | number>
}

interface IResourceTableExpandProps {
  resourceType: RESOURCE_MANAGEMENT_TYPE
  groups: IExpandGroup[]
  data: IData
  isEditing: boolean
  onGetEditingForm: (form: FormInstance) => void
  height?: string
}

const ResourceTableExpand: React.FC<IResourceTableExpandProps> = ({
  resourceType,
  groups,
  data,
  isEditing,
  onGetEditingForm,
  height
}) => {
  const [form] = Form.useForm()
  React.useEffect(() => {
    if (isEditing) {
      onGetEditingForm(form)
    }
  }, [form, onGetEditingForm, isEditing])
  return (
    <Row
      justify='space-around'
      wrap={false}
      style={{ background: '#FAFAFA', padding: '16px', overflow: 'scroll' }}
      gutter={[16, 8]}
    >
      {groups.map((group, index) => {
        const { title, name, items, flexValue } = group
        const dataSource = data[name]
        return (
          <React.Fragment key={name}>
            <Col
              flex={resourceType === RESOURCE_MANAGEMENT_TYPE.INCREMENTAL ? (index === groups.length - 1 ? 1 : 0) : 1}
            >
              <ExpandGroupForm
                resourceType={resourceType}
                form={form}
                dataSource={dataSource}
                items={items}
                title={title}
                isEditing={isEditing}
                height={height}
                flexValue={flexValue}
              />
            </Col>
            {index === groups.length - 1 ? null : (
              <Col>
                <Divider type='vertical' style={{ color: 'black', height: '100%' }} />
              </Col>
            )}
          </React.Fragment>
        )
      })}
    </Row>
  )
}

export default ResourceTableExpand
