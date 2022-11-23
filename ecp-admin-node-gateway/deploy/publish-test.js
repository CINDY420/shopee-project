// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const got = require('got')

const body = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'PipelineRun',
  metadata: {
    annotations: {
      'kubectl.kubernetes.io/last-applied-configuration':
        '{"apiVersion":"tekton.dev/v1beta1","kind":"Pipeline","metadata":{"annotations":{},"name":"ecp-admin-node-gateway","namespace":"application-infra-group-pipeline"},"spec":{"params":[{"default":"test","description":"deploy environment","name":"environment","type":"string"},{"default":"false","name":"useRevisionAsTag","type":"string"},{"default":".","description":"The path to the build context, used by Kaniko - within the workspace","name":"pathToContext","type":"string"},{"default":"debugger/Dockerfile","description":"The path to the debugger dockerfile to build (relative to the context)","name":"pathToDebuggerDockerFile","type":"string"},{"default":"deploy/Dockerfile","description":"The path to the dockerfile to build (relative to the context)","name":"pathToDockerFile","type":"string"},{"default":"harbor.shopeemobile.com/shopee/ecp-debugger","description":"Url of debugger image repository","name":"debuggerImageUrl","type":"string"},{"default":"harbor.shopeemobile.com/shopee/ecp-admin-node-gateway","description":"Url of image repository","name":"imageUrl","type":"string"},{"default":"infra-test","name":"target_cluster","type":"string"},{"default":"deployment/","description":"the target yaml file to deploy","name":"deployYamlFile","type":"string"},{"default":"1","description":"the number of replicas","name":"replicas","type":"string"},{"default":"1","name":"cpu","type":"string"},{"default":"4Gi","name":"memory","type":"string"}],"resources":[{"name":"git-source","type":"git"}],"tasks":[{"name":"get-image-tag","params":[{"name":"useRevisionAsTag","value":"$(params.useRevisionAsTag)"},{"name":"revision","value":"$(resources.inputs.git-source.revision)"}],"resources":{"inputs":[{"name":"git-source","resource":"git-source"}]},"taskRef":{"kind":"Task","name":"get-image-tag-task"}},{"name":"source-to-debugger-image-build","params":[{"name":"pathToContext","value":"$(params.pathToContext)"},{"name":"pathToDockerFile","value":"$(params.pathToDebuggerDockerFile)"},{"name":"imageUrl","value":"$(params.debuggerImageUrl)"},{"name":"imageTag","value":"$(tasks.get-image-tag.results.tag)"}],"resources":{"inputs":[{"name":"git-source","resource":"git-source"}]},"runAfter":["get-image-tag"],"taskRef":{"kind":"Task","name":"source-to-image"}},{"name":"source-to-image-build","params":[{"name":"pathToContext","value":"$(params.pathToContext)"},{"name":"pathToDockerFile","value":"$(params.pathToDockerFile)"},{"name":"imageUrl","value":"$(params.imageUrl)"},{"name":"imageTag","value":"$(tasks.get-image-tag.results.tag)"},{"name":"EXTRA_ARGS","value":"--build-arg=ENV=$(params.environment)"}],"resources":{"inputs":[{"name":"git-source","resource":"git-source"}]},"runAfter":["get-image-tag"],"taskRef":{"kind":"Task","name":"source-to-image"}},{"name":"deploy-with-params","params":[{"name":"cfg","value":"$(params.deployYamlFile)"},{"name":"target_cluster","value":"$(params.target_cluster)"},{"name":"inputs","value":"ENV=$(params.environment);NAMESPACE=ecp-backend;REPLICAS=$(params.replicas);CPU=$(params.cpu);MEMORY=$(params.memory);POD_PORT=3000;METRICS_PORT=3000;APP_NAME=ecp-admin-node-gateway;IMAGE_NAME=$(params.imageUrl):$(tasks.get-image-tag.results.tag);DEBUGGER_IMAGE=$(params.debuggerImageUrl):$(tasks.get-image-tag.results.tag)"}],"resources":{"inputs":[{"name":"git-source","resource":"git-source"}]},"runAfter":["source-to-image-build"],"taskRef":{"kind":"Task","name":"deploy-with-params"}}]}}\n',
    },
    generateName: 'ecp-admin-node-gateway-run-1655360943328-r-',
    labels: {
      app: 'tekton-app',
      reruns: 'ecp-admin-node-gateway-run-1655360943328-r-cgbnn',
    },
    namespace: 'application-infra-group-pipeline',
  },
  spec: {
    params: [
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
        name: 'pathToDebuggerDockerFile',
        value: 'debugger/Dockerfile',
      },
      {
        name: 'pathToDockerFile',
        value: 'deploy/Dockerfile',
      },
      {
        name: 'debuggerImageUrl',
        value: 'harbor.shopeemobile.com/shopee/ecp-debugger',
      },
      {
        name: 'imageUrl',
        value: 'harbor.shopeemobile.com/shopee/ecp-admin-node-gateway',
      },
      {
        name: 'target_cluster',
        value: 'infra-test',
      },
      {
        name: 'deployYamlFile',
        value: 'deployment/',
      },
      {
        name: 'replicas',
        value: '1',
      },
      {
        name: 'cpu',
        value: '1',
      },
      {
        name: 'memory',
        value: '4Gi',
      },
    ],
    pipelineRef: {
      name: 'ecp-admin-node-gateway',
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
          name: 'ecp-admin-node-gateway-test',
        },
      },
    ],
    serviceAccountName: 'app-builder',
    timeout: '1h0m0s',
  },
}

const url =
  'http://tekton-dashboard.envs.test.devops-sz.i.shopee.io/proxy/apis/tekton.dev/v1beta1/namespaces/application-infra-group-pipeline/pipelineruns/'
const botWebHook = 'https://openapi.seatalk.io/webhook/group/uuYVe0OsRwacxl_bZDZ7rQ'

const sendMessage = (message = '') =>
  got({
    url: botWebHook,
    method: 'POST',
    json: { tag: 'text', text: { content: message } },
  })

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
    const message = `test branch publish trigger success, go to http://tekton-dashboard.envs.test.devops-sz.i.shopee.io/#/namespaces/application-infra-group-pipeline/pipelineruns/${name} to see result detail`
    console.log(message)
    await sendMessage(message)
  } catch (e) {
    const message = `test branch publish trigger failed, error: ${e.response.body}, ${e.stack}`
    console.error(message)
    await sendMessage(message)
  }
})()
