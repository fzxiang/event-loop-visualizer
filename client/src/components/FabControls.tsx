import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'

import type { FabOwnProps } from '@mui/material'

import green from '@mui/material/colors/green'
import blue from '@mui/material/colors/blue'
import yellow from '@mui/material/colors/yellow'
import { makeStyles } from 'tss-react/mui'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import FastForwardIcon from '@mui/icons-material/FastForward'
import PauseIcon from '@mui/icons-material/Pause'

const greenTheme = createTheme({
  palette: { primary: {
    main: green[500],
  } },
})

type FabProps = {
  onClick: () => void
  className?: string
  children: ReactNode
} & FabOwnProps

const GreenFab = forwardRef<HTMLButtonElement, FabProps>((props, ref) => {
  return (
    <ThemeProvider theme={greenTheme}>
      <Fab {...props} ref={ref} />
    </ThemeProvider>
  )
})

const blueTheme = createTheme({
  palette: { primary: { main: blue[500] } },
})

const BlueFab = forwardRef<HTMLButtonElement, FabProps>((props, ref) => {
  return (
    <ThemeProvider theme={blueTheme}>
      <Fab {...props} ref={ref} />
    </ThemeProvider>
  )
})

const yellowTheme = createTheme({
  palette: { primary: { main: yellow[500] } },
})

const YellowFab = forwardRef<HTMLButtonElement, FabProps>((props, ref) => {
  return (
    <ThemeProvider theme={yellowTheme}>
      <Fab {...props} ref={ref} />
    </ThemeProvider>
  )
})

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end' as const,
    position: 'absolute' as const,
    bottom: 20,
    right: 20,
    overflow: 'hidden',
  },
}

const useStyles = makeStyles()(theme => ({
  fab: {
    margin: theme.spacing(1),
    color: 'white',
  },
  yellowFab: {
    margin: theme.spacing(1),
    color: 'black',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}))

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
