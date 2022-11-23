import * as React from 'react'
import * as R from 'ramda'
import { Empty } from 'infrad'
import ReactResizeDetector from 'react-resize-detector'
import EventAlert from './EventAlert'

import { IIDeploymentDetailResponseDto } from 'swagger-api/v3/models'
import { Cycle } from 'common-styles/cycle'
import { HorizontalDivider, VerticalDivider, HorizontalLine, VerticalLine } from 'common-styles/divider'
import { selectedDeployment } from 'states/applicationState/deployment'
import { useRecoilValue } from 'recoil'

import {
  OverviewWrapper,
  OverviewTitle,
  BarWrapper,
  Bars,
  BarItem,
  LineWrapper,
  LineItem,
  LineText,
  LabelWrapper,
  AbnormalLabel,
  Label,
  LableItem,
  Status,
  Number,
  NormalLabel
} from './style'

const deploymentStatusColorMap = {
  'Running | Unhealthy': '#D22525',
  Error: '#EE4D2D',
  CrashLoopBackOff: '#FF8C36',
  Other: '#F6D564',
  'Running | Healthy': '#6FC9CA'
}

const calculatePercentage = (deploymentDetail: IIDeploymentDetailResponseDto) => {
  const { normalPod = 0, abnormalPod } = deploymentDetail
  const { runningUnhealth = 0, error = 0, crashBackOff = 0, other = 0 } = abnormalPod || {}
  const abnormalTotal = runningUnhealth + error + crashBackOff + other
  const total = normalPod + abnormalTotal

  let runningUnhealthPercentage = Math.ceil((runningUnhealth / total) * 100)
  let errorPercentage = Math.ceil((error / total) * 100)
  let crashLoopBackOffPercentage = Math.ceil((crashBackOff / total) * 100)
  let otherPercentage = Math.ceil((other / total) * 100)
  let healthyPercentage = Math.ceil((normalPod / total) * 100)
  let unhealthyPercentage = runningUnhealthPercentage + errorPercentage + crashLoopBackOffPercentage + otherPercentage

  if (unhealthyPercentage + healthyPercentage > 100) {
    const num = unhealthyPercentage + healthyPercentage - 100
    const maxNum = Math.max(
      runningUnhealthPercentage,
      errorPercentage,
      crashLoopBackOffPercentage,
      otherPercentage,
      healthyPercentage
    )

    switch (maxNum) {
      case runningUnhealthPercentage:
        runningUnhealthPercentage -= num
        break
      case errorPercentage:
        errorPercentage -= num
        break
      case crashLoopBackOffPercentage:
        crashLoopBackOffPercentage -= num
        break
      case otherPercentage:
        otherPercentage -= num
        break
      case healthyPercentage:
        healthyPercentage -= num
        break
    }

    unhealthyPercentage = runningUnhealthPercentage + errorPercentage + crashLoopBackOffPercentage + otherPercentage
  } else {
    healthyPercentage = 100 - unhealthyPercentage
  }

  return {
    runningUnhealthPercentage,
    errorPercentage,
    crashLoopBackOffPercentage,
    otherPercentage,
    healthyPercentage,
    unhealthyPercentage
  }
}

const PodStatus: React.FC = () => {
  const lineRef = React.useRef<HTMLDivElement>()
  const [unhealthyLineWidth, setUnhealthyLineWidth] = React.useState(0)
  const [healthyLineWidth, setHealthyLineWidth] = React.useState(0)

  const deploymentDetail = useRecoilValue(selectedDeployment)
  const { normalPod = 0, abnormalPod } = deploymentDetail
  const { runningUnhealth = 0, error = 0, crashBackOff = 0, other = 0 } = abnormalPod || {}
  const abnormalTotal = runningUnhealth + error + crashBackOff + other
  const total = normalPod + abnormalTotal

  const result = calculatePercentage(deploymentDetail)
  const {
    runningUnhealthPercentage,
    errorPercentage,
    crashLoopBackOffPercentage,
    otherPercentage,
    unhealthyPercentage,
    healthyPercentage
  } = result

  const podBarMap = {
    'Running | Unhealthy': runningUnhealthPercentage,
    Error: errorPercentage,
    CrashLoopBackOff: crashLoopBackOffPercentage,
    Other: otherPercentage,
    'Running | Healthy': healthyPercentage
  }

  const podLabelMap = {
    'Running | Unhealthy': runningUnhealth,
    Error: error,
    CrashLoopBackOff: crashBackOff,
    Other: other,
    'Running | Healthy': normalPod
  }

  const keys = Object.keys(podBarMap)
  const abnormalKeys = keys.filter(item => !R.equals(item, 'Running | Healthy'))
  const normalKeys = keys.filter(item => R.equals(item, 'Running | Healthy'))

  const handleLineResize = React.useCallback(() => {
    if (lineRef.current && lineRef.current.clientWidth) {
      const width = lineRef.current.clientWidth
      setUnhealthyLineWidth((unhealthyPercentage * width) / 100)
      setHealthyLineWidth((healthyPercentage * width) / 100)
    }
  }, [healthyPercentage, unhealthyPercentage])

  React.useEffect(() => {
    handleLineResize()
  }, [handleLineResize])

  return (
    <OverviewWrapper>
      <OverviewTitle>Pod Status</OverviewTitle>
      <VerticalDivider size='32px' />
      {total ? (
        <>
          <BarWrapper>
            <Bars>
              {keys.map((item: string, index: number) => {
                const percentage = podBarMap[item]
                if (percentage) {
                  return (
                    <BarItem
                      key={`${item}-${index}`}
                      width={`${percentage}%`}
                      backgroundColor={deploymentStatusColorMap[item]}
                    >{`${percentage}%`}</BarItem>
                  )
                }
                return <></>
              })}
            </Bars>
            <VerticalDivider size='8px' />
            <ReactResizeDetector handleWidth onResize={handleLineResize}>
              <LineWrapper ref={lineRef}>
                {unhealthyPercentage ? (
                  <LineItem width={`${unhealthyPercentage}%`}>
                    <HorizontalLine color='#dcdcdc' />
                    <VerticalLine color='#dcdcdc' />
                    <HorizontalLine color='#dcdcdc' />
                    {unhealthyLineWidth > 77 ? <LineText className='lineText'>Abnormal</LineText> : null}
                  </LineItem>
                ) : null}
                {healthyPercentage ? (
                  <LineItem width={`${healthyPercentage}%`}>
                    {!unhealthyPercentage && <HorizontalLine color='#dcdcdc' />}
                    <VerticalLine color='#dcdcdc' />
                    <HorizontalLine color='#dcdcdc' />
                    {healthyLineWidth > 77 ? <LineText className='lineText'>Normal</LineText> : null}
                  </LineItem>
                ) : null}
              </LineWrapper>
            </ReactResizeDetector>
          </BarWrapper>
          <VerticalDivider size='24px' />
          <LabelWrapper>
            <AbnormalLabel>
              <Label>Abnormal</Label>
              {abnormalKeys.map((item: string, index: number) => (
                <React.Fragment key={`${item}-${index}`}>
                  <HorizontalDivider size='16px' />
                  <LableItem>
                    <Cycle background={deploymentStatusColorMap[item]} />
                    <HorizontalDivider size='8px' />
                    <Status>{`${item}：`}</Status>
                    <Number>{podLabelMap[item]}</Number>
                  </LableItem>
                </React.Fragment>
              ))}
            </AbnormalLabel>
            <NormalLabel>
              <Label>Normal</Label>
              {normalKeys.map((item: string, index: number) => (
                <React.Fragment key={`${item}-${index}`}>
                  <HorizontalDivider size='16px' />
                  <LableItem>
                    <Cycle background={deploymentStatusColorMap[item]} />
                    <HorizontalDivider size='8px' />
                    <Status>{`${item}：`}</Status>
                    <Number>{podLabelMap[item]}</Number>
                  </LableItem>
                </React.Fragment>
              ))}
            </NormalLabel>
          </LabelWrapper>
          {abnormalTotal > 0 && <EventAlert isRunningUnHealth={runningUnhealth > 0} />}
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '16px 0' }} />
      )}
    </OverviewWrapper>
  )
}

export default PodStatus
