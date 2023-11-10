import { useState } from 'react'
import Measure from 'react-measure'
import { AnimatePresence, motion } from 'framer-motion'

import type { ContentRect } from 'react-measure'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { makeStyles } from 'tss-react/mui'
import { pastels } from '../styles/colors'
import '../styles/index.css'
import CardHeaderWithAbout from './CardHeaderWithAbout'

const useStyles = makeStyles()((theme) => {
  return {
    card: {
      maxHeight: 140,
      margin: theme.spacing(1),
      height: 120,
      backgroundColor: theme.palette.primary.main,
      display: 'flex',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    task: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      margin: theme.spacing(1),
      display: 'inline-block',
      textAlign: 'center',
      minWidth: 125,
    },
  }
})

interface Props {
  title: string
  tasks: { id: string; name: string }[]
  onClickAbout: () => void
}

const variants = {
  enter: { x: 0, opacity: 1 },
  exit: { x: -200, opacity: 0 },
}

export default function TaskQueue({ tasks, title, onClickAbout }: Props) {
  const [width, setWidth] = useState<number | undefined>(undefined)
  const [height, setHeight] = useState<number | undefined>(undefined)

  const handleResize = ({ bounds }: ContentRect) => {
    if (bounds) {
      setWidth(bounds.width)
      setHeight(bounds.height)
    }
  }

  const { classes } = useStyles()

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <CardHeaderWithAbout title={title} onClickAbout={onClickAbout} slideButtonLeft />
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
          <Measure bounds onResize={handleResize}>
            {({ measureRef: ref }) => <div ref={ref} style={{ flex: 1 }} />}
          </Measure>
          <div
            style={{
              width,
              height,
              position: 'absolute',
              display: 'flex',
              flexWrap: 'nowrap',
              flexDirection: 'row',
              paddingBottom: 20,
            }}
            className="scroll-on-hover-x"
          >
            <AnimatePresence>
              {tasks.map((item, idx) => {
                return (
                  <motion.div
                    key={item.id}
                    initial="exit"
                    animate="enter"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.2 }}
                  >
                    <Paper style={{ backgroundColor: pastels[idx] }} className={classes.task} elevation={1}>
                      <Typography style={{ fontSize: 20 }} color="inherit">
                        {item.name}
                      </Typography>
                    </Paper>
                    {item.name}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
