import React, { useState, useEffect, useCallback } from 'react'
import { Button, Form, Modal, message } from 'infrad'
import { Rule } from 'rc-field-form/lib/interface'

import Icon, { PlusOutlined } from 'infra-design-icons'
import PencilSvg from 'assets/pencil.antd.svg?component'

import Section from '../Common/Section'
import LabelItem from '../Common/LabelItem'

import { selectedCluster } from 'states/clusterState'
import { useRecoilValue } from 'recoil'
import { flavorControllerGetClusterFlavors, flavorControllerUpdateClusterFlavors } from 'swagger-api/v3/apis/Flavor'

import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'
import { AccessControlContext } from 'hooks/useAccessControl'

import {
  StyledItem,
  StyledSpan,
  StyledTable,
  StyledHead,
  StyledTbody,
  StyledTr,
  ButtonWrapper,
  StyledButton,
  StyledInput,
  ErrorInfo,
  StyledTdKey,
  StyledTdValue,
  StyledTdValueText
} from './style'

const CpuUnit = <StyledSpan>Cores</StyledSpan>
const MemoryUnit = <StyledSpan>GiB</StyledSpan>

interface IFlavor {
  cpu: number
  memory: number
}

interface IChangedFlavors {
  add: IFlavor[]
  remove: IFlavor[]
}

const getChangedFlavors = (preFlavors: IFlavor[], currentFlavors: IFlavor[]): IChangedFlavors => {
  const sameFlavors = preFlavors.filter(({ cpu: preCpu, memory: preMem }) => {
    return currentFlavors.some(({ cpu: curCpu, memory: curMem }) => preCpu === curCpu && preMem === curMem)
  })
  const addedFlavors = currentFlavors.filter(({ cpu: curCpu, memory: curMem }) => {
    return !sameFlavors.some(({ cpu, memory }) => cpu === curCpu && memory === curMem)
  })
  const removedFlavors = preFlavors.filter(({ cpu: curCpu, memory: curMem }) => {
    return !sameFlavors.some(({ cpu, memory }) => cpu === curCpu && memory === curMem)
  })
  return { add: addedFlavors, remove: removedFlavors }
}

const inputRules: Rule[] = [
  { transform: value => Number(value), type: 'integer', min: 1, message: 'Please enter a positive integer' },
  { required: true, message: 'require!' }
]

const PodFlavor: React.FC = () => {
  const [form] = Form.useForm()

  const cluster = useRecoilValue(selectedCluster)
  const { name: clusterName = '' } = cluster || {}
  const [flavors, setFlavors] = useState([])
  const [editing, setEditing] = useState(false)

  const getClusterFlavorsFn = useCallback(async () => {
    const { flavors } = await flavorControllerGetClusterFlavors({ clusterName })
    setFlavors(flavors)
    form.setFieldsValue({ flavors })
  }, [form, clusterName])

  useEffect(() => {
    getClusterFlavorsFn()
  }, [getClusterFlavorsFn])

  const accessControlContext = React.useContext(AccessControlContext)
  const clusterActions = accessControlContext[RESOURCE_TYPE.CLUSTER] || []
  const canEditCluster = clusterActions.includes(RESOURCE_ACTION.Edit)

  const Title = (
    <span>
      <span>Pod Flavor</span>
      {canEditCluster && (
        <Button onClick={() => setEditing(true)} style={{ float: 'right' }} type='link'>
          <Icon component={PencilSvg} /> Edit
        </Button>
      )}
    </span>
  )

  const [sameFlavorIndexes, setSameFlavorIndexes] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [addedFlavors, setAddedFlavors] = useState<IFlavor[]>([])
  const [removedFlavors, setRemovedFlavors] = useState<IFlavor[]>([])

  const sameFlavorValidateFn = () => {
    setSameFlavorIndexes([])
    // get same flavors index
    const currentFlavors = form.getFieldValue('flavors')
    const flavorsSet = new Set()
    currentFlavors
      .filter(flavor => flavor)
      .forEach(({ cpu, memory }, index) => {
        const previousSize = flavorsSet.size
        flavorsSet.add(`${cpu}-${memory}`)
        if (flavorsSet.size === previousSize) {
          setSameFlavorIndexes(preIndexes => {
            const newIndexes = [...preIndexes, index]
            return newIndexes
          })
        }
      })
  }

  const handleCancel = () => {
    form.resetFields()
    form.setFieldsValue({ flavors })
    setSameFlavorIndexes([])
    setEditing(false)
  }
  const handleSave = async () => {
    const currentFlavors = form.getFieldValue('flavors')
    const transformedFlavors = currentFlavors
      .filter(flavor => flavor)
      .map(({ cpu, memory }) => {
        return { cpu: Number(cpu), memory: Number(memory) }
      })
    const { add, remove } = getChangedFlavors(flavors, transformedFlavors)
    if (add.length || remove.length) {
      await form.validateFields()
      setAddedFlavors(add)
      setRemovedFlavors(remove)
      setModalVisible(true)
    } else {
      if (transformedFlavors.length === currentFlavors.length) {
        // no change
        handleCancel()
      } else {
        // no change but with empty items
        await form.validateFields()
      }
    }
  }
  const handleOk = async () => {
    try {
      await flavorControllerUpdateClusterFlavors({
        clusterName,
        payload: { added: addedFlavors, removed: removedFlavors }
      })
      message.success('Edit operation succeeded')
      // refresh flavors
      getClusterFlavorsFn()
      setModalVisible(false)
      setEditing(false)
    } catch (err) {
      err.message && message.error(err.message)
    }
  }

  const FlavorTable = (
    <>
      <Form form={form}>
        <Form.List name='flavors'>
          {(fields, { add, remove }) => (
            <>
              <StyledTable>
                <StyledHead>
                  <tr>
                    <td style={{ textAlign: 'center', width: '80px' }}>No.</td>
                    <td style={{ width: '260px' }}>CPU</td>
                    <td style={{ width: '260px' }}>Memory</td>
                    {editing && <td style={{ width: '100px' }}>Action</td>}
                  </tr>
                </StyledHead>
                <StyledTbody>
                  {fields.map(({ key, name, ...restField }, index) => {
                    const currentFlavor = flavors[index]
                    const { cpu, memory } = currentFlavor || {}
                    return (
                      <StyledTr key={key}>
                        <td style={{ textAlign: 'center' }}>
                          <StyledSpan>{index + 1}</StyledSpan>
                        </td>
                        <td>
                          <StyledItem
                            name={[name, 'cpu']}
                            {...restField}
                            rules={inputRules}
                            validateStatus={sameFlavorIndexes.includes(index) ? 'error' : undefined}
                          >
                            {editing ? (
                              <StyledInput onChange={sameFlavorValidateFn} suffix={CpuUnit} />
                            ) : (
                              <>
                                {cpu} {CpuUnit}
                              </>
                            )}
                          </StyledItem>
                          {sameFlavorIndexes.includes(index) && (
                            <ErrorInfo> The configuration already exists</ErrorInfo>
                          )}
                        </td>
                        <td>
                          <StyledItem
                            name={[name, 'memory']}
                            rules={inputRules}
                            validateStatus={sameFlavorIndexes.includes(index) ? 'error' : undefined}
                          >
                            {editing ? (
                              <StyledInput onChange={sameFlavorValidateFn} suffix={MemoryUnit} />
                            ) : (
                              <>
                                {memory} {MemoryUnit}
                              </>
                            )}
                          </StyledItem>
                          {sameFlavorIndexes.includes(index) && <ErrorInfo></ErrorInfo>}
                        </td>
                        {editing && (
                          <td>
                            <Button
                              style={{ padding: '0' }}
                              type='link'
                              onClick={() => {
                                remove(name)
                                sameFlavorValidateFn()
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        )}
                      </StyledTr>
                    )
                  })}
                  {editing && (
                    <tr>
                      <td></td>
                      <td colSpan={3}>
                        <Button type='link' onClick={() => add()}>
                          <PlusOutlined />
                          Add New Pod Flavor
                        </Button>
                      </td>
                    </tr>
                  )}
                </StyledTbody>
              </StyledTable>
            </>
          )}
        </Form.List>
      </Form>
      {editing && (
        <ButtonWrapper>
          <StyledButton onClick={!sameFlavorIndexes.length && handleSave} type='primary'>
            Save
          </StyledButton>
          <StyledButton onClick={handleCancel} style={{ marginLeft: '16px' }}>
            Cancel
          </StyledButton>
        </ButtonWrapper>
      )}
    </>
  )

  return (
    <>
      <Section title={editing ? 'Pod Flavor' : Title} body={<LabelItem label='Pod Flavor' item={FlavorTable} />} />
      <Modal
        title='Notice'
        visible={modalVisible}
        getContainer={() => document.body}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        okText='Confirm'
      >
        <table style={{ width: '100%' }}>
          <tbody>
            {addedFlavors.length > 0 && (
              <>
                <tr>
                  <StyledTdKey>Add Pod Flavor</StyledTdKey>
                  <StyledTdValue>
                    <StyledTdValueText>
                      {addedFlavors.map(({ cpu, memory }) => (
                        <div key={`${cpu}-${memory}`}>{`${cpu} Cores / ${memory} GiB`}</div>
                      ))}
                    </StyledTdValueText>
                  </StyledTdValue>
                </tr>
                <tr style={{ height: '16px' }}></tr>
              </>
            )}
            {removedFlavors.length > 0 && (
              <tr>
                <StyledTdKey>Remove Pod Flavor</StyledTdKey>
                <StyledTdValue>
                  <StyledTdValueText>
                    {removedFlavors.map(({ cpu, memory }) => (
                      <div key={`${cpu}-${memory}`}>{`${cpu} Cores / ${memory} GiB`}</div>
                    ))}
                  </StyledTdValueText>
                </StyledTdValue>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>
    </>
  )
}

export default PodFlavor
