import * as React from 'react'
import { Table, Alert, Typography } from 'infrad'
import useMountedState from 'hooks/useMountedState'
import LogText from './LogText'
import useAsyncFn from 'hooks/useAsyncFn'

import { formatTime } from 'helpers/format'
import { podsControllerGetLogDirectory } from 'swagger-api/v3/apis/Pods'
import { IGetLogDirectoryResponseDto } from 'swagger-api/v3/models'
import { useQueryParam } from 'use-query-params'
import { POD_DETAIL_TABS } from 'components/App/ApplicationsManagement/PodDetail'
import { generateLogPlatformLink } from 'helpers/routes'
import * as bytes from 'bytes'

const { Link } = Typography

interface IDirectoryList {
  currentContainer: any
  selectedPod: any
}

const DirectoryList: React.FC<IDirectoryList> = props => {
  const [fileName, setFileName] = React.useState('')
  const [data, setData] = React.useState<IGetLogDirectoryResponseDto>()
  const { currentContainer, selectedPod } = props
  const [apiResult, getLogListFn] = useAsyncFn(podsControllerGetLogDirectory)
  const { tenantId, projectName, appName, name: podName, clusterId } = selectedPod
  const [, setSelectedTab] = useQueryParam<string>('selectedTab')

  const getMounted = useMountedState()

  const chooseFile = (fileName: string) => {
    setFileName(fileName)
  }

  const columns = [
    {
      title: 'Log File',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Last Updated At',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (time: string) => formatTime(time)
    },
    {
      title: 'File Size',
      dataIndex: 'filesSize',
      key: 'fileSize'
    },
    {
      title: 'Action',
      dataIndex: 'filesSize',
      key: 'fileSize',
      render: (fileSize, item) => {
        const fileSizeWithFullUnit = `${fileSize}B`
        const maximumFileSize = '2GB'

        if (bytes(fileSizeWithFullUnit) > bytes(maximumFileSize)) {
          return (
            <a href={logPlatformLink} target='_blank' rel='noreferrer'>
              go to logging platform
            </a>
          )
        } else {
          return <a onClick={() => chooseFile(item.name)}>Detail</a>
        }
      }
    }
  ]

  React.useEffect(() => {
    getLogListFn({ tenantId, projectName, appName, podName, clusterId, containerName: currentContainer }).then(data => {
      if (getMounted()) {
        setData(data)
        setFileName('')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContainer])

  const logPlatformLink = generateLogPlatformLink({ clusterId, projectName, appName })

  return (
    <>
      {fileName ? (
        <LogText fileName={fileName} backList={chooseFile} selectedPod={selectedPod} containerName={currentContainer} />
      ) : (
        <>
          <Alert
            message={
              <div>
                If the log file is too large, please download it in the{' '}
                <Link onClick={() => setSelectedTab(POD_DETAIL_TABS.TERMINAL)}>terminal</Link> or view it through the{' '}
                <a href={logPlatformLink} target='_blank' rel='noreferrer'>
                  {' '}
                  logging platform
                </a>
                .
              </div>
            }
            type='info'
            showIcon
            style={{ margin: '24px 0' }}
          />
          <div style={{ height: 'calc(100% - 122px)', overflow: 'auto' }}>
            <Table
              rowKey='name'
              columns={columns}
              dataSource={data?.files}
              pagination={false}
              loading={apiResult.loading}
            />
          </div>
        </>
      )}
    </>
  )
}

export default DirectoryList
