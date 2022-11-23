import * as React from 'react'
import jsYaml from 'js-yaml'

import Editor from 'components/Common/Editor'
import { Item, CardRoot, CardTitle, CardWrap } from '../style'

interface IProps {
  lifeCycle: any
}

const LifeCycle: React.FC<IProps> = ({ lifeCycle = {} }) => {
  const { postStart = '', preStop = '' } = lifeCycle

  let postStartYaml = postStart
  let preStopYaml = preStop

  try {
    postStartYaml = postStart ? jsYaml.dump(JSON.parse(postStart)) : postStart
    preStopYaml = preStop ? jsYaml.dump(JSON.parse(preStop)) : preStop
  } catch (e) {
    console.error(e.message)
  }

  const isEmpty = !postStartYaml && !preStopYaml

  return (
    <Item alignItems={!isEmpty ? 'flex-start' : ''}>
      <span style={!isEmpty ? { width: '80px' } : {}}>LifeCycle:</span>
      {!isEmpty ? (
        <CardRoot>
          {postStartYaml ? (
            <CardWrap>
              <CardTitle>PostStart</CardTitle>
              <Editor mode='yaml' height='240px' readOnly={true} value={postStartYaml} />
            </CardWrap>
          ) : null}
          {preStopYaml ? (
            <CardWrap>
              <CardTitle>PreStop</CardTitle>
              <Editor mode='yaml' height='240px' readOnly={true} value={preStopYaml} />
            </CardWrap>
          ) : null}
        </CardRoot>
      ) : (
        '-'
      )}
    </Item>
  )
}

export default LifeCycle
