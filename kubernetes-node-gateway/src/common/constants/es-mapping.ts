export const USER_LOG_MAPPING = {
  mappings: {
    properties: {
      email: {
        type: 'keyword',
      },
      name: {
        type: 'keyword',
      },
      department: {
        type: 'text',
      },
      group: {
        type: 'keyword',
      },
      tenant: {
        type: 'keyword',
      },
      source: {
        type: 'keyword',
      },
      requestPath: {
        type: 'text',
      },
      object: {
        type: 'keyword',
      },
      requestMethod: {
        type: 'text',
      },
      requestQuery: {
        type: 'text',
      },
      requestHeader: {
        type: 'text',
      },
      requestBody: {
        type: 'text',
      },
      responseCode: {
        type: 'text',
      },
      '@timestamp': {
        type: 'date',
      },
    },
  },
}
