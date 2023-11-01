function eventsReducer (state: State, evt: Events) {
  const { type, payload } = evt;

  if (type === 'EarlyTermination') state.events.push(evt);
  if (type === 'UncaughtError') state.events.push(evt);

  if (type === 'ConsoleLog') state.events.push(evt);
  if (type === 'ConsoleWarn') state.events.push(evt);
  if (type === 'ConsoleError') state.events.push(evt);

  if (type === 'EnterFunction') {
    if (state.prevEvt.type === 'BeforePromise') {
      state.events.push({ type: 'DequeueMicrotask', payload: {} });
    }
    state.events.push(evt);
  }
  if (type == 'ExitFunction') state.events.push(evt);
  if (type == 'ErrorFunction') state.events.push(evt);

  if (type === 'InitPromise') state.events.push(evt);
  if (type === 'ResolvePromise') {
    state.events.push(evt);

    const microtaskInfo = state.parentsIdsOfPromisesWithInvokedCallbacks
      .find(({ id }) => id === payload.id);

    if (microtaskInfo) {
      state.events.push({
        type: 'EnqueueMicrotask',
        payload: { name: microtaskInfo.name }
      });
    }
  }
  if (type === 'BeforePromise') state.events.push(evt);
  if (type === 'AfterPromise') state.events.push(evt);

  if (type === 'InitTimeout') state.events.push(evt);
  if (type === 'BeforeTimeout') {
    state.events.push({ type: 'Rerender', payload: {} });
    state.events.push(evt);
  }

  state.prevEvt = evt;

  return state;
}

// TODO: Return line:column numbers for func calls


export function reduceEvents (events: Events[]): Events[] {
  events = events
  .slice()
  .reverse()
  .filter(
      (evt, index, arr) =>
          evt.type !== 'ResolvePromise' ||
          index === arr.findIndex((e) => e.type === 'ResolvePromise' && e.payload.id === evt.payload.id)
  )
  .reverse();

  const resolvedPromiseIds: string[] = events
  .filter(({ type }) => type === 'ResolvePromise')
  .map(({ payload: { id } }) => id);

  const promisesWithInvokedCallbacksInfo: MicrotaskInfo[] = events
  .filter(({ type }) =>
      ['BeforePromise', 'EnterFunction', 'ExitFunction', 'ResolvePromise'].includes(type)
  )
  .reduce((result: MicrotaskInfo[], evt, index, arr) => {
    if (evt.type === 'BeforePromise' && (arr[index + 1] || {}).type === 'EnterFunction') {
      result.push({
        id: evt.payload.id,
        name: (arr[index + 1] as Events).payload.name
      });
    }
    return result;
  }, []);

  const promiseChildIdToParentId: Record<string, string> = {};
  events
  .filter(({ type }) => type === 'InitPromise')
  .forEach(({ payload: { id, parentId } }) => {
    promiseChildIdToParentId[id] = parentId;
  });

  const parentsIdsOfPromisesWithInvokedCallbacks: MicrotaskInfo[] = promisesWithInvokedCallbacksInfo
  .map(({ id: childId, name }) => ({
    id: promiseChildIdToParentId[childId],
    name,
  }));

  console.log({ resolvedPromiseIds, promisesWithInvokedCallbacksInfo, parentsIdsOfPromisesWithInvokedCallbacks });

  return events.reduce(eventsReducer, {
    events: [],
    parentsIdsOfPromisesWithInvokedCallbacks,
    prevEvt: {} as Events,
  }).events;
}

