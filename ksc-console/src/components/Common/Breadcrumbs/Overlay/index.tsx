import React from 'react'
import { useDebounce } from 'react-use'
import { SearchOutlined } from 'infra-design-icons'
import { Wrapper, ListWrapper, StyledList, StyledInput } from './style'

export interface IOverlayProps {
  crumbName?: string
  dropdownLists?: Array<any>
  onSelect?: (item: { name: string; id: string }) => void
}

const Overlay: React.FC<IOverlayProps> = ({ crumbName, dropdownLists = [], onSelect }) => {
  const [inputValue, setInputValue] = React.useState<string>('')
  const [menuList, setMenuList] = React.useState(dropdownLists)
  useDebounce(
    () => {
      const filterList = dropdownLists.filter(
        (item) => item.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
      )
      setMenuList(filterList)
    },
    500,
    [inputValue],
  )

  return (
    <Wrapper>
      <StyledInput
        value={inputValue}
        onChange={({ currentTarget }) => setInputValue(currentTarget.value)}
        placeholder={`Search ${crumbName}`}
        size="small"
        suffix={<SearchOutlined />}
      />
      <ListWrapper>
        <StyledList>
          {menuList?.map((item) => (
            <StyledList.Item
              key={item.name}
              onClick={() => onSelect && onSelect(item)}
              title={item.name}
            >
              {item.name}
            </StyledList.Item>
          ))}
        </StyledList>
      </ListWrapper>
    </Wrapper>
  )
}

export default Overlay
