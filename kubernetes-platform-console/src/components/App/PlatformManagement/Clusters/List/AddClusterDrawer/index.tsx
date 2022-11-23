import * as React from 'react'
import * as R from 'ramda'
import { Form } from 'infrad'

import Drawer from 'components/Common/CrudDrawer'
import ClusterForm from './ClusteForm'
import { checkIfFormHasError } from 'helpers/form'

interface IClusterFormDrawerProps {
  visible: boolean
  closeDrawer: () => void
  onSubmit: (param: any) => void
  submitCallback: () => void
}

const initConfig = {
  name: '',
  kubeconfig: ''
}

const ClusterFormDrawer: React.FC<IClusterFormDrawerProps> = (props: IClusterFormDrawerProps) => {
  const { visible, submitCallback, closeDrawer, onSubmit } = props

  const [name, setName] = React.useState(initConfig.name)
  const [kubeconfig, setKubeconfig] = React.useState(initConfig.kubeconfig)
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true)
  const [form] = Form.useForm()

  const clearForm = () => {
    setName(initConfig.name)
    setKubeconfig(initConfig.kubeconfig)
  }

  const getFormState = () => {
    return (
      R.equals(initConfig, {
        name: name,
        kubeconfig: kubeconfig
      }) || checkIfFormHasError(form.getFieldsError())
    )
  }

  React.useEffect(() => {
    setIsSubmitDisabled(getFormState())

    if (name === initConfig.name && kubeconfig === initConfig.kubeconfig) {
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, kubeconfig])

  return (
    <>
      <Drawer
        title='Add Cluster'
        isSubmitDisabled={isSubmitDisabled}
        visible={visible}
        closeDrawer={() => {
          closeDrawer()
          clearForm()
        }}
        body={
          <ClusterForm
            name={name}
            kubeconfig={kubeconfig}
            setName={setName}
            setKubeconfig={setKubeconfig}
            form={form}
          ></ClusterForm>
        }
        onSubmit={async () => {
          await onSubmit({
            payload: {
              name: name,
              kubeconfig: kubeconfig
            }
          })
          submitCallback()
          closeDrawer()
        }}
      ></Drawer>
    </>
  )
}

export default ClusterFormDrawer
