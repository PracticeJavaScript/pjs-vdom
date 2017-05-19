/*global self*/
import diff from 'virtual-dom/diff'
import serializePatch from 'vdom-serialized-patch/serialize'
import fromJson from 'vdom-as-json/fromJson'
import app from './views/app'
import {assert} from 'chai'
import initialProblem from './problems/initial'

let currentVDom
let renderCount = 0

let problems = []
problems.push(initialProblem)


// our entire application state
// as a plain object
let state = {
  currentProblemIndex: 0, // start with first index
  problem: problems[0],   // start with first problem
  shuffle: true,
  shuffleClass: 'active',
  url: '/'
}

function getNextProblemIndex(currIndex, length) {
  let newIndex;
  if (state.shuffle) {
    newIndex = Math.floor(Math.random() * length)
  } else {
    if (state.currentProblemIndex === problems.length -1) {
      newIndex = 0
    } else {
      newIndex = state.currentProblemIndex + 1
    }
  }
  return newIndex
}

function getNextProblem(probs) {
  state.currentProblemIndex = getNextProblemIndex(state.currentProblemIndex, problems.length)
  return probs[state.currentProblemIndex]
}

function getActiveClass(attr) {
  return state[attr]
    ? 'active'
    : ''
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
      console.log('shuffle toggled! SHUFFLE:', state.shuffle)
      state.shuffleClass = getActiveClass('shuffle')
      break
    }
  }

  // just for fun
  console.log('state:', state)

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
