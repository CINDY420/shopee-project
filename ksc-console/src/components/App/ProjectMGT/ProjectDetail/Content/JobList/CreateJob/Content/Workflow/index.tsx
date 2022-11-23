import Task from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content/Workflow/Task'
import { StyledRoot } from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content/Basics/style'

const WorkflowStepContent = ({ form }) => (
  <StyledRoot>
    <Task form={form} />
  </StyledRoot>
)

export default WorkflowStepContent
