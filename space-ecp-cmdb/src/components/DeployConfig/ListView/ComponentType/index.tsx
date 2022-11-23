import * as React from 'react'

import SectionWrapper from 'src/components/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'src/components/DeployConfig/ListView/Common/TableFormList'
import RowFormField from 'src/components/DeployConfig/ListView/Common/RowFormField'
import { Form, Select } from 'infrad'
import {
  DeployConfigContext,
  FormType,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { AutoDisabledSelect } from 'src/components/DeployConfig/ListView/Common/WithAutoDisabled'
import { find, union, partition, uniqBy, uniq } from 'lodash'
import { IModels } from 'src/rapper/request'

type IListWorkloadResponse = IModels['GET/api/ecp-cmdb/workloads']['Res']['items']
type IWorkloads = IListWorkloadResponse[0]
type IWorkload = IWorkloads['workloads'][0]
export type IComponentTypeOverride =
  IModels['GET/api/ecp-cmdb/deploy-config/commits']['Res']['commits'][0]['data']['component_type_overrides'][0]
enum Category {
  BROMO = 'bromo',
  DEPLOYMENT = 'deployment',
  CLONESET = 'cloneset',
  STATEFULSET = 'statefulset',
}
export enum EngineType {
  BROMO = 'bromo',
  KUBERNETES = 'kubernetes',
}
interface ICategoryGroup {
  [Category.BROMO]: string[]
  [Category.STATEFULSET]: string[]
  [Category.DEPLOYMENT]: string[]
  [Category.CLONESET]: string[]
}

interface IComponentType {
  bromo: string[]
  nonBromo: string[]
}

const NOTICE_ADDRESS =
  'https://confluence.shopee.io/pages/viewpage.action?pageId=917289060#heading-Currentcomponentsmanagement'

const ComponentType: React.FC = () => {
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { newDeployConfig, countryAzsOptions, isEditing, workloads } = state
  const { component_type, component_type_overrides, scheduler } = newDeployConfig

  const [form] = Form.useForm()
  const [globalOrchestratorList, setGlobalOrchestratorList] = React.useState<string[]>([])
  const [componentTypes, setComponentTypes] = React.useState<IListWorkloadResponse>([])
  const [componentTypesGroup, setComponentTypesGroup] = React.useState<IComponentType>({
    bromo: [],
    nonBromo: [],
  })
  const [filteredcomponents, setFilteredcomponents] = React.useState<IWorkload[]>([])
  const [categoryGroup, setCategoryGroup] = React.useState<ICategoryGroup>({
    bromo: [],
    deployment: [],
    statefulset: [],
    cloneset: [],
  })

  const convertTypeIntoCategories = React.useCallback(
    (type: string): string[] => {
      if (!type || type === 'bromo') return undefined
      return Object.entries(categoryGroup)
        .filter(([_, value]) => value.includes(type))
        .map(([key, _]) => key)
    },
    [categoryGroup],
  )

  const columns = [
    {
      title: 'Country',
      dataIndex: 'cid',
      key: 'cid',
      width: '11%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record

        return (
          <Form.Item {...restField} name={[name, 'cid']}>
            <AutoDisabledSelect>
              {Object.keys(countryAzsOptions).map(
                (cid) =>
                  cid && (
                    <Select.Option value={cid} key={cid}>
                      {cid}
                    </Select.Option>
                  ),
              )}
            </AutoDisabledSelect>
          </Form.Item>
        )
      },
    },
    {
      title: 'AZ',
      dataIndex: 'idc',
      key: 'idc',
      width: '34%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record

        return (
          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.component_type_overrides?.[name]?.cid !==
              curValue.component_type_overrides?.[name]?.cid
            }
          >
            {({ getFieldValue }) => {
              const formValues = getFieldValue(['component_type_overrides'])
              const cid = getFieldValue(['component_type_overrides', name, 'cid'])
              const azs = countryAzsOptions?.[cid] || []

              return (
                <Form.Item
                  {...restField}
                  name={[name, 'idc']}
                  rules={[{ required: true, message: 'Please fill in your target AZ(s)' }]}
                >
                  <AutoDisabledSelect>
                    {azs.map((az) => (
                      <Select.Option
                        value={az}
                        key={az}
                        disabled={!!find(formValues, { cid, idc: az })}
                      >
                        {az}
                      </Select.Option>
                    ))}
                  </AutoDisabledSelect>
                </Form.Item>
              )
            }}
          </Form.Item>
        )
      },
    },
    {
      title: 'Workload Type - Orchestrator',
      dataIndex: ['data', 'workload_type'],
      key: 'workload_type',
      width: '50%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key: _key, name, ...restField } = record

        return (
          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.component_type_overrides?.[name]?.idc !==
              curValue.component_type_overrides?.[name]?.idc
            }
          >
            {({ getFieldValue }) => {
              const idc: string = getFieldValue(['component_type_overrides', name, 'idc'])
              const type: string = getFieldValue([
                'component_type_overrides',
                name,
                'data',
                'workload_type',
              ])
              const categories = convertTypeIntoCategories(type)
              const componentTypesWithAz = componentTypes?.filter((item) => item.az === idc)
              const components: IWorkload[] =
                categories && categories.length !== 0
                  ? componentTypesWithAz[0]?.workloads?.filter((component: IWorkload) =>
                      categories.includes(component.category),
                    )
                  : componentTypesWithAz[0]?.workloads

              const orchestrators = components?.find(
                (component) => component.name === 'bromo',
              )?.orchestrators

              const bromoMode = type === EngineType.BROMO
              return (
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <Form.Item
                    name={[name, 'data', 'workload_type']}
                    style={{ width: bromoMode ? '49%' : '100%' }}
                    rules={[
                      {
                        required: true,
                        message: 'Please fill in your target componentType(s)',
                      },
                    ]}
                    {...restField}
                  >
                    <AutoDisabledSelect
                      dropdownMatchSelectWidth={false}
                      style={{ minWidth: '100px' }}
                    >
                      {components?.map((component) => (
                        <Select.Option value={component.name} key={component.name}>
                          {component.nameDisplay}
                        </Select.Option>
                      ))}
                    </AutoDisabledSelect>
                  </Form.Item>
                  <Form.Item
                    style={{ width: '49%' }}
                    {...restField}
                    name={[name, 'data', 'orchestrator']}
                    hidden={!bromoMode}
                  >
                    <AutoDisabledSelect allowClear>
                      {orchestrators?.map((orchestrator) => (
                        <Select.Option value={orchestrator} key={orchestrator}>
                          {orchestrator}
                        </Select.Option>
                      ))}
                    </AutoDisabledSelect>
                  </Form.Item>
                </div>
              )
            }}
          </Form.Item>
        )
      },
    },
  ]

  React.useEffect(() => {
    const selectedAzs = union(
      Object.values(countryAzsOptions).reduce((acc, curr) => acc.concat(curr), []),
    )
    const workloadsWithAz = workloads.filter((item) => selectedAzs.includes(item.az))
    setComponentTypes(workloadsWithAz)

    /*
     * split types into groups which include 'bromo' and 'nonBromo'
     * split category into groups which include 'bromo', 'deployment', 'statefulset' and 'cloneset'
     */

    const formatComponents = workloadsWithAz.reduce(
      (acc: IWorkload[], curr: IWorkloads) => acc.concat(curr.workloads),
      [],
    )
    const nameMap = formatComponents?.reduce((acc: Record<string, string>, curr) => {
      const obj = { [curr.name]: curr.nameDisplay }
      return { ...acc, ...obj }
    }, {})
    dispatchers.updateNameMap(nameMap)

    const componentType: IComponentType = {
      bromo: [],
      nonBromo: [],
    }
    const category: ICategoryGroup = {
      bromo: [],
      statefulset: [],
      deployment: [],
      cloneset: [],
    }
    formatComponents?.forEach((each) => {
      if (each?.type === 'bromo') {
        componentType.bromo.push(each.name)
      } else if (each?.type === 'kubernetes') {
        componentType.nonBromo.push(each.name)
      } else if (each?.type === 'ecp') {
        componentType.bromo.push(each.name)
        componentType.nonBromo.push(each.name)
      }

      category.bromo.push(each.name)
      if (each.category === Category.BROMO) {
        Object.values(Category).forEach((key) => {
          category[key].push(each.name)
        })
      } else {
        category[each.category as Category].push(each.name)
      }
    })
    setComponentTypesGroup(componentType)
    setCategoryGroup(category)
  }, [countryAzsOptions, dispatchers, workloads])

  React.useEffect(() => {
    const unionComponents = union(
      ...Object.values(componentTypes).map((item: IWorkloads) => item.workloads),
    )
    const components = uniqBy(unionComponents, 'name')

    const globalOrchestrators = unionComponents?.reduce((acc: string[], curr) => {
      if (curr.name === EngineType.BROMO) {
        curr.orchestrators.forEach((each) => {
          if (!acc.includes(each)) {
            acc.push(each)
          }
        })
        return acc
      }
      return acc
    }, [])
    setGlobalOrchestratorList(globalOrchestrators)

    const type = component_type?.[0]?.workload_type
    const categories = convertTypeIntoCategories(type)
    const filteredcomponents: IWorkload[] =
      categories && categories.length !== 0
        ? components.filter((component: IWorkload) => categories?.includes(component.category))
        : components

    setFilteredcomponents(filteredcomponents)
  }, [componentTypes, component_type, convertTypeIntoCategories, form])

  const updateComponentType = React.useCallback(() => {
    // handle override components
    const component_type_overrides: IComponentTypeOverride[] = form.getFieldValue([
      'component_type_overrides',
    ])
    const [bromoComponentsName, nonBromoComponentsName] = partition(
      component_type_overrides
        ?.map((component) => component?.data?.workload_type)
        ?.filter((componentType) => componentType !== undefined),
      (componentType) => componentTypesGroup.bromo.includes(componentType),
    )

    // handle default component
    const defaultComponent = form.getFieldValue('workload_type')

    if (defaultComponent) {
      componentTypesGroup.bromo.includes(defaultComponent)
        ? bromoComponentsName.push(defaultComponent)
        : nonBromoComponentsName.push(defaultComponent)
    } else {
      bromoComponentsName.push('bromo')
    }

    // reset form
    if (bromoComponentsName.length === 0) {
      if (nonBromoComponentsName.length === 0) {
        dispatchers.updateDeployConfigForms({ [FormType.STRAEGY]: undefined })
      }
    } else if (nonBromoComponentsName.length === 0) {
      dispatchers.updateDeployConfigForms({
        [FormType.EXTRA_CONFIG]: undefined,
      })
    }
    dispatchers.updateBromoComponent({
      bromo: uniq(bromoComponentsName),
      nonBromo: uniq(nonBromoComponentsName),
    })
  }, [componentTypesGroup.bromo, dispatchers, form])

  const initializeFormValues = React.useCallback(() => {
    // when data source is from k8s
    if (component_type && component_type.length !== 0) {
      // initialize global component type
      const orchestrator = component_type?.[0]?.orchestrator
      const workloadType = component_type?.[0]?.workload_type
      const defaultComponentType = {
        workload_type: workloadType,
        orchestrator: orchestrator ?? '',
      }
      form.setFieldsValue({ ...defaultComponentType })

      // initialize override component types
      const newOverrides = component_type_overrides?.map((override) => {
        const { data, ...rest } = override
        const { orchestrator, workload_type } = data
        const newData = {
          workload_type,
          orchestrator: orchestrator ?? '',
        }
        return {
          data: newData,
          ...rest,
        }
      })
      form.setFieldsValue({
        component_type_overrides: newOverrides,
      })
      // when data source is from Space
    } else {
      const { orchestrator } = scheduler ?? {}
      let res: IComponentTypeOverride[] = []
      orchestrator &&
        Object.entries(orchestrator).forEach(([cid, azs]: [string, Record<string, string>]) => {
          const data = Object.entries(azs).map(([idc, workloadType]) => ({
            cid,
            idc,
            data: {
              workload_type: EngineType.BROMO,
              orchestrator: workloadType,
            },
          }))
          res = res.concat(data)
        })
      form.setFieldsValue({
        workload_type: EngineType.BROMO,
        orchestrator: '',
        component_type_overrides: res,
      })
    }
    dispatchers.updateErrors(FormType.COMPONENT_TYPE)
    updateComponentType()
  }, [component_type, component_type_overrides, dispatchers, form, scheduler])

  React.useEffect(() => {
    initializeFormValues()
  }, [initializeFormValues])

  React.useEffect(() => {
    dispatchers.updateDeployConfigForms({ [FormType.COMPONENT_TYPE]: form })
  }, [dispatchers, form, isEditing])

  React.useEffect(() => {
    const componentTypeOverrides = form
      .getFieldValue('component_type_overrides')
      ?.filter(
        (override: IComponentTypeOverride) =>
          override && Object.keys(countryAzsOptions).includes(override.cid),
      )
      .map((override: IComponentTypeOverride) =>
        countryAzsOptions[override.cid].includes(override.idc)
          ? { ...override }
          : {
              ...override,
              idc: undefined,
              data: { workload_type: undefined, orchestrator: undefined },
            },
      )
    form.setFieldsValue({
      component_type_overrides: componentTypeOverrides,
    })
  }, [countryAzsOptions, form])

  const defaultComponentType: string = form.getFieldValue('workload_type')
  const bromoMode = defaultComponentType === EngineType.BROMO
  return (
    <SectionWrapper
      title="Workload Type"
      tooltip="Component type will affect the following config:Extra Config、Pod Flavor、Strategy、Canary Deployment."
      anchorKey={FormType.COMPONENT_TYPE}
      notice={
        <>
          Click <a href={NOTICE_ADDRESS}>here</a> for more Workload - Advanced Config mapping info
        </>
      }
    >
      <Form
        form={form}
        layout="horizontal"
        requiredMark={false}
        onValuesChange={() => updateComponentType()}
        onFieldsChange={() => dispatchers.updateErrors(FormType.COMPONENT_TYPE)}
      >
        <RowFormField
          rowKey="Global Type"
          hasBackground={false}
          tooltip="This configuration will take effect globally unless it is overridden"
        >
          <div style={{ display: 'flex' }}>
            <Form.Item
              name="workload_type"
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: true,
                  message: 'Please fill in your target componentType(s)',
                },
              ]}
            >
              <AutoDisabledSelect dropdownMatchSelectWidth={false} style={{ minWidth: '100px' }}>
                {filteredcomponents?.map((component) => (
                  <Select.Option value={component.name} key={component.name}>
                    {component.nameDisplay}
                  </Select.Option>
                ))}
              </AutoDisabledSelect>
            </Form.Item>
            <Form.Item
              name="orchestrator"
              style={{ marginBottom: 0, marginLeft: '16px' }}
              hidden={!bromoMode}
            >
              <AutoDisabledSelect
                dropdownMatchSelectWidth={false}
                style={{ minWidth: '100px' }}
                allowClear
              >
                {globalOrchestratorList?.map((orchestrator) => (
                  <Select.Option value={orchestrator} key={orchestrator}>
                    {orchestrator}
                  </Select.Option>
                ))}
              </AutoDisabledSelect>
            </Form.Item>
          </div>
        </RowFormField>
        <RowFormField
          rowKey="Override"
          tooltip="You can override the default configuration with this function"
        >
          <Form.List name="component_type_overrides">
            {(fields, { add, remove }) => (
              <TableFormList
                onAdd={add}
                onRemove={remove}
                dataSource={fields}
                dataColumns={columns}
                addButtonText="Add Override"
                formType={FormType.COMPONENT_TYPE}
              />
            )}
          </Form.List>
        </RowFormField>
      </Form>
    </SectionWrapper>
  )
}

export default ComponentType
