import { Button, Dropdown, DropDownProps, ButtonProps } from 'infrad'
import { StyledRow } from 'components/Common/TableDropdown/style'
import { IArrowDown } from 'infra-design-icons'

interface ITableDropdownProps extends DropDownProps {
  title: string
  buttonType?: ButtonProps['type']
}

const TableDropdown = (props: ITableDropdownProps) => {
  const { title, buttonType = 'default', ...resetProps } = props
  return (
    <StyledRow>
      <Dropdown {...resetProps}>
        <Button type={buttonType}>
          {title}
          <IArrowDown />
        </Button>
      </Dropdown>
    </StyledRow>
  )
}

export default TableDropdown
