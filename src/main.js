/*global history, requestAnimationFrame, location*/
import WorkerThread from './worker.thread'
import virtualize from 'vdom-virtualize'
import toJson from 'vdom-as-json/toJson'
import applyPatch from 'vdom-serialized-patch/patch'
import { getLocalPathname } from 'local-links'
import { debounce } from './helpers'
import './styles/main.styl'

// Keys to ignore while user is navigating around the textarea but not changing any code
const ignoreKeyCodes = [
  9, // Tab
  37, // Left arrow
  39, // Right arrow
  38, // Up arrow
  40 // Down arrow
];

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
  const { url, payload } = data
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
}

// we start things off by sending a virtual DOM
// representation of the *real* DOM along with
// the current URL to our worker
worker.postMessage({type: 'start', payload: {
  virtualDom: toJson(virtualize(rootElement)),
  url: location.pathname
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
    worker.postMessage({type: 'next'})
  }
})

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
document.body.addEventListener('keyup', debouncedCodeUpdate)
