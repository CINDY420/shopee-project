import { Button } from 'infrad'
import { StyledResult } from 'src/components/App/Cluster/AddOtherCluster/Finish/style'

interface IFinishProps {
  onConfirm?: () => void
}

const Finish: React.FC<IFinishProps> = ({ onConfirm }) => (
  <StyledResult
    status="success"
    title="Successfully add cluster to ECP Admin!"
    extra={
      <Button type="primary" onClick={onConfirm}>
        Confirm
      </Button>
    }
  />
)

export default Finish
