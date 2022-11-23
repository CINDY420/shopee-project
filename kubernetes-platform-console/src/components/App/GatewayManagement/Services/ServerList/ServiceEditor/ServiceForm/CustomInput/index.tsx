import React from 'react'
import { Input } from 'infrad'

import { CustomInputWrapper, OptionWrapper, OptionItem } from './style'

const options = ['cid', 'env', 'domain_cid_suffix', 'domain_env_flag']

const textSize = (
  text: string,
  style?: {
    fontWeight: string | number
    fontSize: string
    fontFamily: string
  }
) => {
  const { fontWeight = 'normal', fontSize = '14px', fontFamily = 'PingFang SC' } = style || {}
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`

  return ctx.measureText(text).width
}

const innerPosition = (input: any) => {
  return {
    start: input.selectionStart || 0,
    end: input.selectionEnd || 0
  }
}

interface ICustomInputProps {
  onChange?: (value: string) => void
  value?: string
}

const CustomInput: React.FC<ICustomInputProps> = ({ value: initValue = '', onChange }) => {
  const [isOpened, setIsOpened] = React.useState(false)
  const [value, setValue] = React.useState(initValue)
  const [translateX, setTranslateX] = React.useState(0)
  const ref = React.useRef<any>({ input: null })

  const handleChange = e => {
    const value = e.target.value
    const index = value.lastIndexOf('@')

    setValue(value)

    if (onChange) {
      onChange(value)
    }

    if (index !== -1 && index === value.length - 1) {
      const input = ref.current.input
      const { clientWidth } = input
      const { start } = innerPosition(input)
      const text = value.slice(0, start)
      const size = textSize(text)

      setTranslateX(Math.min(size, clientWidth - 140))
      setIsOpened(true)
    } else {
      setIsOpened(false)
    }
  }

  const handleSelect = (option: string) => {
    const current = ref.current
    const { start } = innerPosition(current.input)
    const result = value.slice(0, start) + option + value.slice(start)

    setValue(result)
    setIsOpened(false)
    current.focus()

    if (onChange) {
      onChange(result)
    }
  }

  return (
    <CustomInputWrapper>
      <div>
        <Input ref={ref} onChange={handleChange} value={value} placeholder='Input...' />
      </div>
      {isOpened && (
        <OptionWrapper style={{ transform: `translateX(${translateX}px)` }}>
          {options.map(item => (
            <OptionItem key={item} onClick={() => handleSelect(item)}>
              {item}
            </OptionItem>
          ))}
        </OptionWrapper>
      )}
    </CustomInputWrapper>
  )
}

export default CustomInput
