import React from 'react'
import CrudDrawer from 'components/Common/CrudDrawer'
import FlavorForm from './FlavorForm'
import { Form, Modal, message } from 'infrad'

import { FormContext } from './context'
import { StyledTable, StyledThead, StyledTbody, StyledTr } from './style'

import { IClusterFlavorsItem } from 'api/types/cluster/cluster'
import { flavorControllerAddClustersFlavors } from 'swagger-api/v3/apis/Flavor'
import { clustersControllerGetClusterNames } from 'swagger-api/v3/apis/Cluster'

interface IAddPodFlavorDrawer {
  visible: boolean
  onClose: () => void
}

const getAddedFlavors = (clustersFlavors: IClusterFlavorsItem[]) => {
  const clustersFlavorsKeys = clustersFlavors.map(({ clusters, flavors }) => {
    const flavorsKeys = flavors.map(({ cpu, memory }) => `${cpu}-${memory}`)
    return `${clusters.join('&&')}==${flavorsKeys.join('&&')}`
  })
  const repeatedIndexes = []
  while (clustersFlavorsKeys.length) {
    const curKey = clustersFlavorsKeys.pop()
    clustersFlavorsKeys.includes(curKey) && repeatedIndexes.push(clustersFlavorsKeys.length)
  }
  const addedFlavors = clustersFlavors.filter((_, index) => !repeatedIndexes.includes(index))
  return addedFlavors
}

const AddPodFlavorDrawer: React.FC<IAddPodFlavorDrawer> = ({ visible, onClose }) => {
  // store form fields status which can't be validate by form.validateFields()
  const [isFormValid, setFormValid] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(false)
  const [clustersFlavors, setClustersFlavors] = React.useState([])
  const [clusterList, setClusterList] = React.useState<string[]>([])
  const listClustersFn = async () => {
    const { names } = await clustersControllerGetClusterNames()
    setClusterList(names)
  }
  React.useEffect(() => {
    listClustersFn()
  }, [])

  const [form] = Form.useForm()
  const handleSubmit = async () => {
    try {
      const flavors = await form.validateFields()
      const { clustersFlavors = [] } = flavors
      if (isFormValid) {
        const addedFlavors = getAddedFlavors(clustersFlavors)
        setClustersFlavors(addedFlavors)
        setModalVisible(true)
      }
    } catch (err) {
      // ignore err
    }
  }

  const handleOk = async () => {
    const values = form.getFieldsValue()
    const { clustersFlavors } = values
    try {
      await flavorControllerAddClustersFlavors({ payload: { clustersFlavors } })
      message.success('Edit operation succeeded.')
      setModalVisible(false)
      onClose()
    } catch (err) {
      err.message && message.error(err.message)
    }
  }
  return (
    <>
      <FormContext.Provider value={{ isFormValid, updateFormValid: status => setFormValid(status) }}>
        <CrudDrawer
          title='Pod Flavor Batch Add'
          isSubmitDisabled={false}
          visible={visible}
          closeDrawer={onClose}
          body={<FlavorForm form={form} clusterList={clusterList} />}
          onSubmit={handleSubmit}
        />
      </FormContext.Provider>
      <Modal
        title='Added Pod Flavors'
        visible={modalVisible}
        getContainer={() => document.body}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        okText='Confirm'
        bodyStyle={{ maxHeight: 400, overflow: 'auto' }}
      >
        <StyledTable>
          <StyledThead>
            <tr>
              <th>Pod Flavor</th>
              <th>Affected Cluster</th>
            </tr>
          </StyledThead>
          <StyledTbody>
            {clustersFlavors.map(({ flavors, clusters }, index) => {
              return (
                <StyledTr key={index + clusters.join('-')}>
                  <td>
                    {flavors.map(({ cpu, memory }) => (
                      <div key={`${cpu}-${memory}`}>{`${cpu}Cores / ${memory}GiB`}</div>
                    ))}
                  </td>
                  <td>{clusters.length === clusterList.length ? 'All Clusters' : clusters.join('、')}</td>
                </StyledTr>
              )
            })}
          </StyledTbody>
        </StyledTable>
      </Modal>
    </>
  )
}

export default AddPodFlavorDrawer
