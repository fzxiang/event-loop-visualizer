import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Typography from '@mui/material/Typography'
import Stepper from '@mui/material/Stepper'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import blue from '@mui/material/colors/blue'

import { makeStyles } from 'tss-react/mui'
import CardHeaderWithAbout from './CardHeaderWithAbout'

const blueTheme = createTheme({
  palette: { primary: blue },
})

const useStyles = makeStyles()(theme => ({
  card: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.main,
    flex: 1,
    maxWidth: 300,
    overflowY: 'auto',
  },
  stepper: {
    backgroundColor: 'transparent',
  },
}))

const stepTitles = [
  'Evaluate Script',
  'Run a Task',
  'Run all Microtasks',
  'Rerender',
]

const stepDescriptions = [
  'Synchronously execute the script as though it were a function body. Run until the Call Stack is empty.',
  'Select the oldest Task from the Task Queue. Run it until the Call Stack is empty.',
  'Select the oldest Microtask from the Microtask Queue. Run it until the Call Stack is empty. Repeat until the Microtask Queue is empty.',
  'Rerender the UI. Then, return to step 2. (This step only applies to browsers, not NodeJS).',
]

const idxForStep = {
  none: -1,
  evaluateScript: 0,
  runTasks: 1,
  runMicrotasks: 2,
  rerender: 3,
}

export default function ExecutionModelStepper({
  step,
  onClickAbout,
}: {
  step: 'evaluateScript' | 'runTasks' | 'runMicrotasks' | 'rerender' | 'none'
  onClickAbout: () => void
}) {
  const { classes } = useStyles()
  return (
    <Card className={classes.card}>
      <CardContent>
        <CardHeaderWithAbout title="Event Loop" onClickAbout={onClickAbout} />
        <ThemeProvider theme={blueTheme}>
          <Stepper
            activeStep={idxForStep[step]}
            orientation="vertical"
            className={classes.stepper}
          >
            {stepTitles.map((title, idx) => {
              return (
                <Step key={title} completed={idx < idxForStep[step]}>
                  <StepLabel>
                    <Typography
                      style={{ fontWeight: idx === idxForStep[step] ? 'bold' : 'normal' }}
                    >
                      {title}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography>{stepDescriptions[idx]}</Typography>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>
        </ThemeProvider>
      </CardContent>
    </Card>
  )
}
