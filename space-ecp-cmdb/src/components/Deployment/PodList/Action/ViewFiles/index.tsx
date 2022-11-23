import * as React from 'react'
import { Col, Modal, Row, Select, Space, Spin } from 'infrad'
import FilesTable from 'src/components/Deployment/PodList/Action/ViewFiles/FilesTable'
import { StyledContainer } from 'src/components/Deployment/PodList/Action/ViewFiles/style'
import { IModels } from 'src/rapper/request'
import FileDetail from 'src/components/Deployment/PodList/Action/ViewFiles/FileDetail'

export type PodData =
  IModels['GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods']['Res']['items'][0]
export type FileData =
  IModels['GET/api/ecp-cmdb/sdus/{sduName}/svcdeploys/{deployId}/pods/{podName}/files']['Res']['items'][0]

interface IViewFilesProps {
  visible: boolean
  onModalVisibleChange: (visible: boolean) => void
  sduName: string
  deployId: string
  podData: PodData
}

const ViewFiles: React.FC<IViewFilesProps> = (props) => {
  const { visible, onModalVisibleChange, sduName, deployId, podData } = props
  const { containerInfo: containers = [] } = podData || {}
  const [selectedFile, setSelectedFile] = React.useState<FileData>()
  const [selectedContainer, setSelectedContainer] = React.useState('')

  React.useEffect(() => {
    const defaultContainer =
      containers?.find((item) => item?.containerName === sduName || item?.contianerName === sduName)
        ?.containerId || containers?.[0]?.containerId
    setSelectedContainer(defaultContainer)
  }, [containers, sduName])

  const renderModalTitle = () => (
    <Space direction="vertical">
      View Files
      <Space size={8}>
        <StyledContainer>Container:</StyledContainer>
        <Select value={selectedContainer} style={{ minWidth: 180 }} onSelect={setSelectedContainer}>
          {containers.map((item) => (
            <Select.Option value={item.containerId} key={item.containerId}>
              {item.containerName || item.contianerName}
            </Select.Option>
          ))}
        </Select>
      </Space>
    </Space>
  )

  const handleCancel = () => {
    onModalVisibleChange(false)
    setSelectedFile(undefined)
  }

  return (
    <Modal
      visible={visible}
      title={renderModalTitle()}
      width={1323}
      onCancel={handleCancel}
      destroyOnClose
      footer={null}
    >
      <Spin spinning={false}>
        <Row gutter={24}>
          <Col span={12}>
            <FilesTable
              sduName={sduName}
              deployId={deployId}
              podData={podData}
              onSelectFile={setSelectedFile}
              modalVisible={visible}
            />
          </Col>
          <Col span={12}>
            <FileDetail
              sduName={sduName}
              deployId={deployId}
              podData={podData}
              fileData={selectedFile}
            />
          </Col>
        </Row>
      </Spin>
    </Modal>
  )
}

export default ViewFiles
