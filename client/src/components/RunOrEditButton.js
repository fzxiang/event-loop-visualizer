
import React from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import SendIcon from '@material-ui/icons/Send';
import CodeIcon from '@material-ui/icons/Code';

import MuiThemeProvider from '@mui/material/styles/MuiThemeProvider';
import { createMuiTheme } from '@mui/material/styles';
import { withStyles } from '@mui/material/styles';
import green from '@mui/material/colors/green';
import blue from '@mui/material/colors/blue';
import yellow from '@mui/material/colors/yellow';

const createTheme = (primary) =>createMuiTheme({
  palette: { primary },
  typography: { useNextVariants: true },
});

const greenTheme = createTheme(green);

const GreenButton = (props) => (
  <MuiThemeProvider theme={greenTheme}>
    <Button {...props} />
  </MuiThemeProvider>
);

const blueTheme = createTheme(blue);

const BlueButton = (props) => (
  <MuiThemeProvider theme={blueTheme}>
    <Button {...props} />
  </MuiThemeProvider>
);

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: 'white',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
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
});

const RunOrEditButton = ({
  classes,
  mode,
  runDisabled,
  onClickRun,
  onClickEdit,
}: {|
  classes: any,
  mode: 'editing' | 'visualizing',
  runDisabled: boolean,
  onClickRun: void => any,
  onClickEdit: void => any,
|}) => (
  <div>
    {
      mode === 'editing' || mode === 'running' ? (
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
      ) : mode === 'visualizing' ? (
        <BlueButton
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={onClickEdit}
        >
          Edit
          <CodeIcon className={classes.rightIcon}>Edit</CodeIcon>
        </BlueButton>
      ) : new Error(`Invalid mode: ${mode}`)
    }
  </div>
);

export default withStyles(styles)(RunOrEditButton);
