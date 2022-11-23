import * as React from 'react'
import { Input } from 'infrad'
import {
  StyledSpace,
  ContentCode,
  ContentPanel,
  StyledSpin,
  DownArrow,
  UpArrow,
} from 'src/components/Deployment/PodList/Action/ViewFiles/FileDetail/style'
import { useRequest, useAsyncEffect } from 'ahooks'
import { fetch } from 'src/rapper'
import { VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from 'infra-design-icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import Converter from 'ansi-to-html'
import { FileData, PodData } from 'src/components/Deployment/PodList/Action/ViewFiles'

interface IFileDetaileProps {
  sduName: string
  deployId: string
  podData: PodData
  fileData: FileData
}

export const MAX_CONTENT_LENGTH = 1000000

const FileDetail: React.FC<IFileDetaileProps> = (props) => {
  const { sduName, deployId, podData, fileData } = props
  const { podName, hostIp } = podData || {}
  const { path, size = '0' } = fileData || {}
  const maxBufferSize = Number(size)
  const [searchValue, setSearchValue] = React.useState('')
  const scroll = React.useRef(null)
  const [inverse, setInverse] = React.useState(false)
  const [offset, setOffset] = React.useState(MAX_CONTENT_LENGTH)
  const [done, setDone] = React.useState(false)
  const [fileContent, setFileContent] = React.useState<string[]>([])
  const scrollContent = React.useRef<HTMLDivElement>(null)

  const removeUselessTag = (content: string) =>
    content
      .replace(/<img[^>](?:(?!\/>)[^])*\/*>/g, '')
      .replace(/<script[^>]*>(?:(?!<\/script>)[^])*<\/script>/g, '')
      .replace(/<form[^>]*>(?:(?!<\/form>)[^])*<\/form>/g, '')
      .replace(/<style[^>]*>(?:(?!<\/style>)[^])*<\/style>/g, '')

  const handleSearch = (value: string) => {
    if (searchValue) {
      const highlightWord = renderHighlight(searchValue)
      const originalContent = fileContent?.map((item) => {
        if (item.indexOf(highlightWord) !== -1) {
          return item.replace(new RegExp(highlightWord, 'g'), searchValue)
        }
        return item
      })
      const highlightedContent = highlightKeyword(value, originalContent)
      setFileContent(highlightedContent)
    } else {
      const highlightedContent = highlightKeyword(value, fileContent)
      setFileContent(highlightedContent)
    }
    setSearchValue(value)
  }

  const renderHighlight = (value: string) =>
    `<span class="ecp-cmdb-highlight" style="background-color: #FFBF00; line-height: 18px;">${value}</span>`

  const highlightKeyword = (keyword: string, fileContent: string[]) => {
    if (!keyword) return fileContent
    return fileContent?.map((item) => {
      if (item.indexOf(keyword) !== -1) {
        return item.replace(new RegExp(keyword, 'g'), renderHighlight(keyword))
      }
      return item
    })
  }

  const { loading: getFileDetailLoading, runAsync: getFileContent } = useRequest(
    async (offset: number, length: number) => {
      if (!path) return
      const { fileContent } = await fetch[
        'GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/file:read'
      ]({
        sduName,
        deployId,
        podName,
        hostIp,
        offset,
        length,
        path,
      })

      const content = removeUselessTag(window.atob(fileContent)).split('\n')
      return highlightKeyword(searchValue, content)
    },
    {
      manual: true,
    },
  )

  useAsyncEffect(async () => {
    onScrollTopClick()
    setDone(false)
    setOffset(MAX_CONTENT_LENGTH)
    const data = await getFileContent(0, MAX_CONTENT_LENGTH)
    setFileContent(data)
  }, [getFileContent, sduName, deployId, podName, hostIp, path])

  const fetchMoreLogAbove = React.useCallback(
    async (length?: number): Promise<void> => {
      if (getFileDetailLoading || offset > maxBufferSize) return

      if (offset < 0) {
        setDone(true)
        return
      }
      const data = await getFileContent(offset, length || MAX_CONTENT_LENGTH)
      if (!data) return
      setFileContent((item) => [...item, ...data.reverse()])
      setOffset((item) => (offset === 0 ? -1 : Math.max(item - MAX_CONTENT_LENGTH, 0)))
    },
    [getFileDetailLoading, offset, maxBufferSize, getFileContent],
  )

  const fetchMoreLogBelow = React.useCallback(
    async (length?: number): Promise<void> => {
      if (getFileDetailLoading || offset > maxBufferSize) {
        if (offset > maxBufferSize) setDone(true)
        return
      }

      const data = await getFileContent(offset, length || MAX_CONTENT_LENGTH)
      if (!data) return
      setFileContent((item) => [...item, ...data])
      setOffset((item) => item + MAX_CONTENT_LENGTH)
    },
    [getFileDetailLoading, offset, maxBufferSize, getFileContent],
  )

  const onScrollTopClick = () => {
    setInverse(false)
    scroll.current.el.scrollTop = 0
  }

  const onScrollBottomClick = () => {
    setInverse(true)
    scroll.current.el.scrollTop = scroll.current.el.scrollHeight
  }

  const next = () => {
    inverse ? fetchMoreLogAbove() : fetchMoreLogBelow()
  }

  useAsyncEffect(async () => {
    setFileContent((data) => [...data.reverse()])
    if (done) {
      return
    }
    const initialOffset = inverse ? Math.max(maxBufferSize - MAX_CONTENT_LENGTH, 0) : 0
    const data = await getFileContent(initialOffset, MAX_CONTENT_LENGTH)
    if (inverse) {
      setOffset(Math.max(initialOffset - MAX_CONTENT_LENGTH, 0))
    } else {
      setOffset(initialOffset + MAX_CONTENT_LENGTH)
    }
    if (!data) return
    if ((inverse && initialOffset === 0) || (!inverse && MAX_CONTENT_LENGTH >= maxBufferSize))
      setDone(true)
    setFileContent(inverse ? data.reverse() : data)
  }, [inverse])

  const converter = new Converter()

  return (
    <StyledSpace direction="vertical">
      <Input.Search
        allowClear
        onSearch={handleSearch}
        onPressEnter={(e) => handleSearch(e.currentTarget.value)}
        placeholder="Search"
        style={{ width: '264px' }}
      />
      <ContentPanel>
        <StyledSpin spinning={getFileDetailLoading} size="default" />
        <ContentCode>
          <div id="scroll-content" style={{ height: '100%' }} ref={scrollContent}>
            <InfiniteScroll
              key={inverse ? 'inverse' : 'not-inverse'}
              dataLength={fileContent?.length}
              next={next}
              style={{
                display: 'flex',
                flexDirection: inverse ? 'column-reverse' : 'column',
              }}
              height={scrollContent.current?.clientHeight}
              hasMore={!done}
              ref={scroll}
              scrollableTarget="scroll-content"
              loader={<h4 />}
              inverse={inverse}
            >
              {fileContent?.map((item, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={`${item}/${i}`}>
                  <code dangerouslySetInnerHTML={{ __html: converter.toHtml(item) }} />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </ContentCode>
        {fileContent?.length > 0 && (
          <>
            <DownArrow onClick={onScrollBottomClick}>
              <VerticalAlignBottomOutlined />
            </DownArrow>
            <UpArrow onClick={onScrollTopClick}>
              <VerticalAlignTopOutlined />
            </UpArrow>
          </>
        )}
      </ContentPanel>
    </StyledSpace>
  )
}

export default FileDetail
