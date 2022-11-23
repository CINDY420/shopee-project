import * as React from 'react'
import { mapValues } from 'lodash'
import { Validator } from 'jsonschema'
import { useLocalStorageState } from 'ahooks'
import { Button, Col, Modal, ModalProps, Row, Checkbox } from 'infrad'
import { RESOURCE_MANAGEMENT_LOCAL_STORAGE_KEYS } from 'constants/localStorage'
import CheckBoxGroups, { IOptions, isPlainOption } from 'components/App/ResourceManagement/common/CheckBoxGroups'
import { STOCK_GROUPS } from 'components/App/ResourceManagement/common/ResourceTable/columnGroups'
import { ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import { GlobalContext } from 'hocs/useGlobalContext'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'

interface ICustomDisplayItemsModalProps extends Omit<ModalProps, 'onOk'> {
  name: RESOURCE_MANAGEMENT_LOCAL_STORAGE_KEYS // key for localStorage
  onOk: (values: Record<string, string[]>) => void
}

const PREFERENCE_CACHE_SCHEMA = {
  type: 'object',
  additionalProperties: {
    type: 'array',
    items: {
      type: 'string'
    }
  }
}

const CustomDisplayItemsModal: React.FC<ICustomDisplayItemsModalProps> = ({
  name,
  visible,
  onCancel,
  onOk,
  ...otherProps
}) => {
  const { state: GlobalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = GlobalContextState || {}
  const isPlatformAdmin = userRoles.some(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)

  const { state } = React.useContext(ResourceContext)
  const { envs, machineModels } = state

  const getStockGroups = React.useCallback(() => {
    return STOCK_GROUPS(envs, machineModels, isPlatformAdmin)
  }, [envs, isPlatformAdmin, machineModels])

  const options = React.useCallback(() => {
    return getStockGroups()?.reduce((acc, curr) => {
      const { name, items } = curr
      const obj = { [name]: items }
      return { ...acc, ...obj }
    }, {})
  }, [getStockGroups])
  const [isSave, setIsSave] = React.useState(true)
  const [preferenceCache, setPreferenceCache] = useLocalStorageState<Record<string, string[]>>(name)
  const defaultValue = React.useMemo(() => {
    const validator = new Validator()
    const { valid } = validator.validate(preferenceCache, PREFERENCE_CACHE_SCHEMA)
    if (preferenceCache && valid) {
      return preferenceCache
    }

    setPreferenceCache(null)
    return mapValues(options(), (options: IOptions) =>
      options.map(option => (isPlainOption(option) ? option : option.name))
    )
  }, [options, preferenceCache, setPreferenceCache])
  const [values, setValues] = React.useState(defaultValue)

  const handleChange = (group: string, newValue: string[]) => {
    setValues(prevValue => ({
      ...prevValue,
      [group]: newValue
    }))
  }

  const handleConfirm = () => {
    if (isSave) {
      setPreferenceCache(values)
    }

    onOk(values)
  }

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onCancel(e)
    setValues(defaultValue)
  }

  return (
    <Modal
      width='1150px'
      visible={visible}
      title='Custom Display Items'
      getContainer={() => document.body}
      footer={
        <>
          <Row justify='start' style={{ paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Col>
              <Checkbox onChange={e => setIsSave(e.target.checked)} checked={isSave}>
                Save as default
              </Checkbox>
            </Col>
          </Row>
          <Row justify='end'>
            <Col>
              <Button onClick={e => handleCancel(e)}>Cancel</Button>
              <Button onClick={handleConfirm}>Confirm</Button>
            </Col>
          </Row>
        </>
      }
      onCancel={e => handleCancel(e)}
      destroyOnClose
      {...otherProps}
    >
      <CheckBoxGroups options={options()} values={values} groups={getStockGroups()} onChange={handleChange} />
    </Modal>
  )
}

export default CustomDisplayItemsModal
