import { HTTPError } from '@space/common-http'
import { Button, Form, Input, Modal, Space, TableColumnType, message } from 'infrad'
import { Table } from 'src/common-styles/table'

import React, { useContext, useEffect, useState } from 'react'
import { SegmentDetailContext } from 'src/components/App/Segment/SegmentDetail/context'
import { IResourceItem } from 'src/components/App/Segment/SegmentDetail/Quota/Resource'
import ChangeValueItem from 'src/components/App/Segment/SegmentDetail/Quota/Resource/ChangeTotalResource/ChangeValueItem'
import {
  Block,
  InfoItem,
  InfoWrapper,
} from 'src/components/App/Segment/SegmentDetail/Quota/Resource/ChangeTotalResource/style'
import { ENV } from 'src/constants/quota'
import { GiBToByte } from 'src/helpers/unit'
import { quotaController_updateSegmentQuota } from 'src/swagger-api/apis/SegmentQuota'

export interface IChangeTotalForm extends Record<IResourceItem['name'], number> {
  reason: string
}

interface IChangeTotalResourceProps {
  resourceList: IResourceItem[]
  env: ENV
  onChanged: () => void
}

interface EditableCellProps {
  title: string
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof IResourceItem
  record: IResourceItem
}

const ChangeTotalResource: React.FC<IChangeTotalResourceProps> = ({
  resourceList,
  env,
  onChanged,
}) => {
  const [visible, setVisible] = useState(false)
  const [preview, setPreview] = useState(false)
  const [form] = Form.useForm<IChangeTotalForm>()
  const {
    azKey = '',
    azName = '',
    segmentKey = '',
    segmentName = '',
  } = useContext(SegmentDetailContext)
  const [reason, setReason] = useState('')
  const [changedCPU, setChangedCPU] = useState(0)
  const [changedMemory, setChangedMemory] = useState(0)

  useEffect(() => {
    if (!visible) form.resetFields()
  }, [form, visible])

  const columns: TableColumnType<IResourceItem>[] = [
    {
      title: 'Resource',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Change Value',
      onCell(record) {
        return {
          record,
          title: 'Change Value',
          dataIndex: 'total',
          key: 'total',
          editable: true,
        }
      },
    },
  ]

  const EditableCell: React.FC<EditableCellProps> = ({
    editable,
    children,
    record,
    ...restProps
  }) =>
    editable ? (
      <ChangeValueItem form={form} preview={preview} {...record} />
    ) : (
      <td {...restProps}>{children}</td>
    )

  const handleCancel = () => {
    Modal.confirm({
      title: 'Notification',
      okText: 'Confirm',
      content: 'The change will not take effect, are you sure to cancel?',
      onOk: () => {
        form.resetFields()
        setVisible(false)
        setPreview(false)
      },
    })
  }

  const handleNext = async () => {
    try {
      const values = await form.validateFields()
      setChangedCPU(Number(values?.CPU))
      setChangedMemory(Number(values?.Memory))
      setReason(values.reason)
      setPreview(true)
    } catch (error) {
      setPreview(false)
    }
  }

  const handleComfirm = async () => {
    try {
      await quotaController_updateSegmentQuota({
        azKey,
        segmentKey,
        payload: {
          env,
          addCPU: changedCPU,
          addMemory: GiBToByte(changedMemory),
          reason,
        },
      })
      message.success('Submit successfully!')
      setVisible(false)
      setPreview(false)
      onChanged && onChanged()
    } catch (error) {
      if (error instanceof HTTPError) {
        await message.error(error.message)
      }
    }
  }

  return (
    <>
      <Button onClick={() => setVisible(true)}>Change Total Resource</Button>
      <Modal
        title="Change Total Resource"
        visible={visible}
        centered
        destroyOnClose
        width={680}
        footer={
          preview ? (
            <Space>
              <Button key="Return" onClick={() => setPreview(false)}>
                Return
              </Button>
              <Button key="Cancel" onClick={handleCancel}>
                Cancel
              </Button>
              <Button key="Confirm" type="primary" onClick={handleComfirm}>
                Confirm
              </Button>
            </Space>
          ) : (
            <Space>
              <Button key="Cancel" onClick={handleCancel}>
                Cancel
              </Button>
              <Button key="Next" type="primary" onClick={handleNext}>
                Next
              </Button>
            </Space>
          )
        }
        onCancel={handleCancel}
        maskClosable={false}
      >
        <Form layout="vertical" form={form}>
          {preview && <div style={{ marginBottom: '16px' }}>Preview:</div>}
          <Block>
            <div style={{ fontWeight: 500 }}>Basic Information</div>
            <InfoWrapper>
              <InfoItem style={{ width: '50%' }}>AZ/Segment: {`${azName}/${segmentName}`}</InfoItem>
              <InfoItem style={{ width: '50%' }}>Env: {env}</InfoItem>
            </InfoWrapper>
          </Block>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            rowKey="name"
            columns={columns}
            dataSource={resourceList}
            pagination={false}
          />
          <Form.Item
            name="reason"
            label="Change Reason"
            required={!preview}
            rules={[{ required: true }]}
            style={{ marginTop: '16px' }}
          >
            <Input.TextArea autoSize disabled={preview} showCount maxLength={256} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ChangeTotalResource
