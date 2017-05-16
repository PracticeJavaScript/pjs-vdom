export default ({shuffle, shuffleClass, problem}) => (
  <div>
    <button data-click={{type: 'shuffle'}} data-class={shuffleClass}>shuffle</button>
    <button data-click={{type: 'next'}}> &gt; </button>
    <p>{problem.prompt}&nbsp;</p>
    <textarea name="code" id="" cols="100" rows="10">{problem.given} </textarea>
  </div>
)
