import testArea from './tests'

export default (state) => {
  let tests = testArea(state)

  return (
    <div>
      <p>{state.problem.prompt}&nbsp;</p>
      <textarea name="code" id="code" cols="100" rows="10" data-codeupdate={{type: 'codeupdate'}}>{state.problem.given}</textarea>
      <h2>Tests</h2>
      <div className="tests">{tests}</div>
      <h2>Output</h2>
      <div className="evaluated">{(state.problem.evaluated === '{}') ? 'undefined' : state.problem.evaluated}</div>
    </div>
  )
}
