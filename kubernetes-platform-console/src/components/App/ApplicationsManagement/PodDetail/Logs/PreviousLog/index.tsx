import React, { useState, useEffect, useCallback } from 'react'
import LogContent from '../../Common/LogDirectoryList/LogText/LogContent'
import { podsControllerGetLogPrevousLog } from 'swagger-api/v3/apis/Pods'
import { IPod } from 'api/types/application/pod'
import { Result } from 'infrad'

import { HTTPError } from 'helpers/fetch'

import { Root, HeaderWrapper, SearchInput } from './style'

interface IPreviousLog {
  selectedPod: IPod
  selectedContainer: string
}

const PreviousLog: React.FC<IPreviousLog> = ({ selectedPod, selectedContainer }) => {
  const [searchedWord, setSearchedWord] = useState<string>()
  const [logs, setLogs] = useState<string>()
  const [finished, setFinished] = useState(true)
  const [error, setError] = useState<HTTPError>()

  const { tenantId, projectName, appName, name, clusterId } = selectedPod
  const getPreviousContainerLogFn = useCallback(async () => {
    try {
      setFinished(false)
      const logsResponse = await podsControllerGetLogPrevousLog({
        tenantId,
        projectName,
        appName,
        podName: name,
        clusterId,
        containerName: selectedContainer
      })
      const { logString } = logsResponse || {}
      setLogs(logString)
    } catch (err) {
      setError(err)
    }
    setFinished(true)
  }, [appName, clusterId, name, projectName, selectedContainer, tenantId])

  useEffect(() => {
    getPreviousContainerLogFn()
  }, [getPreviousContainerLogFn])

  return (
    <Root>
      <HeaderWrapper>
        <SearchInput placeholder='input search text' enterButton onSearch={value => setSearchedWord(value)} />
      </HeaderWrapper>
      {error ? (
        <Result
          status='error'
          title='Error'
          subTitle={error.message || 'Your pod encountered some problems during deployment.'}
        />
      ) : (
        <LogContent
          tryAgain={() => {
            getPreviousContainerLogFn()
          }}
          logs={logs}
          isLogFinished={finished}
          isError={false}
          keyWord={searchedWord}
        />
      )}
    </Root>
  )
}

export default PreviousLog
