import home from './home'
// import about from './about'
import footer from './footer'

export default (state) => {
  const { url } = state
  let page

  if (url === '/') {
    page = home(state)
  }
  // else if (url === '/about') {
  //   page = about(state)
  // }

  return (
    <main className={state.admin ? 'admin' : ''}>
      <heading>
        <div class="brand">
          <h1>Practice JavaScript!</h1>
        </div>
        <nav class="nav">
          <button id="back" data-click={{type: 'back'}} data-keybinding={{type: 'back'}} title="BACK" className={state.shuffle ? 'hide' : ''}> &lt; </button>
          <button id="shuffle" data-click={{type: 'shuffle'}} className={state.shuffle ? 'active' : ''} >shuffle</button>
          <button id="next" data-click={{type: 'next'}} data-keybinding={{type: 'next'}} title="NEXT"> &gt; </button>
        </nav>
      </heading>
      <div className="filters">
        <button id="es5" data-click={{type: 'filter', payload: 'es5'}} className={state.filters.includes('es5') ? 'active' : ''} >ES5</button>
        <button id="es6" data-click={{type: 'filter', payload: 'es6'}} className={state.filters.includes('es6') ? 'active' : ''} >ES6</button>
      </div>
      {page}
      {footer()}
    </main>
  )
}
