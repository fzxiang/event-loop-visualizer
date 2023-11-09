import AceEditor from 'react-ace'

import Paper from '@mui/material/Paper'

import 'brace'
import 'brace/mode/javascript'
import 'brace/theme/solarized_light'

import '../styles/colors.css'
import { makeStyles } from 'tss-react/mui'
import { getPastelIndexFor } from '../styles/colors'

const useStyles = makeStyles()(theme => ({
  root: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    height: '100%',
    display: 'flex',
  },
}))

function convertCodeIndexToRowCol(code: string, index: number): { row: number; col: number } {
  let col = 0
  let row = 0
  let head = 0
  while (head < index) {
    col += 1

    if (code[head - 1] === '\n') {
      row += 1
      col = 1
    }

    head += 1
    if (head >= code.length)
      throw new Error(`head=${head}, code.length=${code.length}`)
  }

  if (code[head - 1] === '\n') {
    row += 1
    col = 0
  }

  return { row, col }
}

export default function CodeEditor({
  code = '',
  markers = [],
  onChangeCode,
  locked = false,
}: {
  code: string
  markers?: { start: number; end: number }[]
  onChangeCode: (code: string) => any
  locked: boolean
}) {
  const { classes } = useStyles()
  return (
    <Paper className={classes.root} elevation={1}>
      <AceEditor
        style={{
          maxWidth: 500,
          height: '100%',
          marginLeft: -15,
          marginRight: -15,
        }}
        readOnly={locked}
        value={code}
        mode="javascript"
        theme="solarized_light"
        onChange={onChangeCode}
        name="code-editor"
        fontSize={14}
        tabSize={2}
        markers={
          markers.map(({ start, end }, idx) => {
            return ({
              startRow: convertCodeIndexToRowCol(code, start).row,
              startCol: convertCodeIndexToRowCol(code, start).col,
              endRow: convertCodeIndexToRowCol(code, end).row,
              endCol: convertCodeIndexToRowCol(code, end).col,
              className: `active-function-marker${getPastelIndexFor(idx)}`,
              type: 'text',
            })
          })
        }
        showGutter
        highlightActiveLine={!locked}
        setOptions={{
          showLineNumbers: true,
        }}
        editorProps={{ $blockScrolling: Number.POSITIVE_INFINITY }}
        focus
      />
    </Paper>
  )
}
