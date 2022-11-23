import type React from 'react'
import { FunctionComponent, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { intersectionBy, uniqBy, xorBy } from 'lodash'
import type { Store } from 'rc-field-form/lib/interface'
import { ITrash, PlusOutlined } from 'infra-design-icons'
import { Button, Form, message, Space, Spin } from 'infrad'

import {
  DivWrapperForIcon,
  FlexSpace,
  StyledFooter,
  StyledFormBox,
  StyledFormItem,
} from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ConfigForm/style'
import {
  tenantAndEnvState,
  useConfigsNumber,
  useUpdateFormSavedStatus,
} from 'src/components/App/Tenant/AppClusterConfig/store'
import { AzSegmentBindClusterSelector } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/AzSegmentBindClusterSelector'
import {
  AppClusterConfigSearch,
  scopeMap,
  SCOPES,
} from 'src/components/App/Tenant/AppClusterConfig/AppClusterConfigSearch'
import { convertCamelcaseToPascalCase } from 'src/helpers/string'
import { antdConfirm } from 'src/helpers/antdModel'
import { fetch } from 'src/rapper'

export type ConfigFormProp = {
  initialValues?: Store
  className?: string
  scope?: string
  extraClusterMetaSelector?: {
    width?: string
    required?: boolean
    selectorDom?: React.ReactNode
  }
}
export const ConfigForm: FunctionComponent<ConfigFormProp> = (props) => {
  const { className, scope = 'tenant', extraClusterMetaSelector, initialValues } = props
  const formName = 'appClusterConfigForm'
  const extraColName = convertCamelcaseToPascalCase(scope ?? '')
  const formListName = `${formName}${extraColName.replace(/-/g, '')}List`
  const [, setEditStatus] = useUpdateFormSavedStatus()
  const tenantAndEnv = useRecoilValue(tenantAndEnvState)
  const { env, tenant } = tenantAndEnv
  const [_configsNumbers, setConfigsNumber] = useConfigsNumber()
  const [loadingForm, setLoadingForm] = useState(false)

  const [form] = Form.useForm()

  const fetchAppClusterConfigs = async () => {
    setLoadingForm(true)
    const search = new AppClusterConfigSearch(
      {
        env,
        tenant,
      },
      true,
    )
    const result = await search.getConfigs(scope, tenant, env, scopeMap[scope] === SCOPES.SDU)
    setLoadingForm(false)
    return result
  }

  const setAppClusterConfigs = async () => {
    if (!env || !tenant) {
      return
    }
    const data = await fetchAppClusterConfigs()
    form.setFieldsValue({
      [formListName]: data.aggregated.map((item) => {
        const value = {
          azSegment: item.azSegment,
          cluster: item.cluster,
          extra: item.keys,
          clusterUuid: item.clusterUuid,
        }
        if (scopeMap[scope] === SCOPES.SDU) {
          const sduKeys = item.keys.map((key) => {
            const [app, module, _env, cid] = (key ?? '').split('-')
            return `${app}-${module}-${cid}`
          })
          value.extra = sduKeys
        }
        return value
      }),
    })
    setConfigsNumber(scope, data.aggregated.length)
  }

  const handleSubmit = async (
    values: Record<
      string,
      { azSegment: string; cluster: string; extra: string[]; clusterUuid?: string }[]
    >,
  ) => {
    const formData = values[formListName]
    const configs = formData.flatMap((item) => {
      const { azSegment, cluster, extra, clusterUuid } = item
      const [azKey, segmentKey] = azSegment.split('-')
      if (!extra) {
        return [
          {
            env,
            azKey,
            segmentKey,
            cluster,
            /**
             * for new (added) row, clusterUuid will be undefined and cluster is the uuid
             * for old row, clusterUuid will not be undefined
             */
            clusterUuid: clusterUuid ?? cluster,
            key: tenant,
            scope: SCOPES.TENANT,
            cmdbTenantId: tenant,
          },
        ]
      }

      if (scopeMap[scope] === SCOPES.SDU) {
        return extra.map((extraKey) => {
          const [app, module, cid] = extraKey.split('-')
          return {
            env,
            azKey,
            segmentKey,
            cluster,
            clusterUuid: clusterUuid ?? cluster,
            key: `${app}-${module}-${env}-${cid}`,
            scope: SCOPES.SDU,
            cmdbTenantId: tenant,
          }
        })
      }

      return extra.map((key) => ({
        env,
        azKey,
        segmentKey,
        clusterUuid: clusterUuid ?? cluster,
        key,
        scope,
        cmdbTenantId: tenant,
      }))
    })

    const getConfigId = (item: { azKey: string; segmentKey: string; key: string }) =>
      [item.azKey, item.segmentKey, item.key].join('-')

    const currentConfigs = uniqBy(configs, getConfigId)
    if (currentConfigs.length !== configs.length) {
      console.error('duplicate configs', xorBy(configs, currentConfigs, getConfigId))
      return message.error('configs is duplicated, please check it')
    }
    const oldConfigs = (await fetchAppClusterConfigs()).listed ?? []

    const unchangedConfigs = intersectionBy(oldConfigs, currentConfigs, getConfigId)
    const deletedConfigs = xorBy(oldConfigs, unchangedConfigs, getConfigId)
    const newConfigs = xorBy(currentConfigs, unchangedConfigs, getConfigId).map((item) => ({
      env,
      cmdbTenantId: tenant,
      clusterUuid: item.clusterUuid,
      key: item.key,
      scope: scopeMap[scope],
      segmentKey: item.segmentKey ?? '',
      azKey: item.azKey,
    }))

    if (newConfigs.length) {
      await fetch['POST/ecpadmin/appClusterConfigs:batchAdd']({ configs: newConfigs })
    }
    if (deletedConfigs.length) {
      await fetch['POST/ecpadmin/appClusterConfigs:batchRemove']({
        idList: deletedConfigs.map((item) => item.id!),
      })
    }
    await setAppClusterConfigs()
    setEditStatus(scope, true)
  }

  useEffect(() => {
    void setAppClusterConfigs()
  }, [env, tenant])

  return (
    <div className={className}>
      <StyledFormBox $isWide={!!extraClusterMetaSelector}>
        <header>
          <span key="AZ-Segment">AZ-Segment</span>
          <span key="Cluster">Cluster</span>
          {scope && scope !== 'tenant' && <span key={scope}>{extraColName}</span>}
        </header>
        <Spin spinning={loadingForm}>
          <Form
            form={form}
            name={formName}
            onFinish={handleSubmit}
            onValuesChange={() => {
              setEditStatus(scope, false)
            }}
            autoComplete="off"
            initialValues={initialValues}
          >
            <Form.List name={formListName}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <FlexSpace key={key} align="start" size={8}>
                      <AzSegmentBindClusterSelector form={form} name={name} />
                      {extraClusterMetaSelector && (
                        <StyledFormItem
                          $width={extraClusterMetaSelector.width}
                          name={[name, 'extra']}
                          required={extraClusterMetaSelector.required}
                        >
                          {extraClusterMetaSelector.selectorDom}
                        </StyledFormItem>
                      )}
                      <DivWrapperForIcon>
                        <ITrash
                          onClick={() => {
                            remove(name)
                            setConfigsNumber(scope, fields.length - 1)
                          }}
                        />
                      </DivWrapperForIcon>
                    </FlexSpace>
                  ))}
                  <StyledFormItem $isAddButton>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add()
                        setConfigsNumber(scope, fields.length + 1)
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add
                    </Button>
                  </StyledFormItem>
                </>
              )}
            </Form.List>
          </Form>
        </Spin>
      </StyledFormBox>
      <StyledFooter>
        <Space>
          <Button
            htmlType="reset"
            onClick={async () => {
              const confirm = await antdConfirm({
                title: 'Are you sure to reset your changes?',
                okText: 'Yes',
                cancelText: 'No',
              })
              if (!confirm) return
              await setAppClusterConfigs()
              setEditStatus(scope, true)
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={async () => {
              if (!env || !tenant) {
                return message.error('please select tenant and env')
              }
              const confirmToSubmit = await antdConfirm({
                title: 'Notice',
                okText: 'Confirm',
                icon: null,
                closeIcon: null,
                content:
                  'The config will take effect during the next deployment. Please type the commit message then save the change.',
              })
              if (confirmToSubmit) {
                form.submit()
              }
            }}
          >
            Save
          </Button>
        </Space>
      </StyledFooter>
    </div>
  )
}
