import React from 'react'

import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'

import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import FastForwardIcon from '@material-ui/icons/FastForward'
import PauseIcon from '@material-ui/icons/Pause'

import MuiThemeProvider from '@mui/material/styles/MuiThemeProvider'
import green from '@mui/material/colors/green'
import blue from '@mui/material/colors/blue'
import yellow from '@mui/material/colors/yellow'
import { makeStyles } from 'tss-react/mui'
import { ThemeProvider, createTheme } from '@mui/material/styles'


function createTheme(primary) {
  return createMuiTheme({
    palette: { primary },
    typography: { useNextVariants: true },
  })
}

const greenTheme = createTheme({
  palette: { primary: green },
})

function GreenFab(props) {
  return (
    <ThemeProvider theme={greenTheme}>
      <Fab {...props} />
    </ThemeProvider>
  )
}

const blueTheme = createTheme({
  palette: { primary: blue },
})

function BlueFab(props) {
  return (
    <ThemeProvider theme={blueTheme}>
      <Fab {...props} />
    </ThemeProvider>
  )
}

const yellowTheme = createTheme(yellow)

function YellowFab(props) {
  return (
    <ThemeProvider theme={yellowTheme}>
      <Fab {...props} />
    </ThemeProvider>
  )
}

const useStyles = makeStyles()(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 20,
    right: 20,
    overflow: 'hidden',
  },
}))

function themedStyles(theme) {
  return {
    fab: {
      margin: theme.spacing.unit,
      color: 'white',
    },
    yellowFab: {
      margin: theme.spacing.unit,
      color: 'black',
    },
    extendedIcon: {
      marginRight: theme.spacing.unit,
    },
  }
}

export default function FabControls({
  visible,
  isAutoPlaying,
  hasReachedEnd,
  onClickStep,
  onClickAutoStep,
  onClickPauseAutoStep,
}: {
  visible: boolean
  isAutoPlaying: boolean
  hasReachedEnd: boolean
  onClickStep: () => void
  onClickAutoStep: () => void
  onClickPauseAutoStep: () => void
}) {
  const { classes } = useStyles()

  return (
    <div style={styles.container}>
      {!isAutoPlaying && (
        <Tooltip
          style={{ transitionDelay: '50ms' }}
          title="Auto Step"
          aria-label="Auto Step"
          placement="left"
        >
          <div>
            <Zoom in={visible && !isAutoPlaying} className={classes.fab}>
              <BlueFab
                color="primary"
                size="medium"
                aria-label="auto-play"
                disabled={hasReachedEnd}
                onClick={onClickAutoStep}
              >
                <FastForwardIcon />
              </BlueFab>
            </Zoom>
          </div>
        </Tooltip>
      )}
      {isAutoPlaying && (
        <Tooltip
          style={{ transitionDelay: '50ms' }}
          title="Pause Auto Step"
          aria-label="Pause Auto Step"
          placement="left"
        >
          <div>
            <Zoom in={visible && isAutoPlaying} className={classes.yellowFab}>
              <YellowFab
                color="primary"
                size="medium"
                aria-label="pause"
                disabled={hasReachedEnd}
                onClick={onClickPauseAutoStep}
              >
                <PauseIcon />
              </YellowFab>
            </Zoom>
          </div>
        </Tooltip>
      )}
     
      <Zoom style={{ transitionDelay: '0ms' }} in={visible}>
        <GreenFab
          color="primary"
          variant="extended"
          size="large"
          aria-label="Delete"
          className={classes.fab}
          disabled={isAutoPlaying || hasReachedEnd}
          onClick={onClickStep}
        >
          <PlayArrowIcon className={classes.extendedIcon} />
          Step
        </GreenFab>
      </Zoom>
    </div>
  )
}
