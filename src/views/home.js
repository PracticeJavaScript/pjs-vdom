import testArea from './tests'

export default (state) => {
  let tests = testArea(state)

  return (
    <div className="content">
      <p className="prompt">{state.problem.prompt}&nbsp;</p>
      <div className="tests-and-code">
        <div className="test-area">
          <div className={'test-status ' + (state.testsPass ? 'pass' : 'fail')}>{state.testsPass ? 'PASS' : 'FAIL'}</div>
          <div className="tests">{tests}</div>
        </div>
        <div className="code-area">
          <div className="label">Code</div>
          <textarea name="code" id="code" cols="100" rows="10" data-codeupdate={{type: 'codeupdate'}} value={state.problem.given || ''}></textarea>
          <div className="output">
            <div className="label">Output</div>
            <div className="evaluated">{(state.problem.evaluated === '{}') ? 'undefined' : state.problem.evaluated}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
