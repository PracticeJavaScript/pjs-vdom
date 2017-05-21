export default [
  {
    name: 'Access Array by index (first)',
    time: 10,
    prompt: 'Return the first value of the Array',
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             return fruits[0];`,
    tests: [
      {
        name: 'Correct output',
        test: 'assert.deepEqual(output, \'apple\') === undefined'
      },
      {
        name: 'Returns a String',
        test: 'assert.isString(output) === undefined'
      }
    ]
  },
  {
    name: 'Access Array by index (last)',
    time: 10,
    prompt: 'Return the last value of the Array',
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             return fruits[fruits.length - 1];`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, 'orange') === undefined;`
      },
      {
        name: 'Returns a String',
        test: `assert.isString(output) === undefined;`
      }
    ]
  },
  {
    name: 'Access Array by index (second)',
    time: 10,
    prompt: 'Return the second value of the Array',
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             return fruits[1];`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, 'banana') === undefined;`
      },
      {
        name: 'Returns a String',
        test: `assert.isString(output) === undefined;`
      }
    ]
  },
  {
    name: 'Array.forEach()',
    time: 20,
    prompt: 'Loop over the array, add an \'x\' to the end of each name, push each fruit into a new array, then return the new array.',
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             const newFruits = [];
             fruits.forEach(function(item) {
               newFruits.push(item+'x');
             });
             return newFruits;`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, ['applex', 'bananax']) === undefined;`
      },
      {
        name: 'Returns an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 2 items',
        test: `assert.lengthOf(output, 2) === undefined;`
      }
    ]
  },
  {
    name: 'Array.push()',
    time: 10,
    prompt: `Add 'orange' to the end of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana'];\r`,
    answer: `const fruits = ['apple', 'banana'];
             fruits.push('orange');
             return fruits;`,
    tests: [
      {
        name: 'Correct output',
        test: `(assert.deepEqual(output, ['apple', 'banana', 'orange']) === undefined);`
      },
      {
        name: 'Returns an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 3 items',
        test: `assert.lengthOf(output, 3) === undefined;`
      }
    ]
  },
  {
    name: 'Array.shift()',
    time: 10,
    prompt: `Remove 'apple' from the front of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             fruits.shift();
             return fruits;`,
    tests: [
      {
        name: 'Output must be correct',
        test: `assert.deepEqual(output, ['banana', 'orange']) === undefined;`
      },
      {
        name: 'Returns an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 2 items',
        test: `assert.lengthOf(output, 2) === undefined;`
      }
    ]
  },
  {
    name: 'Array.unshift()',
    time: 10,
    prompt: `Add 'strawberry' to the front of the 'fruits' array and return 'fruits'.`,
    given: `const fruits = ['apple', 'banana', 'orange'];\r`,
    answer: `const fruits = ['apple', 'banana', 'orange'];
             fruits.unshift('strawberry');
             return fruits;`,
    tests: [
      {
        name: 'Output must be correct',
        test: `(assert.deepEqual(output, [
                  'strawberry',
                  'apple',
                  'banana',
                  'orange'
                ]) === undefined)`
      },
      {
        name: 'Must return an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 4 items',
        test: `assert.lengthOf(output, 4) === undefined;`
      }
    ]
  },
  {
    name: 'Array.indexOf()',
    time: 10,
    prompt: `Return the index of 'banana' in the Array.`,
    given: `const fruits = ['strawberry', 'banana', 'mango'];\r`,
    answer: `const fruits = ['strawberry', 'banana', 'mango'];
             const ind = fruits.indexOf('banana');
             return ind;`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, 1) === undefined;`
      },
      {
        name: 'Returns a Number',
        test: `assert.isNumber(output) === undefined;`
      }
    ]
  },
  {
    name: 'Array.concat()',
    time: 10,
    prompt: `Merge the two arrays using Array's 'concat()' method. Return the resulting array.`,
    given: `const fruits = ['strawberry', 'banana'];\rconst otherFruits = ['pear','peach'];\r`,
    answer: `const fruits = ['strawberry', 'banana'];
            const otherFruits = ['pear','peach'];
            const allTheFruits = fruits.concat(otherFruits);
            return allTheFruits;\r`,
    tests: [
      {
        name: 'Correct output',
        test: `(assert.deepEqual(output, [
                  'strawberry',
                  'banana',
                  'pear',
                  'peach'
                ]) === undefined
              );`
      },
      {
        name: 'Returns an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 4 items',
        test: `assert.lengthOf(output, 4) === undefined;`
      }
    ]
  },
  {
    name: 'Array.join()',
    time: 10,
    prompt: `Mix the two flavors with a '-' using Array's 'join' method. Return the resulting hybrid flavor.`,
    given: `const fruits = ['strawberry', 'banana'];\r`,
    answer: `const fruits = ['strawberry', 'banana'];
             const hybrid = fruits.join('-');
             return hybrid;\r`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, 'strawberry-banana') === undefined;`
      },
      {
        name: 'Returns a String',
        test: `assert.isString(output) === undefined;`
      }
    ]
  },
  {
    name: 'Array.slice()',
    time: 20,
    prompt: `Return just the citrus fruits from the 'fruits' array using 'Array.slice()'`,
    given: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];\r`,
    answer: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];
             const citrus = fruits.slice(1, 3);
             return citrus;`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, ['orange', 'lemon']) === undefined;`
      },
      {
        name: 'Returns an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 2 items',
        test: `assert.lengthOf(output, 2) === undefined;`
      }
    ]
  },
  {
    name: 'Array.reverse()',
    time: 10,
    prompt: `Reverse the order of the 'fruit' array using 'Array.reverse()'`,
    given: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];\r`,
    answer: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];
             const stiurf = fruits.reverse();
             return stiurf;`,
    tests: [
      {
        name: 'Correct output',
        test: `(assert.deepEqual(output, [
                  'banana',
                  'lemon',
                  'orange',
                  'strawberry'
                ]) === undefined);`
      },
      {
        name: 'Returns an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 4 items',
        test: `assert.lengthOf(output, 4) === undefined;`
      },
      {
        name: `First item is 'banana'`,
        test: `assert.deepEqual(output[0], 'banana') === undefined;`
      }
    ]
  },
  {
    name: 'Array.sort()',
    time: 10,
    prompt: `Return the 'fruits' Array after sorting them using 'Array.sort()'.`,
    given: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];\r`,
    answer: `const fruits = ['strawberry', 'orange', 'lemon', 'banana'];
             const orderlyFruit = fruits.sort();
             return orderlyFruit;`,
    tests: [
      {
        name: 'Correct output',
        test: `(assert.deepEqual(output, [
                  'banana',
                  'lemon',
                  'orange',
                  'strawberry'
                ]) === undefined);`
      },
      {
        name: 'Returns an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 4 items',
        test: `assert.lengthOf(output, 4) === undefined;`
      },
      {
        name: `First item is 'banana'`,
        test: `assert.deepEqual(output[0], 'banana') === undefined;`
      }
    ]
  },
  {
    name: 'Array.lastIndexOf()',
    time: 10,
    prompt: `Return the index of the last 'peach' instance in the 'fruit' array using 'Array.lastIndexOf()'`,
    given: `const fruits = ['peach', 'orange', 'lemon', 'peach'];\r`,
    answer: `const fruits = ['peach', 'orange', 'lemon', 'peach'];
             const wheresTheLastPeach = fruits.lastIndexOf('peach');
             return wheresTheLastPeach;`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, 3) === undefined;`
      },
      {
        name: 'Returns a Number',
        test: `assert.isNumber(output) === undefined;`
      }
    ]
  },
  {
    name: 'Array.filter()',
    time: 10,
    prompt: `Return an array of the numbers greater than 5 in 'numbers' using 'Array.filter()'`,
    given: `const numbers = [1, 1, 2, 3, 5, 8, 13, 21];\r`,
    answer: `const numbers = [1, 1, 2, 3, 5, 8, 13, 21];
             const overFive = numbers.filter(num => num > 5);
             return overFive;`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, [8, 13, 21]) === undefined;`
      },
      {
        name: 'Returns an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 3 items',
        test: `assert.lengthOf(output, 3) === undefined;`
      },
      {
        name: `First item is 8`,
        test: `assert.deepEqual(output[0], 8) === undefined;`
      }
    ]
  },
  {
    name: 'Array.map()',
    time: 10,
    prompt: `Return an array of 'numbers' array's square roots, using 'Array.map()' and 'Math.sqrt()'`,
    given: `const numbers = [25, 121, 169];\r`,
    answer: `const numbers = [25, 121, 169];
             const roots = numbers.map(num => Math.sqrt(num));
             return roots;`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, [5, 11, 13]) === undefined;`
      },
      {
        name: 'Returns an Array',
        test: `assert.isArray(output) === undefined;`
      },
      {
        name: 'Array has 3 items',
        test: `assert.lengthOf(output, 3) === undefined;`
      },
      {
        name: `First item is 5`,
        test: `assert.deepEqual(output[0], 5) === undefined;`
      },
      {
        name: `Last item is 13`,
        test: `assert.deepEqual(output[output.length - 1], 13) === undefined;`
      }
    ]
  },
  {
    name: 'Array.every()',
    time: 10,
    prompt: `Return object that returns whether each array contains all even numbers using Array.every().`,
    given: `
const evenNumbers = [2, 4, 6, 8];
const someOddNumbers = [2, 5, 6, 8];
function isEven(element) {
}
return {
  evenNumbers: evenNumbers.,
  someOddNumbers: someOddNumbers.
};`,
    answer: `
const evenNumbers = [2, 4, 6, 8];
const someOddNumbers = [2, 5, 6, 8];
function isEven(element) {
  return element % 2 === 0
}
return {
  evenNumbers: evenNumbers.every(isEven),
  someOddNumbers: someOddNumbers.every(isEven)
};`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, {
            evenNumbers: true,
            someOddNumbers: false
          }) === undefined;`
      },
      {
        name: 'Returns an Object',
        test: `assert.isObject(output) === undefined;`
      },
      {
        name: 'Object has 2 items',
        test: `assert.lengthOf(Object.keys(output), 2) === undefined;`
      },
      {
        name: `First value is true`,
        test: `assert.isTrue(output.evenNumbers) === undefined;`
      },
      {
        name: `Second value is false`,
        test: `assert.isFalse(output.someOddNumbers) === undefined;`
      }
    ]
  },
  {
    name: 'Array.some()',
    time: 10,
    prompt: `Return 'Object' that returns whether each array contains some odd numbers using 'Array.some()'.`,
    given: `
const evenNumbers = [2, 4, 6, 8];
const someOddNumbers = [2, 4, 7, 8];
function isOdd(element) {
}
return {
  evenNumbers: evenNumbers.,
  someOddNumbers: someOddNumbers.
};`,
    answer: `
const evenNumbers = [1, 3, 5, 7];
const someOddNumbers = [1, 3, 6, 7];
function isOdd(element) {
  return element % 2 !== 0;
}
return {
  evenNumbers: evenNumbers.some(isOdd),
  someOddNumbers: someOddNumbers.some(isOdd)
};`,
    tests: [
      {
        name: 'Correct output',
        test: `assert.deepEqual(output, {
            evenNumbers: false,
            someOddNumbers: true
          }) === undefined;`
      },
      {
        name: 'Returns an Object',
        test: `assert.isObject(output) === undefined;`
      },
      {
        name: 'Object has 2 items',
        test: `assert.lengthOf(Object.keys(output), 2) === undefined;`
      },
      {
        name: `First value is false`,
        test: `assert.isFalse(output.evenNumbers) === undefined;`
      },
      {
        name: `Second value is true`,
        test: `assert.isTrue(output.someOddNumbers) === undefined;`
      }
    ]
  }
  // Next problems to create:
  // forEach? fix one above that tried, but can't verify forEach was used
  // some
  // reduce
  // reduceRight
  // Array.from and other ways to turn array-like into array
];
