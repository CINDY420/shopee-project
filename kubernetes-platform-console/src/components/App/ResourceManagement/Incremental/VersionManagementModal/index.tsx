import AddNewVersionModal from 'components/App/ResourceManagement/Incremental/VersionManagementModal/AddNewVersionModal'
import {
  Compaign,
  StyledButton,
  StyledTable,
  StyledPopconfirm
} from 'components/App/ResourceManagement/Incremental/VersionManagementModal/style'
import { getDispatchers, ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import { LockOutlined, PlusOutlined, UnlockOutlined } from 'infra-design-icons'
import { message, Modal, ModalProps, Switch } from 'infrad'
import { flatten } from 'lodash'
import * as React from 'react'
import { sduResourceControllerEditVersion, sduResourceControllerListVersion } from 'swagger-api/v1/apis/SduResource'
import { IVersion } from 'swagger-api/v1/models'

interface IVersionManagementModalProps extends ModalProps {
  isVisible: boolean
}

const VersionManagementModal: React.FC<IVersionManagementModalProps> = ({ isVisible, onCancel, onOk }) => {
  const { state, dispatch } = React.useContext(ResourceContext)
  const { bigSales, versions } = state
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const [unlockList, setUnlockList] = React.useState<string[]>([])
  React.useEffect(() => {
    const unlockList = versions.filter(version => version.state === 0).map(version => version.versionId)
    setUnlockList(unlockList)
  }, [versions])

  const formatedVersionList: Record<number, string[]>[] = versions.map(version => {
    const { startBigSale, endBigSale } = version
    const { year: startYear, month: startMonth, day: startDay } = startBigSale
    const { year: endYear, month: endMonth, day: endDay } = endBigSale

    const availableBigSales = flatten(Object.values(bigSales)).filter(bigSale => {
      if (bigSale.year < startYear || bigSale.year > endYear) {
        return false
      }
      if (bigSale.month < startMonth || bigSale.month > endMonth) {
        return false
      }
      if (bigSale.day < startDay || bigSale.day > endDay) {
        return false
      }
      return true
    })

    const versionList = availableBigSales.reduce((acc: Record<number, string[]>, curr) => {
      const { year, month, day } = curr
      const bigSale = `${month}.${day}`
      if (acc[year]) {
        acc[year].push(bigSale)
      } else {
        acc[year] = [bigSale]
      }
      return { ...acc }
    }, {})

    return versionList
  })

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, record: IVersion, index: number) => {
        const version = formatedVersionList[index]
        return (
          <div>
            <div>{record.name}</div>
            <div>
              {Object.entries(version).map(([year, dates]) => {
                return (
                  <Compaign key={record.name + year}>
                    <>{year} Compaign </>
                    <>{dates.map(date => `[${date}]`).join(', ')}</>
                  </Compaign>
                )
              })}
            </div>
          </div>
        )
      }
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: (_, record: IVersion) => {
        const isUnlocked = unlockList.includes(record.versionId)
        return (
          <StyledPopconfirm
            title={
              isUnlocked
                ? 'Are you sure lock this version?'
                : 'Unlock this version will make the other versions be locked. Are you sure ?'
            }
            onConfirm={() => setTimeout(() => handleStateChange(isUnlocked, record.versionId), 50)}
            okText='Yes'
            cancelText='No'
          >
            <Switch checkedChildren={<UnlockOutlined />} unCheckedChildren={<LockOutlined />} checked={isUnlocked} />
          </StyledPopconfirm>
        )
      }
    }
  ]
  const [isAddNewVersionModalVisible, setAddNewVersionModalVisible] = React.useState(false)

  const handleStateChange = (isUnlocked: boolean, versionId: string) => {
    if (isUnlocked) {
      const newUnlockedList = unlockList.filter(item => item !== versionId)
      setUnlockList(newUnlockedList)
    } else {
      setUnlockList([versionId])
    }
  }
  const handleConfirm = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const unlockVersionId = unlockList[0]
    const payload = {
      lockAll: !unlockVersionId,
      unlockVersionId
    }
    try {
      await sduResourceControllerEditVersion({ payload })
      const { versions = [] } = await sduResourceControllerListVersion()
      dispatchers.updateVersions(versions)
      message.success('Update version successfully')
    } catch (e) {
      e.message && message.error(e.message)
    }
    onOk(e)
  }
  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const unlockList = versions.filter(version => version.state === 0).map(version => version.versionId)
    setUnlockList(unlockList)
    onCancel(e)
  }
  return (
    <Modal
      visible={isVisible}
      title='Version Management'
      width='600px'
      getContainer={() => document.body}
      okText='Confirm'
      onCancel={e => handleCancel(e)}
      onOk={e => handleConfirm(e)}
      bodyStyle={{ height: '800px', overflowY: 'scroll' }}
    >
      <StyledTable
        rowKey={(record: IVersion) => record.versionId}
        columns={columns}
        dataSource={versions}
        pagination={false}
      />
      <StyledButton type='link' icon={<PlusOutlined />} onClick={() => setAddNewVersionModalVisible(true)}>
        Add New Version
      </StyledButton>
      <AddNewVersionModal
        isVisible={isAddNewVersionModalVisible}
        onOk={() => setAddNewVersionModalVisible(false)}
        onCancel={() => setAddNewVersionModalVisible(false)}
      />
    </Modal>
  )
}

export default VersionManagementModal
