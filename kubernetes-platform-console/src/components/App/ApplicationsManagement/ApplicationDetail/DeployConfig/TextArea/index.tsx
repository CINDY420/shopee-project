import { Validator } from 'jsonschema'
import * as React from 'react'
import { message } from 'infrad'
import {
  DeployConfigContext,
  getDispatchers
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import { StyledAceEditor } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/TextArea/style'

import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-json'
import {
  IUpdateNewDeployConfig,
  VALIDATE_STATUS,
  VALIDATE_TYPES
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig'

const ECP_DEPLOY_CONFIG_SCHEMA = {
  type: 'object',
  properties: {
    annotations: {
      type: 'object'
    },
    zone_management: {
      type: 'array',
      items: {
        type: 'object',
        required: ['cid', 'idc', 'zone'],
        properties: {
          cid: {
            type: 'string'
          },
          idc: {
            type: 'string'
          },
          zone: {
            type: 'string'
          }
        }
      }
    },
    component_type: {
      type: 'array',
      items: {
        type: 'object',
        required: ['workload_type'],
        properties: {
          workload_type: {
            type: 'string'
          }
        }
      }
    },
    component_type_overrides: {
      type: 'array',
      items: {
        type: 'object',
        required: ['cid', 'idc', 'data'],
        properties: {
          cid: {
            type: 'string'
          },
          idc: {
            type: 'string'
          },
          data: {
            type: 'object',
            required: ['workload_type'],
            properties: {
              workload_type: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    envs: {
      type: 'array',
      items: {
        type: 'object',
        required: ['cid', 'data'],
        properties: {
          cid: {
            type: 'string'
          },
          data: {
            type: 'object',
            required: ['key', 'value'],
            properties: {
              key: {
                type: 'string'
              },
              value: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    idcs: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    },
    instances: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          additionalProperties: {
            type: 'number',
            minimum: 0
          }
        }
      }
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
            minimum: 0
          }
        }
      }
    },
    resource: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          cpu: {
            type: 'number',
            minimum: 0
          },
          disk: {
            type: 'number',
            minimum: 0
          },
          mem: {
            type: 'number',
            minimum: 0
          },
          gpu: {
            type: 'number',
            minimum: 0
          }
        }
      }
    },
    resources_override: {
      type: 'array',
      items: {
        type: 'object',
        minProperties: 1,
        properties: {
          cpu: {
            type: 'number',
            minimum: 0
          },
          disk: {
            type: 'number',
            minimum: 0
          },
          mem: {
            type: 'number',
            minimum: 0
          },
          gpu: {
            type: 'number',
            minimum: 0
          }
        }
      }
    },
    scheduler: {
      type: 'object'
    },
    strategy: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        parameters: {
          type: 'object'
        }
      }
    }
  }
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
    (value: string) => {
      return new Promise((resolve, reject) => {
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
      })
    },
    [dispatchers]
  )

  React.useEffect(() => {
    setValue(JSON.stringify(isEditing ? newDeployConfig : deployConfig, null, '\t'))
  }, [deployConfig, isEditing, newDeployConfig])

  React.useEffect(() => {
    if (updateNewDeployConfigState === undefined) return
    const { validateType, validateStatus } = updateNewDeployConfigState
    if (validateType === VALIDATE_TYPES.JSON && validateStatus === VALIDATE_STATUS.START) {
      handleValidate(value)
        .then(() => {
          onValidateFinish({
            ...updateNewDeployConfigState,
            validateStatus: VALIDATE_STATUS.SUCCESS
          })
        })
        .catch(() => {
          onValidateFinish(undefined)
        })
    }
  }, [handleValidate, onValidateFinish, updateNewDeployConfigState, value])

  const handleChange = (value: string) => setValue(value)

  return (
    <StyledAceEditor
      tabSize={2}
      mode='json'
      width='100%'
      minLines={30}
      value={value}
      theme='textmate'
      defaultValue='{}'
      showGutter={true}
      wrapEnabled={true}
      maxLines={Infinity}
      isEditing={isEditing}
      readOnly={!isEditing}
      onChange={handleChange}
      showPrintMargin={false}
      highlightActiveLine={false}
      enableLiveAutocompletion={true}
      enableBasicAutocompletion={true}
      editorProps={{ $blockScrolling: true }}
    />
  )
}

export default TextArea
