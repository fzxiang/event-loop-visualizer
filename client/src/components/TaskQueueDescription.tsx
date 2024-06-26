import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { makeStyles } from 'tss-react/mui'

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

export default function TaskQueueDescription({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => any
}) {
  const { classes } = useStyles()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="scroll-dialog-title">About the Task Queue</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <b>TL;DR</b>
          {' '}
          <em>
            The
            {' '}
            <b>Task Queue</b>
            {' '}
            is a FIFO queue of Tasks that are going to be
            executed by the Event Loop. Tasks are synchronous blocks of code that
            can enqueue other Tasks while they're running.
          </em>
        </DialogContentText>
        <br />
        <Divider />
        <br />
        <DialogContentText>
          If the Call Stack keeps track of the functions that are executing right
          now, then the
          {' '}
          <b>Task Queue</b>
          {' '}
          keeps track of functions that are going
          to be executed in the future.
        </DialogContentText>
        <br />
        <DialogContentText>
          The
          {' '}
          <b>Task Queue</b>
          {' '}
          is a FIFO queue of Tasks that are processed by the
          Event Loop. Tasks are synchronous blocks of code. You can think of them
          as Function objects.
        </DialogContentText>
        <br />
        <DialogContentText>
          The Event Loop works by continuously looping through the
          {' '}
          <b>Task Queue</b>
          {' '}
          and processing the Tasks it contains one by one. A
          single iteration of the Event Loop is called a tick.
        </DialogContentText>
        <br />
        <DialogContentText>
          To process a Task, the Event Loop invokes the Function associated with
          it. While a Task is running, it has exclusive access to the Call Stack.
          The Event Loop waits to process the next Task until the current Task is
          finished, and the Call Stack is empty.
        </DialogContentText>
        <br />
        <DialogContentText>
          While a Task is running, it can enqueue other Tasks to be processed in
          subsequent ticks of the Event Loop. There are several ways to do this,
          the simplest of which is
          {' '}
          <code>setTimeout(taskFn, 0)</code>
          . Tasks can
          also come from external sources such as DOM and network events.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Link
          variant="body1"
          color="secondary"
          href="https://www.w3.org/TR/html52/webappapis.html#task-queues"
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
