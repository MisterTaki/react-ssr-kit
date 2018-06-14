// https://hackernoon.com/rethinking-javascript-eliminate-the-switch-statement-for-better-code-5c81c044716d

const executeIfFunction = f => (
  f instanceof Function ? f() : f
);

const switchCase = cases => defaultCase => key => (
  Object.prototype.hasOwnProperty.call(cases, key) ? cases[key] : defaultCase
);

export default cases => defaultCase => key =>
  executeIfFunction(switchCase(cases)(defaultCase)(key));
