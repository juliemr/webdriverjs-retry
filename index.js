var webdriver = require('selenium-webdriver');

var DEFAULT_TIMEOUT = 3000;
var DEFAULT_SLEEP = 100;

module.exports = function() {
  var defaultTimeout = DEFAULT_TIMEOUT;
  var defaultSleep = DEFAULT_SLEEP;
  var errorsToIgnore = [];
  var flow = webdriver.promise.controlFlow();

  var retry = {
    /**
     * @param {function} fn The function to execute. The entire contents of the
     *     function will be retried.
     * @param {number=} opt_timeout The total time to wait for this test to pass. If the
     *     timeout is exceeded and the code is erroring, throw that error.
     * @param {number=} opt_sleep Time to sleep between retries. Defaults to 100ms.
     * @return {webdriver.promise.Promise} a promise which will resolve when
     *     the retry is complete, or reject if the retry times out or encounters
     *     an error which is not ignored.
     */
    run: function(fn, opt_timeout, opt_sleep) {
      var timeout = opt_timeout || defaultTimeout;
      var sleep = opt_sleep || defaultSleep;
      var deadlineTimer = null;
      var deadlineExceeded = false;


      function tryExecute() {
        return flow.execute(function() {
          if (!deadlineTimer) {
            deadlineTimer = setTimeout(function() {
              deadlineExceeded = true;
            }, timeout);
          }
          return fn();
        }).then(function(value) {
          clearTimeout(deadlineTimer);
          return value;
        }, function(error) {
          if (deadlineExceeded) {
            throw error;
          }
          var ignoring = false;
          if (errorsToIgnore.length) {
            for (var i = 0; i < errorsToIgnore.length; i++) {
              if (typeof errorsToIgnore[i] === 'number') {
                if (errorsToIgnore[i] === error.code) {
                  ignoring = true;
                }
              } else {
                if (error instanceof errorsToIgnore[i]) {
                  ignoring = true;
                }
              }
            }
          } else {
            ignoring = true;
          }
          if (!ignoring) {
            throw error;
          }
          flow.timeout(sleep);
          return tryExecute();
        });
      }

      return tryExecute();
    },
    /**
     * Set the default timeout for this retrier.
     * @param {numer} timeout
     */
    setDefaultTimeout: function(timeout) {
      defaultTimeout = timeout;
      return retry;
    },
    /**
     * Set the default sleep for this retrier.
     * @param {numer} sleep
     */
    setDefaultSleep: function(sleep) {
      defaultSleep = sleep;
      return retry;
    },
    /**
     * Set the errors to be ignored. By default, all errors are ignored.
     * The arguments may be either error classes or numbers, which correspond
     * to error codes.
     *
     * For a list of webdriver error codes, see
     * https://code.google.com/p/selenium/source/browse/javascript/atoms/error.js
     *
     * @param {...(number|Object)} varArgs a list of error codes or error
     *     classes to be ignored
     */
    ignoring: function(varArgs) {
      var args = arguments;
      flow.execute(function() {
        errorsToIgnore = [];
        for (var i = 0; i < args.length; ++i) {
          errorsToIgnore.push(args[i]);
        }
      }, 'webdriverjs-retry setting error ignore list');
      return retry;
    }
  };

  return retry;
}();
