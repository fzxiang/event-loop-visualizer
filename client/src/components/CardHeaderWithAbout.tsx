import { makeStyles } from 'tss-react/mui'

import type { ButtonOwnProps } from '@mui/material'
import { Button } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import blue from '@mui/material/colors/blue'

import CardHeader from '@mui/material/CardHeader'

const blueTheme = createTheme({
  palette: { primary: blue },
})

interface ButtonProps {
  color: ButtonOwnProps['color']
  size: ButtonOwnProps['size']
  onClick: () => void
  className: string
  children: React.ReactNode
}
function BlueButton(props: ButtonProps) {
  return (
    <ThemeProvider theme={blueTheme}>
      <Button {...props} />
    </ThemeProvider>
  )
}

const useStyles = makeStyles()(() => {
  return {
    header: {
      padding: 0,
    },
    margin1: {
    },
    margin2: {
      marginRight: 25,
    },
  }
})

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
  },
}

export default function CardHeaderWithAbout({
  slideButtonLeft = false,
  title,
  onClickAbout,
}: {
  slideButtonLeft?: boolean
  title: string
  onClickAbout: () => void
}) {
  const { classes } = useStyles()

  return (
    <div style={styles.container}>
      <CardHeader title={title} className={classes.header} />
      <BlueButton
        color="primary"
        size="small"
        className={slideButtonLeft ? classes.margin2 : classes.margin1}
        onClick={onClickAbout}
      >
        About
      </BlueButton>
    </div>
  )
};
