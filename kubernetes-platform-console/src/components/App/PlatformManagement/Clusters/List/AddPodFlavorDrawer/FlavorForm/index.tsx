import React from 'react'
import { Form, Button } from 'infrad'
import { PlusOutlined } from 'infra-design-icons'

import OperationCard from './OperationCard'
import { FormContext, IFormContext } from 'components/App/PlatformManagement/Clusters/List/AddPodFlavorDrawer/context'
import { FormInstance } from 'infrad/lib/form/hooks/useForm'
interface IFlavorForm {
  form: FormInstance
  clusterList: string[]
}
type FormListAddFn = (initialValue?: any) => void

const flavorInitialValues = { flavors: [{}] }

const FlavorForm: React.FC<IFlavorForm> = ({ form, clusterList }) => {
  const formStatus = React.useContext<IFormContext>(FormContext)
  const { isFormValid } = formStatus

  const handleOperationAdd = async (callback: FormListAddFn) => {
    try {
      await form.validateFields()
      // Only the current form are valid can add new Item
      isFormValid && callback(flavorInitialValues)
    } catch (err) {
      // ignore validate err
    }
  }
  return (
    <Form name='flavors' colon={false} form={form} initialValues={{ clustersFlavors: [flavorInitialValues] }}>
      <Form.List name='clustersFlavors'>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ name, key, ...restField }, index) => (
              <OperationCard
                clusterList={clusterList}
                form={form}
                key={key}
                {...restField}
                fatherFieldName={name}
                index={index}
                disableDelete={fields.length <= 1}
                onDelete={() => remove(name)}
              />
            ))}
            <div style={{ textAlign: 'center', border: '1px solid #2673DD' }}>
              <Button type='link' onClick={() => handleOperationAdd(add)}>
                <PlusOutlined /> Add new operation
              </Button>
            </div>
          </>
        )}
      </Form.List>
    </Form>
  )
}

export default FlavorForm
