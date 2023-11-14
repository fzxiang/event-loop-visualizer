import type { ReactNode, Ref } from 'react'
import { forwardRef, useEffect, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import TextField from '@mui/material/TextField'

import type { ButtonOwnProps } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import pink from '@mui/material/colors/pink'
import { makeStyles } from 'tss-react/mui'

const pinkTheme = createTheme({
  palette: { primary: { main: pink[500] } },
})

type ButtonProps = {
  onClick: () => void
  className: string
  children: ReactNode
  ref: any
} & ButtonOwnProps

const PinkButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <ThemeProvider theme={pinkTheme}>
      <Button {...props} ref={ref} />
    </ThemeProvider>
  )
})

const useStyles = makeStyles()(theme => ({
  button: {
    margin: theme.spacing(1),
    color: 'white',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
    color: 'white',
  },
  popover: {
    width: '40rem',
    zIndex: 1,
  },
  popoverArrow: {
    'position': 'absolute',
    'height': '.75rem',
    'width': '.75rem',
    'top': '-0.25rem',
    'left': 0,
    'right': 0,
    'margin': 'auto',
    '&::before': {
      content: '""',
      position: 'absolute',
      height: '.75rem',
      width: '.75rem',
      top: 0,
      left: 0,
      transform: 'translateX(0px) rotate(45deg)',
      transformOrigin: 'center center',
      backgroundColor: '#ffffff',
    },
  },
  popoverContent: {
    padding: theme.spacing(1),
  },
  input: {
    overflow: 'hidden',
  },
}))

export default function ShareButton({ code }: { code: string }) {
  const { classes } = useStyles()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const anchor = buttonRef && buttonRef.current
  const url = new URL(window.location.href)

  url.searchParams.set('code', btoa(code))

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.select()
      inputRef.current.scrollLeft = 0
    }
  }

  useEffect(() => {
    open && requestAnimationFrame(() => {
      inputRef.current && (inputRef.current.focus())
    })
  }, [open])

  return (
    <div>
      <PinkButton
        color="primary"
        variant="contained"
        className={classes.button}
        ref={buttonRef}
        onClick={handleOpen}
      >
        Share
        <LinkIcon className={classes.rightIcon}>
          Run
        </LinkIcon>
      </PinkButton>
      <Popper
        open={open}
        anchorEl={anchor}
        placement="bottom"
        className={classes.popover}
      >
        <div className={classes.popoverArrow} data-popper-arrow></div>
        <Paper className={classes.popoverContent}>
          <TextField
            value={url.toString()}
            className={classes.input}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            inputRef={inputRef}
            onBlur={handleClose}
            onFocus={handleFocus}
          />
        </Paper>
      </Popper>
    </div>
  )
}
