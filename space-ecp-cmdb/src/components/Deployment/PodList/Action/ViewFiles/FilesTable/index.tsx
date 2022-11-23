import * as React from 'react'
import { Alert, Button, Space } from 'infrad'
import { Table } from 'src/common-styles/table'
import useTable from 'src/hooks/useTable'
import { Params } from 'ahooks/lib/useAntdTable/types'
import { getTableProps } from 'src/helpers/tableProps'
import { fetch, useRequest } from 'src/rapper'
import { TABLE_PAGINATION_OPTION } from 'src/constants/pagination'
import { FileData, PodData } from 'src/components/Deployment/PodList/Action/ViewFiles'
import { ColumnsType } from 'infrad/lib/table'
import { formatFileSize } from 'src/helpers/formatFileSize'
import { formatTime } from 'src/helpers/format'

interface IFilesTableProps {
  modalVisible: boolean
  sduName: string
  deployId: string
  podData: PodData
  onSelectFile: (file: FileData) => void
}

const MAX_DOWNLOAD_SIZE = 1000000000
const MAX_DOWNLOAD_LENGTH = 100000000

const FilesTable: React.FC<IFilesTableProps> = (props) => {
  const { modalVisible, sduName, deployId, podData, onSelectFile } = props
  const { podName, hostIp } = podData || {}
  const [downloadingFile, setDownloadingFile] = React.useState('')

  const columns: ColumnsType<FileData> = [
    {
      title: 'Log File',
      dataIndex: 'name',
    },
    {
      title: 'Mode',
      dataIndex: 'modStr',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      render: (size) => formatFileSize(Number(size)),
    },
    {
      title: 'Update Time',
      dataIndex: 'modTime',
      sorter: true,
      render: (time) => formatTime(Number(time)),
    },
    {
      title: 'Action',
      render: (_: unknown, record) => (
        <Space direction="vertical" size={0}>
          <Button
            type="link"
            onClick={() => downloadFile(record)}
            disabled={parseInt(record.size) > MAX_DOWNLOAD_SIZE || parseInt(record.size) <= 0}
            style={{ padding: 0 }}
            loading={downloadLoading && record.name === downloadingFile}
          >
            Download
          </Button>
          <Button
            type="link"
            onClick={() => onSelectFile(record)}
            disabled={parseInt(record.size) <= 0}
            style={{ padding: 0 }}
          >
            Detail
          </Button>
        </Space>
      ),
    },
  ]

  const { runAsync: downloadFile, loading: downloadLoading } = useRequest(
    async (file: FileData) => {
      setDownloadingFile(file.name)
      const { fileContent } = await fetch[
        'GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/file:read'
      ]({
        sduName,
        deployId,
        podName,
        hostIp,
        offset: 0,
        length: MAX_DOWNLOAD_LENGTH,
        path: file?.path,
      })
      const content = window.atob(fileContent)
      const blob = new Blob([content])
      const fileDownloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = fileDownloadUrl
      link.setAttribute('download', file?.name)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    },
    {
      manual: true,
    },
  )

  const { tableProps } = useTable(
    (args) =>
      getFileList(args, {
        sduName,
        podName,
      }),
    {
      refreshDeps: [sduName, podName, modalVisible],
    },
  )

  const getFileList = async (
    { current, pageSize, filters, sorter }: Params[0],
    params: { sduName: string; podName: string },
  ) => {
    if (!modalVisible) return
    const { podName, sduName } = params

    const { offset, limit, filterBy, orderBy } = getTableProps({
      pagination: { current, pageSize },
      filters,
      sorter,
    })

    const { items, total } = await fetch[
      'GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/files'
    ]({
      sduName,
      deployId,
      podName,
      hostIp,
      offset,
      limit,
      filterBy,
      orderBy,
    })

    return {
      list: items || [],
      total: total || 0,
    }
  }

  return (
    <Space direction="vertical" size={10} style={{ display: 'flex' }}>
      <Alert
        message="Logs download is only allowed for file size smaller than 1GB."
        type="info"
        showIcon
      />
      <Table
        {...tableProps}
        rowKey="path"
        columns={columns}
        pagination={{
          ...TABLE_PAGINATION_OPTION,
          ...tableProps?.pagination,
          showTotal: null,
        }}
        scroll={{ x: 'max-content' }}
      />
    </Space>
  )
}

export default FilesTable
