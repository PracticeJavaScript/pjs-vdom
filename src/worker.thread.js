/*global self*/


// DEPS
// ============================================================

import diff from 'virtual-dom/diff'
import serializePatch from 'vdom-serialized-patch/serialize'
import fromJson from 'vdom-as-json/fromJson'
import app from './views/app'
import {assert} from 'chai'
import initialProblems from './problems/initial'

let currentVDom
let renderCount = 0

let problems = []
problems.push(...initialProblems)


// STATE OBJECT
// ============================================================

// our entire application state
// as a plain object
let state = {
  currentProblemIndex: 0, // start with first index
  problem: problems[0],   // start with first problem
  shuffle: true,
  shuffleClass: 'active',
  url: '/'
}


// APP METHODS
// ============================================================

// PROBLEM NAVIGATION
// ============================================================

function getNextProblemIndex(currIndex, length) {
  let newIndex;
  // if shuffle on, return new random index
  if (state.shuffle) {
    newIndex = Math.floor(Math.random() * length)
  } else {
    // if at the end of the problems array, go to the start
    if (state.currentProblemIndex === problems.length -1) {
      newIndex = 0
    } else {
      // if not at then end, increment as normal
      newIndex = state.currentProblemIndex + 1
    }
  }
  return newIndex
}

function getNextProblem(probs) {
  // set new index to state
  state.currentProblemIndex = getNextProblemIndex(state.currentProblemIndex, problems.length)
  // return new problem from that index
  return probs[state.currentProblemIndex]
}

function getActiveClass(attr) {
  // toggle given attr between active and not
  return state[attr]
    ? 'active'
    : ''
}

// TEST VALIDATION
// ============================================================

// TODO: Filter things out of input string, that the worker can
// actually perform but we don't want them to
function evaluate(input) {
  let output
  try {
    output = eval(`(function(){${input}})()`)
  } catch(err) {
    output = err
  }
  return output
}

function testSuite(input, problem) {
  const evaluatedInput = evaluate(input)
  problem.evaluated = JSON.stringify(evaluatedInput);
  let problemWithTestFeedback = problem.tests.map(test => {
    try {
      test.testFeedback = test.test(evaluatedInput)
    } catch (err) {
      test.testFeedback = err
    }
    return test
  })
  return problemWithTestFeedback
}


// EVENT BUS
// ============================================================

// messages from the main thread come
// in here
self.onmessage = ({data}) => {
  const { type, payload } = data

  // console.log('worker got message:', data)

  // handle different event types
  // update the state accordingly
  switch (type) {
    case 'start': {
      currentVDom = fromJson(payload.virtualDom)
      state.url = payload.url
      state.problem = problems[0]
      state.problem.tests = testSuite(payload, state.problem)
      break
    }
    case 'setUrl': {
      state.url = payload
      break
    }
    case 'next': {
      state.problem = getNextProblem(problems)
      state.problem.tests = testSuite(payload, state.problem)
      break
    }
    case 'shuffle': {
      state.shuffle = !state.shuffle
      state.shuffleClass = getActiveClass('shuffle')
      break
    }
    case 'codeupdate': {
      state.problem.tests = testSuite(payload, state.problem)
      break
    }
  }


  // UPDATING THE DOM
  // ============================================================

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
