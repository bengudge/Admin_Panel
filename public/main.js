/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/daemon/index.js":
/*!**************************************!*\
  !*** ./node_modules/daemon/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");
var child_process = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'child_process'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

// daemonize ourselves
module.exports = function(opt) {
    // we are a daemon, don't daemonize again
    if (process.env.__daemon) {
        return process.pid;
    }

    var args = [].concat(process.argv);

    // shift off node
    args.shift();

    // our script name
    var script = args.shift();

    opt = opt || {};
    var env = opt.env || process.env;

    // the child process will have this set so we can identify it as being daemonized
    env.__daemon = true;

    // start ourselves as a daemon
    module.exports.daemon(script, args, opt);

    // parent is done
    return process.exit();
};

// daemonizes the script and returns the child process object
module.exports.daemon = function(script, args, opt) {

    opt = opt || {};

    var stdout = opt.stdout || 'ignore';
    var stderr = opt.stderr || 'ignore';

    var env = opt.env || process.env;
    var cwd = opt.cwd || process.cwd;

    var cp_opt = {
        stdio: ['ignore', stdout, stderr],
        env: env,
        cwd: cwd,
        detached: true
    };

    // spawn the child using the same node process as ours
    var child = child_process.spawn(process.execPath, [script].concat(args), cp_opt);

    // required so the parent can exit
    child.unref();

    return child;
};



/***/ }),

/***/ "./node_modules/init/init.js":
/*!***********************************!*\
  !*** ./node_modules/init/init.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");
(function() {
  var daemon, fs;
  fs = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'fs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
  daemon = __webpack_require__(/*! daemon */ "./node_modules/daemon/index.js");
  exports.printStatus = function(st) {
    if (st.pid) {
      console.log('Process running with pid %d.', st.pid);
      return process.exit(0);
    } else if (st.exists) {
      console.log('Pidfile exists, but process is dead.');
      return process.exit(1);
    } else {
      console.log('Not running.');
      return process.exit(3);
    }
  };
  exports.status = function(pidfile, cb) {
    if (cb == null) {
      cb = exports.printStatus;
    }
    return fs.readFile(pidfile, 'utf8', function(err, data) {
      var match, pid;
      if (err) {
        return cb({
          exists: err.code !== 'ENOENT'
        });
      } else if (match = /^\d+/.exec(data)) {
        pid = parseInt(match[0]);
        try {
          process.kill(pid, 0);
          return cb({
            pid: pid
          });
        } catch (e) {
          return cb({
            exists: true
          });
        }
      } else {
        return cb({
          exists: true
        });
      }
    });
  };
  exports.startSucceeded = function(pid) {
    if (pid) {
      return console.log('Process already running with pid %d.', pid);
    } else {
      return console.log('Started.');
    }
  };
  exports.startFailed = function(err) {
    console.log(err);
    return process.exit(1);
  };
  exports.start = function(_arg) {
    var failure, logfile, pidfile, run, start, success;
    pidfile = _arg.pidfile, logfile = _arg.logfile, run = _arg.run, success = _arg.success, failure = _arg.failure;
    success || (success = exports.startSucceeded);
    failure || (failure = exports.startFailed);
    logfile || (logfile = '/dev/null');
    start = function(err) {
      if (err) {
        return failure(err);
      }
      return fs.open(logfile, 'a+', 0666, function(err, fd) {
        var pid;
        if (err) {
          return failure(err);
        }
        success();
        pid = daemon.start(fd);
        daemon.lock(pidfile);
        return run();
      });
    };
    return exports.status(pidfile, function(st) {
      if (st.pid) {
        return success(st.pid, true);
      } else if (st.exists) {
        return fs.unlink(pidfile, start);
      } else {
        return start();
      }
    });
  };
  exports.stopped = function(killed) {
    if (killed) {
      console.log('Stopped.');
    } else {
      console.log('Not running.');
    }
    return process.exit(0);
  };
  exports.hardKiller = function(timeout) {
    if (timeout == null) {
      timeout = 2000;
    }
    return function(pid, cb) {
      var signals, tryKill;
      signals = ['TERM', 'INT', 'QUIT', 'KILL'];
      tryKill = function() {
        var sig;
        sig = "SIG" + signals[0];
        try {
          process.kill(pid, sig);
          if (signals.length > 1) {
            signals.shift();
          }
          return setTimeout((function() {
            return tryKill(sig);
          }), timeout);
        } catch (e) {
          return cb(signals.length < 4);
        }
      };
      return tryKill();
    };
  };
  exports.softKiller = function(timeout) {
    if (timeout == null) {
      timeout = 2000;
    }
    return function(pid, cb) {
      var sig, tryKill;
      sig = "SIGTERM";
      tryKill = function() {
        var first;
        try {
          process.kill(pid, sig);
          console.log("Waiting for pid " + pid);
          if (sig !== 0) {
            sig = 0;
          }
          first = false;
          return setTimeout(tryKill, timeout);
        } catch (e) {
          return cb(sig === 0);
        }
      };
      return tryKill();
    };
  };
  exports.stop = function(pidfile, cb, killer) {
    if (cb == null) {
      cb = exports.stopped;
    }
    if (killer == null) {
      killer = exports.hardKiller(2000);
    }
    return exports.status(pidfile, function(_arg) {
      var pid;
      pid = _arg.pid;
      if (pid) {
        return killer(pid, function(killed) {
          return fs.unlink(pidfile, function() {
            return cb(killed);
          });
        });
      } else {
        return cb(false);
      }
    });
  };
  exports.simple = function(_arg) {
    var command, killer, logfile, pidfile, run, start;
    pidfile = _arg.pidfile, logfile = _arg.logfile, command = _arg.command, run = _arg.run, killer = _arg.killer;
    command || (command = process.argv[2]);
    killer || (killer = null);
    start = function() {
      return exports.start({
        pidfile: pidfile,
        logfile: logfile,
        run: run
      });
    };
    switch (command) {
      case 'start':
        return start();
      case 'stop':
        return exports.stop(pidfile, null, killer);
      case 'status':
        return exports.status(pidfile);
      case 'restart':
      case 'force-reload':
        return exports.stop(pidfile, start, killer);
      case 'try-restart':
        return exports.stop(pidfile, function(killed) {
          if (killed) {
            return exports.start({
              pidfile: pidfile,
              logfile: logfile,
              run: run
            });
          } else {
            console.log('Not running.');
            return process.exit(1);
          }
        });
      default:
        console.log('Command must be one of: ' + 'start|stop|status|restart|force-reload|try-restart');
        return process.exit(1);
    }
  };
}).call(this);


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./node_modules/init/init.js");
/******/ 	
/******/ })()
;