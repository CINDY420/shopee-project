import { Button, Space } from 'infrad'
import { Root } from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable/ConfirmAction/style'

interface IConfirmActionProps {
  visible: boolean
  confirmDisabled: boolean
  onSave: () => void
  onCancel: () => void
}

const ConfirmAction: React.FC<IConfirmActionProps> = ({
  visible,
  confirmDisabled,
  onSave,
  onCancel,
}) =>
  visible ? (
    <Root>
      <Space size={8}>
        <Button style={{ width: 240 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button style={{ width: 240 }} type="primary" onClick={onSave} disabled={confirmDisabled}>
          Save
        </Button>
      </Space>
    </Root>
  ) : null

export default ConfirmAction
