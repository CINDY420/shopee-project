import React, { useCallback, useEffect } from 'react'

import { FREEZE_PIPELINES_STATUS } from 'constants/pipeline'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'

import {
  freezesControllerListReleaseFreezes,
  freezesControllerStopReleaseFreeze
} from 'swagger-api/v3/apis/ReleaseFreezes'
import { IListReleaseFreezes, IReleaseFreezeDetail } from 'api/types/application/pipeline'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'

import { Table } from 'common-styles/table'
import { VerticalDivider } from 'common-styles/divider'
import { StyledButton } from 'components/App/PipelinesManagement/ReleaseFreezes/FreezesTable/style'
import { SyncOutlined, HourglassOutlined, CheckCircleOutlined } from 'infra-design-icons'
import { Modal, message } from 'infrad'
import TooltipEllipsis from 'components/Common/TooltipEllipsis'
import FreezeDrawer from 'components/App/PipelinesManagement/ReleaseFreezes/FreezeDrawer'

const { confirm } = Modal

interface IFreezeTable {
  drawerVisible: boolean
  onHideDrawer: () => void
  selectedFreeze: IReleaseFreezeDetail
  showEditDrawer: (freeze?: IReleaseFreezeDetail) => void
  canEdit: boolean
  canStop: boolean
}

const FreezeTable: React.FC<IFreezeTable> = ({
  drawerVisible,
  onHideDrawer,
  selectedFreeze,
  showEditDrawer,
  canEdit,
  canStop
}) => {
  const getFreezeListFnWithResource = useCallback(args => {
    const { offset, limit } = args
    return freezesControllerListReleaseFreezes({ offset, limit })
  }, [])

  const [getFreezeListState, getFreezeListFn] = useAsyncIntervalFn<IListReleaseFreezes>(getFreezeListFnWithResource)

  const { value, loading } = getFreezeListState
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: getFreezeListFn })

  const { releaseFreezeList = [], total = 0 } = value || {}

  useEffect(() => {
    refresh()
  }, [refresh])

  const renderStatus = (status: string) => {
    switch (status) {
      case FREEZE_PIPELINES_STATUS.FREEZING:
        return (
          <div style={{ color: '#55CC77' }}>
            <SyncOutlined /> {FREEZE_PIPELINES_STATUS.FREEZING}
          </div>
        )
      case FREEZE_PIPELINES_STATUS.APPROACHING:
        return (
          <div style={{ color: '#333333' }}>
            <HourglassOutlined /> {FREEZE_PIPELINES_STATUS.APPROACHING}
          </div>
        )
      case FREEZE_PIPELINES_STATUS.COMPLETED:
        return (
          <div style={{ color: '#999999' }}>
            <CheckCircleOutlined /> {FREEZE_PIPELINES_STATUS.COMPLETED}
          </div>
        )
      case FREEZE_PIPELINES_STATUS.STOPPED:
        return (
          <div style={{ color: '#999999' }}>
            <CheckCircleOutlined /> {FREEZE_PIPELINES_STATUS.STOPPED}
          </div>
        )
      default:
        return <div>-</div>
    }
  }

  const handleStopFreeze = async (releaseFreezeId: string) => {
    try {
      await freezesControllerStopReleaseFreeze({ releaseFreezeId })
      message.success('Stop release freeze successfully!')
      refresh()
    } catch (err) {
      err.message && message.error(err.message)
    }
  }

  const showAbortConfirm = (id: string) => {
    confirm({
      title: 'Notice',
      content: 'Are you sure you want to stop this release freeze?',
      icon: null,
      okText: 'Confirm',
      cancelText: 'Cancel',
      autoFocusButton: null,
      onOk() {
        return handleStopFreeze(id)
      }
    })
  }

  const columns = [
    {
      title: 'ENV',
      key: 'env',
      dataIndex: 'env'
    },
    {
      title: 'Time Slot',
      key: 'timeSlot',
      dataIndex: 'timeSlot',
      render: (_, record: IReleaseFreezeDetail) => (
        <>
          {renderStatus(record.status)}
          {`${record.startTime} - ${record.endTime}`}
        </>
      )
    },
    {
      title: 'Last Execute',
      key: 'updatedBy',
      dataIndex: 'updatedBy',
      render: (updatedBy: string, record: IReleaseFreezeDetail) => (
        <>
          <div>{updatedBy || record.createdBy || '-'}</div>
          <div style={{ color: '#999999' }}>{record.updatedAt || record.createdAt || '-'}</div>
        </>
      )
    },
    {
      title: 'Reason',
      key: 'reason',
      dataIndex: 'reason',
      render: (reason: string) => <TooltipEllipsis title={reason} maxWidth='260px' largeScreenMaxWidth='700px' />
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: IReleaseFreezeDetail) => {
        const { id, status } = record
        if (status === FREEZE_PIPELINES_STATUS.FREEZING || status === FREEZE_PIPELINES_STATUS.APPROACHING) {
          return (
            <>
              <StyledButton type='link' onClick={() => showEditDrawer(record)} disabled={!canEdit}>
                Edit
              </StyledButton>
              <VerticalDivider size='0' />
              <StyledButton type='link' onClick={() => showAbortConfirm(id)} disabled={!canStop}>
                Stop
              </StyledButton>
            </>
          )
        } else {
          return <span style={{ paddingLeft: 5 }}>-</span>
        }
      }
    }
  ]

  return (
    <>
      <Table
        columns={columns}
        rowKey='id'
        dataSource={releaseFreezeList}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...pagination,
          total
        }}
        padding='16px'
      />
      <FreezeDrawer
        visible={drawerVisible}
        onHideDrawer={onHideDrawer}
        selectedFreeze={selectedFreeze}
        onRefresh={refresh}
      />
    </>
  )
}

export default FreezeTable
