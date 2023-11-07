import { blueGrey } from '@mui/material/colors';

import Attribution from './components/Attribution';
import Header from './components/Header';
import RunOrEditButton from './components/RunOrEditButton';
import ShareButton from './components/ShareButton';
import ExampleSelector from './components/ExampleSelector';
import CodeEditor from './components/CodeEditor';
import CallStack from './components/CallStack';
import TaskQueue from './components/TaskQueue';
import ExecutionModelStepper from './components/ExecutionModelStepper';
import FabControls from './components/FabControls';
import Drawer from './components/Drawer';
import CallStackDescription from './components/CallStackDescription';
import EventLoopDescription from './components/EventLoopDescription';
import TaskQueueDescription from './components/TaskQueueDescription';
import MicrotaskQueueDescription from './components/MicrotaskQueueDescription';


const styles = {
  container: {
    backgroundColor: blueGrey['100'],
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  codeControlsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRightContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
};
interface AppRootProps {
  mode: 'editing' | 'running' | 'visualizing';
  example: string,
  code: string,
  tasks: { id: string, name: string }[],
  microtasks: { name: string }[],
  frames: { name: string }[],
  markers: { start: number, end: number }[],
  visiblePanels: {
    taskQueue: boolean,
    microtaskQueue: boolean,
    callStack: boolean,
    eventLoop: boolean,
  },
  isAutoPlaying: boolean,
  isDrawerOpen: boolean,
  showCallStackDescription: boolean,
  showEventLoopDescription: boolean,
  showTaskQueueDescription: boolean,
  showMicrotaskQueueDescription: boolean,
  hasReachedEnd: boolean,
  currentStep: 'evaluateScript' | 'runTasks' | 'runMicrotasks' | 'rerender',
  onChangeVisiblePanel: string => void => any,
  onCloseDrawer: void => any,
  onOpenDrawer: void => any,
  onChangeExample: ({ target: { value: string } }) => any,
  onChangeCode: string => any,
  onClickRun: void => any,
  onClickEdit: void => any,
  onClickPauseAutoStep: void => any,
  onClickAutoStep: void => any,
  onClickStepBack: void => any,
  onClickStep: void => any,
  onShowCallStackDescription: void => any,
  onHideCallStackDescription: void => any,
  onShowEventLoopDescription: void => any,
  onHideEventLoopDescription: void => any,
  onShowTaskQueueDescription: void => any,
  onHideTaskQueueDescription: void => any,
  onShowMicrotaskQueueDescription: void => any,
  onHideMicrotaskQueueDescription: void => any,
}
const AppRoot = ({
  classes,
  mode,
  example,
  code,
  tasks,
  microtasks,
  frames,
  markers,
  visiblePanels,
  isAutoPlaying,
  isDrawerOpen,
  showCallStackDescription,
  showEventLoopDescription,
  showTaskQueueDescription,
  showMicrotaskQueueDescription,
  hasReachedEnd,
  currentStep,
  onChangeVisiblePanel,
  onCloseDrawer,
  onOpenDrawer,
  onChangeExample,
  onChangeCode,
  onClickRun,
  onClickEdit,
  onClickPauseAutoStep,
  onClickAutoStep,
  onClickStepBack,
  onClickStep,
  onShowCallStackDescription,
  onHideCallStackDescription,
  onShowEventLoopDescription,
  onHideEventLoopDescription,
  onShowTaskQueueDescription,
  onHideTaskQueueDescription,
  onShowMicrotaskQueueDescription,
  onHideMicrotaskQueueDescription,
}: AppRootProps) => (
  <div style={styles.container}>
      <Drawer
        open={isDrawerOpen}
        visiblePanels={visiblePanels}
        onChange={onChangeVisiblePanel}
        onClose={onCloseDrawer}
      />

      <div style={styles.leftContainer}>
        <Header onClickLogo={onOpenDrawer} />
        <div style={styles.codeControlsContainer}>
          <ExampleSelector
            example={example}
            locked={mode === 'running'}
            onChangeExample={onChangeExample}
          />
          <RunOrEditButton
            mode={mode}
            runDisabled={code.trim() === ''}
            onClickRun={onClickRun}
            onClickEdit={onClickEdit}
          />
          <ShareButton code={code} />
        </div>
        <CodeEditor
          code={code}
          markers={markers}
          locked={mode !== 'editing'}
          onChangeCode={onChangeCode}
        />
        <Attribution />
      </div>

      <div style={styles.rightContainer}>
        <div>
          {visiblePanels.taskQueue && (
            <TaskQueue
              title="Task Queue"
              tasks={tasks}
              onClickAbout={onShowTaskQueueDescription}
            />
          )}
          {visiblePanels.microtaskQueue && (
            <TaskQueue
              title="Microtask Queue"
              tasks={microtasks}
              onClickAbout={onShowMicrotaskQueueDescription}
            />
          )}
        </div>
        <div style={styles.bottomRightContainer}>
          {visiblePanels.callStack && (
            <CallStack
              frames={frames}
              onClickAbout={onShowCallStackDescription}
            />
          )}
          {visiblePanels.eventLoop && (
            <ExecutionModelStepper
              step={currentStep}
              onClickAbout={onShowEventLoopDescription}
            />
          )}
        </div>
      </div>

      <FabControls
        visible={mode === 'visualizing'}
        isAutoPlaying={isAutoPlaying}
        hasReachedEnd={hasReachedEnd}
        onClickPauseAutoStep={onClickPauseAutoStep}
        onClickAutoStep={onClickAutoStep}
        onClickStepBack={onClickStepBack}
        onClickStep={onClickStep}
      />

      <CallStackDescription
        open={showCallStackDescription}
        onClose={onHideCallStackDescription}
      />

      <EventLoopDescription
        open={showEventLoopDescription}
        onClose={onHideEventLoopDescription}
      />

      <TaskQueueDescription
        open={showTaskQueueDescription}
        onClose={onHideTaskQueueDescription}
      />

      <MicrotaskQueueDescription
        open={showMicrotaskQueueDescription}
        onClose={onHideMicrotaskQueueDescription}
      />
  </div>
);

export default AppRoot;
