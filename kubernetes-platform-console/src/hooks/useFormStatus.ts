import * as React from 'react'
import { FormInstance } from 'infrad/lib/form'
import { FieldData, ValidateErrorEntity } from 'rc-field-form/lib/interface'
import * as R from 'ramda'

export interface IAsyncState {
  status: boolean
  errorFields?: ValidateErrorEntity[]
}

export type AsyncFn = [IAsyncState, (changedFields: FieldData[], allFields: FieldData[]) => Promise<void>]

export function useFormStatus (form: FormInstance): AsyncFn {
  const { validateFields, setFields, getFieldValue } = form
  const [state, setState] = React.useState<IAsyncState>({ status: false })
  const fieldsRef = React.useRef({
    perAllFieldsLength: 0,
    isFormValidating: false
  })

  const getFormStatus = React.useCallback(
    async (changedFields: FieldData[], allFields: FieldData[]) => {
      const length = changedFields.length
      const allFieldsLength = allFields.length
      const current = fieldsRef.current
      const { isFormValidating } = current

      current.perAllFieldsLength = allFieldsLength

      if (length === 1 && !isFormValidating) {
        const field = changedFields[0]
        const currentName = field.name

        current.isFormValidating = true
        await validateFields()
          .then(values => {
            current.isFormValidating = false

            setState({ status: true })
          })
          .catch(errorInfo => {
            const errorFields = errorInfo.errorFields

            const fields = errorFields.map(item => {
              const name = item.name
              const isEqualed = R.equals(currentName, name)
              const value = getFieldValue(name)

              if (!isEqualed && value === undefined) {
                item.errors = []
              }

              return item
            })

            setFields(fields)
            setState({ status: !errorFields.length, errorFields })

            current.isFormValidating = false

            // the number of fields has changed
            if (current.perAllFieldsLength !== allFieldsLength) {
              getFormStatus(changedFields, allFields)
            }
          })
      }
    },
    [validateFields, setFields, setState, getFieldValue]
  )

  return [state, getFormStatus]
}
