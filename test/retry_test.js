var retry = require('../index.js');
var webdriver = require('selenium-webdriver');

/**
 * Tests for the WebDriverJS-retry module. These tests use
 * WebDriverJS's control flow and promises without setting up the whole
 * webdriver.
 */
var getFakeDriver = function() {
  var flow = webdriver.promise.controlFlow();
  var elementExists = false;
  var findTries = 0;
  return {
    numFindTries: function() {
      return findTries;
    },
    controlFlow: function() {
      return flow;
    },
    sleep: function(ms) {
      return flow.timeout(ms);
    },
    setUp: function() {
      return flow.execute(function() {
        return webdriver.promise.fulfilled('setup done');
      });
    },
    showElementSoon: function(ms) {
      return flow.execute(function() {
        setTimeout(function() {
          elementExists = true;
        }, ms);
      });
    },
    findTheElement: function() {
      return flow.execute(function() {
        return webdriver.promise.delayed(100).then(function() {
          if (elementExists) {
            return webdriver.promise.fulfilled('a');
          } else {
            findTries++;
            var err = new Error('element not found');
            err.code = 8;
            throw err;
          }
        });
      });
    },
    getValueA: function() {
      return flow.execute(function() {
        return webdriver.promise.fulfilled('a');
      });
    }
  };
};

var fakeDriver = getFakeDriver();

describe('webdriverJS-retry', function() {
  it('should execute non-failing statements as usual', function(done) {
    var driver = getFakeDriver();
    retry.run(function() {
      driver.getValueA();
    }).then(function(value) {
      done();
    }, function(err) {
      done(err);
    });
  });

  it('should retry when it encounters an error', function(done) {
    var driver = getFakeDriver();

    driver.showElementSoon(1000);

    retry.run(function() {
      driver.findTheElement();
    }, 2000).then(function() {
      // Should have tried at least a couple times.
      expect(driver.numFindTries()).toBeGreaterThan(2);
      done();
    }, function(err) {
      done(err);
    });
  });

  it('should timeout if the function is still erroring', function(done) {
    var driver = getFakeDriver();

    driver.showElementSoon(2000);

    retry.run(function() {
      driver.findTheElement();
    }, 1000).then(function() {
      done('Error - should not succeed');
    }, function(err) {
      expect(err.message).toEqual('element not found');
      done();
    });
  });

  it('should take a list of error codes to ignore and fail on others',
      function(done) {
    var driver = getFakeDriver();

    driver.showElementSoon(1000);

    retry.ignoring(1, 2).run(function() {
      driver.findTheElement();
    }, 2000).then(function() {
      done('Error - should not succeed');
    }, function(err) {
      expect(err.code).toEqual(8);
      done();
    });
  });

  it('should take a list of error codes to ignore and ignore them',
      function(done) {
    var driver = getFakeDriver();

    driver.showElementSoon(1000);

    retry.ignoring(1, 8).run(function() {
      driver.findTheElement();
    }, 2000).then(function() {
      done();
    }, function(err) {
      done(err);
    });
  });
});
