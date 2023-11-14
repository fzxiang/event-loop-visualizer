import { blue, green, red } from '@mui/material/colors'

import { createTheme } from '@mui/material/styles'

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: green[800],
    },
    secondary: {
      main: blue[800],
    },
    error: {
      main: red.A400,
    },
  },
})

export default theme
