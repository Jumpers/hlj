const fileName = process.argv[2];
const {
  test,
  expect,
  getPassedCount,
  getTotalCount,
  getTestCaseResults,
} = require('./core');
const { BLANK_SPACE } = require('./constant');

const runTest = (fileName) => {
  global.test = test;
  global.expect = expect;
  require('../' + fileName);
};

const formatTestResult = (testCaseResults) =>
  testCaseResults
    .map(
      (testCase) =>
        `${BLANK_SPACE.repeat(2)}${testCase.isPassed ? '✓' : '✕'} ${
          testCase.name
        }`
    )
    .join('\n');

const getFailedCountString = () => {
  const failedCount = getTotalCount() - getPassedCount();
  if (failedCount === 0) {
    return '';
  }

  return `${failedCount} failed,${BLANK_SPACE}`;
};

let executionTime = 0;
const getExecutionTime = () => `Time: ${executionTime / 1000} s`;

const getTestResult = (isPassed) => {
  let output = '';
  output += isPassed ? 'PASS' : 'FAIL';
  output += `${BLANK_SPACE}${fileName}\n`;
  output += `${formatTestResult(getTestCaseResults())}\n`;
  output += `Tests:${BLANK_SPACE}`;
  output += getFailedCountString();
  output += `${getPassedCount()} passed, ${getTotalCount()} total\n`;
  output += getExecutionTime();
  return output;
};

const startAt = Date.now();
let isPassed;
try {
  runTest(fileName);
  isPassed = true;
} catch (e) {
  isPassed = false;
} finally {
  executionTime = Date.now() - startAt;
  console.log(getTestResult(isPassed));
}
