import { withStyles } from '@mui/styles'

import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

function Attribution({ classes }: { classes: any }) {
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
        Andrew Dillon
      </Link>
      . Inspired by
      {' '}
      <Link
        variant="body1"
        color="secondary"
        href="http://latentflip.com/loupe/"
        target="_blank"
        rel="noreferrer"
      >
        Loupe
      </Link>
      .
    </Typography>
  )
}

function styles(theme: any) {
  return {
    root: {
      marginBottom: theme?.spacing?.unit,
    },
  }
}

export default withStyles(styles)(Attribution)
