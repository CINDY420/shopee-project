import * as React from 'react'
import { Alert, AlertProps } from 'infrad'
import { TextLoop } from 'react-text-loop-next'
import { fetch } from 'src/rapper'

const LoopNotice: React.FC<AlertProps> = (props) => {
  const [announcements, setAnnouncements] = React.useState<string[]>([])
  const getAnnouncements = React.useCallback(async () => {
    const { announcements } = await fetch['GET/api/ecp-cmdb/announcements']()
    setAnnouncements(announcements ?? [])
  }, [])

  React.useEffect(() => {
    void getAnnouncements()
  }, [getAnnouncements])

  return (
    announcements.length !== 0 && (
      <Alert
        {...props}
        banner
        message={
          <TextLoop mask>
            {announcements.map((message) => (
              <div key={new Date().getTime()}>{message}</div>
            ))}
          </TextLoop>
        }
      />
    )
  )
}

export default LoopNotice
