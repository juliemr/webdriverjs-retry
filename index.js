var webdriver = require('selenium-webdriver');

var DEFAULT_SLEEP = 100;

// TODO - the timeout is not exactly accurate, since there's a lot of time
// in between sleeps.

// TODO - allow setting of default sleep and timeout.

// TODO - allow only capturing certain type of errors.

// TODO - should return something intelligent

module.exports = function(fn, timeout, opt_sleep) {
  var sleep = opt_sleep || DEFAULT_SLEEP;
  var flow = webdriver.promise.controlFlow();
  var timeRemaining = timeout;

  function tryExecute() {
    flow.execute(fn).then(function() {

    }, function(error) {
      if (timeRemaining <= 0) {
        throw error;
      }
      timeRemaining -= sleep;
      flow.timeout(sleep);
      tryExecute();
    });
  }

  tryExecute();
};
