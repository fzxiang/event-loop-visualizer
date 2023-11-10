import _ from 'lodash'

const URL: string = import.meta.env.NODE_ENV === 'production'
  ? 'wss://js-visualizer-9000-server.herokuapp.com'
  : 'ws://localhost:8080'

export function fetchEventsForCode(code: string): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    try {
      const ws: WebSocket = new WebSocket(URL)

      ws.addEventListener('open', () => {
        const command = { type: 'RunCode', payload: code }
        ws.send(JSON.stringify(command))
      })

      ws.addEventListener('message', (event: MessageEvent) => {
        const events: any[] = JSON.parse(event.data)

        const didError: boolean = !events || !events[0] || events[0].type === 'UncaughtError'

        if (didError) {
          const msg: string = _.get(events[0], 'payload.error.name') === 'SyntaxError'
            ? 'Failed to run script due to syntax error.'
            : 'Failed to run script.'
          reject(new Error(msg))
        }
        else {
          resolve(events)
        }

        ws.close()
      })
    }
    catch (e: any) {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ ...e, message: `Failed to connect to backend: ${e.message}` })
    }
  })
}
