import { atom, useRecoilState } from 'recoil'
import { StyledConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ConfigForm/style'
import { StyledProjectConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ProjectConfigForm/style'
import { StyledApplicationConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ApplicationConfigForm/style'
import { StyledSDUConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/SDUConfigForm/style'

export const DefaultConfigTabs = [
  {
    title: 'Tenant',
    scope: 'tenant',
    DefaultConfigForm: StyledConfigForm,
  },
  {
    title: 'Project',
    scope: 'project',
    DefaultConfigForm: StyledProjectConfigForm,
  },
  {
    title: 'Application',
    scope: 'application',
    DefaultConfigForm: StyledApplicationConfigForm,
  },
  {
    title: 'SDU',
    scope: 'application-CID',
    DefaultConfigForm: StyledSDUConfigForm,
  },
]

export const formSavedStatusList = atom({
  default: DefaultConfigTabs.map((tab) => tab.scope).map((scope) => ({
    scope,
    value: true,
  })),
  key: 'formSavedStatusList',
})

export const useUpdateFormSavedStatus = () => {
  const [savedStatusList, setSavedStatusList] = useRecoilState(formSavedStatusList)
  const setEditStatus = (scope: string | undefined, value: boolean) => {
    setSavedStatusList(
      savedStatusList.map((item) => {
        if (item.scope === scope) {
          return { ...item, value }
        }
        return item
      }),
    )
  }
  return [savedStatusList, setEditStatus] as const
}

export const configsNumberList = atom({
  default: DefaultConfigTabs.map((tab) => tab.scope).map((scope) => ({
    scope,
    value: 0,
  })),
  key: 'configsNumberList',
})

export const useConfigsNumber = () => {
  const [configsNumbers, setConfigsNumbers] = useRecoilState(configsNumberList)
  const setConfigsNumber = (scope: string | undefined, value: number) => {
    setConfigsNumbers(
      configsNumbers.map((item) => {
        if (item.scope === scope) {
          return { ...item, value }
        }
        return item
      }),
    )
  }
  return [configsNumbers, setConfigsNumber] as const
}

export const tenantAndEnvState = atom({
  key: 'tenantAndEnvState',
  default: {
    tenant: '',
    env: '',
  },
})
