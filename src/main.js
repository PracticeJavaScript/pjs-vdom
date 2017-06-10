/*global history, requestAnimationFrame, location*/

// DEPS
// ============================================================

import WorkerThread from './worker.thread'
import virtualize from 'vdom-virtualize'
import toJson from 'vdom-as-json/toJson'
import applyPatch from 'vdom-serialized-patch/patch'
import { getLocalPathname } from 'local-links'
import { debounce } from './helpers'
import './styles/main.styl'
import {assert} from 'chai'
import probs from 'pjs-problems'


// CONFIG
// ============================================================

// Keys to ignore while user is navigating around the textarea but not changing any code
const ignoreKeyCodes = [
  9, // Tab
  37, // Left arrow
  39, // Right arrow
  38, // Up arrow
  40 // Down arrow
];

// LOCAL STATE PERSIST
// ============================================================

function getLocalState() {
  const localState = localStorage.getItem('pjs_state')
  let parsedState = false
  if (localState) {
    parsedState = JSON.parse(localState)
  } else {
    console.log('Error getting previous or no local config stored.')
  }
  return parsedState
}

function saveLocalState(stateString) {
  localStorage.setItem('pjs_state', stateString)
  // console.log('Just saved local state:', stateString);
}


// WORKER EVENT DISPATCHER
// ============================================================

// Create an instance of our worker.
// The actual loading of the script gets handled
// by webpack's worker-loader:
// https://www.npmjs.com/package/worker-loader
const worker = new WorkerThread()

// The root element that contains our app markup
const rootElement = document.body.firstChild

// any time we get a message from the worker
// it will be a set of "patches" to apply to
// the real DOM. We do this on a requestAnimationFrame
// for minimal impact
worker.onmessage = ({data}) => {
  const { url, payload, serializedState } = data
  requestAnimationFrame(() => {
    applyPatch(rootElement, payload)
  })
  // we only want to update the URL
  // if it's different than the current
  // URL. Otherwise we keep pushing
  // the same url to the history with
  // each render
  if (location.pathname !== url) {
    history.pushState(null, null, url)
  }
  // save state to localstorage, so we can come back to it later
  if (serializedState) {
    saveLocalState(serializedState)
  }
}

// we start things off by sending a virtual DOM
// representation of the *real* DOM along with
// the current URL to our worker
worker.postMessage({type: 'start', payload: {
  virtualDom: toJson(virtualize(rootElement)),
  url: location.pathname,
  localState: getLocalState()
}})

// if the user hits the back/forward buttons
// pass the new url to the worker
window.addEventListener('popstate', () => {
  worker.postMessage({type: 'setUrl', payload: location.pathname})
})

// listen for all clicks globally
document.body.addEventListener('click', (event) => {
  // handles internal navigation defined as
  // clicks on <a> tags that have `href` that is
  // on the same origin.
  // https://www.npmjs.com/package/local-links
  const pathname = getLocalPathname(event)
  if (pathname) {
    // stop browser from following the link
    event.preventDefault()
    // instead, post the new URL to our worker
    // which will trigger compute a new vDom
    // based on that new URL state
    worker.postMessage({type: 'setUrl', payload: pathname})
    return
  }

  // this is for other "onClick" type events we want to
  // respond to. We check existance of an `data-click`
  // attribute and if it exists, post that back.
  // In our case, the messages look like either
  // {type: "increment"}
  // or
  // {type: "decrement"}
  // but could contain any serializable payload
  // describing the action that occured
  const click = event.target['data-click']
  if (click) {
    event.preventDefault()
    worker.postMessage(click)
  }
})

// Listen for all keydown events globally,
// to bind the keyboard shortcuts, with different de-bounce for each
document.body.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && !event.shiftKey && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    worker.postMessage({type: 'next'})
  }
})

// allow tabs to indent within textarea
code.addEventListener('keydown', function(event) {
  if(event.keyCode === 9) { // tab was pressed
    // get caret position/selection
    var start = this.selectionStart;
    var end = this.selectionEnd;
    var target = event.target;
    var value = target.value;
    // set textarea value to: text before caret + tab + text after caret
    target.value = value.substring(0, start)
      + "\t"
      + value.substring(end);
    // put caret at right position again (add one for the tab)
    this.selectionStart = this.selectionEnd = start + 1;
    // prevent the focus lose
    event.preventDefault();
  }
}, false)

const debouncedCodeUpdate = debounce(event => {
  // ignore things like arrow keys for submissions
  if (ignoreKeyCodes.indexOf(event.keyCode) === -1) {
    const codeupdate = event.target['data-codeupdate']
    if (codeupdate) {
      worker.postMessage({type: 'codeupdate', payload: event.target.value})
    }
  }
}, 200)

// Listen for keyup events in code textarea
// to auto-submit the code in textarea for test validation,
code.addEventListener('keyup', debouncedCodeUpdate)

// Lazy-load the rest of the content after the app's booted
function lazyLoadContent() {
  // require.ensure([], () => {
    // const probs = require('pjs-problems');
    const problems = [];
    Object.entries(probs).forEach(subject => {
      // send all content except initial, since we already have it
      if (subject[0] !== 'initial') {
        problems.push(...subject[1])
      }
    })
    worker.postMessage({type: 'newproblems', payload: problems})
  // })
}
// lazy-load that additional problem content
lazyLoadContent();
// window.addEventListener('load', lazyLoadContent)

// register service worker
(function() {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
})();
