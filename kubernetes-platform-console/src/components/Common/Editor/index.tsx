import * as React from 'react'
import AceEditor from 'react-ace'
import styled from 'styled-components'
import { IAceEditorProps } from 'react-ace/lib/ace'

import 'brace/mode/yaml'
import 'brace/mode/groovy'
import 'brace/theme/textmate'

const StyledAceEditor = styled(AceEditor)`
  border: 1px solid rgba(0, 0, 0, 0.12);
`

interface IEditorProps extends IAceEditorProps {
  // readOnly?: boolean
  // value?: string
  // onChange?: (value: string) => void
  // mode?: string
  // theme?: string
  // highlightActiveLine?: boolean
  // showPrintMargin?: boolean
  // showGutter?: boolean
  // setOptions?: object
  // fontSize?: string
  // height?: string
  // width?: string
  // editorProps?: object
}

/**
 * Editor is a component based on react-ace package, and its attributes are all from react-ace.
 *
 * So for descriptions of properties, please refer to https://github.com/securingsincity/react-ace/blob/master/docs/Ace.md
 */
const Editor: React.FC<IEditorProps> = React.forwardRef(props => {
  const {
    readOnly,
    value,
    onChange,
    mode,
    theme,
    highlightActiveLine,
    showPrintMargin,
    showGutter,
    setOptions,
    fontSize,
    height,
    width,
    editorProps,
    ...others
  } = props

  return (
    <StyledAceEditor
      {...others}
      highlightActiveLine={highlightActiveLine}
      showPrintMargin={showPrintMargin}
      showGutter={showGutter}
      mode={mode}
      theme={theme}
      fontSize={fontSize}
      readOnly={readOnly}
      width={width}
      height={height}
      setOptions={setOptions}
      editorProps={editorProps}
      value={value}
      onChange={onChange}
    />
  )
})

Editor.defaultProps = {
  editorProps: { $blockScrolling: Infinity },
  setOptions: {
    showLineNumbers: true,
    tabSize: 2
  },
  highlightActiveLine: true,
  theme: 'textmate',
  width: '100%',
  height: '500px'
}

export default Editor
