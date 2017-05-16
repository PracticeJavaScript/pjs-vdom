/*global self*/
import diff from 'virtual-dom/diff'
import serializePatch from 'vdom-serialized-patch/serialize'
import fromJson from 'vdom-as-json/fromJson'
import app from './views/app'
import {assert} from 'chai'
import arrays from './problems/arrays'

let currentVDom
let renderCount = 0
let problems = []
problems.push(...arrays)

// console.log('assert', assert);

function getNextProblemIndex(currIndex, length) {
  return state.shuffle
    ? Math.floor(Math.random() * length)
    : currentProblemIndex++
}

function getNextProblem(probs) {
  return probs[getNextProblemIndex(state.currentProblemIndex, problems.length)]
}

function getActiveClass(attr) {
  return state[attr]
    ? 'active'
    : ''
}

// our entire application state
// as a plain object
const state = {
  currentProblemIndex: 0,
  problem: getNextProblem(problems),
  shuffle: true,
  url: '/'
}


// messages from the main thread come
// in here
self.onmessage = ({data}) => {
  const { type, payload } = data

  console.log('worker got message:', data)

  // handle different event types
  // update the state accordingly
  switch (type) {
    case 'start': {
      currentVDom = fromJson(payload.virtualDom)
      state.url = payload.url
      state.problem = problems[0]
      break
    }
    case 'setUrl': {
      state.url = payload
      break
    }
    case 'next': {
      state.problem = getNextProblem(problems)
      break
    }
    case 'shuffle': {
      state.shuffle = !state.shuffle
      state.shuffleClass = getActiveClass('shuffle')
      break
    }
  }

  // just for fun
  console.log('render count:', ++renderCount)

  // our entire app in one line:
  const newVDom = app(state)

  // do the diff
  const patches = diff(currentVDom, newVDom)

  // cache last vdom so we diff against
  // the new one the next time through
  currentVDom = newVDom

  // send patches and current url back to the main thread
  self.postMessage({url: state.url, payload: serializePatch(patches)})
}
