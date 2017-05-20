export default (state) => {

  return (state.problem.tests.map(test => {
    return (
      <div className="test">
        <div className="test-heading">
          <div className={'test-status-single ' + (test.testFeedback === true ? 'pass' : 'fail')}>
            {(test.testFeedback === true ? '[✓]' : '[✘]')}
          </div>
          <div className="name">{test.name}</div>
        </div>
        {(test.testFeedback && test.testFeedback.message)
          ? (<div className="feedback">{test.testFeedback.message}</div>)
          : ('')}
      </div>
    )
  }))

}
