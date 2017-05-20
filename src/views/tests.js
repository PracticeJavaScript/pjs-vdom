export default (state) => {

  return (state.problem.tests.map(test => {
    return (
      <div className="test">
        <div className="name">{test.name}</div>
        <div className="feedback">{test.testFeedback && test.testFeedback.message}</div>
      </div>
    )
  }))

}
