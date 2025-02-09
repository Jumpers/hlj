#!/usr/bin/env node
const fs = require('fs');

const fileName = process.argv[2];
const {
  it,
  test,
  expect,
  describe,
  getPassedCount,
  getTotalCount,
  getTestCaseResults,
} = require('./core');

const runTest = (path) => {
  global.test = test;
  global.it = it;
  global.expect = expect;
  global.describe = describe;

  function isDir(fileName) {
    return fs.lstatSync(fileName).isDirectory();
  }

  if (isDir(path)) {
    let fileNames = fs.readdirSync(path);
    fileNames.forEach((fileName) => {
      require('../' + path + fileName);
    });
  } else {
    require('../' + path);
  }
};

const formatTestResult = (testCaseResults) =>
  testCaseResults
    .map((testCase) => `  ${testCase.isPassed ? '✓' : '✕'} ${testCase.name}`)
    .join('\n');

const getFailedCountString = () => {
  const failedCount = getTotalCount() - getPassedCount();
  if (failedCount === 0) {
    return '';
  }

  return `${failedCount} failed, `;
};

let executionTime = 0;
const getExecutionTime = () => `Time: ${executionTime / 1000} s`;

function getDiffMessage(isPassed, testMessage) {
  if (isPassed) {
    return '';
  }

  const { expected, received } = testMessage;

  return `\n  Expected: ${expected}\n  Received: ${received}`;
}

const getTestResult = (isPassed, testMessage = {}) => {
  return `${isPassed ? 'PASS' : 'FAIL'} ${fileName}
${formatTestResult(getTestCaseResults())}${getDiffMessage(
    isPassed,
    testMessage
  )}
Tests: ${getFailedCountString()}${getPassedCount()} passed, ${getTotalCount()} total
${getExecutionTime()}`;
};

const startAt = Date.now();
let isPassed;
let testMessage;
try {
  runTest(fileName);
  isPassed = true;
} catch (e) {
  isPassed = false;
  testMessage = JSON.parse(e.message);
} finally {
  executionTime = Date.now() - startAt;
  console.log(getTestResult(isPassed, testMessage));
}
