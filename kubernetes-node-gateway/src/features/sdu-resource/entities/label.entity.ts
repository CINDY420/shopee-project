export class LabelNode {
  depth: number
  displayName: string
  labelNodeId: string
  parentId: string
  childNodes: LabelNode[]
}

export class Label {
  labelNodeId: string
  displayName: string
}
