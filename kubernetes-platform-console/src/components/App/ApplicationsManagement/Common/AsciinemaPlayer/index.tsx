import React from 'react'
import { StyledSpin, StyledDiv, StyledPlayer } from 'components/App/ApplicationsManagement/Common/AsciinemaPlayer/style'
import 'asciinema-player/resources/public/css/asciinema-player.css'

const loadAsciinemaPlayer = () => {
  window.React = React
  __IS_VITE__ && __IS_LOCAL__ ? import('asciinema-player') : require('asciinema-player')
}

loadAsciinemaPlayer()

type AsciinemaPlayerProps = {
  data: string
  loading?: boolean
  speed?: number
}

const AsciinemaPlayer: React.FC<AsciinemaPlayerProps> = ({ data, speed, loading = false }) => {
  const playerRef = React.useRef<HTMLDivElement>(null)

  const parseDataToJsonArray = (str: string) => {
    const lines = str.split('\r\n')
    const jsonArray = lines.filter(line => !!line).map(line => JSON.parse(line))

    return jsonArray
  }

  const renderPlayer = React.useCallback(
    async (ref: HTMLDivElement) => {
      data &&
        window.asciinema.player.js.CreatePlayer(ref, parseDataToJsonArray(data), {
          speed,
          fontSize: 12,
          autoPlay: true
        })
    },
    [data, speed]
  )

  React.useEffect(() => {
    const currentPlayerRef = playerRef.current
    renderPlayer(currentPlayerRef)

    return () => {
      window.asciinema.player.js.UnmountPlayer(currentPlayerRef)
    }
  }, [renderPlayer])

  return (
    <StyledDiv>
      <StyledSpin spinning={loading} />
      <StyledPlayer ref={playerRef} />
    </StyledDiv>
  )
}

export default AsciinemaPlayer
