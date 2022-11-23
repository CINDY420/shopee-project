import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { StyledConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ConfigForm/style'
import { Select } from 'infrad'
import { fetch } from 'src/rapper'
import { useRecoilValue } from 'recoil'
import { tenantAndEnvState } from 'src/components/App/Tenant/AppClusterConfig'
import { IOptionData } from 'src/hooks/useCascadeSelect'

type ApplicationConfigFormProp = {
  className?: string
}
export const ApplicationConfigForm: FunctionComponent<ApplicationConfigFormProp> = (props) => {
  const { className } = props

  const tenantAndEnv = useRecoilValue(tenantAndEnvState)
  const { tenant } = tenantAndEnv
  const [options, setOptions] = useState<IOptionData[]>([])

  const getOptions = useCallback(async () => {
    const result = await fetch['GET/ecpadmin/applications']({ id: tenant, scope: 'tenant' })
    setOptions(
      result.items.map((item) => ({
        label: item,
        value: item,
      })),
    )
  }, [tenant])

  useEffect(() => {
    void getOptions()
  }, [getOptions])

  return (
    <StyledConfigForm
      className={className}
      scope="application"
      extraClusterMetaSelector={{
        selectorDom: (
          <Select mode="multiple" placeholder="select" getPopupContainer={() => document.body}>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        ),
      }}
    />
  )
}
