import { FunctionComponent, useEffect, useState } from 'react'
import { StyledConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ConfigForm/style'
import { TreeSelect, TreeSelectProps } from 'infrad'
import { useRecoilValue } from 'recoil'
import { tenantAndEnvState } from 'src/components/App/Tenant/AppClusterConfig'
import { IOptionData } from 'src/hooks/useCascadeSelect'
import { fetch } from 'src/rapper'

function generateTree(
  appList: IOptionData[],
  cidList: IOptionData[],
): TreeSelectProps<string>['treeData'] {
  return appList.map((app) => ({
    title: app.label,
    value: app.value,
    key: app.value,
    children: cidList.map((cid) => ({
      title: `${app.label}-${cid.label}`,
      value: `${app.value}-${cid.value}`,
      key: `${app.value}-${cid.value}`,
    })),
  }))
}

type SDUConfigFormProp = {
  className?: string
}
export const SDUConfigForm: FunctionComponent<SDUConfigFormProp> = (props) => {
  const { className } = props

  const tenantAndEnv = useRecoilValue(tenantAndEnvState)
  const { tenant } = tenantAndEnv
  const [appOptions, setAppOptions] = useState<IOptionData[]>([])
  const [cidOptions, setCIDOptions] = useState<IOptionData[]>([])

  const getAppOptions = async () => {
    const result = await fetch['GET/ecpadmin/applications']({ id: tenant, scope: 'tenant' })
    setAppOptions(
      result.items.map((item) => ({
        label: item,
        value: item,
      })),
    )
  }
  const getCIDOptions = async () => {
    const { items } = await fetch['GET/ecpadmin/cids']()
    setCIDOptions(
      items.map((item) => ({
        label: item.name,
        value: item.name,
      })),
    )
  }

  useEffect(() => {
    void getAppOptions()
    void getCIDOptions()
  }, [tenant])

  const treeData = generateTree(appOptions, cidOptions)

  const treeSelectProps: TreeSelectProps<string> = {
    treeData,
    treeCheckable: true,
    placeholder: 'Select',
    filterTreeNode: true,
    autoClearSearchValue: true,
    dropdownStyle: {
      zIndex: 20,
    },
  }

  return (
    <StyledConfigForm
      scope="application-CID"
      className={className}
      extraClusterMetaSelector={{
        selectorDom: <TreeSelect getPopupContainer={() => document.body} {...treeSelectProps} />,
      }}
    />
  )
}
