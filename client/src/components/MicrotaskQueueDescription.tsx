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

export default function MicrotaskQueueDescription({
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
      <DialogTitle id="scroll-dialog-title">
        About the Microtask Queue
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <b>TL;DR</b>
          {' '}
          <em>
            The
            {' '}
            <b>Microtask Queue</b>
            {' '}
            was added in ES6 to handle Promises. It's a
            lot like the Call Stack. The main difference is how Microtasks are
            enqueued and when they are processed.
          </em>
        </DialogContentText>
        <br />
        <Divider />
        <br />
        <DialogContentText>
          The
          {' '}
          <b>Microtask Queue</b>
          {' '}
          is a FIFO queue of Microtasks that are
          processed by the Event Loop. The
          {' '}
          <b>Microtask Queue</b>
          {' '}
          is very similar
          to the Task Queue. It was added to JavaScript's execution model as part
          of ES6 in order to handle Promise resolution callbacks.
        </DialogContentText>
        <br />
        <DialogContentText>
          Microtasks are a lot like Tasks. They are synchronous blocks of code
          (think of them as Function objects) that have exclusive access to the
          Call Stack while running. And just like Tasks, Microtasks are able to
          enqueue additional Microtasks or Tasks to be run next.
        </DialogContentText>
        <br />
        <DialogContentText>
          The only difference between Microtasks and Tasks is where they are
          stored, and when they are processed.
          <ul>
            <li>
              Tasks are stored in Task Queues. But Microtasks are stored in the
              {' '}
              <b>Microtask Queue</b>
              {' '}
              (there's only one of these).
            </li>
            <li>
              Tasks are processed in a loop, and rendering is performed in-between
              Tasks. But the
              {' '}
              <b>Microtask Queue</b>
              {' '}
              is emptied out after a Task
              completes, and before re-rendering occurs.
            </li>
          </ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Link
          variant="body1"
          color="secondary"
          href="https://www.w3.org/TR/html52/webappapis.html#microtask-queue"
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
};
