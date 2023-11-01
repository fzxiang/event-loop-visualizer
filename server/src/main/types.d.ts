declare type Events = {
    type: string;
    payload: any;
}

interface MicrotaskInfo {
    id: string;
    name: string;
}

interface State {
    events: Events[];
    parentsIdsOfPromisesWithInvokedCallbacks: MicrotaskInfo[];
    prevEvt: Events;
}
