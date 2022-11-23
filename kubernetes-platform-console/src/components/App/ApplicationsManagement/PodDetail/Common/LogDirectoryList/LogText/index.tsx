/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import LogContent from './LogContent'

import { Input } from 'infrad'

import { podsControllerGetPodContainerFileLog } from 'swagger-api/v3/apis/Pods'
import { FlexWrapper } from 'common-styles/flexWrapper'
import useAsyncFn from 'hooks/useAsyncFn'

import { Root, HeaderRoot, HeaderTip, HeaderSearch } from './style'

interface ILogs {
  content: string
}
interface IDirectoryList {
  fileName: string
  containerName: string
  backList: (fileName: string) => void
  selectedPod: any
}

const LogText: React.FC<IDirectoryList> = props => {
  const { fileName, backList, selectedPod, containerName } = props
  const [searchText, setSearchText] = React.useState('')
  const [logs, setLogs] = React.useState<ILogs>()
  const [isLogFinished, setIsLogFinished] = React.useState(false)
  const [apiResult, getLogTextApiFn] = useAsyncFn(podsControllerGetPodContainerFileLog)
  const { tenantId, projectName, appName, name: podName, clusterId } = selectedPod

  const handleClick = () => {
    backList('')
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const getLogText = async () => {
    const result = await getLogTextApiFn({
      tenantId,
      projectName,
      appName,
      podName,
      containerName,
      clusterId,
      fileName: encodeURIComponent(fileName),
      searchBy: searchText
    })
    setLogs(result)
    setIsLogFinished(true)
  }

  React.useEffect(() => {
    getLogText()
  }, [searchText])

  return (
    <Root>
      <HeaderRoot>
        <FlexWrapper justifyContent='space-between'>
          <HeaderTip>
            <a onClick={handleClick}>Back to list</a>
            <span>{fileName}</span>
          </HeaderTip>
          <HeaderSearch>
            <Input.Search placeholder='input search text' enterButton onSearch={handleSearch} />
          </HeaderSearch>
        </FlexWrapper>
      </HeaderRoot>
      <LogContent
        tryAgain={() => {
          getLogText()
        }}
        logs={logs?.content}
        isLogFinished={isLogFinished}
        isError={!!apiResult.error}
        keyWord={searchText}
      />
    </Root>
  )
}

export default LogText
