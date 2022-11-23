import styled from 'styled-components'

export const DirectoryTreeWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  .ant-tree .ant-tree-node-content-wrapper {
    width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ant-tree.ant-tree-directory .ant-tree-treenode-selected::before {
    background: #f1f2f5;
    border-left: 4px solid #0f4c81;
  }

  .ant-tree.ant-tree-directory .ant-tree-treenode .ant-tree-node-content-wrapper.ant-tree-node-selected {
    color: #0f4c81;
  }

  .ant-tree.ant-tree-directory .ant-tree-treenode-selected {
    .ant-tree-switcher {
      color: #0f4c81;
    }
  }

  .ant-tree .ant-tree-treenode {
    padding: 0;
    height: 40px;
    align-items: center;
  }

  .ant-tree.ant-tree-directory .ant-tree-treenode::before {
    bottom: 0;
  }

  .ant-tree .ant-tree-switcher {
    line-height: 40px;
  }
`
