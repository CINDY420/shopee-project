import { Cascader } from 'infrad'
import { DefaultOptionType } from 'infrad/lib/cascader'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import {
  buildProductValue,
  parseProductValue,
} from 'src/components/App/Cluster/AddOtherCluster/ServiceNameCascader/helper'
import {
  eksEnumsController_listAllSpaceTenantProducts,
  eksEnumsController_listAllSpaceTenants,
} from 'src/swagger-api/apis/EksEnums'

interface ICascaderOption extends DefaultOptionType {
  value?: string | number | null
  label: string | ReactNode
  children?: ICascaderOption[]
  isLeaf?: boolean
  loading?: boolean
}

interface IServiceNameCascaderProps {
  value?: (string | number)[]
  placeholder?: string
  onChange?: (value: (string | number)[], selectedOptions: ICascaderOption[]) => void
}

const ServiceNameCascader: React.FC<IServiceNameCascaderProps> = ({
  value,
  placeholder,
  onChange,
}) => {
  const [serviceOptions, setServiceOptions] = useState<ICascaderOption[]>([])
  const getServiceOptionsFn = useCallback(async () => {
    const tenantsResponse = await eksEnumsController_listAllSpaceTenants()
    const tenantOptions: ICascaderOption[] = tenantsResponse?.items.map((tenant) => ({
      value: tenant,
      label: tenant,
      isLeaf: false,
    }))
    setServiceOptions(tenantOptions)
  }, [])
  const handleLoadData = async (selectedOptions: ICascaderOption[]) => {
    // The Cascader has 2 level, and the 2nd level data is fetched by the 1nd level data
    if (selectedOptions.length !== 1) return
    const selectedTeamOption = selectedOptions[0]
    selectedTeamOption.loading = true
    const tenantName = selectedTeamOption.value?.toString() || ''
    const currentProducts = await eksEnumsController_listAllSpaceTenantProducts({
      tenantName,
    })
    selectedTeamOption.loading = false
    const productOptions = currentProducts.items.map(({ productName, productId }) => ({
      label: productName,
      value: buildProductValue(productName, productId),
    }))
    selectedTeamOption.children = productOptions
    setServiceOptions([...serviceOptions])
  }
  useEffect(() => {
    void getServiceOptionsFn()
  }, [getServiceOptionsFn])

  return (
    <Cascader
      value={value}
      options={serviceOptions}
      placeholder={placeholder}
      displayRender={(service) => {
        const [tenantName, productValue] = service
        const { productName } = parseProductValue(productValue)
        return `${tenantName} / ${productName}`
      }}
      loadData={handleLoadData}
      onChange={onChange}
    />
  )
}

export default ServiceNameCascader
