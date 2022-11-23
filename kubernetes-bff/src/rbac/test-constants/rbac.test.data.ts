export const defaultAuthUser = {
  email: 'test@shopee.com',
  name: 'Test',
  avatar: '123.jpg',
  position: 'FE',
  isWhite: false,
  isQA: false,
  isManager: false,
  isAManager: false,
  group: 'Infrastructure Team',
  groupId: 191,
  role: '',
  isInfra: false,
  departPath: '/Shopee/Developer Center/Infrastructure Team/BE/Kubernetes',
  department: [
    { name: 'Shopee' },
    { name: 'Developer Center' },
    { name: 'Infrastructure Team' },
    { name: 'BE' },
    { name: 'Kubernetes' }
  ],
  groupLeaders: [],
  env: 'test'
}

const baseGroupsReturn = {
  rules: {
    projectQuota: {
      resource: 'projectQuota',
      verbs: ['View', 'Edit'],
      availableVerbs: {
        View: false,
        Edit: false
      }
    },
    pipeline: {
      resource: 'pipeline',
      verbs: ['List', 'Delete', 'Execute', 'GetDetails', 'Edit', 'GetHistory', 'ExecuteLive', 'ExecuteLiveCodeFreeze'],
      availableVerbs: {
        List: false,
        Delete: false,
        Execute: false,
        GetDetails: false,
        Edit: false,
        GetHistory: false,
        ExecuteLive: false,
        ExecuteLiveCodeFreeze: false
      }
    },
    project: {
      resource: 'project',
      verbs: ['Create', 'View', 'Edit', 'Delete'],
      availableVerbs: {
        Create: false,
        View: false,
        Edit: false,
        Delete: false
      }
    },
    application: {
      resource: 'application',
      verbs: ['Create', 'View', 'Edit', 'Delete', 'EditConfig'],
      availableVerbs: {
        Create: false,
        View: false,
        Edit: false,
        Delete: false,
        EditConfig: false
      }
    },
    ingress: {
      resource: 'ingress',
      verbs: ['Create', 'View', 'Edit', 'Delete'],
      availableVerbs: {
        Create: false,
        View: false,
        Edit: false,
        Delete: false
      }
    },
    pod: {
      resource: 'pod',
      verbs: ['Delete', 'DeleteLive'],
      availableVerbs: {
        Delete: false,
        DeleteLive: false
      }
    },
    deploy: {
      resource: 'deploy',
      verbs: ['Edit', 'EditLive'],
      availableVerbs: {
        Edit: false,
        EditLive: false
      }
    },
    service: {
      resource: 'service',
      verbs: ['Create', 'View', 'Edit', 'Delete'],
      availableVerbs: {
        Create: false,
        View: false,
        Edit: false,
        Delete: false
      }
    },
    terminalAccess: {
      resource: 'terminalAccess',
      verbs: ['ViewApply', 'ViewApprove'],
      availableVerbs: {
        ViewApply: false,
        ViewApprove: false
      }
    },
    changeRole: {
      resource: 'changeRole',
      verbs: ['ViewApply', 'ViewApprove'],
      availableVerbs: {
        ViewApply: false,
        ViewApprove: false
      }
    },
    initialAccess: {
      resource: 'initialAccess',
      verbs: ['ViewApply', 'ViewApprove'],
      availableVerbs: {
        ViewApply: false,
        ViewApprove: false
      }
    },
    addRole: {
      resource: 'addRole',
      verbs: ['ViewApply', 'ViewApprove'],
      availableVerbs: {
        ViewApply: false,
        ViewApprove: false
      }
    }
  }
}

export const baseReturn = {
  global: {
    rules: {
      codeFreeze: {
        resource: 'codeFreeze',
        verbs: ['View', 'Edit'],
        availableVerbs: {
          View: false,
          Edit: false
        }
      },
      groupQuota: {
        resource: 'groupQuota',
        verbs: ['View', 'Edit'],
        availableVerbs: {
          View: false,
          Edit: false
        }
      },
      userLog: {
        resource: 'userLog',
        verbs: ['View'],
        availableVerbs: {
          View: false
        }
      },
      auth: {
        resource: 'auth',
        verbs: ['ViewApply', 'ViewApprove'],
        availableVerbs: {
          ViewApply: false,
          ViewApprove: false
        }
      },
      clusterTab: {
        resource: 'clusterTab',
        verbs: ['View', 'Edit', 'Delete', 'Create'],
        availableVerbs: {
          View: false,
          Edit: false,
          Delete: false,
          Create: false
        }
      }
    }
  },
  groups: {
    'Seller Group': {
      group: 'Seller Group',
      ...baseGroupsReturn
    },
    'Financial Services Group': {
      group: 'Financial Services Group',
      ...baseGroupsReturn
    },
    'To C Group': {
      group: 'To C Group',
      ...baseGroupsReturn
    },
    'Supply Chain Group': {
      group: 'Supply Chain Group',
      ...baseGroupsReturn
    },
    'Infrastructure Team': {
      group: 'Infrastructure Team',
      ...baseGroupsReturn
    },
    'Client Group': {
      group: 'Client Group',
      ...baseGroupsReturn
    },
    Banking: {
      group: 'Banking',
      ...baseGroupsReturn
    },
    'Data Science Group': {
      group: 'Data Science Group',
      ...baseGroupsReturn
    }
  }
}

export const authorizedGroupSettings = {
  rules: {
    application: {
      availableVerbs: {
        View: true
      }
    },
    deploy: {
      availableVerbs: {
        Edit: true
      }
    },
    ingress: {
      availableVerbs: {
        View: true
      }
    },
    pipeline: {
      availableVerbs: {
        Execute: true,
        GetDetails: true,
        GetHistory: true,
        List: true
      }
    },
    pod: {
      availableVerbs: {
        Delete: true
      }
    },
    project: {
      availableVerbs: {
        View: true
      }
    },
    projectQuota: {
      availableVerbs: {
        View: true
      }
    }
  }
}

export const othersGlobalReturn = {
  global: {
    rules: {
      codeFreeze: {
        availableVerbs: {
          View: true
        }
      },
      auth: {
        availableVerbs: {
          ViewApply: true
        }
      },
      clusterTab: {
        availableVerbs: {
          View: true
        }
      }
    }
  }
}

export const bossGlobalReturn = {
  global: {
    rules: {
      auth: {
        availableVerbs: {
          ViewApprove: true
        }
      },
      clusterTab: {
        availableVerbs: {
          Create: true,
          Delete: true,
          Edit: true,
          View: true
        }
      },
      codeFreeze: {
        availableVerbs: {
          Edit: true,
          View: true
        }
      },
      groupQuota: {
        availableVerbs: {
          Edit: true,
          View: true
        }
      },
      userLog: {
        availableVerbs: {
          View: true
        }
      }
    }
  }
}

export const infraGlobalReturn = {
  global: {
    rules: {
      codeFreeze: {
        availableVerbs: {
          View: true
        }
      },
      groupQuota: {
        availableVerbs: {
          View: true,
          Edit: true
        }
      },
      userLog: {
        availableVerbs: {
          View: true
        }
      },
      auth: {
        availableVerbs: {
          ViewApply: true
        }
      },
      clusterTab: {
        availableVerbs: {
          View: true,
          Edit: true,
          Delete: true,
          Create: true
        }
      }
    }
  }
}

export const whiteUserGlobalReturn = {
  global: {
    rules: {
      auth: {
        availableVerbs: {
          ViewApply: true
        }
      },
      clusterTab: {
        availableVerbs: {
          View: true
        }
      },
      codeFreeze: {
        availableVerbs: {
          View: true
        }
      }
    }
  }
}

export const managerGlobalReturn = {
  global: {
    rules: {
      auth: {
        availableVerbs: {
          ViewApply: true,
          ViewApprove: true
        }
      },
      clusterTab: {
        availableVerbs: {
          View: true
        }
      },
      codeFreeze: {
        availableVerbs: {
          View: true
        }
      }
    }
  }
}

export const infraAdminUserGlobalReturn = {
  global: {
    rules: {
      auth: {
        availableVerbs: {
          ViewApply: true,
          ViewApprove: true
        }
      },
      clusterTab: {
        availableVerbs: {
          Create: true,
          Delete: true,
          Edit: true,
          View: true
        }
      },
      codeFreeze: {
        availableVerbs: {
          Edit: true,
          View: true
        }
      },
      groupQuota: {
        availableVerbs: {
          Edit: true,
          View: true
        }
      },
      userLog: {
        availableVerbs: {
          View: true
        }
      }
    }
  }
}

export const includedGroupReturn = {
  rules: {
    application: {
      availableVerbs: {
        View: true
      }
    },
    deploy: {
      availableVerbs: {
        Edit: true
      }
    },
    ingress: {
      availableVerbs: {
        View: true
      }
    },
    pipeline: {
      availableVerbs: {
        Execute: true,
        GetDetails: true,
        GetHistory: true,
        List: true
      }
    },
    pod: {
      availableVerbs: {
        Delete: true
      }
    },
    project: {
      availableVerbs: {
        View: true
      }
    },
    projectQuota: {
      availableVerbs: {
        View: true
      }
    }
  }
}

export const infraGroupReturn = {
  rules: {
    projectQuota: {
      availableVerbs: {
        View: true,
        Edit: true
      }
    },
    pipeline: {
      availableVerbs: {
        List: true,
        Delete: true,
        Execute: true,
        GetDetails: true,
        Edit: true,
        GetHistory: true,
        ExecuteLive: true,
        ExecuteLiveCodeFreeze: true
      }
    },
    project: {
      availableVerbs: {
        Create: true,
        View: true,
        Edit: true,
        Delete: true
      }
    },
    application: {
      availableVerbs: {
        Create: true,
        View: true,
        Edit: true,
        Delete: true,
        EditConfig: true
      }
    },
    ingress: {
      availableVerbs: {
        Create: true,
        View: true,
        Edit: true,
        Delete: true
      }
    },
    pod: {
      availableVerbs: {
        Delete: true,
        DeleteLive: true
      }
    },
    deploy: {
      availableVerbs: {
        Edit: true,
        EditLive: true
      }
    },
    service: {
      availableVerbs: {
        Create: true,
        View: true,
        Edit: true,
        Delete: true
      }
    },
    terminalAccess: {
      availableVerbs: {
        ViewApply: true
      }
    },
    changeRole: {
      availableVerbs: {
        ViewApply: true
      }
    },
    initialAccess: {
      availableVerbs: {
        ViewApply: true
      }
    },
    addRole: {
      availableVerbs: {
        ViewApply: true
      }
    }
  }
}

export const SREGroupReturn = {
  rules: {
    projectQuota: {
      availableVerbs: {
        View: true,
        Edit: true
      }
    },
    pipeline: {
      availableVerbs: {
        List: true,
        Delete: true,
        Execute: true,
        GetDetails: true,
        Edit: true,
        GetHistory: true
      }
    },
    project: {
      availableVerbs: {
        Create: true,
        View: true,
        Edit: true,
        Delete: true
      }
    },
    application: {
      availableVerbs: {
        Create: true,
        View: true,
        Edit: true,
        Delete: true,
        EditConfig: true
      }
    },
    ingress: {
      availableVerbs: {
        Create: true,
        View: true,
        Edit: true,
        Delete: true
      }
    },
    pod: {
      availableVerbs: {
        Delete: true
      }
    },
    deploy: {
      availableVerbs: {
        Edit: true
      }
    },
    service: {
      availableVerbs: {
        Create: true,
        View: true,
        Edit: true,
        Delete: true
      }
    },
    terminalAccess: {
      availableVerbs: {
        ViewApply: true
      }
    },
    changeRole: {
      availableVerbs: {
        ViewApply: true
      }
    },
    initialAccess: {
      availableVerbs: {
        ViewApply: true
      }
    },
    addRole: {
      availableVerbs: {
        ViewApply: true
      }
    }
  }
}

export const otherRoleGroupReturn = {
  rules: {
    pipeline: {
      availableVerbs: {
        ExecuteLive: true
      }
    },
    service: {
      availableVerbs: {
        View: true
      }
    }
  }
}

export const managerGroupReturn = {
  rules: {
    addRole: {
      availableVerbs: {
        ViewApply: true
      }
    },
    application: {
      availableVerbs: {
        View: true
      }
    },
    changeRole: {
      availableVerbs: {
        ViewApply: true
      }
    },
    deploy: {
      availableVerbs: {
        Edit: true
      }
    },
    ingress: {
      availableVerbs: {
        View: true
      }
    },
    initialAccess: {
      availableVerbs: {
        ViewApply: true
      }
    },
    pipeline: {
      availableVerbs: {
        Execute: true,
        ExecuteLive: true,
        GetDetails: true,
        GetHistory: true,
        List: true
      }
    },
    pod: {
      availableVerbs: {
        Delete: true
      }
    },
    project: {
      availableVerbs: {
        View: true
      }
    },
    projectQuota: {
      availableVerbs: {
        Edit: true,
        View: true
      }
    },
    service: {
      availableVerbs: {
        View: true
      }
    },
    terminalAccess: {
      availableVerbs: {
        ViewApply: true,
        ViewApprove: true
      }
    }
  }
}

export const codeFreezeGroupReturn = {
  rules: {
    addRole: {
      availableVerbs: {
        ViewApply: true
      }
    },
    changeRole: {
      availableVerbs: {
        ViewApply: true
      }
    },
    deploy: {
      availableVerbs: {
        Edit: true
      }
    },
    initialAccess: {
      availableVerbs: {
        ViewApply: true
      }
    },
    pipeline: {
      availableVerbs: {
        ExecuteLive: true
      }
    },
    projectQuota: {
      availableVerbs: {
        Edit: true
      }
    },
    service: {
      availableVerbs: {
        View: true
      }
    },
    terminalAccess: {
      availableVerbs: {
        ViewApply: true,
        ViewApprove: true
      }
    }
  }
}

export const twoRolesGroupReturn = {
  rules: {
    projectQuota: {
      availableVerbs: {
        View: true
      }
    },
    pipeline: {
      availableVerbs: {
        List: true,
        Execute: true,
        GetDetails: true,
        GetHistory: true,
        ExecuteLive: true
      }
    },
    project: {
      availableVerbs: {
        View: true
      }
    },
    application: {
      availableVerbs: {
        View: true
      }
    },
    ingress: {
      availableVerbs: {
        View: true
      }
    },
    pod: {
      availableVerbs: {
        Delete: true
      }
    },
    deploy: {
      availableVerbs: {
        Edit: true
      }
    },
    service: {
      availableVerbs: {
        View: true
      }
    }
  }
}
