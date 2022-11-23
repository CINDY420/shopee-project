import React from 'react'
import { CaretRightOutlined, CaretDownOutlined } from 'infra-design-icons'
import { Table } from 'common-styles/table'
import { TableProps } from 'infrad/lib/table'
import { RenderExpandIconProps } from 'rc-table/lib/interface.d'
import { StyledComponentWrapper } from './style'

export type IExpandableTable<TRecordType> = Omit<TableProps<TRecordType>, 'expandable'> & {
  Component: React.FC<{ params?: unknown }> | null
}

const ExpandableTable = <TRecordType extends object>(props: IExpandableTable<TRecordType>) => {
  const { Component, ...restProps } = props
  return (
    <Table
      expandable={
        Component
          ? {
              expandedRowRender: (record: unknown, _index, _indent, expanded: boolean) =>
                expanded &&
                Component && (
                  <StyledComponentWrapper>
                    <Component params={record} />
                  </StyledComponentWrapper>
                ),
              expandIcon: ({ expanded, onExpand, record }: RenderExpandIconProps<TRecordType>) =>
                expanded ? (
                  <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                ) : (
                  <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
                ),
            }
          : false
      }
      {...restProps}
    />
  )
}

export default ExpandableTable
