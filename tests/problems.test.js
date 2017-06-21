// PROBLEMS-TEST
// --------------------------------------------------------------------------------
// Test that the problems repo has imported properly,
// and that it's in the format we expect

import problems from 'pjs-problems'
import is from 'is'

test('problems must be importable', () => {
  expect(problems).toBeDefined()
})

test('problems must be an object', () => {
  expect(is.object(problems)).toBe(true)
})

test('problems direct children attribute values must be non-empty arrays', () => {
  Object.entries(problems).map(item => {
    // is valid array
    expect(is.array(item[1])).toBe(true)
    // has more than zero items
    expect(item[1].length).toBeGreaterThan(0)
  })
})

test('problems must each have the required attributes', () => {
  Object.entries(problems).map(item => {
    item[1].forEach(problem => {
      // name
      expect(problem.name).toBeTruthy()
      expect(is.string(problem.name)).toBe(true)
      // prompt
      expect(problem.prompt).toBeTruthy()
      expect(is.string(problem.prompt)).toBe(true)
      // given
      expect(problem.given).toBeTruthy()
      expect(is.string(problem.given)).toBe(true)
      // tests
      expect(problem.tests).toBeTruthy()
      expect(is.array(problem.tests)).toBe(true)
    })
  })
})

test('problems tests must non-empty array', () => {
  Object.entries(problems).map(item => {
    item[1].forEach(problem => {
      // tests
      // is array
      expect(is.array(problem.tests)).toBe(true)
      // non-empty
      expect(problem.tests.length).toBeGreaterThan(0)
    })
  })
})

test('problems tests must each have the required attributes', () => {
  Object.entries(problems).map(item => {
    item[1].forEach(problem => {
      problem.tests.forEach(test => {
        // name
        expect(test.name).toBeTruthy()
        expect(is.string(test.name)).toBe(true)
        // test
        expect(test.test).toBeTruthy()
        expect(is.string(test.test)).toBe(true)
      })
    })
  })
})
