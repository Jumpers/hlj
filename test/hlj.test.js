const { exec } = require('./exec');

describe('JavaScript TDD framework', () => {
  it('is a CLI program', () => {
    const stdout = exec('hlj sum.test.js');
    expect(stdout).toContain('PASS');
  });
  it('should return PASS when test passed', () => {
    const stdout = exec('hlj sum.test.js');
    expect(stdout).toContain('PASS');
  });
  it('should return FAIL when test failed', () => {
    const stdout = exec('hlj failed.test.js');
    expect(stdout).toContain('FAIL');
  });
  describe('Test report', () => {
    it('should output number of tests passed', () => {
      const stdout = exec('hlj two-tests.test.js');
      expect(stdout).toContain(
        '' +
          'PASS two-tests.test.js\n' +
          '  ✓ 1 plus 2 is 3\n' +
          '  ✓ 2 plus 2 is 4\n' +
          'Tests: 2 passed, 2 total\n'
      );
    });
    it('should output number of tests passed while there are failed tests', () => {
      const stdout = exec('hlj passed-and-failed.test.js');
      expect(stdout).toContain(
        '' +
          'FAIL passed-and-failed.test.js\n' +
          '  ✓ 1 plus 2 is 3\n' +
          '  ✕ 2 plus 2 is 5\n' +
          '  Expected: 5\n' +
          '  Received: 4\n' +
          'Tests: 1 failed, 1 passed, 2 total\n'
      );
    });

    it('should output execution time', () => {
      const stdout = exec('hlj passed-and-failed.test.js');
      const expectRegex = /Time: ([0-9]*[.])?[0-9]+ s/;
      expect(stdout).toMatch(expectRegex);
    });
  });

  describe('Run tests in directory', () => {
    it('should run all files in specified directory', () => {
      const stdout = exec('hlj test-dir/');
      expect(stdout).toContain('PASS');
      expect(stdout).toContain('Tests: 6 passed, 6 total');
    });
  });
});
