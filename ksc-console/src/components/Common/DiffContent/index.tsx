import { StyledDel, StyledIns } from 'components/Common/DiffContent/style'
import { diffLines } from 'diff'

interface IDiffContentProps {
  oldStr: string
  newStr: string
}
const DiffContent: React.FC<IDiffContentProps> = ({ oldStr, newStr }) => {
  const diff = diffLines(oldStr, newStr)
  return (
    <pre>
      {diff.map((line) => {
        const { removed, added, value } = line
        if (removed) {
          return <StyledDel key={value}>{value}</StyledDel>
        }
        if (added) {
          return <StyledIns key={value}>{value}</StyledIns>
        }
        return value
      })}
    </pre>
  )
}

export default DiffContent
