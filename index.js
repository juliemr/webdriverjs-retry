var webdriver = require('selenium-webdriver');

var DEFAULT_SLEEP = 100;

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
