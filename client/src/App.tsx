import { useEffect, useState } from 'react'

import { v4 as uuid } from 'uuid'

import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { SnackbarProvider, useSnackbar } from 'notistack'

import AppRoot from './AppRoot'
import { fetchEventsForCode } from './utils/events'
import DEFAULT_CODE from './assets/defaultCode'

const pause = (millis: number) => new Promise(resolve => setTimeout(resolve, millis))

function isPlayableEvent({ type }: { type: string }) {
  return [
    'EnterFunction',
    'ExitFunction',
    'EnqueueMicrotask',
    'DequeueMicrotask',
    'InitTimeout',
    'BeforeTimeout',
    'Rerender',
    'ConsoleLog',
    'ConsoleWarn',
    'ConsoleError',
    'ErrorFunction',
  ].includes(type)
}

const PRETTY_MUCH_INFINITY = 9999999999

function App() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  // State
  const [state, setState] = useState<State>({
    tasks: [],
    microtasks: [],
    frames: [],
    markers: [],
    mode: 'editing', // 'editing' | 'running' | 'visualizing'
    code: DEFAULT_CODE,
    isAutoPlaying: false,
    currentStep: 'none', // 'none' | 'runTask' | 'runMicrotasks' | 'rerender',
    example: 'none',
    isDrawerOpen: false,
    visiblePanels: {
      taskQueue: true,
      microtaskQueue: true,
      callStack: true,
      eventLoop: true,
    },
    showCallStackDescription: false,
    showEventLoopDescription: false,
    showTaskQueueDescription: false,
    showMicrotaskQueueDescription: false,
  })

  // let currEventIdx: number = 0
  const [currEventIdx, setCurrEventIdx] = useState<number>(0)
  // let events: { type: string; payload: any }[] = []
  const [events, setEvents] = useState<{ type: string; payload: any }[]>([])
  const [snackbarIds, setSnackbarIds] = useState<string[]>([])

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const code = atob(search.get('code') || '') || localStorage.getItem('code') || DEFAULT_CODE
    setState(prevState => ({ ...prevState, code }))
  }, [])

  const handleOpenDrawer = () => setState(prevState => ({ ...prevState, isDrawerOpen: true }))
  const handleCloseDrawer = () => setState(prevState => ({ ...prevState, isDrawerOpen: false }))

  const handleChangeVisiblePanel = (panel: keyof State['visiblePanels']) => () => {
    const { visiblePanels } = state
    const current = visiblePanels[panel]
    setState(prevState => ({ ...prevState, visiblePanels: { ...visiblePanels, [panel]: !current } }))
  }

  const handleShowCallStackDescription = () =>
    setState(preState => ({ ...preState, showCallStackDescription: true }))

  const handleHideCallStackDescription = () =>
    setState(preState => ({ ...preState, showCallStackDescription: false }))

  const handleShowEventLoopDescription = () =>
    setState(preState => ({ ...preState, showEventLoopDescription: true }))

  const handleHideEventLoopDescription = () =>
    setState(preState => ({ ...preState, showEventLoopDescription: false }))

  const handleShowTaskQueueDescription = () =>
    setState(preState => ({ ...preState, showTaskQueueDescription: true }))

  const handleHideTaskQueueDescription = () =>
    setState(preState => ({ ...preState, showTaskQueueDescription: false }))

  const handleShowMicrotaskQueueDescription = () =>
    setState(preState => ({ ...preState, showMicrotaskQueueDescription: true }))

  const handleHideMicrotaskQueueDescription = () =>
    setState(preState => ({ ...preState, showMicrotaskQueueDescription: false }))

  const handleChangeExample = (evt: { target: { value: string } }) => {
    const { value } = evt.target
    setState(preState => ({
      ...preState,
      code: value === 'none' ? '' : value,
      example: evt.target.value,
    }))
    transitionToEditMode()
  }

  const handleChangeCode = (code: string) => {
    setState(preState => ({ ...preState, code }))
    localStorage.setItem('code', code)
  }

  const handleClickEdit = () => {
    transitionToEditMode()
  }

  const handleClickRun = async () => {
    const { code } = state

    hideAllSnackbars()
    setState(preState => ({
      ...preState,
      mode: 'running',
      frames: [],
      tasks: [],
      microtasks: [],
      markers: [],
      isAutoPlaying: false,
      currentStep: 'none',
    }))

    try {
      const ev = await fetchEventsForCode(code)
      // currEventIdx = 0
      setCurrEventIdx(0)
      // events = ev
      setEvents(ev)
      setState(preState => ({ ...preState, mode: 'visualizing', currentStep: 'evaluateScript' }))
    }
    catch (e: any) {
      // currEventIdx = 0
      setCurrEventIdx(0)
      showSnackbar('error', e.message)
      setState(preState => ({ ...preState, mode: 'editing', currentStep: 'none' }))
      console.error(e)
    }
  }

  const handleClickPauseAutoStep = () => {
    setState(preState => ({ ...preState, isAutoPlaying: false }))
  }

  const handleClickAutoStep = () => {
    // TODO: Add isAutoPlaying to state to disable other buttons...
    autoPlayEvents()
  }

  const handleClickStep = () => {
    playNextEvent()
  }

  function showSnackbar(variant: 'info' | 'warning' | 'error', msg: string) {
    const key = uuid()

    setSnackbarIds(pre => [...pre, key])
    enqueueSnackbar(msg, {
      key,
      variant,
      autoHideDuration: PRETTY_MUCH_INFINITY,
      action: (
        <IconButton color="inherit">
          <CloseIcon />
        </IconButton>
      ),
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    })
  }

  function hideAllSnackbars() {
    snackbarIds.forEach((id) => {
      closeSnackbar(id)
    })
  }

  function transitionToEditMode() {
    hideAllSnackbars()
    setState(preState => ({
      ...preState,
      mode: 'editing',
      frames: [],
      tasks: [],
      microtasks: [],
      markers: [],
      isAutoPlaying: false,
      currentStep: 'none',
    }))
  }

  const hasReachedEnd = () => {
    return currEventIdx >= events.length
  }

  const getCurrentEvent = () => events[currEventIdx]

  const seekToNextPlayableEvent = async() => {

    while (!hasReachedEnd() && !isPlayableEvent(getCurrentEvent())) {
      /* Process non-playable event: */
      const {
        type,
        payload: { name, message },
      } = getCurrentEvent()
      if (type === 'UncaughtError')
        showSnackbar('error', `Uncaught ${name} Exception: ${message}`)

      if (type === 'EarlyTermination')
        showSnackbar('warning', message)

      // currEventIdx += 1
      setCurrEventIdx(currEventIdx+1)
    }
  }

  function playNextEvent(): undefined | void {
    const { markers } = state

    // TODO: Handle trailing non-playable events...
    seekToNextPlayableEvent()

    if (!getCurrentEvent())
      return

    const {
      type,
      payload: { id, name, callbackName, start, end, message },
    } = getCurrentEvent()

    if (type === 'ConsoleLog')
      showSnackbar('info', message)
    if (type === 'ConsoleWarn')
      showSnackbar('warning', message)
    if (type === 'ConsoleError')
      showSnackbar('error', message)
    if (type === 'ErrorFunction')
      showSnackbar('error', `Uncaught Exception in "${name}": ${message}`)

    if (type === 'EnterFunction') {
      setState(preState => ({ ...preState, markers: markers.concat({ start, end }) }))
      pushCallStackFrame(name)
    }
    if (type === 'ExitFunction') {
      setState(preState => ({ ...preState, markers: markers.slice(0, markers.length - 1) }))
      popCallStackFrame()
    }
    if (type === 'EnqueueMicrotask')
      enqueueMicrotask(name)
    if (type === 'DequeueMicrotask')
      dequeueMicrotask()
    if (type === 'InitTimeout')
      enqueueTask(id, callbackName)
    if (type === 'BeforeTimeout')
      dequeueTask(id)
    // currEventIdx += 1
    setCurrEventIdx(pre => pre + 1)
    seekToNextPlayableEvent()
    const nextEvent = getCurrentEvent()

    const currentStep
      = nextEvent === undefined
        ? 'rerender'
        : nextEvent.type === 'Rerender'
          ? 'rerender'
          : nextEvent.type === 'BeforeTimeout'
            ? 'runTasks'
            : nextEvent.type === 'DequeueMicrotask'
              ? 'runMicrotasks'
              : undefined

    if (currentStep)
      setState(preState => ({ ...preState, currentStep }))

    // Automatically move task functions into the call stack
    if (
      ['DequeueMicrotask', 'BeforeTimeout'].includes(type)
      && nextEvent.type === 'EnterFunction'
    )
      playNextEvent()
  }

  async function autoPlayEvents() {
    setState(preState => ({ ...preState, isAutoPlaying: true }))

    while (state.mode === 'visualizing' && state.isAutoPlaying) {
      const endReached = playNextEvent()

      if (endReached) {
        setState(preState => ({ ...preState, isAutoPlaying: false }))
        break
      }

      await pause(500)
    }
  }

  function pushCallStackFrame(name: string) {
    const { frames } = state
    const newFrames = frames.concat({ id: uuid(), name })
    setState(preState => ({ ...preState, frames: newFrames }))
  }

  function popCallStackFrame() {
    const { frames } = state
    const newFrames = frames.slice(0, frames.length - 1)
    setState(preState => ({ ...preState, frames: newFrames }))
  }

  function enqueueMicrotask(name: string) {
    const { microtasks } = state
    const newMicrotasks = microtasks.concat({ id: uuid(), name })
    setState(preState => ({ ...preState, microtasks: newMicrotasks }))
  }

  function dequeueMicrotask() {
    const { microtasks } = state
    const newMicrotasks = microtasks.slice(1)
    setState(preState => ({ ...preState, microtasks: newMicrotasks }))
  }

  function enqueueTask(id: number, name: string) {
    const { tasks } = state
    const newTasks = tasks.concat({ id: id.toString(), name })
    setState(preState => ({ ...preState, tasks: newTasks }))
  }

  // We can't just pop tasks like we can for the Call Stack and Microtask Queue,
  // because if timers have a delay, their execution order isn't necessarily
  // FIFO.
  function dequeueTask(id: number) {
    const { tasks } = state
    const newTasks = tasks.filter(task => +task.id !== id)
    setState(preState => ({ ...preState, tasks: newTasks }))
  }

  return (
    <AppRoot
      mode={state.mode}
      example={state.example}
      code={state.code}
      tasks={state.tasks}
      microtasks={state.microtasks}
      frames={state.frames}
      markers={state.markers}
      visiblePanels={state.visiblePanels}
      isAutoPlaying={state.isAutoPlaying}
      isDrawerOpen={state.isDrawerOpen}
      showCallStackDescription={state.showCallStackDescription}
      showEventLoopDescription={state.showEventLoopDescription}
      showTaskQueueDescription={state.showTaskQueueDescription}
      showMicrotaskQueueDescription={state.showMicrotaskQueueDescription}
      hasReachedEnd={hasReachedEnd()}
      currentStep={state.currentStep}
      onChangeVisiblePanel={handleChangeVisiblePanel}
      onCloseDrawer={handleCloseDrawer}
      onOpenDrawer={handleOpenDrawer}
      onChangeExample={handleChangeExample}
      onChangeCode={handleChangeCode}
      onClickRun={handleClickRun}
      onClickEdit={handleClickEdit}
      onClickPauseAutoStep={handleClickPauseAutoStep}
      onClickAutoStep={handleClickAutoStep}
      onClickStep={handleClickStep}
      onShowCallStackDescription={handleShowCallStackDescription}
      onHideCallStackDescription={handleHideCallStackDescription}
      onShowEventLoopDescription={handleShowEventLoopDescription}
      onHideEventLoopDescription={handleHideEventLoopDescription}
      onShowTaskQueueDescription={handleShowTaskQueueDescription}
      onHideTaskQueueDescription={handleHideTaskQueueDescription}
      onShowMicrotaskQueueDescription={handleShowMicrotaskQueueDescription}
      onHideMicrotaskQueueDescription={handleHideMicrotaskQueueDescription}
    />
  )
}

export default () => (
  <SnackbarProvider maxSnack={4}>
    <App />
  </SnackbarProvider>
)
