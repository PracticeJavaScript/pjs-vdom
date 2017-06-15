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
    <main>
      <heading>
        <div class="brand">
          <h1>Practice JavaScript!</h1>
        </div>
        <nav>
          <button data-click={{type: 'shuffle'}} className={state.shuffle ? 'active' : ''}>shuffle</button>
          <button data-click={{type: 'next'}} data-keybinding={{type: 'next'}} title="NEXT"> &gt; </button>
        </nav>
      </heading>
      {page}
      {footer()}
    </main>
  )
}
