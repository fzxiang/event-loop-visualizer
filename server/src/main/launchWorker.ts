import { Worker } from 'worker_threads';

const WORKER_FILE = './src/worker/worker.js';

const action = (type: string, payload: any) => JSON.stringify({ type, payload });
const Messages = {
  UncaughtError: (error: Error) => action('UncaughtError', { error }),
  Done: (exitCode: number) => action('Done', { exitCode }),
}

export function launchWorker (jsSourceCode: string, onEvent: (message: string) => void)  {
  const worker = new Worker(WORKER_FILE, { workerData: jsSourceCode });

  worker.on('message', (message) => {
    console.log('Worker MESSAGE:', message)
    onEvent(message);
  });

  worker.on('error', (error) => {
    console.error('Worker ERROR:', error)
    onEvent(Messages.UncaughtError({
      name: error.name,
      stack: error.stack,
      message: error.message,
    }));
  });

  worker.on('exit', (code) => {
    console.log('Worker EXIT:', code)
    onEvent(Messages.Done(code));
  });

  return worker;
}

