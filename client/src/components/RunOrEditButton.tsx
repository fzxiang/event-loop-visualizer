import type { ReactNode } from 'react'
import type { ButtonOwnProps } from '@mui/material'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import SendIcon from '@mui/icons-material/Send'
import CodeIcon from '@mui/icons-material/Code'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import green from '@mui/material/colors/green'
import blue from '@mui/material/colors/blue'
import yellow from '@mui/material/colors/yellow'
import { makeStyles } from 'tss-react/mui'

const greenTheme = createTheme({
  palette: { primary: { main: green[500] } },
})
type ButtonProps = {
  onClick: () => void
  className: string
  children: ReactNode
} & ButtonOwnProps

function GreenButton(props: ButtonProps) {
  return (
    <ThemeProvider theme={greenTheme}>
      <Button {...props} />
    </ThemeProvider>
  )
}

const blueTheme = createTheme({
  palette: { primary: { main: blue[500] } },
})

function BlueButton(props: ButtonProps) {
  return (
    <ThemeProvider theme={blueTheme}>
      <Button {...props} />
    </ThemeProvider>
  )
}

const useStyles = makeStyles()((theme) => {
  return {
    button: {
      margin: theme.spacing(1),
      color: 'white',
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
      color: 'white',
    },
    wrapper: {
      position: 'relative',
    },
    buttonProgress: {
      color: yellow[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }
})

export default function RunOrEditButton({
  mode,
  runDisabled,
  onClickRun,
  onClickEdit,
}: {
  mode: 'editing' | 'visualizing' | 'running'
  runDisabled: boolean
  onClickRun: () => void
  onClickEdit: () => void
}) {
  const { classes } = useStyles()

  if (mode !== 'editing' && mode !== 'running' && mode !== 'visualizing')
    throw new Error(`Invalid mode: ${mode}`)

  return (
    <div>
      {
        mode === 'editing' || mode === 'running'
          ? (
            <div className={classes.wrapper}>
              <GreenButton
                color="primary"
                variant="contained"
                className={classes.button}
                disabled={runDisabled || mode === 'running'}
                onClick={onClickRun}
              >
                Run
                <SendIcon className={classes.rightIcon}>Run</SendIcon>
              </GreenButton>
              {mode === 'running' && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
            )
          : mode === 'visualizing'
            ? (
              <BlueButton
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={onClickEdit}
              >
                Edit
                <CodeIcon className={classes.rightIcon}>Edit</CodeIcon>
              </BlueButton>
              )
            : null
      }
    </div>
  )
}
