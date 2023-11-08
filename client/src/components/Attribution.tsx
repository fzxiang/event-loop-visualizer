import { makeStyles } from 'tss-react/mui'

import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

const useStyles = makeStyles()(theme => (
  {
    root: {
      marginBottom: theme.spacing(1),
    },
  }
))

function Attribution() {
  const { classes } = useStyles()
  return (
    <Typography
      variant="body1"
      color="inherit"
      className={classes.root}
      align="center"
    >
      Built by
      {' '}
      <Link
        variant="body1"
        color="secondary"
        href="https://github.com/Hopding/"
        target="_blank"
        rel="noreferrer"
      >
        Alson(fzxiang)
      </Link>
      . Inspired by
      {' '}
      <Link
        variant="body1"
        color="secondary"
        href="https://github.com/Hopding/"
        target="_blank"
        rel="noreferrer"
      >
        Andrew Dillon
      </Link>
      .
    </Typography>
  )
}

export default Attribution
