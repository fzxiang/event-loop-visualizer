const { parentPort, workerData } = require('worker_threads');
const asyncHooks = require('async_hooks');
// const util = require('util');
const fs = require('fs');
const babel = require('babel-core');
// const { VM } = require('vm2');


const fetch = require('node-fetch');
const _ = require('lodash');
const falafel = require('falafel');
const prettyFormat = require('pretty-format');

const LOG_FILE = './log.txt';
fs.writeFileSync(LOG_FILE, '');
const log = (...msg) => fs.appendFileSync(
  LOG_FILE,
  msg.map(m => _.isString(m) ? m : prettyFormat(m)).join(' ') + '\n'
);

const EVENTS = {
  ConsoleLog: (message) => ({ type: 'ConsoleLog', payload: { message } }),
  ConsoleWarn: (message) => ({ type: 'ConsoleWarn', payload: { message } }),
  ConsoleError: (message) => ({ type: 'ConsoleError', payload: { message } }),

  EnterFunction: (id, name, start, end) => ({ type: 'EnterFunction', payload: { id, name, start, end } }),
  ExitFunction: (id, name, start, end) => ({ type: 'ExitFunction', payload: { id, name, start, end } }),
  ErrorFunction: (message, id, name, start, end) => ({ type: 'ErrorFunction', payload: { message, id, name, start, end } }),

  InitPromise: (id, parentId) => ({ type: 'InitPromise', payload: { id, parentId } }),
  ResolvePromise: (id) => ({ type: 'ResolvePromise', payload: { id } }),
  BeforePromise: (id) => ({ type: 'BeforePromise', payload: { id } }),
  AfterPromise: (id) => ({ type: 'AfterPromise', payload: { id } }),

  InitTimeout: (id, callbackName) => ({ type: 'InitTimeout', payload: { id, callbackName } }),
  BeforeTimeout: (id) => ({ type: 'BeforeTimeout', payload: { id } }),

  UncaughtError: (error) => ({
    type: 'UncaughtError',
    payload: {
      name: (error || {}).name,
      stack: (error || {}).stack,
      message: (error || {}).message,
    }
  }),

  EarlyTermination: (message) => ({ type: 'EarlyTermination', payload: { message } }),
};

const events = [];
const postEvent = (event) => {
  events.push(event);
  parentPort.postMessage(JSON.stringify(event));
}

const asyncIdToResource = {};

const init = (asyncId, type, triggerAsyncId, resource) => {
  asyncIdToResource[asyncId] = resource;
  if (type === 'PROMISE') {
    postEvent(EVENTS.InitPromise(asyncId, triggerAsyncId));
  }
  if (type === 'Timeout') {
    const callbackName = resource._onTimeout.name || 'anonymous';
    postEvent(EVENTS.InitTimeout(asyncId, callbackName));
  }
}

const before = (asyncId) => {
  const resource = asyncIdToResource[asyncId] || {};
  const resourceName = (resource.constructor).name;
  if (resourceName === 'PromiseWrap') {
    postEvent(EVENTS.BeforePromise(asyncId));
  }
  if (resourceName === 'Timeout') {
    postEvent(EVENTS.BeforeTimeout(asyncId));
  }
}

const after = (asyncId) => {
  const resource = asyncIdToResource[asyncId] || {};
  const resourceName = (resource.constructor).name;
  if (resourceName === 'PromiseWrap') {
    postEvent(EVENTS.AfterPromise(asyncId));
  }
}

const destroy = (asyncId) => {
  const resource = asyncIdToResource[asyncId] || {};
}

const promiseResolve = (asyncId) => {
  const promise = asyncIdToResource[asyncId].promise;
  postEvent(EVENTS.ResolvePromise(asyncId));
}

asyncHooks
  .createHook({ init, before, after, destroy, promiseResolve })
  .enable();

const functionDefinitionTypes = [
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
];
const arrowFnImplicitReturnTypesRegex = /Literal|Identifier|(\w)*Expression/;

// Inspired by: http://alltom.com/pages/instrumenting-javascript/
const traceBlock = (code, fnName, start, end) => `{
  const idWithExtensionToAvoidConflicts = nextId();
  Tracer.enterFunc(idWithExtensionToAvoidConflicts, '${fnName}', ${start}, ${end});
  try {
    ${code}
  } catch (e) {
    Tracer.errorFunc(e.message, idWithExtensionToAvoidConflicts, '${fnName}', ${start}, ${end});
    throw e;
  } finally {
    Tracer.exitFunc(idWithExtensionToAvoidConflicts, '${fnName}', ${start}, ${end});
  }
}`

const jsSourceCode = workerData;

// TODO: Convert all this to babel transform(s)
// TODO: HANDLE GENERATORS/ASYNC-AWAIT
const output = falafel(jsSourceCode, (node) => {

  const parentType = node.parent && node.parent.type;
  const isBlockStatement = node.type === 'BlockStatement';
  const isFunctionBody = functionDefinitionTypes.includes(parentType);
  const isArrowFnReturnType = arrowFnImplicitReturnTypesRegex.test(node.type);
  const isArrowFunctionBody = parentType === 'ArrowFunctionExpression';
  const isArrowFn = node.type === 'ArrowFunctionExpression';

  if (isBlockStatement && isFunctionBody) {
    const { start, end } = node.parent;
    const fnName = (node.parent.id && node.parent.id.name) || 'anonymous';
    const block = node.source();
    const blockWithoutCurlies = block.substring(1, block.length - 1);
    node.update(traceBlock(blockWithoutCurlies, fnName, start, end))
  }
  else if (isArrowFnReturnType && isArrowFunctionBody) {
    const { start, end, params } = node.parent;

    const isParamIdentifier = params.some(param => param === node);

    if (!isParamIdentifier) {
      const fnName = (node.parent.id && node.parent.id.name) || 'anonymous';
      const block = node.source();
      const returnedBlock = `return (${block});`;
      node.update(traceBlock(returnedBlock, fnName, start, end))
    }
  }
  else if (isArrowFn) {
    const body = node.source();
    const firstCurly = body.indexOf('{');
    const lastCurly = body.lastIndexOf('}');
    const bodyHasCurlies = firstCurly !== -1 && lastCurly !== -1;

    // We already updated all arrow function bodies to have curlies, so here
    // we can assume if a body looks like `({ ... })`, then we need to remove
    // the parenthesis.
    if (bodyHasCurlies) {
      const parensNeedStripped = body[firstCurly - 1] === '(';
      if (parensNeedStripped) {
        const bodyBlock = body.substring(firstCurly, lastCurly + 1);
        const bodyWithoutParens = `() => ${bodyBlock}`;
        node.update(bodyWithoutParens);
      }
    }
  }

});

const modifiedSource = babel
  .transform(output.toString(), { plugins: [traceLoops] })
  .code;

/**
 * 这个babel插件会在循环的最后添加一个Tracer.iterateLoop()的调用
 * @param babel
 * @returns {{visitor: {WhileStatement: transformLoop, ForStatement: transformLoop, DoWhileStatement: transformLoop, ForInStatement: transformLoop, ForOfStatement: transformLoop}}}
 */
function traceLoops(babel) {
  const t = babel.types;

  const transformLoop = (path) => {
    const iterateLoop = t.memberExpression(
        t.identifier('Tracer'),
        t.identifier('iterateLoop'),
    );
    const callIterateLoop = t.callExpression(iterateLoop, []);
    path.get('body').pushContainer('body', callIterateLoop);
  };

  return {
    visitor: {
      WhileStatement: transformLoop,
      DoWhileStatement: transformLoop,
      ForStatement: transformLoop,
      ForInStatement: transformLoop,
      ForOfStatement: transformLoop,
    }
  };
}

// TODO: Maybe change this name to avoid conflicts?
const nextId = (() => {
  let id = 0;
  return () => id++;
})();

const arrToPrettyStr = (arr) =>
  arr.map(a => _.isString(a) ? a : prettyFormat(a)).join(' ') + '\n'

const START_TIME = Date.now();
const TIMEOUT_MILLIS = 5000;
const EVENT_LIMIT = 500;

const Tracer = {
  enterFunc: (id, name, start, end) => postEvent(EVENTS.EnterFunction(id, name, start, end)),
  exitFunc: (id, name, start, end) => postEvent(EVENTS.ExitFunction(id, name, start, end)),
  errorFunc: (message, id, name, start, end) => postEvent(EVENTS.ErrorFunction(message, id, name, start, end)),
  log: (...args) => postEvent(EVENTS.ConsoleLog(arrToPrettyStr(args))),
  warn: (...args) => postEvent(EVENTS.ConsoleWarn(arrToPrettyStr(args))),
  error: (...args) => postEvent(EVENTS.ConsoleError(arrToPrettyStr(args))),
  iterateLoop: () => {
    const hasTimedOut = (Date.now() - START_TIME) > TIMEOUT_MILLIS;
    const reachedEventLimit = events.length >= EVENT_LIMIT;
    const shouldTerminate = reachedEventLimit || hasTimedOut;
    if (shouldTerminate) {
      postEvent(EVENTS.EarlyTermination(hasTimedOut
        ? `Terminated early: Timeout of ${TIMEOUT_MILLIS} millis exceeded.`
        : `Termianted early: Event limit of ${EVENT_LIMIT} exceeded.`
      ));
      process.exit(1);
    }
  },
};

// E.g. call stack size exceeded errors...
process.on('uncaughtException', (err) => {
  postEvent(EVENTS.UncaughtError(err));
  process.exit(1);
});


Object.assign(console, Tracer)
// vm.run(modifiedSource);

eval(modifiedSource);
