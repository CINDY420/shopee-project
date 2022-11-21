const got = require('got')
const lastAppliedConfiguration = '{"apiVersion":"tekton.dev/v1beta1","kind":"Pipeline","metadata":{"annotations":{},"name":"ecp-cmdb-node-gateway","namespace":"application-infra-group-pipeline"},"spec":{"params":[{"default":"0","description":"whether to skip deploy stage, only do a CI build \u0026\u0026 push, \u003c0|1\u003e","name":"skip-deploy","type":"string"},{"default":"0","description":"whether to skip build stage, only do a deploy, \u003c0|1\u003e","name":"skip-build","type":"string"},{"default":"1","description":"whether to only patch image in deploy stage, \u003c0|1\u003e, 1 will deploy by just patching image,  0 will deploy by applying manifest source from https://git.garena.com/shopee/sz-devops/kubernetes/ecp-management-platform-manifests/- /tree/master/deploy/components/ecp-cmdb-node-gateway.\"","name":"deploy-by-patch-image","type":"string"},{"default":"test","description":"deploy environment","name":"environment","type":"string"},{"default":"false","name":"useRevisionAsTag","type":"string"},{"default":".","description":"The path to the build context, used by Kaniko - within the workspace","name":"pathToContext","type":"string"},{"default":"deploy/Dockerfile","description":"The path to the dockerfile to build (relative to the context)","name":"pathToDockerFile","type":"string"},{"default":"harbor.shopeemobile.com/shopee/ecp-cmdb-node-gateway","description":"Url of image repository","name":"imageUrl","type":"string"},{"default":"/deploy","description":"the target yaml file to deploy","name":"deployYamlFile","type":"string"},{"default":"infra-test","description":"infra-test;infra-test-2nd;...","name":"target_cluster","type":"string"}],"resources":[{"name":"git-source","type":"git"},{"name":"deploy-source","type":"git"}],"tasks":[{"name":"get-image-tag","params":[{"name":"useRevisionAsTag","value":"$(params.useRevisionAsTag)"},{"name":"revision","value":"$(resources.inputs.git-source.revision)"}],"resources":{"inputs":[{"name":"git-source","resource":"git-source"}]},"taskRef":{"kind":"Task","name":"get-image-tag-task"}},{"name":"source-to-image-build","params":[{"name":"pathToContext","value":"$(params.pathToContext)"},{"name":"pathToDockerFile","value":"$(params.pathToDockerFile)"},{"name":"imageUrl","value":"$(params.imageUrl)"},{"name":"imageTag","value":"$(tasks.get-image-tag.results.tag)"},{"name":"EXTRA_ARGS","value":"--build-arg=ENV=$(params.environment)"}],"resources":{"inputs":[{"name":"git-source","resource":"git-source"}]},"runAfter":["get-image-tag"],"taskRef":{"kind":"Task","name":"source-to-image"},"when":[{"input":"$(params.skip-build)","operator":"in","values":["0"]}]},{"name":"deploy-using-manifest","params":[{"name":"identity","value":"ecp-cmdb-node-gateway"},{"name":"env","value":"$(params.environment)"},{"name":"namespace","value":"ecp-backend"},{"name":"type","value":"deployment"},{"name":"ispatch","value":"$(params.deploy-by-patch-image)"},{"name":"image","value":"$(params.imageUrl):$(tasks.get-image-tag.results.tag)"},{"name":"clusters","value":"$(params.target_cluster)"}],"resources":{"inputs":[{"name":"deploy-source","resource":"deploy-source"}]},"runAfter":["source-to-image-build"],"taskRef":{"kind":"Task","name":"single-component-deploy"},"when":[{"input":"$(params.skip-deploy)","operator":"in","values":["0"]}]},{"name":"deploy-using-manifest-when-ci-skipped","params":[{"name":"identity","value":"ecp-cmdb-node-gateway"},{"name":"env","value":"$(params.environment)"},{"name":"namespace","value":"ecp-backend"},{"name":"type","value":"deployment"},{"name":"ispatch","value":"$(params.deploy-by-patch-image)"},{"name":"image","value":"$(params.imageUrl):$(tasks.get-image-tag.results.tag)"},{"name":"clusters","value":"$(params.target_cluster)"}],"resources":{"inputs":[{"name":"deploy-source","resource":"deploy-source"}]},"runAfter":["get-image-tag"],"taskRef":{"kind":"Task","name":"single-component-deploy"},"when":[{"input":"$(params.skip-build)","operator":"notin","values":["0"]},{"input":"$(params.skip-deploy)","operator":"in","values":["0"]}]}]}}'
const body = {
  apiVersion: 'tekton.dev/v1beta1',
  kind: 'PipelineRun',
  metadata: {
    annotations: {
      'kubectl.kubernetes.io/last-applied-configuration': lastAppliedConfiguration,
    },
    generateName: 'ecp-cmdb-node-gateway-run-1652867810632-r-',
    labels: {
      app: 'tekton-app',
      reruns: 'ecp-cmdb-node-gateway-run-1652867810632-r-monkey',
    },
    namespace: 'application-infra-group-pipeline',
  },
  spec: {
    params: [
      {
        name: "environment",
        value: "test"
      },
      {
        name: "useRevisionAsTag",
        value: "false"
      },
      {
        name: "pathToContext",
        value: "."
      },
      {
        name: "pathToDockerFile",
        value: "deploy/Dockerfile"
      },
      {
        name: "imageUrl",
        value: "harbor.shopeemobile.com/shopee/ecp-cmdb-node-gateway"
      },
      {
        name: "deployYamlFile",
        value: "/deploy"
      },
      {
        name: "target_cluster",
        value: "infra-test;infra-test-2nd"
      },
      {
        name: "replicas",
        value: "1"
      },
      {
        name: "cpu",
        value: "1"
      },
      {
        name: "memory",
        value: "4Gi"
      }
    ],
    pipelineRef: {
      name: "ecp-cmdb-node-gateway"
    },
    podTemplate: {
      hostNetwork: true,
      nodeSelector: {
        "node-role.kubernetes.io/jenkins": ""
      },
      tolerations: [
        {
          effect: "NoSchedule",
          key: "node-role.kubernetes.io",
          operator: "Equal",
          value: "jenkins"
        }
      ]
    },
    resources: [
      {
        name: "git-source",
        resourceRef: {
          name: "ecp-cmdb-node-gateway-test"
        }
      },
      {
        name: "deploy-source",
        resourceRef: {
          name: "ecp-component-manifest"
        }
      }
    ],
    serviceAccountName: "app-builder",
    timeout: "1h0m0s"
  },
}

const url = 'http://tekton-dashboard.envs.test.devops-sz.i.shopee.io/proxy/apis/tekton.dev/v1beta1/namespaces/application-infra-group-pipeline/pipelineruns/'

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
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'Content-Type': 'application/json',
        Origin: 'http://tekton-dashboard.envs.test.devops-sz.i.shopee.io',
        Referer: 'http://tekton-dashboard.envs.test.devops-sz.i.shopee.io/',
      },
      json: body
    }).json()
    const name = result.metadata.name
    console.log('success, go to http://tekton-dashboard.envs.test.devops-sz.i.shopee.io/#/namespaces/application-infra-group-pipeline/pipelineruns/' + name + ' to see result detail')
  } catch (e) {
    console.error(e)
    console.error(e.response.body)
  }
})()
