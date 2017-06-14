/*global self*/


// DEPS
// ============================================================

import diff from 'virtual-dom/diff'
import serializePatch from 'vdom-serialized-patch/serialize'
import fromJson from 'vdom-as-json/fromJson'
import app from './views/app'
import chai from 'chai'
import dedent from 'dedent'
// import initialProblems from './problems/initial'
import probbs from 'pjs-problems'

let currentVDom
let renderCount = 0

// merge all the problem categories for now, until we have user-driven filtering
let problems = Object.entries(probbs)
  .map(item => item[1])
  .reduce((curr,next) => {
    return curr.concat(next);
  });

// dedent the code strings in problems
problems = dedentStrings(problems);


// STATE OBJECT
// ============================================================

// our entire application state
// as a plain object
let state = {
  currentProblemIndex: 0, // start with first index
  events: [],
  problem: null,   // start with first problem
  shuffle: true,
  testsPass: false,
  url: '/',
}


// APP METHODS
// ============================================================

// PROBLEM TEMPLATE NICE-IFICATION
// ============================================================

function dedentStrings(problems) {
  return problems.map(prob => {
    prob.given = dedent(prob.given)
    prob.answer = dedent(prob.answer)
    return prob
  });
}

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

// TEST VALIDATION
// ============================================================

function evaluate(input = undefined) {
  let output
  try {
    output = eval(`(function(){${input}})()`)
  } catch(err) {
    output = err
  }
  return output
}

function testSuite(input = 'undefined', problem) {
  const assert = chai.assert;
  const output = evaluate(input)
  let testResultBooleans = []
  // stringify output to show in ui console
  problem.evaluated = JSON.stringify(output);

  let problemWithTestFeedback = problem.tests.map(test => {
    try {
      const testEval = eval(test.test);
      if (testEval === true) {
        testResultBooleans.push(true)
      }
      test.testFeedback = testEval
    } catch (err) {
      testResultBooleans.push(false)
      test.testFeedback = err
    }
    return test
  })

  // "all tests pass", set it in state
  state.testsPass = testResultBooleans.every((result => result === true))
  // have main thread play testpass sound when it catches the next change diff
  if (state.testsPass === true) {
    const soundObj = {
      name: 'sound', data: {
        id: 'pass'
      }
    };
    state.events.push(soundObj)
  } else {
    state.events = state.events.filter(item => {
      return !(item.name === 'sound' && item.data.id === 'pass')
    })
  }
  return problemWithTestFeedback
}


// EVENT BUS
// ============================================================

// messages from the main thread come
// in here
self.onmessage = ({data}) => {
  const { type, payload } = data

  // handle different event types
  // update the state accordingly
  switch (type) {
    case 'start': {
      currentVDom = fromJson(payload.virtualDom)
      if (payload.localState) {
        state.shuffle = payload.localState.shuffle
        // will bring back the last problem they were on
        state.problem = payload.localState.problem || false
      }
      state.url = state.url || payload.url
      // if we didn't recover a saved problem from localstorage, go get a new one!
      if (!state.problem) {
        state.problem = state.shuffle
          ? problems[getNextProblemIndex(state.currentProblemIndex, problems.length)]
          : problems[0]
      }
      state.problem.tests = testSuite(state.problem.given, state.problem)
      break
    }
    case 'setUrl': {
      state.url = payload
      break
    }
    case 'next': {
      state.problem = getNextProblem(problems)
      state.testsPass = false
      state.problem.tests = testSuite(state.problem.given, state.problem)
      break
    }
    case 'shuffle': {
      state.shuffle = !state.shuffle
      break
    }
    case 'codeupdate': {
      state.problem.tests = testSuite(payload, state.problem)
      break
    }
    case 'newproblems': {
      problems.push(...dedentStrings(payload))
      // todo: show a toast that new content has been loaded for them
      break
    }
  }


  // UPDATING THE DOM
  // ============================================================

  // just for fun
  // serialize the state, and delete reversible big bits so we can save in localstorage
  let tinyState = {
    shuffle: state.shuffle,
    problem: state.problem
  }
  const serializedState = JSON.stringify(tinyState)

  // state events to pass to main thread
  const stateEvents = state.events || null;

  // our entire app in one line:
  const newVDom = app(state)

  // do the diff
  const patches = diff(currentVDom, newVDom)

  // cache last vdom so we diff against
  // the new one the next time through
  currentVDom = newVDom

  // send patches and current url back to the main thread
  self.postMessage({url: state.url, payload: serializePatch(patches), serializedState, stateEvents})
}
