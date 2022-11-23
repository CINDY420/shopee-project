import { ButtonProps } from 'infrad'
import { StyledRow, StyledButton } from 'components/Common/TableCreateButton/style'

interface ITableCreateButtonProps extends ButtonProps {
  title: string
}

const TableCreateButton = (props: ITableCreateButtonProps) => {
  const { title, onClick } = props
  return (
    <StyledRow>
      <StyledButton type="primary" onClick={onClick}>
        {title}
      </StyledButton>
    </StyledRow>
  )
}

export default TableCreateButton
