import { FormInstance, Input } from 'infrad'
import { useState } from 'react'
import { IResourceItem } from 'src/components/App/Segment/SegmentDetail/Quota/Resource'
import { IChangeTotalForm } from 'src/components/App/Segment/SegmentDetail/Quota/Resource/ChangeTotalResource'
import {
  EditableItem,
  StyledFormItem,
  UnitText,
  UnitWrapper,
  ValueText,
} from 'src/components/App/Segment/SegmentDetail/Quota/Resource/ChangeTotalResource/ChangeValueItem/style'

interface IChangeValueItemProps extends IResourceItem {
  preview?: boolean
  form: FormInstance<IChangeTotalForm>
}

const ChangeValueItem: React.FC<IChangeValueItemProps> = ({
  name,
  applied,
  total,
  unit,
  preview,
  form,
}) => {
  const getFieldValue = (name: string) => parseInt(form.getFieldValue(name) || 0)
  const isError = (inputVal: number) => inputVal < 0 && total + inputVal < applied
  const [extraText, setExtraText] = useState(`=${total}`)

  if (preview) {
    return (
      <td>
        <div>
          <ValueText>{total}</ValueText>
          <UnitText>{unit}</UnitText>
        </div>
        <div>
          <ValueText style={{ color: getFieldValue(name) >= 0 ? '#FF4D4F' : '#52C41A' }}>
            {getFieldValue(name) >= 0 ? `+${getFieldValue(name)}` : getFieldValue(name)}
          </ValueText>
          <UnitText>{unit}</UnitText>
        </div>
        <div>
          <ValueText>={total + getFieldValue(name)}</ValueText>
          <UnitText>{unit}</UnitText>
        </div>
      </td>
    )
  }

  return (
    <EditableItem>
      <div style={{ height: '32px', lineHeight: '32px' }}>{total}</div>
      <StyledFormItem
        name={name}
        initialValue="+0"
        validateFirst
        extra={extraText}
        rules={[
          {
            required: true,
            message: 'Please input your targeted change value',
          },
          {
            validator: (_, changedValue: string) => {
              // validate format
              const isValidFormat = /^[+-]([1-9]\d*|0)$/.test(changedValue)
              if (!isValidFormat) {
                setExtraText('')
                return Promise.reject(new Error('Invalid format'))
              }

              const changedValueNumber = Number(changedValue)
              if (isError(changedValueNumber)) {
                setExtraText('')
                return Promise.reject(
                  `Only ${total - applied} ${unit} unapplied quota can be reduced.`,
                )
              }
              setExtraText(`=${total + changedValueNumber}`)
              return Promise.resolve()
            },
          },
        ]}
      >
        <Input style={{ width: '141px' }} addonAfter={<UnitWrapper>{unit}</UnitWrapper>} />
      </StyledFormItem>
    </EditableItem>
  )
}

export default ChangeValueItem
