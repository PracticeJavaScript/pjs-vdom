export default {
    name: 'Create Array',
    time: 10,
    prompt: 'Create and return an array that contains \'apple\' and \'banana\'',
    given: `const fruits = [];\rreturn fruits;`,
    answer: `const fruits = ['apple', 'banana'];
             return fruits;`,
    tests: [
      {
        name: 'Correct output',
        test(output) {
          return assert.deepEqual(output, ['apple', 'banana']) === undefined;
        }
      },
      {
        name: 'Returns an Array',
        test(output) {
          return assert.isArray(output) === undefined;
        }
      },
      {
        name: 'Array has 2 items',
        test(output) {
          return assert.lengthOf(output, 2) === undefined;
        }
      }
    ]
  }
