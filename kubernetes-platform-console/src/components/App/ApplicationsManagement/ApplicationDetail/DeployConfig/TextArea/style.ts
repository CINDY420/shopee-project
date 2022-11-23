import 'ace-builds'
import AceEditor from 'react-ace'
import styled from 'styled-components'

interface IAceEditor {
  isEditing: boolean
}

export const StyledAceEditor = styled(AceEditor)<IAceEditor>`
  border: 1px solid rgba(0, 0, 0, 0.12);
  margin-bottom: 24px;

  .ace_gutter-cell {
    padding-left: 4px;
  }

  .ace_content {
    cursor: ${props => (props.isEditing ? 'text' : 'not-allowed')};
  }
`
