import * as React from 'react'
import { Input, Switch } from 'infrad'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom/extend-expect'
import withAutoDisable from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Common/WithAutoDisabled/withAutoDisable'

configure({ adapter: new Adapter() })
describe('notFound render UI result', () => {
  it('should return Component with property of editing', () => {
    const SwitchComponent = () => <Switch />
    const EditableSwitch = withAutoDisable(SwitchComponent)
    const editableSwitchNode = shallow(<EditableSwitch />)
    expect(editableSwitchNode.props()).toHaveProperty('disabled')

    const InputComponent = () => <Input />
    const EditableInput = withAutoDisable(InputComponent)
    const editableInputNode = shallow(<EditableInput />)
    expect(editableInputNode.props()).toHaveProperty('disabled')
  })
})
