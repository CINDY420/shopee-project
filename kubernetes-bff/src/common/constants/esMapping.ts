export const USER_LOG_MAPPING = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
    max_result_window: 10000000
  },
  mappings: {
    properties: {
      email: {
        type: 'keyword'
      },
      name: {
        type: 'keyword'
      },
      department: {
        type: 'text'
      },
      group: {
        type: 'keyword'
      },
      tenant: {
        type: 'keyword'
      },
      source: {
        type: 'keyword'
      },
      requestPath: {
        type: 'text'
      },
      object: {
        type: 'keyword'
      },
      requestMethod: {
        type: 'text'
      },
      requestQuery: {
        type: 'text'
      },
      requestHeader: {
        type: 'text'
      },
      requestBody: {
        type: 'text'
      },
      responseCode: {
        type: 'text'
      },
      '@timestamp': {
        type: 'date'
      }
    }
  }
}

export const AUTH_V2_MAPPINGS = {
  mappings: {
    properties: {
      realGroup: {
        type: 'keyword'
      },
      role: {
        type: 'keyword'
      },
      approver: {
        type: 'keyword'
      },
      createtime: {
        type: 'keyword'
      },
      email: {
        type: 'keyword'
      },
      group: {
        type: 'keyword'
      },
      name: {
        type: 'keyword'
      },
      reason: {
        type: 'text',
        index: false
      },
      requireres: {
        type: 'keyword'
      },
      status: {
        type: 'keyword'
      },
      type: {
        type: 'keyword'
      },
      updatetime: {
        type: 'keyword'
      }
    }
  }
}

export const TERMINAL_LOG_MAPPING = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
    max_result_window: 10000000
  },
  mappings: {
    properties: {
      '@timestamp': {
        type: 'date'
      },
      application: {
        type: 'keyword'
      },
      container: {
        type: 'keyword'
      },
      department: {
        type: 'keyword'
      },
      email: {
        type: 'keyword'
      },
      group: {
        type: 'keyword'
      },
      name: {
        type: 'keyword'
      },
      nodeIP: {
        type: 'keyword'
      },
      nodeName: {
        type: 'keyword'
      },
      pod: {
        type: 'keyword'
      },
      podIP: {
        type: 'keyword'
      },
      project: {
        type: 'keyword'
      },
      requestCmd: {
        type: 'keyword'
      },
      requestMethod: {
        type: 'keyword'
      },
      requestPath: {
        type: 'keyword'
      },
      requestQuery: {
        type: 'keyword'
      },
      sessionId: {
        type: 'keyword'
      }
    }
  }
}

export const BOT_MAPPINGS = {
  mappings: {
    properties: {
      id: {
        type: 'keyword'
      },
      name: {
        type: 'keyword'
      },
      password: {
        type: 'keyword'
      },
      description: {
        type: 'text',
        index: false
      },
      creator: {
        type: 'keyword'
      },
      createTime: {
        type: 'keyword'
      },
      updateTime: {
        type: 'keyword'
      }
    }
  }
}

export const TICKET_MAPPINGS = {
  mappings: {
    properties: {
      tenant: {
        type: 'keyword'
      },
      type: {
        type: 'keyword'
      },
      permissionGroup: {
        type: 'keyword'
      },
      applicant: {
        type: 'keyword'
      },
      status: {
        type: 'keyword'
      },
      approver: {
        type: 'keyword'
      },
      project: {
        type: 'keyword'
      },
      purpose: {
        type: 'text',
        index: false
      },
      createdAt: {
        type: 'keyword'
      },
      updatedAt: {
        type: 'keyword'
      }
    }
  }
}

export const POLICY_MAPPINGS = {
  mappings: {
    properties: {
      role: {
        type: 'keyword'
      },
      effectiveSourceId: {
        type: 'keyword'
      },
      source: {
        type: 'keyword'
      },
      effect: {
        type: 'keyword'
      },
      actions: {
        type: 'text'
      },
      desc: {
        type: 'text'
      },
      createdAt: {
        type: 'keyword'
      },
      updatedAt: {
        type: 'keyword'
      }
    }
  }
}

export const RELEASE_FREEZE_MAPPINGS = {
  mappings: {
    properties: {
      id: {
        type: 'keyword'
      },
      env: {
        type: 'keyword'
      },
      start_time: {
        type: 'keyword'
      },
      end_time: {
        type: 'keyword'
      },
      reason: {
        type: 'keyword'
      },
      created_by: {
        type: 'keyword'
      },
      updated_by: {
        type: 'keyword'
      },
      status: {
        type: 'keyword'
      },
      statnum: {
        type: 'keyword'
      },
      created_at: {
        type: 'keyword'
      },
      updated_at: {
        type: 'keyword'
      },
      resource: {
        type: 'keyword'
      }
    }
  }
}

export const PROF_DESCRIPTOR_MAPPING = {
  mappings: {
    properties: {
      profileId: {
        type: 'keyword'
      },
      profile: {
        type: 'text'
      },
      podName: {
        type: 'keyword'
      },
      projectName: {
        type: 'keyword'
      },
      appName: {
        type: 'keyword'
      },
      deployName: {
        type: 'keyword'
      },
      graphs: {
        type: 'text'
      },
      status: {
        type: 'keyword'
      },
      message: {
        type: 'text'
      },
      operator: {
        type: 'keyword'
      },
      createdTime: {
        type: 'date'
      },
      env: {
        type: 'keyword'
      },
      sampleTime: {
        type: 'keyword'
      },
      object: {
        type: 'keyword'
      }
    }
  }
}

export const TERMINAL_REPLAY_MAPPING = {
  mappings: {
    properties: {
      '@timestamp': {
        type: 'date'
      },
      fileId: {
        type: 'keyword'
      },
      sessionId: {
        type: 'keyword'
      },
      duration: {
        type: 'keyword'
      },
      application: {
        type: 'keyword'
      },
      container: {
        type: 'keyword'
      },
      email: {
        type: 'keyword'
      },
      tenant: {
        type: 'keyword'
      },
      name: {
        type: 'keyword'
      },
      nodeIP: {
        type: 'keyword'
      },
      nodeName: {
        type: 'keyword'
      },
      podName: {
        type: 'keyword'
      },
      podIP: {
        type: 'keyword'
      },
      project: {
        type: 'keyword'
      }
    }
  }
}
