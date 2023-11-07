/* @flow */
import React from 'react';

import { withStyles } from '@mui/material/styles';

import MUIDrawer from '@mui/material/Drawer';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
});

const Drawer = ({
  classes,
  open,
  visiblePanels: { taskQueue, microtaskQueue, callStack, eventLoop },
  onChange,
  onClose,
}: {|
  classes: any,
  open: boolean,
  visiblePanels: {
    taskQueue: boolean,
    microtaskQueue: boolean,
    callStack: boolean,
    eventLoop: boolean,
  },
  onChange: string => void => any,
  onClose: void => any,
|}) => (
  <MUIDrawer open={open} onClose={onClose}>
    <FormControl component="div" className={classes.formControl}>
      <FormLabel component="legend">Visible Panels</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={taskQueue} onChange={onChange('taskQueue')} value="Task Queue" />
          }
          label="Task Queue"
        />
        <FormControlLabel
          control={
            <Checkbox checked={microtaskQueue} onChange={onChange('microtaskQueue')} value="Microtask Queue" />
          }
          label="Microtask Queue"
        />
        <FormControlLabel
          control={
            <Checkbox checked={callStack} onChange={onChange('callStack')} value="Call Stack" />
          }
          label="Call Stack"
        />
        <FormControlLabel
          control={
            <Checkbox checked={eventLoop} onChange={onChange('eventLoop')} value="Event Loop" />
          }
          label="Event Loop"
        />
      </FormGroup>
    </FormControl>
  </MUIDrawer>
);

export default withStyles(styles)(Drawer);
