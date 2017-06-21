import dedent from 'dedent'


// PROBLEM TEMPLATE NICE-IFICATION
// ============================================================
function dedentStringsInProblems(problems) {
  return problems.map(prob => {
    prob.given = dedent(prob.given)
    prob.answer = dedent(prob.answer)
    return prob
  });
}


// DEBOUNCE UI EVENTS
// --------------------------------------------------------------------------------
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

module.exports = {
  dedentStringsInProblems,
  debounce
}
