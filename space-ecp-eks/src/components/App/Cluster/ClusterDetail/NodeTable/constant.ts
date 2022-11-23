export enum NodeAction {
  LABEL = 'Label',
  TAINT = 'Taint',
  CORDON = 'Cordon',
  UNCORDON = 'Uncordon',
  DRAIN = 'Drain',
  WEB_TERMINAL = 'Web Terminal',
  DELETE = 'Delete',
}

export const NodeBatchActions = {
  [NodeAction.LABEL]: 'Label',
  [NodeAction.TAINT]: 'Taint',
  [NodeAction.CORDON]: 'Cordon',
  [NodeAction.UNCORDON]: 'Uncordon',
  [NodeAction.DRAIN]: 'Drain',
  // TODO: wenwen.wu bath delete node is not support on current version
  // [NodeAction.DELETE]: 'Delete',
}
