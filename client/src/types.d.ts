interface State {
  mode: 'editing' | 'running' | 'visualizing'
  tasks: { id: string; name: string }[]
  microtasks: { id: string; name: string }[]
  frames: { id: string; name: string }[]
  markers: { start: number; end: number }[]
  code: string
  isAutoPlaying: boolean
  currentStep: 'none' | 'runTasks' | 'runMicrotasks' | 'rerender' | 'evaluateScript'
  example: string
  isDrawerOpen: boolean
  visiblePanels: {
    taskQueue: boolean
    microtaskQueue: boolean
    callStack: boolean
    eventLoop: boolean
  }
  showCallStackDescription: boolean
  showEventLoopDescription: boolean
  showTaskQueueDescription: boolean
  showMicrotaskQueueDescription: boolean
}

interface AppRootProps extends State {
  hasReachedEnd: boolean
  onChangeVisiblePanel: (key: keyof State['visiblePanels']) => () => void
  onCloseDrawer: () => void
  onOpenDrawer: () => void
  onChangeExample: (arg: { target: { value: string } }) => any
  onChangeCode: (key: string) => any
  onClickRun: () => void
  onClickEdit: () => void
  onClickPauseAutoStep: () => void
  onClickAutoStep: () => void
  onClickStep: () => void
  onShowCallStackDescription: () => void
  onHideCallStackDescription: () => void
  onShowEventLoopDescription: () => void
  onHideEventLoopDescription: () => void
  onShowTaskQueueDescription: () => void
  onHideTaskQueueDescription: () => void
  onShowMicrotaskQueueDescription: () => void
  onHideMicrotaskQueueDescription: () => void
}
