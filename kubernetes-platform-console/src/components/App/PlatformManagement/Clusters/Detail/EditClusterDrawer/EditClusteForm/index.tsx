import * as React from 'react'
import { Typography, Spin } from 'infrad'

import useAsyncFn from 'hooks/useAsyncFn'
import { IIGlobalDataResponse } from 'swagger-api/v3/models'

import { Container, StyledCheckbox as Checkbox } from './style'

const { Title } = Typography

interface IProps {
  type: string
  title: string
  initialData: string[]
  fetchFn: () => Promise<IIGlobalDataResponse>
  onChange: (key: string, value: string[]) => void
}

const Selector: React.FC<IProps> = ({ title, initialData, fetchFn, onChange, type }) => {
  const [configItems, setconfigItems] = React.useState<string[]>([])
  const [selectedData, setSelectedData] = React.useState<string[]>(initialData)
  const [getConfigItemState, getConfigItemFn] = useAsyncFn(fetchFn)
  const [isAllChecked, setIsAllChecked] = React.useState(false)

  React.useEffect(() => {
    fetchConfigData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchConfigData = async () => {
    const result = await getConfigItemFn()
    if (result) {
      const { items } = result
      setconfigItems(items)
    }
  }

  const handleSelectItem = item => {
    const index = selectedData.indexOf(item)
    const data = [...selectedData]
    if (index > -1) {
      data.splice(index, 1)
    } else {
      data.push(item)
    }
    setSelectedData(data)
    onChange(type, data)
  }

  const handleSelectAll = (e: any) => {
    const isChecked = e.target.checked
    const newData = isChecked ? [...configItems] : []
    setSelectedData(newData)
    onChange(type, newData)
  }

  React.useEffect(() => {
    setIsAllChecked(configItems.length === selectedData.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData, configItems])

  React.useEffect(() => {
    setSelectedData(initialData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  return (
    <Container>
      <Title level={4}>{title}</Title>
      <Spin spinning={getConfigItemState.loading}>
        <Checkbox checked={isAllChecked} onChange={handleSelectAll}>
          All
        </Checkbox>
        {configItems.map(item => {
          const isDisabled = initialData.includes(item)
          return (
            <Checkbox
              key={item}
              checked={isDisabled}
              onChange={() => {
                handleSelectItem(item)
              }}
            >
              {item}
            </Checkbox>
          )
        })}
      </Spin>
    </Container>
  )
}

export default Selector
