import home from './home'
import about from './about'

export default (state) => {
  const { url } = state
  let page

  if (url === '/') {
    page = home(state)
  } else if (url === '/about') {
    page = about(state)
  }

  return (
    <main>
      <heading>
        <div class="brand">
          <h1>Practice JavaScript!</h1>
        </div>
        <nav>
          <button data-click={{type: 'shuffle'}} className={state.shuffleClass}>shuffle</button>
          <button data-click={{type: 'next'}}> &gt; </button>
        </nav>
      </heading>
      {page}
    </main>
  )
}
