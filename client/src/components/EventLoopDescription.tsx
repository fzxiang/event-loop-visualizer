import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { makeStyles } from 'tss-react/mui'

const eventLoopPsuedocode = `
while (EventLoop.waitForTask()) {
  const taskQueue = EventLoop.selectTaskQueue();
  if (taskQueue.hasNextTask()) {
    taskQueue.processNextTask();
  }

  const microtaskQueue = EventLoop.microTaskQueue;
  while (microtaskQueue.hasNextMicrotask()) {
    microtaskQueue.processNextMicrotask();
  }

  rerender();
}
`.trim()

const useStyles = makeStyles()(() => ({
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    marginLeft: 15,
  },
}))

export default function EventLoopDescription({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { classes } = useStyles()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="scroll-dialog-title">About the Event Loop</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <b>TL;DR</b>
          {' '}
          <em>
            The
            {' '}
            <b>Event Loop</b>
            {' '}
            processes Tasks and Microtasks. It places them
            into the Call Stack for execution one at a time. It also controls when
            rerendering occurs.
          </em>
        </DialogContentText>
        <br />
        <Divider />
        <br />
        <DialogContentText>
          The Event Loop is a looping algorithm that processes the
          Tasks/Microtasks in the Task Queue and Microtask Queue. It handles
          selecting the next Task/Microtask to be run and placing it in the Call
          Stack for execution.
        </DialogContentText>
        <br />
        <DialogContentText>
          The Event Loop algorithm consists of four key steps:
          <ol>
            <li>
              <b>Evaluate Script:</b>
              {' '}
              Synchronously execute the script as though
              it were a function body. Run until the Call Stack is empty.
            </li>
            <li>
              <b>Run a Task:</b>
              {' '}
              Select the oldest Task from the Task Queue. Run
              it until the Call Stack is empty.
            </li>
            <li>
              <b>Run all Microtasks:</b>
              {' '}
              Select the oldest Microtask from the
              Microtask Queue. Run it until the Call Stack is empty. Repeat until
              the Microtask Queue is empty.
            </li>
            <li>
              <b>Rerender the UI:</b>
              {' '}
              Rerender the UI. Then, return to step 2.
              (This step only applies to browsers, not NodeJS).
            </li>
          </ol>
        </DialogContentText>
        <br />
        <DialogContentText>
          Let's model the Event Loop with some JavaScript psuedocode:
          <pre style={{ fontSize: 14, marginLeft: 16 }}>
            <code>{eventLoopPsuedocode}</code>
          </pre>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Link
          variant="body1"
          color="secondary"
          href="https://www.w3.org/TR/html52/webappapis.html#event-loops-processing-model"
          target="_blank"
          rel="noreferrer"
          className={classes.link}
        >
          Learn more from the HTML Scripting Spec
        </Link>
        <Button onClick={onClose} color="secondary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
