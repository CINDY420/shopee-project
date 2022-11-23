export type setUpApplicationFn = (callback?: () => void) => void

// setUpProject for auto test
export const setupProject = (callback?) => {
  const groupName = Cypress.env('group')
  const projectName = Cypress.env('project')

  cy.request({
    method: 'GET',
    url: `/groups/${groupName}/projects/${projectName}`,
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 404) {
      cy.request('POST', `/groups/${groupName}/projects`, {
        project: projectName,
        cids: ['SG', 'ID'],
        quotas: [
          {
            name: 'test:DEV',
            cpuTotal: 1,
            memoryTotal: 0.1
          },
          {
            name: 'test:TEST',
            cpuTotal: 1,
            memoryTotal: 1
          }
        ]
      }).then((response) => {
        expect(response.status).to.equal(201)
      })
    } else {
      expect(response.status).to.equal(200)
      callback && callback()
    }
  })
}

export const setupApplication: setUpApplicationFn = (callback?) => {
  const groupName = Cypress.env('group')
  const projectName = Cypress.env('project')
  const applicationName = Cypress.env('application')

  setupProject(() => {
    cy.request({
      method: 'GET',
      url: `/groups/${groupName}/projects/${projectName}/apps/${applicationName}`,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 404) {
        cy.request('POST', `/groups/${groupName}/projects/${projectName}/apps`, {
          appName: applicationName,
          strategyType: {
            type: 'RollingUpdate',
            value: {
              maxSurge: '25%',
              maxUnavailable: '0'
            }
          },
          healthCheck: {
            readinessProbe: {
              type: 'HTTP',
              typeValue: 'test',
              initialDelaySeconds: 15,
              periodSeconds: 5,
              successThreshold: 1,
              timeoutSeconds: 5
            },
            livenessProbe: {
              type: 'HTTP',
              typeValue: '12132',
              initialDelaySeconds: 15,
              periodSeconds: 5,
              successThreshold: 1,
              timeoutSeconds: 5
            }
          },
          pipeline: ''
        }).then((response) => {
          expect(response.status).to.equal(201)
        })
      } else {
        expect(response.status).to.equal(200)
        callback && callback()
      }
    })
  })
}
