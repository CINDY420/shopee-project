import { CenterWrapper } from 'common-styles/flexWrapper'
import { StyledQuestionCircleOutlined, StyledTooltip } from 'components/App/ResourceManagement/Summary/style'
import { ColumnsType } from 'infrad/lib/table'
import React from 'react'

const targetWithTooltip = () => (
  <CenterWrapper>
    Target
    <StyledTooltip placement='top' title='Target = Stock + Increment'>
      <StyledQuestionCircleOutlined />
    </StyledTooltip>
  </CenterWrapper>
)

const ratioWithTooltip = () => (
  <CenterWrapper>
    Ratio
    <StyledTooltip placement='top' title='Ratio = Target/Stock * 100%'>
      <StyledQuestionCircleOutlined />
    </StyledTooltip>
  </CenterWrapper>
)

const subColumns = (parentColumn: string, isDetailSummary: boolean) => {
  const defaultSubColumns: ColumnsType = [
    {
      title: 'Stock',
      dataIndex: `${parentColumn}Stock`,
      width: 90
    },
    {
      title: 'Incremental',
      dataIndex: `${parentColumn}Increment`,
      width: 90
    }
  ]
  const extraSubColumns: ColumnsType = [
    {
      title: targetWithTooltip(),
      dataIndex: `${parentColumn}Target`,
      width: 90
    },
    {
      title: ratioWithTooltip(),
      dataIndex: `${parentColumn}IncrementRatio`,
      width: 90,
      render: (data: number) => (data < 0 ? '-' : data)
    }
  ]
  return isDetailSummary ? defaultSubColumns : defaultSubColumns.concat(extraSubColumns)
}

export const COLUMNS = (isDetailSummary: boolean) => [
  {
    title: 'CPU (Core)',
    width: 360,
    children: subColumns('cpu', isDetailSummary)
  },
  {
    title: 'MEM (GB)',
    dataIndex: 'memory',
    width: 360,
    children: subColumns('mem', isDetailSummary)
  },
  // {
  //   title: 'GPU (Card)',
  //   dataIndex: 'gpu',
  //   width: 360,
  //   children: subColumns('gpu', isDetailSummary)
  // },
  {
    title: 'Pods',
    dataIndex: 'pods',
    width: 360,
    children: subColumns('insCount', isDetailSummary)
  }
]
