import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    actions: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    link: {
      marginLeft: 15,
    },
  }
})

export default function CallStackDescription({
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
      <DialogTitle id="scroll-dialog-title">About the Call Stack</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <b>TL;DR</b>
          {' '}
          <em>
            The
            {' '}
            <b>Call Stack</b>
            {' '}
            tracks function calls. It is a LIFO stack of
            frames. Each frame represents a function call.
          </em>
        </DialogContentText>
        <br />
        <Divider />
        <br />
        <DialogContentText>
          The
          {' '}
          <b>Call Stack</b>
          {' '}
          is a fundamental part of the JavaScript language.
          It is a record-keeping structure that allows us to perform function
          calls. Each function call is represented as a frame on the
          {' '}
          <b>Call Stack</b>
          . This is how the JavaScript engine keeps track of
          which functions have been called and in what order. The JS engine uses
          this information to ensure execution picks back up in the right spot
          after a function returns.
        </DialogContentText>
        <br />
        <DialogContentText>
          When a JavaScript program first starts executing, the
          {' '}
          <b>Call Stack</b>
          {' '}
          is empty. When the first function call is made, a new frame is pushed
          onto the top of the
          {' '}
          <b>Call Stack</b>
          . When that function returns, its
          frame is popped off of the
          {' '}
          <b>Call Stack</b>
          .
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Link
          variant="body1"
          color="secondary"
          href="https://www.ecma-international.org/ecma-262/9.0/index.html#sec-execution-contexts"
          target="_blank"
          rel="noreferrer"
          className={classes.link}
        >
          Learn more from the JavaScript Spec
        </Link>
        <Button onClick={onClose} color="secondary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
