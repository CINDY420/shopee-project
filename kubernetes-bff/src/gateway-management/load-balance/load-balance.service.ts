import { Injectable } from '@nestjs/common'
import { RenderTemplateBodyDto, RenderTemplateResponseDto } from './dto/load-balance.dto'
import { ReplaceType, replaceFnMap } from './helper'

@Injectable()
export class LoadBalanceService {
  getRenderedTemplate(renderInfo: RenderTemplateBodyDto): RenderTemplateResponseDto {
    const { envs, cids, clusters, frontend: frontendTemplate, backend: backendTemplate } = renderInfo

    // render frontend template
    const cidFrontendTemplate = this.batchReplaceTemplates(ReplaceType.CID, cids, [frontendTemplate])
    const envFrontendTemplateMap = {}
    envs.forEach((env) => {
      envFrontendTemplateMap[env] = this.batchReplaceTemplates(ReplaceType.ENV, [env], cidFrontendTemplate)
    })

    // render backend template
    const cidBackendTemplate = this.batchReplaceTemplates(ReplaceType.CID, cids, [backendTemplate])
    const envBackendTemplateList = envs.map((env) => {
      return { envRenders: this.batchReplaceTemplates(ReplaceType.ENV, [env], cidBackendTemplate) }
    })
    const renderedBackendTemplateList = clusters.map((cluster) => {
      const clusterRenderList = envBackendTemplateList.map((envRender) => {
        return { envRenders: this.batchReplaceTemplates(ReplaceType.CLUSTER, [cluster], envRender.envRenders) }
      })
      return { clusterRenders: clusterRenderList }
    })

    return {
      frontend: envFrontendTemplateMap,
      backend: renderedBackendTemplateList
    }
  }

  private batchReplaceTemplates(replaceType: ReplaceType, targetValues: string[], templateList: string[]): string[] {
    if (!targetValues.length) return templateList
    const renderedTemplateList = []
    templateList.forEach((template) => {
      targetValues.forEach((value) => {
        const replaceFn = replaceFnMap[replaceType]
        const replacedTemplate = replaceFn(value, template)
        // may be undefined
        if (replacedTemplate) {
          renderedTemplateList.push(replacedTemplate)
        }
      })
    })

    return renderedTemplateList
  }
}
