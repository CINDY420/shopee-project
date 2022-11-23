import * as React from 'react'
import { Radio } from 'infrad'

import { Container, FlexWrap } from './style'

interface ITabsProps {
  /** Currently selected value */
  activeKey?: string | number
  /** Default selected value */
  defaultActiveKey?: string | number
  /** Callback function when the value changes */
  onChange?: (activeValue: string | number) => void
  /** Extra content */
  tabBarExtraContent?: React.ReactElement
  optionType?: string
}

/**
 * Array radio button
 */
export const RadiosTabs: React.FC<ITabsProps> = ({
  activeKey,
  defaultActiveKey,
  children,
  onChange,
  tabBarExtraContent,
  optionType
}) => {
  const Option = optionType === 'default' ? Radio : Radio.Button

  const isControlMode = typeof activeKey !== 'undefined'
  const [activeValue, setActiveValue] = React.useState(isControlMode ? activeKey : defaultActiveKey)
  const handleRadioChange = (e: any) => {
    if (!isControlMode) {
      setActiveValue(e.target.value)
    }
    if (typeof onChange === 'function') {
      onChange(e.target.value)
    }
  }

  React.useEffect(() => {
    if (isControlMode) {
      setActiveValue(activeKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey])

  const renderRadios = () => {
    return (
      <Radio.Group value={activeValue} defaultValue={activeValue} onChange={handleRadioChange}>
        {React.Children.map(children, (element: React.ReactElement<ITabsPaneProps>) => {
          const { name, value } = element.props
          return <Option value={value}>{name}</Option>
        })}
      </Radio.Group>
    )
  }

  const renderPanes = () => {
    const result = React.Children.map(children, (element: React.ReactElement<ITabsPaneProps>) => {
      const { value, children } = element.props
      return (
        <Container value={value} activeValue={activeValue}>
          {children}
        </Container>
      )
    })
    return result
  }

  return (
    <>
      <FlexWrap>
        {renderRadios()}
        {tabBarExtraContent}
      </FlexWrap>
      {renderPanes()}
    </>
  )
}

interface ITabsPaneProps {
  name: string | number
  value: string | number
  children?: React.ReactNode
}

export const RadiosTabPane: React.FC<ITabsPaneProps> = () => {
  return <></>
}
