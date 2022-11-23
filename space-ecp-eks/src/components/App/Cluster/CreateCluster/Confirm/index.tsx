import React from 'react'
import { Divider, Tag, Space, Checkbox } from 'infrad'
import { Root, CertificateWrapper } from 'src/components/App/Cluster/CreateCluster/Confirm/style'
import SubCard, { ISubCardProps } from 'src/components/App/Cluster/CreateCluster/Common/SubCard'
import LabelValueList, {
  IItem,
} from 'src/components/App/Cluster/CreateCluster/Confirm/LabelValueList'
import { IServerForm, IBasicInfoForm } from 'src/components/App/Cluster/CreateCluster/constant'
import { buildIPV4, parseNameIdtValue } from 'src/components/App/Cluster/CreateCluster/helper'

const StyledCard: React.FC<Omit<ISubCardProps, 'titleStyle'>> = ({ title, children }) => (
  <SubCard
    title={title}
    titleStyle={{ fontSize: '16px', fontWeight: 500, lineHeight: '24px', padding: '4px 0 28px 0' }}
  >
    {children}
  </SubCard>
)

interface IConfirmProps {
  previewValue: IServerForm & IBasicInfoForm
}

const enableTextRender = (enable: boolean) => (enable ? 'enable' : 'disable')

const Confirm: React.FC<IConfirmProps> = ({ previewValue }) => {
  const { resourceInfo, serverList, clusterSpec, etcd, networkingModel, clusterNetwork, advance } =
    previewValue || {}
  const { service = [], azSegment = [], env, templateId } = resourceInfo || {}
  const { clusterName, platform } = clusterSpec || {}
  const { masterIPs = [], workIPs = [] } = serverList || {}
  const { IPs: etcdIps = [], authority, certification, key } = etcd || {}
  const { enableVpcCNI, vpc, anchorServer } = networkingModel || {}
  const { serviceCidrBlock, podCidrBlock, nodeMask } = clusterNetwork || {}
  const {
    enableDragonfly,
    enableGPU,
    apiServerExtraArgs = [],
    controllerManagementExtraArgs = [],
    schedulerExtraArgs = [],
    eventEtcd,
    enableLog,
    enableMonitoring,
    enableBromo,
  } = advance || {}

  const [tenantName, productValue] = service
  const { name: productName } = parseNameIdtValue(productValue)
  const [az, segment] = azSegment
  const { name: azName } = parseNameIdtValue(az)
  const { name: segmentName } = parseNameIdtValue(segment)
  const { name: platformName } = parseNameIdtValue(platform)

  const basicInfoItems: IItem[] = [
    { label: 'Service Name', value: `${tenantName}${productName && ` / ${productName}`}` },
    {
      label: 'AZ/Segment',
      value: (
        <span>
          {azName}[{segmentName}]
        </span>
      ),
    },
    { label: 'Env', value: env },
    { label: 'Cluster Name', value: clusterName },
    { label: 'Platform', value: platformName },
    { label: 'Template', value: templateId },
  ]
  const nodeItems: IItem[] = [
    { label: 'Masters Number', value: masterIPs.length },
    { label: 'Workers Number', value: workIPs.length },
  ]
  const etcdCertificateItems: IItem[] = [
    { label: 'SSL Certificate Authority file', value: authority },
    { label: 'Client SSL certification file', value: certification },
    { label: 'Client SSL key file', value: key },
  ]
  const networkingModelItems: IItem[] = [
    {
      label: 'Networking Model',
      value: (
        <span>
          <Checkbox checked={enableVpcCNI} disabled /> VPN-CNI
        </span>
      ),
    },
    { label: 'VPC', value: vpc, hidden: !enableVpcCNI },
    { label: 'AnchorServer', value: anchorServer, hidden: !enableVpcCNI },
  ]
  const clusterNetworkItems: IItem[] = [
    {
      label: 'Service Cidr Block',
      value: `${buildIPV4(serviceCidrBlock)}/${serviceCidrBlock?.cidr}`,
    },
    {
      label: 'Pod Cidr Block',
      value: `${buildIPV4(podCidrBlock)}/${podCidrBlock?.cidr}`,
      hidden: !podCidrBlock?.cidr,
    },
    {
      label: 'Node Mask',
      value: nodeMask,
      hidden: !nodeMask,
    },
  ]

  const runtimeItems: IItem[] = [
    { label: 'Dragonfly', value: enableTextRender(enableDragonfly) },
    { label: 'GPU', value: enableTextRender(enableGPU) },
  ]
  const clusterEntryPointItems: IItem[] = [
    {
      label: 'apiserver-extraArgs',
      value: (
        <Space direction="vertical" size={8}>
          {apiServerExtraArgs.map(({ key, value }) => (
            <span key={value}>
              {key}={value}
            </span>
          ))}
        </Space>
      ),
      hidden: apiServerExtraArgs?.length < 1,
    },
    {
      label: 'controllerManagement-extraArgs',
      value: (
        <Space direction="vertical" size={8}>
          {controllerManagementExtraArgs.map(({ key, value }) => (
            <span key={value}>
              {key}={value}
            </span>
          ))}
        </Space>
      ),
      hidden: controllerManagementExtraArgs?.length < 1,
    },
    {
      label: 'scheduler-extraArgs',
      value: (
        <Space direction="vertical" size={8}>
          {schedulerExtraArgs.map(({ key, value }) => (
            <span key={value}>
              {key}={value}
            </span>
          ))}
        </Space>
      ),
      hidden: schedulerExtraArgs?.length < 1,
    },
  ]
  const eventEtcdCertificateItems: IItem[] = [
    { label: 'SSL Certificate Authority file', value: eventEtcd?.authority },
    { label: 'Client SSL certification file', value: eventEtcd?.certification },
    { label: 'Client SSL key file', value: eventEtcd?.key },
  ]
  const observabilityItems: IItem[] = [
    { label: 'Log', value: enableTextRender(enableLog) },
    { label: 'Monitoring', value: enableTextRender(enableMonitoring) },
  ]
  return (
    <Root>
      <StyledCard title="Basic Info">
        <LabelValueList items={basicInfoItems} />
      </StyledCard>
      <Divider />
      <StyledCard title="Node">
        <LabelValueList items={nodeItems} />
      </StyledCard>
      <Divider />
      <StyledCard title="ETCD">
        <LabelValueList
          items={[
            {
              label: 'ETCD IPs',
              value: (
                <Space size={8}>
                  {etcdIps.map((ip) => (
                    <Tag key={ip}>{ip}</Tag>
                  ))}
                </Space>
              ),
            },
          ]}
        />
        <CertificateWrapper>Certificate:</CertificateWrapper>
        <LabelValueList items={etcdCertificateItems} />
      </StyledCard>
      <Divider />
      <StyledCard title="Networking Model">
        <LabelValueList items={networkingModelItems} />
      </StyledCard>
      <Divider />
      <StyledCard title="Cluster Network">
        <LabelValueList items={clusterNetworkItems} />
      </StyledCard>
      <Divider />
      <StyledCard title="Runtime">
        <LabelValueList items={runtimeItems} />
      </StyledCard>
      <Divider />
      <StyledCard title="Cluster EntryPoint">
        <LabelValueList items={clusterEntryPointItems} />
      </StyledCard>
      <Divider />
      {eventEtcd?.IPs?.length > 0 && (
        <>
          <StyledCard title="Event ETCD">
            <LabelValueList
              items={[
                {
                  label: 'ETCD IPs',
                  value: (
                    <Space size={8}>
                      {eventEtcd?.IPs.map((ip) => (
                        <Tag key={ip}>{ip}</Tag>
                      ))}
                    </Space>
                  ),
                },
              ]}
            />
            <CertificateWrapper>Certificate:</CertificateWrapper>
            <LabelValueList items={eventEtcdCertificateItems} />
          </StyledCard>
          <Divider />
        </>
      )}
      <StyledCard title="Observability">
        <LabelValueList items={observabilityItems} />
      </StyledCard>
      <Divider />
      <StyledCard title="Internal">
        <LabelValueList items={[{ label: 'Bromo', value: enableTextRender(enableBromo) }]} />
      </StyledCard>
    </Root>
  )
}

export default Confirm
