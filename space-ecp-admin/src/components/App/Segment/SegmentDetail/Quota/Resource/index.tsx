import { HTTPError } from '@space/common-http'
import { InfoCircleOutlined, WarningOutlined } from 'infra-design-icons'
import { Card, Modal, Radio, Switch, message } from 'infrad'
import { useContext, useMemo, useState } from 'react'
import { SegmentDetailContext } from 'src/components/App/Segment/SegmentDetail/context'
import ChangeTotalResource from 'src/components/App/Segment/SegmentDetail/Quota/Resource/ChangeTotalResource'
import {
  ActionWrapper,
  EnvWrapper,
  StyledTooltip,
  StyledUsage,
  UsageHeaderWrapper,
  UsagesWrapper,
  ResourceTitleWrapper,
} from 'src/components/App/Segment/SegmentDetail/Quota/Resource/style'
import { StyledTag, Title } from 'src/components/Common/Usage/style'
import { ENV } from 'src/constants/quota'
import { ByteToGiB } from 'src/helpers/unit'
import { quotaController_switchSegmentEnvQuota } from 'src/swagger-api/apis/SegmentQuota'
import { IGetSegmentQuotaResponse } from 'src/swagger-api/models'
import { CSSProperties } from 'styled-components'

export const APPLIED_TIP =
  "The sum of all SDUs' Applied on the segment of the selected environment."

export const ASSIGNED_TIP =
  "The sum of all organizations' quotas on the segment of the selected environment."

export const TOTAL_TIP = 'The total resource on the segment of the selected environment.'

interface IResourceProps {
  style?: CSSProperties
  listSegmentQuota: IGetSegmentQuotaResponse[]
  refreshEnvTotalQuotaList: (env: ENV) => void
  loading?: boolean
}

export interface IResourceItem {
  name: 'CPU' | 'Memory'
  used: number
  applied: number
  total: number
  unit: 'Cores' | 'GiB'
}

const UsageTitle: React.FC<{ title: string; tip: string }> = ({ title, tip }) => (
  <div>
    {title}
    <StyledTooltip title={tip}>
      <InfoCircleOutlined />
    </StyledTooltip>
  </div>
)

const UsageHeader: React.FC<{ title: string; percentage: number; disabled: boolean }> = ({
  title,
  percentage,
  disabled,
}) => {
  let tag = <></>
  if (percentage >= 80) {
    tag = (
      <StyledTag icon={<WarningOutlined />} color={disabled ? 'default' : 'error'}>
        Excessive resources used
      </StyledTag>
    )
  }
  if (percentage <= 30) {
    tag = (
      <StyledTag icon={<WarningOutlined />} color={disabled ? 'default' : 'warning'}>
        Surplus resources used
      </StyledTag>
    )
  }
  return (
    <UsageHeaderWrapper>
      <Title>{title}</Title>
      {tag}
    </UsageHeaderWrapper>
  )
}

const Resource: React.FC<IResourceProps> = ({
  style,
  listSegmentQuota,
  refreshEnvTotalQuotaList,
  loading,
}) => {
  const [selectedEnv, setSelectedEnv] = useState(ENV.LIVE)
  const { azKey = '', segmentKey = '' } = useContext(SegmentDetailContext)

  const envResourceMap = useMemo(() => {
    const map = new Map<
      string,
      {
        items: IResourceItem[]
        enabledQuota: boolean
      }
    >()
    listSegmentQuota.forEach((segmentQuota) => {
      map.set(segmentQuota.env, {
        items: [
          {
            name: 'CPU',
            used: segmentQuota?.cpuApplied,
            applied: segmentQuota?.cpuAssigned,
            total: segmentQuota?.cpuTotal,
            unit: 'Cores',
          },
          {
            name: 'Memory',
            used: ByteToGiB(segmentQuota?.memoryApplied),
            applied: ByteToGiB(segmentQuota?.memoryAssigned),
            total: ByteToGiB(segmentQuota?.memoryTotal),
            unit: 'GiB',
          },
        ],
        enabledQuota: segmentQuota.enabledQuota,
      })
    })
    return map
  }, [listSegmentQuota])

  const selectedSegmentQuota = useMemo(
    () => envResourceMap.get(selectedEnv),
    [envResourceMap, selectedEnv],
  )

  const handleQuotaChange = () => refreshEnvTotalQuotaList(selectedEnv)

  const handleQuotaSwitch = async () => {
    try {
      await quotaController_switchSegmentEnvQuota({
        azKey,
        segmentKey,
        env: selectedEnv,
        payload: {
          switch: !selectedSegmentQuota?.enabledQuota,
        },
      })
      refreshEnvTotalQuotaList(selectedEnv)
      void message.success(selectedSegmentQuota?.enabledQuota ? 'Disabled quota' : 'Enabled quota')
    } catch (error) {
      if (error instanceof HTTPError) {
        await message.error(error.message)
      }
    }
  }

  const handleClickSwitch = () => {
    Modal.confirm({
      title: 'Notification',
      okText: 'Confirm',
      content: selectedSegmentQuota?.enabledQuota
        ? 'Turning off the switch will make the limit disabled, are you sure to turn it off?'
        : 'Turning on the switch will make the limit enable, please make sure your configuration is accurate, are you sure to turn it on?',
      onOk: handleQuotaSwitch,
    })
  }

  const Header = (
    <>
      <ResourceTitleWrapper>Resource</ResourceTitleWrapper>
      <Radio.Group onChange={(e) => setSelectedEnv(e.target.value)} defaultValue={selectedEnv}>
        {Object.values(ENV).map((env) => (
          <Radio.Button value={env} key={env}>
            <EnvWrapper>{env}</EnvWrapper>
          </Radio.Button>
        ))}
      </Radio.Group>
    </>
  )

  return (
    <Card
      title={Header}
      bordered={false}
      style={style}
      loading={loading}
      headStyle={{ padding: '0 24px' }}
      bodyStyle={{ padding: '16px 24px 24px 24px' }}
    >
      <ActionWrapper>
        <div>
          <span style={{ marginRight: '8px' }}>Enable Quota :</span>
          <Switch checked={selectedSegmentQuota?.enabledQuota} onClick={handleClickSwitch} />
        </div>
        <ChangeTotalResource
          resourceList={selectedSegmentQuota?.items || []}
          env={selectedEnv}
          onChanged={handleQuotaChange}
        />
      </ActionWrapper>

      <UsagesWrapper>
        {selectedSegmentQuota?.items?.map((item) => (
          <StyledUsage
            key={item.name}
            title={item.name}
            style={{ padding: '0' }}
            header={
              <UsageHeader
                title={item.name}
                percentage={Math.floor((item.applied / item.total) * 100)}
                disabled={!selectedSegmentQuota.enabledQuota}
              />
            }
            usedPercentage={Math.floor((item.used / item.total) * 100)}
            appliedPercentage={Math.floor((item.applied / item.total) * 100)}
            used={item.used}
            applied={item.applied}
            total={item.total}
            usedTitle={<UsageTitle title="Applied" tip={APPLIED_TIP} />}
            appliedTitle={<UsageTitle title="Assigned Quota" tip={ASSIGNED_TIP} />}
            totalTitle={<UsageTitle title="Total" tip={TOTAL_TIP} />}
            unit={item.unit}
            bordered={false}
            usedColor={selectedSegmentQuota.enabledQuota ? '#4D94EB' : '#8C8C8C'}
            appliedColor={selectedSegmentQuota.enabledQuota ? '#A6D4FF' : '#D9D9D9'}
            totalColor={selectedSegmentQuota.enabledQuota ? '#F5F5F5' : '#F5F5F5'}
          />
        ))}
      </UsagesWrapper>
    </Card>
  )
}

export default Resource
