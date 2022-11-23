import { SearchOutlined } from 'infra-design-icons'
import { StyledRow, StyledInput } from './style'
import { InputProps } from 'infrad/lib/input'

const TableSearchInput = (props: InputProps) => (
  <StyledRow>
    <StyledInput suffix={<SearchOutlined />} {...props} />
  </StyledRow>
)

export default TableSearchInput
