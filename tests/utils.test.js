import utils from '../src/utils'

const beforeDedent = [{
  name: 'Create Array',
  time: 10,
  prompt: 'Create and return an array that contains \'apple\' and \'banana\'',
  given: 'const fruits = [];\rreturn fruits;',
  answer: 'const fruits = [\'apple\', \'banana\'];\n              return fruits;',
  tests: [{
    name: 'Correct output',
    test: 'assert.deepEqual(output, [\'apple\', \'banana\']) === undefined;'
  }, {
    name: 'Returns an Array',
    test: 'assert.isArray(output) === undefined;'
  }, {
    name: 'Array has 2 items',
    test: 'assert.lengthOf(output, 2) === undefined;'
  }]
}]

const afterDedent = [ {
  name: 'Create Array',
  time: 10,
  prompt: 'Create and return an array that contains \'apple\' and \'banana\'',
  given: 'const fruits = [];\rreturn fruits;',
  answer: 'const fruits = [\'apple\', \'banana\'];\nreturn fruits;',
  tests: [ {
  name: 'Correct output',
  test: 'assert.deepEqual(output, [\'apple\', \'banana\']) === undefined;'
  }, {
    name: 'Returns an Array',
    test: 'assert.isArray(output) === undefined;'
  }, {
    name: 'Array has 2 items',
    test: 'assert.lengthOf(output, 2) === undefined;'
  }]
}]

// dedentStringsInProblems
test('dedentStringsInProblems should dedent the text attrs we want', () => {
  const dedentedProbs = utils.dedentStringsInProblems(beforeDedent)
  // console.log('dedentedProbs:', dedentedProbs)
  expect(dedentedProbs).toEqual(afterDedent)
})

