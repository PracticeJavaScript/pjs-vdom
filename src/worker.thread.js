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
      // if not at the end, increment as normal
      newIndex = state.currentProblemIndex + 1
    }
  }
  return newIndex
}

function getBackProblemIndex(currIndex, length) {
  let newIndex;
  // if at the end of the problems array, go to the start
  if (state.currentProblemIndex === 0) {
    newIndex = problems.length -1
  } else {
    // if not at the beginning, decrement as normal
    newIndex = state.currentProblemIndex - 1
  }
  return newIndex
}

function getNextProblem(probs) {
  // set new index to state
  state.currentProblemIndex = getNextProblemIndex(state.currentProblemIndex, problems.length)
  // return new problem from that index
  return probs[state.currentProblemIndex]
}

function getBackProblem(probs) {
  // set new index to state
  state.currentProblemIndex = getBackProblemIndex(state.currentProblemIndex, problems.length)
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
    const analyticsObj = {
      name: 'ga',
      data: {
        hitType: 'event',
        eventLabel: 'Problem',
        eventCategory: state.problem.name,
        eventAction: 'solved'
      }
    };
    state.events.push(analyticsObj);
  } else {
    // remove success sound event
    state.events = state.events.filter(item => {
      return !(item.name === 'sound' && item.data.id === 'pass')
    })
    // remove ga event
    state.events = state.events.filter(item => {
      return !(item.name === 'ga' && item.data.eventAction === 'solved')
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
        state.admin = payload.localState.admin
      }
      state.url = state.url || payload.url
      // go get a new problem!
      state.problem = state.shuffle
        ? problems[getNextProblemIndex(state.currentProblemIndex, problems.length)]
        : problems[0]
      state.problem.tests = testSuite(state.problem.given, state.problem)
      state.events = []
      const analyticsStartObj = {
        name: 'ga',
        data: {
          hitType: 'event',
          eventLabel: 'Started',
          eventCategory: state.problem && state.problem.name,
          eventAction: 'started_at'
        }
      };
      state.events.push(analyticsStartObj);
      break
    }
    case 'setUrl': {
      state.url = payload
      state.events = []
      break
    }
    case 'next': {
      state.problem = getNextProblem(problems)
      state.testsPass = false
      state.events = []
      const analyticsNavObj = {
      name: 'ga',
        data: {
          hitType: 'event',
          eventLabel: 'Navigation',
          eventCategory: state.problem && state.problem.name,
          eventAction: 'navigated_to'
        }
      };
      state.events.push(analyticsNavObj);
      state.problem.tests = testSuite(state.problem.given, state.problem)
      break
    }
    case 'back': {
      state.problem = getBackProblem(problems)
      state.testsPass = false
      state.events = []
      const analyticsNavObj = {
      name: 'ga',
        data: {
          hitType: 'event',
          eventLabel: 'Navigation',
          eventCategory: state.problem && state.problem.name,
          eventAction: 'navigated_to'
        }
      };
      state.events.push(analyticsNavObj);
      state.problem.tests = testSuite(state.problem.given, state.problem)
      break
    }
    case 'shuffle': {
      state.shuffle = !state.shuffle
      state.events = []
      const analyticsShuffleObj = {
      name: 'ga',
        data: {
          hitType: 'event',
          eventLabel: 'Configuration',
          eventCategory: state.shuffle,
          eventAction: 'shuffle_pressed'
        }
      };
      state.events.push(analyticsShuffleObj);
      break
    }
    case 'codeupdate': {
      state.events = []
      state.problem.tests = testSuite(payload, state.problem)
      break
    }
    case 'newproblems': {
      state.events = []
      problems.push(...dedentStrings(payload))
      // todo: show a toast that new content has been loaded for them
      break
    }
    case 'konami': {
      state.admin = payload
      console.log('state.admin:', state.admin);
      break
    }
  }


  // UPDATING THE DOM
  // ============================================================

  // state to save back to localstore
  // serialize the state, and delete reversible big bits so we can save in localstorage
  let tinyState = {
    shuffle: state.shuffle,
    admin: state.admin
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
