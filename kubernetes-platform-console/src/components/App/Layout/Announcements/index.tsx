import React from 'react'
import { Alert } from 'infrad'
import { TextLoop } from 'react-text-loop-next'
import useAsyncFn from 'hooks/useAsyncFn'
import { globalControllerListAnnouncements } from 'swagger-api/v1/apis/Global'

interface IAnnouncementsProps {
  tenant?: number
  closable?: boolean
}

const Announcements: React.FC<IAnnouncementsProps> = ({ tenant, closable = true }) => {
  const [announcementsState, announcementsFetch] = useAsyncFn(globalControllerListAnnouncements)

  React.useEffect(() => {
    announcementsFetch({ tenant })
  }, [announcementsFetch, tenant])

  const loading = announcementsState.loading
  const announcements = announcementsState?.value?.announcements || []
  const total = announcementsState?.value?.total || 0

  return total === 0 || loading ? null : (
    <Alert
      banner
      message={
        <TextLoop mask>
          {announcements.map(announcement => {
            return <div key={announcement}>{announcement}</div>
          })}
        </TextLoop>
      }
      closable={closable}
    />
  )
}

export default Announcements
