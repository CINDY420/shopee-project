import * as R from 'ramda'
import StringBuilder from './StringBuilder'

/**
 * stringify pipeline object into the content shown in the pipeline viewer
 * and it also inserts the line number of each section as it walks down the pipeline object
 * @param pipeline pipeline object needed to be stringified
 * @returns str pipeline string which will be shown in the viewer
 */
export const pipelineStringify = (pipeline: any): { pipeline: any; pipelineString: string } => {
  const result = { pipeline: R.clone(pipeline), pipelineString: '' }
  if (R.isEmpty(pipeline)) {
    return result
  }

  const stringBuilder = new StringBuilder()

  stringBuilder.newBlock('pipeline')
  stringBuilder.indent()
  stringBuilder.newBlock('stages')

  result.pipeline.stages.forEach((stage: any, stageIndex: number) => {
    stage._marker = { startLine: stringBuilder.currentLineNumber }

    stringBuilder.indent()
    stringBuilder.newBlock(`stage('${stage.name}')`)

    if (stage.steps) {
      stage.steps.forEach((step: any, stepIndex: number) => {
        if (stepIndex !== 0) {
          stringBuilder.newLine()
        }

        step._marker = { startLine: stringBuilder.currentLineNumber }
        stringBuilder.appendText(step.value)
        step._marker.endLine = stringBuilder.currentLineNumber
      })

      stringBuilder.endBlock()
      stage._marker.endLine = stringBuilder.currentLineNumber

      if (stageIndex !== pipeline.stages.length - 1) {
        stringBuilder.newLine()
      }
    }
  })

  stringBuilder.endBlock()
  stringBuilder.endBlock()

  result.pipelineString = stringBuilder.result

  return result
}
