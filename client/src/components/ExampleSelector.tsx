import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'

import { makeStyles } from 'tss-react/mui'
import EXAMPLES1 from '../assets/examples1'
import EXAMPLES2 from '../assets/examples2'
import EXAMPLES3 from '../assets/examples3'

const useStyles = makeStyles()(theme => ({
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: theme.spacing(1),
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

export default function ExampleSelector({
  example,
  locked,
  onChangeExample,
}: {
  example: string
  locked: boolean
  onChangeExample: (arg: { target: { value: string } }) => any
}) {
  const { classes } = useStyles()
  return (
    <form className={classes.form} autoComplete="off">
      <FormControl className={classes.formControl} variant="standard">
        <Select
          value={example}
          onChange={onChangeExample}
          disabled={locked}
        >
          <MenuItem value="none">
            <em>Choose an Example</em>
          </MenuItem>
          <Divider />
          {EXAMPLES1.map(({ name, value }) => (
            <MenuItem key={name} value={value}>{name}</MenuItem>
          ))}
          <Divider />
          {EXAMPLES2.map(({ name, value }) => (
            <MenuItem key={name} value={value}>{name}</MenuItem>
          ))}
          <Divider />
          {EXAMPLES3.map(({ name, value }) => (
            <MenuItem key={name} value={value}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  )
}
