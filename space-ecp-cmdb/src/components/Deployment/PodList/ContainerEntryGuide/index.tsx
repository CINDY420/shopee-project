import { Button, Popover, Typography } from 'infrad'
import {
  Command,
  Description,
  GuideContainer,
  GuideTitle,
  Instruction,
} from 'src/components/Deployment/PodList/ContainerEntryGuide/style'
import { ENTER_CONTAINER_STEPS, StepType } from 'src/constants/pod'
import { ProfileOutlined } from 'infra-design-icons'

interface IContainerEntryGuideProps {
  env: string
  sduName: string
}

const renderGuideStep = ({ description, command }: StepType) => (
  <>
    <Description>{description}</Description>
    <Command>
      <Typography.Text
        copyable={{
          tooltips: 'Copy command',
          text: command,
        }}
        style={{ verticalAlign: 'middle' }}
      >
        {command}
      </Typography.Text>
    </Command>
  </>
)

export const ContainerEntryGuide: React.FC<IContainerEntryGuideProps> = ({ env, sduName }) => {
  const entryGuide = () => (
    <GuideContainer>
      <GuideTitle>Guide for Container Entry</GuideTitle>
      <Instruction>
        It&apos;s recommended to use SMC to enter a certain container. The following is the
        corresponding usage guide:
      </Instruction>
      {ENTER_CONTAINER_STEPS(env, sduName).map((step) => renderGuideStep(step))}
      <>
        <Description>3. Other SMC commands:</Description>
        <Command>
          <Typography.Link
            href="https://confluence.shopee.io/display/IPG/SMC+for+ECP"
            target="_blank"
          >
            smc Guide
          </Typography.Link>
        </Command>
      </>
    </GuideContainer>
  )

  return (
    <Popover content={entryGuide} placement="left" getPopupContainer={() => document.body}>
      <Button type="link" icon={<ProfileOutlined style={{ verticalAlign: 'middle' }} />}>
        Guide for Container Entry
      </Button>
    </Popover>
  )
}
