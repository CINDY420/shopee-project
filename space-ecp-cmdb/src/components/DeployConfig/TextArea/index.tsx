import { Validator } from 'jsonschema'
import * as React from 'react'
import { message } from 'infrad'
import {
  DeployConfigContext,
  getDispatchers,
} from 'src/components/DeployConfig/useDeployConfigContext'
import { IUpdateNewDeployConfig, ValidateStatus, ValidateTypes } from 'src/components/DeployConfig'
import { Editor } from '@space/common-components'

export const ECP_DEPLOY_CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    annotations: {
      type: 'object',
    },
    zone_management: {
      type: 'array',
      items: {
        type: 'object',
        required: ['cid', 'idc', 'zone'],
        properties: {
          cid: {
            type: 'string',
          },
          idc: {
            type: 'string',
          },
          zone: {
            type: 'string',
          },
        },
      },
    },
    component_type: {
      type: 'array',
      items: {
        type: 'object',
        required: ['workload_type'],
        properties: {
          workload_type: {
            type: 'string',
          },
        },
      },
    },
    component_type_overrides: {
      type: 'array',
      items: {
        type: 'object',
        required: ['cid', 'idc', 'data'],
        properties: {
          cid: {
            type: 'string',
          },
          idc: {
            type: 'string',
          },
          data: {
            type: 'object',
            required: ['workload_type'],
            properties: {
              workload_type: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    envs: {
      type: 'array',
      items: {
        type: 'object',
        required: ['cid', 'data'],
        properties: {
          cid: {
            type: 'string',
          },
          data: {
            type: 'object',
            required: ['key', 'value'],
            properties: {
              key: {
                type: 'string',
              },
              value: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    idcs: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
    instances: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          additionalProperties: {
            type: 'number',
            minimum: 0,
          },
        },
      },
    },
    minimum_instances: {
      type: 'object',
      maxProperties: 1,
      additionalProperties: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          additionalProperties: {
            type: 'number',
            minimum: 0,
          },
        },
      },
    },
    resource: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          cpu: {
            type: 'number',
            minimum: 0,
          },
          disk: {
            type: 'number',
            minimum: 0,
          },
          mem: {
            type: 'number',
            minimum: 0,
          },
          gpu: {
            type: 'number',
            minimum: 0,
          },
        },
      },
    },
    resources_override: {
      type: 'array',
      items: {
        type: 'object',
        minProperties: 1,
        properties: {
          cpu: {
            type: 'number',
            minimum: 0,
          },
          disk: {
            type: 'number',
            minimum: 0,
          },
          mem: {
            type: 'number',
            minimum: 0,
          },
          gpu: {
            type: 'number',
            minimum: 0,
          },
        },
      },
    },
    scheduler: {
      type: 'object',
    },
    strategy: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        parameters: {
          type: 'object',
        },
      },
    },
  },
}

interface ITextAreaProps {
  updateNewDeployConfigState: IUpdateNewDeployConfig | undefined
  onValidateFinish: (state: IUpdateNewDeployConfig) => void
}

const TextArea: React.FC<ITextAreaProps> = ({ updateNewDeployConfigState, onValidateFinish }) => {
  const [value, setValue] = React.useState('{}')
  const { state, dispatch } = React.useContext(DeployConfigContext)
  const { isEditing, newDeployConfig, deployConfig } = state
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])

  const handleValidate = React.useCallback(
    (value: string) =>
      new Promise((resolve, reject) => {
        const validator = new Validator()

        const deployConfig = JSON.parse(value)
        const { valid, errors } = validator.validate(deployConfig, ECP_DEPLOY_CONFIG_SCHEMA)
        if (!valid) {
          const firstError = errors[0]
          message.error(`${firstError.property} ${firstError.message}`)
          reject()
        } else {
          dispatchers.updateNewDeployConfig(deployConfig)
          resolve(value)
        }
      }),
    [dispatchers],
  )

  React.useEffect(() => {
    const data = JSON.stringify(isEditing ? newDeployConfig : deployConfig, null, '\t')
    setValue(data)
    dispatchers.updateTextarea(data)
  }, [deployConfig, dispatchers, isEditing, newDeployConfig])

  React.useEffect(() => {
    if (updateNewDeployConfigState === undefined) return
    const { validateType, validateStatus } = updateNewDeployConfigState
    if (validateType === ValidateTypes.JSON && validateStatus === ValidateStatus.START) {
      handleValidate(value)
        .then(() => {
          onValidateFinish({
            ...updateNewDeployConfigState,
            validateStatus: ValidateStatus.SUCCESS,
          })
        })
        .catch((e) => {
          void message.error('Error: JSON Format Error')
          console.error(e)
          onValidateFinish(undefined)
        })
    }
  }, [handleValidate, onValidateFinish, updateNewDeployConfigState, value])

  const handleChange = (value: string) => {
    setValue(value)
    dispatchers.updateTextarea(value)
  }

  return (
    <Editor
      readOnly={!isEditing}
      mode="json"
      theme="textmate"
      value={value}
      width="100%"
      height="calc(100vh - 230px)"
      showPrintMargin={false}
      // @ts-expect-error common component need to update
      onChange={handleChange}
    />
  )
}

export default TextArea
