export default (state) => (
  <div>
    <p>{state.problem.prompt}&nbsp;</p>
    <textarea name="code" id="code" cols="100" rows="10">{state.problem.given}</textarea>
  </div>
)
