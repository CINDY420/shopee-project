import { Input, Form } from 'infrad'
import { useState } from 'react'
import { buildQuotaItemName } from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable/helper'
import { UnitWrapper } from 'src/components/App/Segment/SegmentDetail/Quota/QuotaTable/style'
import { IListTenantsQuotaItem } from 'src/swagger-api/models'
import { useDebounce } from 'ahooks'

export enum QuotaName {
  CPU_QUOTA = 'cpuQuota',
  MEMORY_QUOTA = 'memoryQuota',
}

export interface IEditedTenantQuota extends IListTenantsQuotaItem {
  changedCpuQuota?: number
  totalCpuQuota?: number
  changedMemoryQuota?: number
  totalMemoryQuota?: number
}
export interface IOnQuotaUpdateArgs {
  tenantId: string
  env: string
  editedTenantQuota: IEditedTenantQuota
}

interface IQuotaEditItemProps {
  name: QuotaName
  initialValue: number
  unit: string
  record: IListTenantsQuotaItem
  initialEnvUnassignedQuota: number
  currentEnvAddedQuotaList: IEditedTenantQuota[]
  disabled: boolean
  onAddedValidate: (valid: boolean) => void
  onQuotaUpdate: (args: IOnQuotaUpdateArgs) => void
  onRemovePreviewQuota: (tenantId: string, env: string, quotaName: QuotaName) => void
}

const QuotaEditItem: React.FC<IQuotaEditItemProps> = ({
  record,
  name,
  initialValue,
  unit,
  initialEnvUnassignedQuota = 0,
  currentEnvAddedQuotaList,
  disabled,
  onAddedValidate,
  onQuotaUpdate,
  onRemovePreviewQuota,
}) => {
  const { tenantId, env, cpuApplied, cpuQuota, memoryApplied, memoryQuota } = record
  const tenantEnvName = buildQuotaItemName({ tenantId, env })
  const formItemNamePath = [tenantEnvName, name]
  const [isValid, setValid] = useState(true)
  const [total, setTotal] = useState(initialValue)

  const isCpuQuota = name === QuotaName.CPU_QUOTA
  const validNegativeValue = (changedValue: number): { valid: boolean; unapplied: number } => {
    const quota = isCpuQuota ? cpuQuota : memoryQuota
    const applied = isCpuQuota ? cpuApplied : memoryApplied
    const unapplied = quota - applied
    const isValidMinusValue = unapplied + changedValue >= 0
    return { valid: isValidMinusValue, unapplied }
  }

  const currentEnvTotalUnassignedQuota = currentEnvAddedQuotaList.reduce((unassigned, current) => {
    const { changedCpuQuota = 0, changedMemoryQuota = 0 } = current
    const editedQuota = isCpuQuota ? changedCpuQuota : changedMemoryQuota
    return unassigned - editedQuota
  }, initialEnvUnassignedQuota)

  const updateValidateState = (valid: boolean) => {
    setValid(valid)
    onAddedValidate(valid)
  }

  const inputDisabled = useDebounce(disabled && isValid, { wait: 200 })

  return (
    <div style={{ whiteSpace: 'nowrap' }}>
      <span style={{ lineHeight: '32px' }}>{initialValue}</span>
      <Form.Item
        name={formItemNamePath}
        initialValue="+0"
        style={{ display: 'inline-block', marginBottom: '-22px', marginLeft: '4px' }}
        validateFirst
        rules={[
          {
            required: true,
            message: 'Please input your targeted change value',
          },
          {
            validator: (_, changedValue: string) => {
              // validate format
              const isValidFormat = /^[+-]([1-9]\d*|0)$/.test(changedValue)
              if (!isValidFormat) {
                updateValidateState(false)
                return Promise.reject(new Error('Invalid format'))
              }

              const changedValueNumber = Number(changedValue)
              if (changedValueNumber < 0) {
                // validate negative value
                const { valid, unapplied } = validNegativeValue(changedValueNumber)
                if (!valid) {
                  updateValidateState(false)
                  onRemovePreviewQuota(
                    tenantId,
                    env,
                    isCpuQuota ? QuotaName.CPU_QUOTA : QuotaName.MEMORY_QUOTA,
                  )
                  return Promise.reject(
                    new Error(`Only ${unapplied} ${unit} unapplied quota can be reduced.`),
                  )
                }
              } else if (changedValueNumber > 0) {
                // validate positive value
                const isValidPositiveValue = changedValueNumber <= currentEnvTotalUnassignedQuota
                if (!isValidPositiveValue) {
                  updateValidateState(false)
                  onRemovePreviewQuota(
                    tenantId,
                    env,
                    isCpuQuota ? QuotaName.CPU_QUOTA : QuotaName.MEMORY_QUOTA,
                  )
                  return Promise.reject(
                    new Error(
                      `Only ${currentEnvTotalUnassignedQuota} ${unit} resources can be added.`,
                    ),
                  )
                }
              }

              // compute total
              const totalQuota = initialValue + changedValueNumber
              setTotal(totalQuota)

              updateValidateState(true)

              // update global state
              const editedTenantQuota = {
                ...record,
                changedCpuQuota: isCpuQuota ? changedValueNumber : undefined,
                totalCpuQuota: isCpuQuota ? totalQuota : undefined,
                changedMemoryQuota: isCpuQuota ? undefined : changedValueNumber,
                totalMemoryQuota: isCpuQuota ? undefined : totalQuota,
              }
              onQuotaUpdate({ tenantId, env, editedTenantQuota })
              return Promise.resolve()
            },
          },
        ]}
        extra={initialValue !== total && isValid ? `=${total}` : undefined}
      >
        <Input
          style={{ width: '141px' }}
          disabled={inputDisabled}
          addonAfter={<UnitWrapper>{unit}</UnitWrapper>}
        />
      </Form.Item>
    </div>
  )
}

export default QuotaEditItem
