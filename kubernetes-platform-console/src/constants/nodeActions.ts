import { TagOutlined } from 'infra-design-icons'

export enum nodeActions {
  LABEL = 'Label',
  DRAIN = 'Drain',
  CORDON = 'Cordon',
  TAINT = 'Taint',
  UNCORDON = 'Uncordon'
}

export const BATCH_ACTIONS = [
  nodeActions.LABEL,
  nodeActions.DRAIN,
  nodeActions.CORDON,
  nodeActions.TAINT,
  nodeActions.UNCORDON
]

export const INSIDE_MENU_ACTIONS = [nodeActions.DRAIN, nodeActions.CORDON, nodeActions.TAINT, nodeActions.UNCORDON]

export const OUTSIDE_MENU_ACTIONS = [
  {
    action: nodeActions.LABEL,
    icon: TagOutlined
  }
]

export const INPUT_PLACEHOLDER = 'Input…'
