import React from 'react'
import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'
import {
  DeployConfigContext,
  FormType,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'
import { Form, Space, Radio, Select, FormInstance } from 'infrad'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { CountTableAzWrapper } from 'src/components/DeployConfig/ListView/Common/CommonStyles/CountTable'
import { ColumnsType } from 'infrad/lib/table'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import {
  AutoDisabledInput,
  AutoDisabledSelect,
  AutoDisabledSwitch,
  AutoDisabledRadioGroup,
} from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { ICountryAZ } from 'src/components/DeployConfig/ListView/CountryAZ'
import { fetch } from 'src/rapper'
import { IModels } from 'src/rapper/request'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import {
  IStorageFormValues,
  IFormVolume,
} from 'src/components/DeployConfig/useDeployConfigContext/reducer'
import { usePrevious } from 'ahooks'
import { isEqual, difference } from 'lodash'
import FuseFS from 'src/components/DeployConfig/ListView/Storage/FuseFS'

export enum StorageType {
  USS = 'USS',
  FUSE_FS = 'FuseFS (Beta)',
}

interface IStorageProps {
  serviceId: number
}

type IPv = IModels['GET/api/ecp-cmdb/services/{serviceId}/allPvs']['Res']['allPvs'][0]
type IStorage =
  IModels['GET/api/ecp-cmdb/deploy-config/commits']['Res']['commits'][0]['data']['storage']

const getPvcUuidsByCidAz = (allPvs: IPv[], cid: string, az: string): string[] => {
  const filteredPvs = allPvs.filter((pvItem) => pvItem.cid === cid && pvItem.az === az)
  const uuids = filteredPvs?.map((item) => item.uuid)
  return uuids
}

const getPvcNameByCidAzPvcUuid = (allPvs: IPv[], cid: string, az: string, uuid: string): string => {
  const filteredPvs = allPvs.filter((pvItem) => pvItem.cid === cid && pvItem.az === az)
  const pvcName = filteredPvs.find((item) => item.uuid === uuid)?.name
  return pvcName
}

enum IdcFormOperationType {
  ADD = 'add',
  DELETE = 'delete',
  CHANGE_CID = 'changeCid',
  CHANGE_CID_AZ = 'changeCidAZ',
}

interface IDiffCidAz {
  cid: string
  azs: string[]
  preCid?: string
}

interface IGetIdcFormDiffCidAzAndOperationTypeResponse {
  diffCidAz: IDiffCidAz
  idcFormOperationType: IdcFormOperationType
}

const getIdcFormDiffCidAzAndOperationType = (
  previousCountryAzsOptions: Record<string, string[]>,
  currentCountryAzsOptions: Record<string, string[]>,
): IGetIdcFormDiffCidAzAndOperationTypeResponse => {
  let diffCidAz: IDiffCidAz
  let idcFormOperationType: IdcFormOperationType

  const previousIdcFormCids = Object.keys(previousCountryAzsOptions)
  const currentIdcFormCids = Object.keys(currentCountryAzsOptions)

  // judge if add operation
  if (previousIdcFormCids.length < currentIdcFormCids.length) {
    idcFormOperationType = IdcFormOperationType.ADD
    const addCid = difference(currentIdcFormCids, previousIdcFormCids)?.[0]
    const addCidAzs = currentCountryAzsOptions[addCid]
    diffCidAz = {
      cid: addCid,
      azs: addCidAzs,
    }
  }
  // then if delete operation
  else if (previousIdcFormCids.length > currentIdcFormCids.length) {
    idcFormOperationType = IdcFormOperationType.DELETE
    const deletedCid = difference(previousIdcFormCids, currentIdcFormCids)?.[0]
    const deletedCidAzs = previousCountryAzsOptions[deletedCid]
    diffCidAz = {
      cid: deletedCid,
      azs: deletedCidAzs,
    }
  }
  // cid count not changed
  else {
    // case one: only change cid
    if (!isEqual(previousIdcFormCids, currentIdcFormCids)) {
      idcFormOperationType = IdcFormOperationType.CHANGE_CID
      const diffCid = currentIdcFormCids.find((cid) => !previousIdcFormCids.includes(cid))
      const preChangedCid = difference([...previousIdcFormCids, diffCid], currentIdcFormCids)?.[0]
      diffCidAz = {
        cid: diffCid,
        azs: currentCountryAzsOptions[diffCid],
        preCid: preChangedCid,
      }
    }
    // case two: change cid's az
    else {
      idcFormOperationType = IdcFormOperationType.CHANGE_CID_AZ
      const diffCidAzs = Object.entries(currentCountryAzsOptions).find(
        ([cid, azs = []]) => !isEqual(azs, previousCountryAzsOptions[cid]),
      )
      const [cid, azs] = diffCidAzs ?? [undefined, undefined]

      diffCidAz = {
        cid,
        azs,
      }
    }
  }
  return { diffCidAz, idcFormOperationType }
}

const getChangedFormVolumes = (
  diffCidAz: IDiffCidAz,
  idcFormOperationType: IdcFormOperationType,
  volumes: IFormVolume[],
  allPvs: IPv[],
): IFormVolume[] => {
  let data = volumes
  switch (idcFormOperationType) {
    case IdcFormOperationType.ADD: {
      const { cid: changedCid, azs: changedCidAz } = diffCidAz
      const azPvcArray = changedCidAz?.map((az) => {
        const pvcs = getPvcUuidsByCidAz(allPvs, changedCid, az)
        return {
          [az]: pvcs?.[0] ?? '',
        }
      })
      const cidAzPv = azPvcArray?.reduce(
        (acc: Record<string, string>, curr: Record<string, string>) => ({ ...acc, ...curr }),
        {},
      )
      data = [
        ...volumes,
        {
          cid: changedCid,
          mount_path: '',
          ...cidAzPv,
        },
      ]
      return data
    }

    case IdcFormOperationType.DELETE: {
      const { cid: changedCid } = diffCidAz
      data = volumes.filter((volume) => volume?.cid !== changedCid)
      return data
    }

    case IdcFormOperationType.CHANGE_CID: {
      const { cid: changedCid, azs: changedCidAz, preCid } = diffCidAz
      data.forEach((volume, index) => {
        if (volume?.cid === preCid) {
          const azPvcArray = changedCidAz?.map((az) => {
            const pvcs = getPvcUuidsByCidAz(allPvs, changedCid, az)
            return {
              [az]: pvcs?.[0] ?? '',
            }
          })
          const cidAzPv = azPvcArray?.reduce(
            (acc: Record<string, string>, curr: Record<string, string>) => ({ ...acc, ...curr }),
            {},
          )
          data[index] = {
            cid: changedCid,
            mount_path: '',
            ...cidAzPv,
          }
        }
      })
      return data
    }

    case IdcFormOperationType.CHANGE_CID_AZ: {
      const { cid: changedCid, azs: changedCidAz } = diffCidAz
      if (changedCid === undefined && changedCidAz === undefined) {
        return data
      }

      data.forEach((volume, index) => {
        if (volume?.cid === changedCid) {
          const azPvcArray = changedCidAz?.map((az) => {
            const pvcs = getPvcUuidsByCidAz(allPvs, changedCid, az)
            return {
              [az]: pvcs?.[0] ?? '',
            }
          })
          const cidAzPv = azPvcArray?.reduce(
            (acc: Record<string, string>, curr: Record<string, string>) => ({ ...acc, ...curr }),
            {},
          )
          data[index] = {
            cid: changedCid,
            mount_path: '',
            ...cidAzPv,
          }
        }
      })
      return data
    }
  }
}

const getInitializeFormValuesByStorage = (storage: IStorage): IFormVolume[] => {
  const { volumes } = storage
  const data = volumes?.map((volume) => {
    const { cid, mount_path, pvcs } = volume
    const cidAzPvcArr = pvcs?.map((item) => {
      const { idc, pvc } = item
      return {
        [idc]: pvc,
      }
    })
    const cidAzPv = cidAzPvcArr?.reduce(
      (acc: Record<string, string>, curr: Record<string, string>) => ({ ...acc, ...curr }),
      {},
    )
    return {
      cid,
      mount_path,
      ...cidAzPv,
    }
  })
  return data
}

const getInitializeFormValuesByIdcForm = (
  env: string,
  allPvs: IPv[],
  idcForm: FormInstance<any>,
): IFormVolume[] => {
  const idcs: ICountryAZ[] = idcForm
    .getFieldValue(['idcs', env])
    ?.filter((idc: ICountryAZ) => idc !== undefined)

  const data = idcs?.map((idc) => {
    const cidAzPvsArr = idc?.azs?.map((az) => {
      const pvcs = getPvcUuidsByCidAz(allPvs, idc.cid, az)
      return {
        [az]: pvcs?.[0] ?? '',
      }
    })

    const cidAzPv = cidAzPvsArr?.reduce(
      (acc: Record<string, string>, curr: Record<string, string>) => ({ ...acc, ...curr }),
      {},
    )
    return {
      cid: idc.cid,
      mount_path: '',
      ...cidAzPv,
    }
  })
  return data
}

const Storage: React.FC<IStorageProps> = (props) => {
  const { serviceId } = props
  const [form] = Form.useForm()
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { deployConfigForms, newDeployConfig, countryAzsOptions, env } = state
  const idcForm = deployConfigForms[FormType.COUNTRY_AZ]
  const { storage } = newDeployConfig

  const [allPvs, setAllPvs] = React.useState<IPv[]>([])
  const previousCountryAzsOptions = usePrevious(countryAzsOptions)

  const isStorageEnable = Form.useWatch(['storage', 'enable'], form)
  const currentStorageType = Form.useWatch(['storage', 'name'], form)

  const getAllPvs = React.useCallback(async () => {
    const { allPvs } = await fetch['GET/api/ecp-cmdb/services/{serviceId}/allPvs']({
      serviceId: String(serviceId),
    })
    setAllPvs(allPvs)
  }, [serviceId])

  React.useEffect(() => {
    getAllPvs()
  }, [getAllPvs])

  const initializeFormValues = React.useCallback(() => {
    if (storage) {
      if (storage.name === StorageType.USS) {
        const data = getInitializeFormValuesByStorage(storage)

        form.setFieldsValue({
          storage: { volumes: data, name: StorageType.USS, enable: true },
        })
      } else {
        const { fusefs, fusefs_overrides } = storage
        const { local_mount_path, mount_path, ...rest } = fusefs
        const formattedFuseFsOverride = fusefs_overrides?.map((item) => {
          const { cid, az, data } = item
          const { mount_path, local_mount_path, project_path } = data
          return {
            cid,
            az: az === undefined ? 'N/A' : az,
            data: {
              mount_path,
              local_mount_path: local_mount_path.replace(mount_path, ''),
              project_path,
            },
          }
        })
        form.setFieldsValue({
          fusefs: {
            mount_path,
            local_mount_path: local_mount_path.replace(mount_path, ''),
            ...rest,
          },
          fusefs_overrides: formattedFuseFsOverride,
          storage: { name: StorageType.FUSE_FS, enable: true },
        })
      }
    }
    dispatchers.updateDeployConfigForms({ [FormType.STORAGE]: form })
  }, [dispatchers, form, storage])

  React.useEffect(() => {
    initializeFormValues()
  }, [initializeFormValues])

  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      const data = storage
        ? getInitializeFormValuesByStorage(storage)
        : getInitializeFormValuesByIdcForm(env, allPvs, idcForm)
      form.setFieldsValue({ storage: { volumes: data, name: StorageType.USS, enable: checked } })
    }
  }

  React.useEffect(() => {
    if (isStorageEnable && currentStorageType === StorageType.USS) {
      const { diffCidAz, idcFormOperationType } = getIdcFormDiffCidAzAndOperationType(
        previousCountryAzsOptions,
        countryAzsOptions,
      )

      const formValues: IStorageFormValues = form.getFieldsValue()
      const { storage: formStorage } = formValues
      const { volumes: formVolumes = [] } = formStorage

      const data = getChangedFormVolumes(diffCidAz, idcFormOperationType, formVolumes, allPvs)

      form.setFieldsValue({ storage: { volumes: [...data] } })
    }
    dispatchers.updateDeployConfigForms({ [FormType.STORAGE]: form })
    dispatchers.updateErrors(FormType.STORAGE)
  }, [countryAzsOptions])

  const handleCidChange = (index: number) => {
    const formValues: IStorageFormValues = form.getFieldsValue()
    const { storage: formStorage } = formValues
    const { volumes: formVolumes } = formStorage

    const cid = formVolumes[index].cid
    const cidAzs = countryAzsOptions[cid]

    const azPvcArray = cidAzs?.map((az) => {
      const pvcs = getPvcUuidsByCidAz(allPvs, cid, az)
      return {
        [az]: pvcs?.[0] ?? '',
      }
    })
    const cidAzPv = azPvcArray?.reduce(
      (acc: Record<string, string>, curr: Record<string, string>) => ({ ...acc, ...curr }),
      {},
    )
    const data: IFormVolume = {
      cid,
      mount_path: '',
      ...cidAzPv,
    }

    formVolumes[index] = data
    form.setFieldsValue({ storage: { volumes: [...formVolumes] } })
  }

  const columns: ColumnsType = [
    {
      title: 'Country',
      dataIndex: 'cid',
      width: '20%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record
        return (
          <Form.Item
            {...restField}
            name={[name, 'cid']}
            rules={[{ required: true, message: 'Please select cid' }]}
          >
            <AutoDisabledSelect onChange={() => handleCidChange(name)}>
              {Object.keys(countryAzsOptions).map(
                (cid) =>
                  cid && (
                    <Select.Option value={cid} key={cid}>
                      {cid.toUpperCase()}
                    </Select.Option>
                  ),
              )}
            </AutoDisabledSelect>
          </Form.Item>
        )
      },
    },
    {
      title: 'Mount Path',
      dataIndex: 'mount_path',
      width: '30%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record
        return (
          <Form.Item
            {...restField}
            name={[name, 'mount_path']}
            rules={[{ required: true, message: 'Please input mount_path' }]}
          >
            <AutoDisabledInput style={{ width: '220px' }} />
          </Form.Item>
        )
      },
    },
    {
      title: 'PVC',
      width: '50%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record
        return (
          <Form.Item
            {...restField}
            shouldUpdate={(prevValue, curValue) =>
              prevValue?.storage?.volumes?.[name]?.cid !== curValue?.storage?.volumes?.[name]?.cid
            }
          >
            {({ getFieldValue }) => {
              const cid = getFieldValue(['storage', 'volumes', name, 'cid'])
              const cidAzs: string[] = countryAzsOptions[cid]
              return (
                <Space direction="vertical" size={12}>
                  {cidAzs?.map((az: string) => {
                    const pvcs = getPvcUuidsByCidAz(allPvs, cid, az)
                    return (
                      <div style={{ display: 'flex' }} key={az}>
                        <Form.Item {...restField}>
                          <CountTableAzWrapper az={az}>{az}</CountTableAzWrapper>
                        </Form.Item>
                        <Form.Item name={[name, az]}>
                          <AutoDisabledSelect style={{ width: '160px' }} allowClear>
                            {pvcs?.map((pvc) => (
                              <Select.Option value={pvc} key={pvc}>
                                {getPvcNameByCidAzPvcUuid(allPvs, cid, az, pvc)}
                              </Select.Option>
                            ))}
                          </AutoDisabledSelect>
                        </Form.Item>
                      </div>
                    )
                  })}
                </Space>
              )
            }}
          </Form.Item>
        )
      },
    },
  ]

  return (
    <Form
      form={form}
      layout="horizontal"
      requiredMark={false}
      labelCol={{ span: 4 }}
      colon={false}
      onFieldsChange={() => dispatchers.updateErrors(FormType.STORAGE)}
    >
      <SectionWrapper
        title={FormType.STORAGE}
        anchorKey={FormType.STORAGE}
        notice={<>Applications running on Bromo are not supported.</>}
      >
        <RowFormField>
          <Form.Item
            label="Enable Storage"
            name={['storage', 'enable']}
            valuePropName="checked"
            labelCol={{ span: 2 }}
          >
            <AutoDisabledSwitch style={{ marginLeft: '8px' }} onChange={handleSwitchChange} />
          </Form.Item>
          {isStorageEnable && (
            <>
              <Form.Item
                label="Type"
                name={['storage', 'name']}
                labelCol={{ span: 2 }}
                style={{ margin: '24px 0' }}
              >
                <AutoDisabledRadioGroup style={{ marginLeft: '8px' }}>
                  {Object.values(StorageType).map((type) => (
                    <Radio key={type} value={type}>
                      {type}
                    </Radio>
                  ))}
                </AutoDisabledRadioGroup>
              </Form.Item>
              {currentStorageType !== StorageType.USS ? (
                <FuseFS form={form} />
              ) : (
                <Form.List name={['storage', 'volumes']}>
                  {(fields, { add, remove }) => (
                    <TableFormList
                      onAdd={add}
                      onRemove={remove}
                      dataColumns={columns}
                      dataSource={fields}
                      canDeleteAll={false}
                      formType={FormType.STORAGE}
                    />
                  )}
                </Form.List>
              )}
            </>
          )}
        </RowFormField>
      </SectionWrapper>
    </Form>
  )
}
export default Storage
