import type { FC } from 'react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { makeStyles } from 'tss-react/mui'

import type { ContentRect } from 'react-measure'
import Measure from 'react-measure'

import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { getPastelForIndex } from '../styles/colors'
import '../styles/index.css'
import CardHeaderWithAbout from './CardHeaderWithAbout'

interface Props {
  classes: any
  frames: { id: string; name: string }[]
  onClickAbout: () => void
}

const variants = {
  enter: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
}

const useStyles = makeStyles()(theme => ({
  card: {
    margin: theme.spacing(1),
    maxWidth: 230,
    minWidth: 230,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.main,
  },
  content: {
    width: 200,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  frame: {
    width: 165,
    height: 30,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: theme.spacing(1),
    marginRight: theme.spacing(1.5),
    textAlign: 'center',
  },
}))

// refactor this to function component
const CallStack: FC<Props> = ({ frames, onClickAbout }) => {
  const [width, setWidth] = useState<number | undefined>(undefined)
  const [height, setHeight] = useState<number | undefined>(undefined)

  const { classes } = useStyles()
  const handleResize = ({ bounds }: ContentRect) => {
    if (bounds) {
      setWidth(bounds.width)
      setHeight(bounds.height)
    }
  }

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <CardHeaderWithAbout title="Call Stack" onClickAbout={onClickAbout} />
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
          <Measure bounds onResize={handleResize}>
            {({ measureRef: ref }) => <div ref={ref} style={{ flex: 1 }} />}
          </Measure>
          <div
            style={{ width, height, position: 'absolute' }}
            className="scroll-on-hover-y"
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                minHeight: height,
              }}
            >
              <AnimatePresence>
                {frames.map((item, idx) => {
                  return (
                    <motion.div
                      key={item.id}
                      initial="exit"
                      animate="enter"
                      exit="exit"
                      variants={variants}
                      transition={{ duration: 0.2 }}
                    >
                      <Paper style={{ backgroundColor: getPastelForIndex(idx) }} className={classes.frame} elevation={2}>
                        <Typography variant="h6" color="inherit">
                          {item.name}
                        </Typography>
                      </Paper>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CallStack
