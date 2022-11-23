import React from 'react'
import {
  StyleCard,
  StyleColKey,
  StyleColValue,
  StyleRow,
  StyleTabs,
  StyledRoot,
  StyleTabPane,
} from 'components/App/OperationHistory/HistoryDetail/style'
import { operationControllerGetOperationRecord } from 'swagger-api/apis/Operation'
import { IGetOperationRecordResponse } from 'swagger-api/models'
import DiffContent from 'components/Common/DiffContent'
import { message } from 'infrad'

interface IHistoryDetailProps {
  operationRecordId: string
}
interface ITabContents {
  originPayload: React.ReactNode
  payload: React.ReactNode
  diff: React.ReactNode
}

const OPERATION = [
  { displayName: 'Description', key: 'description' },
  { displayName: 'Operator', key: 'operator' },
  { displayName: 'Category', key: 'category' },
  { displayName: 'Operation', key: 'operation' },
]
const DIFF_TAB = [
  { displayName: 'Original', key: 'originPayload' },
  { displayName: 'Changed', key: 'payload' },
  { displayName: 'Diff', key: 'diff' },
]

const formatPayload = (payload?: string) => {
  let result = ''
  try {
    result = payload ? JSON.stringify(JSON.parse(payload), null, 2) : ''
  } catch (error) {
    message.error('Payload is not a standard object')
  }
  return result
}

const HistoryDetail: React.FC<IHistoryDetailProps> = ({ operationRecordId }) => {
  const [details, setDetails] = React.useState<IGetOperationRecordResponse>()
  const [tabContents, setTabContents] = React.useState<ITabContents>()

  const getHistoryDetail = async () => {
    try {
      const data = await operationControllerGetOperationRecord({ operationRecordId })
      setDetails(data)
      setTabContents({
        originPayload: formatPayload(data?.originPayload) || '--',
        payload: formatPayload(data?.payload) || '--',
        diff: (
          <DiffContent
            oldStr={formatPayload(data?.originPayload)}
            newStr={formatPayload(data?.payload)}
          />
        ),
      })
    } catch (error) {
      message.error(error?.message)
    }
  }

  React.useEffect(() => {
    getHistoryDetail()
  }, [operationRecordId])
  return (
    <StyledRoot>
      <StyleCard title="Operation" bordered={false}>
        {OPERATION.map((item) => (
          <StyleRow key={item.displayName}>
            <StyleColKey>{item.displayName}</StyleColKey>
            <StyleColValue>{details?.[item.key] || '--'}</StyleColValue>
          </StyleRow>
        ))}
      </StyleCard>
      <StyleCard title="Diff" bordered={false}>
        <StyleTabs type="card">
          {DIFF_TAB.map((item) => (
            <StyleTabPane key={item.key} tab={item.displayName}>
              <pre>{tabContents?.[item.key]}</pre>
            </StyleTabPane>
          ))}
        </StyleTabs>
      </StyleCard>
    </StyledRoot>
  )
}

export default HistoryDetail
