const got = require('got')
const body = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'PipelineRun',
  metadata: {
    generateName: 'ske-kubernetes-node-gateway-run-1640684924826-r-',
    labels: {
      app: 'tekton-app',
      'tekton.dev/pipeline': 'ske-kubernetes-node-gateway',
    },
    namespace: 'application-infra-group-pipeline',
  },
  spec: {
    params: [
      {
        name: 'skip-deploy',
        value: '0',
      },
      {
        name: 'skip-build',
        value: '0',
      },
      {
        name: 'deploy-by-patch-image',
        value: '1',
      },
      {
        name: 'environment',
        value: 'test',
      },
      {
        name: 'useRevisionAsTag',
        value: 'false',
      },
      {
        name: 'pathToContext',
        value: '.',
      },
      {
        name: 'pathToDockerFile',
        value: 'deploy/Dockerfile',
      },
      {
        name: 'imageUrl',
        value: 'harbor.shopeemobile.com/shopee/ske-kubernetes-node-gateway',
      },
      {
        name: 'target_cluster',
        value: 'infra-test;infra-test-2nd;',
      },
    ],
    pipelineRef: {
      name: 'ske-kubernetes-node-gateway',
    },
    podTemplate: {
      hostNetwork: true,
      nodeSelector: {
        'node-role.kubernetes.io/jenkins': '',
      },
      tolerations: [
        {
          effect: 'NoSchedule',
          key: 'node-role.kubernetes.io',
          operator: 'Equal',
          value: 'jenkins',
        },
      ],
    },
    resources: [
      {
        name: 'git-source',
        resourceRef: {
          name: 'ske-kubernetes-node-gateway-test',
        },
      },
      {
        name: 'deploy-source',
        resourceRef: {
          name: 'ecp-component-manifest',
        },
      }
    ],
    serviceAccountName: 'app-builder',
    timeout: '1h0m0s',
  },
}

const url =
  'http://tekton-dashboard.envs.test.devops-sz.i.shopee.io/proxy/apis/tekton.dev/v1beta1/namespaces/application-infra-group-pipeline/pipelineruns/'

;(async () => {
  try {
    const result = await got({
      url,
      method: 'POST',
      headers: {
        Connection: 'keep-alive',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Accept: 'application/json',
        'Tekton-Client': 'tektoncd/dashboard',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'Content-Type': 'application/json',
        Origin: 'http://tekton-dashboard.envs.test.devops-sz.i.shopee.io',
        Referer: 'http://tekton-dashboard.envs.test.devops-sz.i.shopee.io/',
      },
      json: body,
    }).json()
    const name = result.metadata.name
    console.log(
      `success, go to http://tekton-dashboard.envs.test.devops-sz.i.shopee.io/#/namespaces/application-infra-group-pipeline/pipelineruns/${name} to see result detail`,
    )
  } catch (e) {
    console.error(e)
    console.error(e.response.body)
  }
})()
