import * as React from 'react'

import SectionWrapper from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/SectionWrapper'
import TableFormList from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/TableFormList'
import RowFormField from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/RowFormField'
import { Form, Select } from 'infrad'
import {
  DeployConfigContext,
  FORM_TYPE,
  getDispatchers
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { AutoDisabledSelect } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled'
import { deployConfigControllerListComponents } from 'swagger-api/v1/apis/DeployConfig'
import { IListComponentResponse, IComponent, IComponentTypeOverride, IComponents } from 'swagger-api/v1/models'
import { selectedApplication } from 'states/applicationState/application'
import { useRecoilValue } from 'recoil'
import { find, union, partition, uniqBy, uniq } from 'lodash'
import { StringParam, useQueryParam } from 'use-query-params'

enum Category {
  BROMO = 'bromo',
  DEPLOYMENT = 'deployment',
  CLONESET = 'cloneset',
  STATEFULSET = 'statefulset'
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
  const { newDeployConfig, countryAzsOptions, isEditing } = state
  const { component_type, component_type_overrides } = newDeployConfig

  const application = useRecoilValue(selectedApplication)
  const { tenantId, projectName, name: appName } = application

  const [selectedEnv] = useQueryParam('selectedEnv', StringParam)

  const [form] = Form.useForm()
  const [componentTypes, setComponentTypes] = React.useState<IListComponentResponse['components']>({})
  const [componentTypesGroup, setComponentTypesGroup] = React.useState<IComponentType>({ bromo: [], nonBromo: [] })
  const [filteredcomponents, setFilteredcomponents] = React.useState<IComponent[]>([])
  const [categoryGroup, setCategoryGroup] = React.useState<ICategoryGroup>({
    bromo: [],
    deployment: [],
    statefulset: [],
    cloneset: []
  })

  const convertTypeIntoCategories = React.useCallback(
    (type: string): string[] => {
      if (!type || type === 'bromo') return undefined
      return Object.entries(categoryGroup)
        .filter(([_, value]) => {
          return value.includes(type)
        })
        .map(([key, _]) => key)
    },
    [categoryGroup]
  )

  const columns = [
    {
      title: 'Country',
      dataIndex: 'cid',
      key: 'cid',
      width: '11%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record

        return (
          <Form.Item {...restField} name={[name, 'cid']}>
            <AutoDisabledSelect>
              {Object.keys(countryAzsOptions).map(
                cid =>
                  cid && (
                    <Select.Option value={cid} key={cid}>
                      {cid}
                    </Select.Option>
                  )
              )}
            </AutoDisabledSelect>
          </Form.Item>
        )
      }
    },
    {
      title: 'AZ',
      dataIndex: 'idc',
      key: 'idc',
      width: '34%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record

        return (
          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.component_type_overrides?.[name]?.cid !== curValue.component_type_overrides?.[name]?.cid
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
                    {azs.map(az => (
                      <Select.Option value={az} key={az} disabled={!!find(formValues, { cid, idc: az })}>
                        {az}
                      </Select.Option>
                    ))}
                  </AutoDisabledSelect>
                </Form.Item>
              )
            }}
          </Form.Item>
        )
      }
    },
    {
      title: 'Component Type',
      dataIndex: ['data', 'workload_type'],
      key: 'workload_type',
      width: '50%',
      render: (_: unknown, record: FormListFieldData) => {
        const { key, name, ...restField } = record

        return (
          <Form.Item
            shouldUpdate={(prevValue, curValue) =>
              prevValue.component_type_overrides?.[name]?.idc !== curValue.component_type_overrides?.[name]?.idc
            }
          >
            {({ getFieldValue }) => {
              const idc: string = getFieldValue(['component_type_overrides', name, 'idc'])
              const type: string = getFieldValue(['component_type_overrides', name, 'data', 'workload_type'])
              const categories = convertTypeIntoCategories(type)
              const components: IComponent[] = categories
                ? componentTypes?.[idc]?.components?.filter((component: IComponent) =>
                    categories.includes(component.category)
                  )
                : componentTypes?.[idc]?.components
              return (
                <Form.Item
                  {...restField}
                  name={[name, 'data', 'workload_type']}
                  rules={[{ required: true, message: 'Please fill in your target componentType(s)' }]}
                >
                  <AutoDisabledSelect>
                    {components?.map(component => (
                      <Select.Option value={component.name} key={component.name}>
                        {component.nameDisplay}
                      </Select.Option>
                    ))}
                  </AutoDisabledSelect>
                </Form.Item>
              )
            }}
          </Form.Item>
        )
      }
    }
  ]

  const getComponentTypes = React.useCallback(async () => {
    if (selectedEnv) {
      const { components } = await deployConfigControllerListComponents({
        tenantId,
        appName,
        projectName,
        env: selectedEnv
      })
      setComponentTypes(components)

      // split types into groups which include 'bromo' and 'nonBromo'
      // split category into groups which include 'bromo', 'deployment', 'statefulset' and 'cloneset'
      const formatComponents = uniqBy(
        union(...Object.values(components).map((item: IComponents) => item.components)),
        'name'
      )
      const nameMap = formatComponents.reduce((acc: Record<string, string>, curr) => {
        const obj = { [curr.name]: curr.nameDisplay }
        return { ...acc, ...obj }
      }, {})
      dispatchers.updateNameMap(nameMap)

      const componentType: IComponentType = {
        bromo: [],
        nonBromo: []
      }
      const category: ICategoryGroup = {
        bromo: [],
        statefulset: [],
        deployment: [],
        cloneset: []
      }
      formatComponents?.forEach(each => {
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
          Object.values(Category).forEach(key => {
            category[key].push(each.name)
          })
        } else {
          category[each.category].push(each.name)
        }
      })
      setComponentTypesGroup(componentType)
      setCategoryGroup(category)
    }
  }, [appName, dispatchers, projectName, selectedEnv, tenantId])

  React.useEffect(() => {
    getComponentTypes()
  }, [getComponentTypes])

  React.useEffect(() => {
    const components = uniqBy(
      union(...Object.values(componentTypes).map((item: IComponents) => item.components)),
      'name'
    )
    const type: string = form.getFieldValue('component_type')
    const categories = convertTypeIntoCategories(type)
    const filteredcomponents: IComponent[] = categories
      ? components.filter((component: IComponent) => {
          return categories?.includes(component.category)
        })
      : components
    setFilteredcomponents(filteredcomponents)
  }, [componentTypes, convertTypeIntoCategories, form])

  const updateComponentType = React.useCallback(() => {
    // handle override components
    const component_type_overrides: IComponentTypeOverride[] = form.getFieldValue(['component_type_overrides'])
    const [bromoComponentsName, nonBromoComponenstName] = partition(
      component_type_overrides
        ?.map(component => {
          return component?.data?.workload_type
        })
        ?.filter(componentName => componentName !== undefined),
      component => componentTypesGroup.bromo.includes(component)
    )

    // handle default component
    const defaultComponent = form.getFieldsValue(['component_type'])
    if (componentTypesGroup.bromo.includes(defaultComponent.component_type)) {
      bromoComponentsName.push(defaultComponent.component_type)
    } else {
      nonBromoComponenstName.push(defaultComponent.component_type)
    }

    // reset form
    if (bromoComponentsName.length === 0) {
      dispatchers.updateDeployConfigForms({
        [FORM_TYPE.ASSIGNMENT_POLICIES]: undefined
      })
      if (nonBromoComponenstName.length === 0) {
        dispatchers.updateDeployConfigForms({ [FORM_TYPE.STRAEGY]: undefined })
      }
    } else if (nonBromoComponenstName.length === 0) {
      dispatchers.updateDeployConfigForms({
        [FORM_TYPE.EXTRA_CONFIG]: undefined
      })
    }
    dispatchers.updateBromoComponent({ bromo: uniq(bromoComponentsName), nonBromo: uniq(nonBromoComponenstName) })
  }, [componentTypesGroup.bromo, dispatchers, form])

  const initializeFormValues = React.useCallback(() => {
    form.setFieldsValue({
      component_type: component_type?.[0]?.workload_type,
      component_type_overrides
    })
    dispatchers.updateErrors(FORM_TYPE.COMPONENT_TYPE)
    updateComponentType()
  }, [component_type, component_type_overrides, dispatchers, form, updateComponentType])

  React.useEffect(() => {
    initializeFormValues()
  }, [initializeFormValues])

  React.useEffect(() => {
    dispatchers.updateDeployConfigForms({ [FORM_TYPE.COMPONENT_TYPE]: form })
  }, [dispatchers, form, isEditing])

  React.useEffect(() => {
    const componentTypeOverrides = form
      .getFieldValue('component_type_overrides')
      ?.filter((override: IComponentTypeOverride) => {
        return override && Object.keys(countryAzsOptions).includes(override.cid)
      })
      .map((override: IComponentTypeOverride) => {
        return countryAzsOptions[override.cid].includes(override.idc)
          ? { ...override }
          : { ...override, idc: undefined, data: { workload_type: undefined } }
      })
    form.setFieldsValue({
      component_type_overrides: componentTypeOverrides
    })
  }, [countryAzsOptions, form])

  return (
    <SectionWrapper
      title='Component Type'
      tooltip='Component type will affect the following config:Extra Config、Pod Flavor、Strategy、Canary Deployment.'
      anchorKey={FORM_TYPE.COMPONENT_TYPE}
      notice={
        <>
          Click <a href={NOTICE_ADDRESS}>here</a> for more Component - Advanced Config mapping info
        </>
      }
    >
      <Form
        form={form}
        layout='horizontal'
        requiredMark={false}
        onValuesChange={() => updateComponentType()}
        onFieldsChange={() => dispatchers.updateErrors(FORM_TYPE.COMPONENT_TYPE)}
      >
        <RowFormField
          rowKey='Default'
          hasBackground={false}
          tooltip='This configuration will take effect globally unless it is overridden'
        >
          <Form.Item name='component_type' style={{ marginBottom: 0 }}>
            <AutoDisabledSelect style={{ width: '200px' }}>
              {filteredcomponents?.map(component => (
                <Select.Option value={component.name} key={component.name}>
                  {component.nameDisplay}
                </Select.Option>
              ))}
            </AutoDisabledSelect>
          </Form.Item>
        </RowFormField>
        <RowFormField rowKey='Override' tooltip='You can override the default configuration with this function'>
          <Form.List name='component_type_overrides'>
            {(fields, { add, remove }) => (
              <TableFormList
                onAdd={add}
                onRemove={remove}
                dataSource={fields}
                dataColumns={columns}
                addButtonText='Add Override'
                formType={FORM_TYPE.COMPONENT_TYPE}
              />
            )}
          </Form.List>
        </RowFormField>
      </Form>
    </SectionWrapper>
  )
}

export default ComponentType
