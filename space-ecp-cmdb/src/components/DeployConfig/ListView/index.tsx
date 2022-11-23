import * as React from 'react'
import { message } from 'infrad'
import AssignmentPolicy from 'src/components/DeployConfig/ListView/AssignmentPolicy'
import ExtraConfig from 'src/components/DeployConfig/ListView/ExtraConfig'
import CountryAZ from 'src/components/DeployConfig/ListView/CountryAZ'
import ComponentType from 'src/components/DeployConfig/ListView/ComponentType'
import { IUpdateNewDeployConfig, ValidateStatus, ValidateTypes } from 'src/components/DeployConfig'
import {
  DeployConfigContext,
  getDispatchers,
  getConvertedFormValues,
} from 'src/components/DeployConfig/useDeployConfigContext'
import InstanceCount from 'src/components/DeployConfig/ListView/InstanceCount'
import Resources from 'src/components/DeployConfig/ListView/Resources'
import MinimumInstanceCount from 'src/components/DeployConfig/ListView/MinimumInstanceCount'
import Strategy from 'src/components/DeployConfig/ListView/Strategy'
import CanaryDeployment from 'src/components/DeployConfig/ListView/CanaryDeployment'
import ZoneManagement from 'src/components/DeployConfig/ListView/ZoneManagement'
import Storage from 'src/components/DeployConfig/ListView/Storage'
import Annotation from 'src/components/DeployConfig/ListView/Annotation'

interface IListViewProps {
  tenantId: number
  updateNewDeployConfigState?: IUpdateNewDeployConfig
  onValidateFinish: (state: IUpdateNewDeployConfig) => void
  serviceId: number
}

const ListView: React.FC<IListViewProps> = ({
  tenantId,
  updateNewDeployConfigState,
  onValidateFinish,
  serviceId,
}) => {
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const { deployConfigForms, errors, deployConfig, hybridDeployTenants, componentType } = state
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const hasError = Object.values(errors).includes(true)

  const convertDeployFormValues = React.useCallback(async () => {
    const newDeployConfig = await getConvertedFormValues(deployConfigForms, deployConfig)
    dispatchers.updateNewDeployConfig(newDeployConfig)
  }, [deployConfig, deployConfigForms, dispatchers])

  React.useEffect(() => {
    if (updateNewDeployConfigState === undefined) return
    const { validateType, validateStatus } = updateNewDeployConfigState
    if (validateType === ValidateTypes.FORM && validateStatus === ValidateStatus.START) {
      if (hasError) {
        void message.error('Form data validation failed, please resolve it before')
        onValidateFinish(undefined)
      } else {
        convertDeployFormValues()
          .then(() => {
            onValidateFinish({
              ...updateNewDeployConfigState,
              validateStatus: ValidateStatus.SUCCESS,
            })
          })
          .catch((e) => {
            console.error(e)
            onValidateFinish(undefined)
          })
      }
    }
  }, [convertDeployFormValues, hasError, onValidateFinish, updateNewDeployConfigState])
  return (
    <>
      <CountryAZ />
      {hybridDeployTenants.includes(tenantId) && <ZoneManagement />}
      <ZoneManagement />
      <ComponentType />
      <Resources />
      <Storage serviceId={serviceId} />
      <InstanceCount />
      <MinimumInstanceCount />
      {(componentType.bromo?.length !== 0 || componentType.nonBromo?.length !== 0) && <Strategy />}
      <CanaryDeployment />
      {componentType.nonBromo?.length !== 0 && <ExtraConfig />}
      <AssignmentPolicy />
      <Annotation />
    </>
  )
}

export default ListView
