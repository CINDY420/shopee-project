import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Select } from 'infrad'
import { StyledConfigForm } from 'src/components/App/Tenant/AppClusterConfig/DefaultConfig/ConfigForm/style'
import { fetch } from 'src/rapper'
import { useRecoilValue } from 'recoil'
import { tenantAndEnvState } from 'src/components/App/Tenant/AppClusterConfig'
import { IOptionData } from 'src/hooks/useCascadeSelect'

type ProjectConfigFormProp = {
  className?: string
}
export const ProjectConfigForm: FunctionComponent<ProjectConfigFormProp> = (props) => {
  const { className } = props

  const tenantAndEnv = useRecoilValue(tenantAndEnvState)
  const { tenant } = tenantAndEnv
  const [options, setOptions] = useState<IOptionData[]>([])

  const getOptions = useCallback(async () => {
    const result = await fetch['GET/ecpadmin/projects']({ tenantId: tenant })
    setOptions(
      result.items.map((item) => ({
        label: item,
        value: item,
      })),
    )
  }, [])

  useEffect(() => {
    void getOptions()
  }, [getOptions])

  return (
    <StyledConfigForm
      scope="project"
      className={className}
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
