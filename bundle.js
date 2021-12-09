(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.load = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var gramatica = (function(){
<<<<<<< Updated upstream
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,9],$V1=[1,10],$V2=[1,12],$V3=[1,13],$V4=[1,14],$V5=[1,15],$V6=[1,16],$V7=[1,17],$V8=[5,19,23,24,27,29,30,31,32,33],$V9=[5,19,23,24,27,28,29,30,31,32,33],$Va=[1,40],$Vb=[1,31],$Vc=[1,30],$Vd=[1,32],$Ve=[1,33],$Vf=[1,34],$Vg=[1,35],$Vh=[1,36],$Vi=[1,37],$Vj=[1,38],$Vk=[1,39],$Vl=[8,15],$Vm=[1,46],$Vn=[15,22],$Vo=[1,47],$Vp=[1,48],$Vq=[1,49],$Vr=[1,50],$Vs=[1,51],$Vt=[1,52],$Vu=[1,53],$Vv=[1,54],$Vw=[1,55],$Vx=[1,56],$Vy=[1,57],$Vz=[1,58],$VA=[1,59],$VB=[1,60],$VC=[1,61],$VD=[15,22,34,35,36,37,38,39,40,41,42,44,45,46,47,48,49],$VE=[15,22,41,42],$VF=[1,87],$VG=[15,22,34,35,40,41,42,44,45,46,47,48,49],$VH=[15,22,34,35,36,37,38,40,41,42,44,45,46,47,48,49],$VI=[15,22,41,42,44,45,46,47,48,49],$VJ=[15,22,41,42,48,49];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"start":3,"instrucciones":4,"EOF":5,"instruccion":6,"print_instr":7,"PUNTOCOMA":8,"println_instr":9,"declaracion":10,"if_llav_instr":11,"if_instr":12,"tipo":13,"lista_simbolos":14,"COMA":15,"ID":16,"IGUAL":17,"e":18,"RPRINT":19,"PARA":20,"lista_parametros":21,"PARC":22,"RPRINTLN":23,"RIF":24,"expr":25,"LLAVA":26,"LLAVC":27,"RELSE":28,"RINT":29,"RDOUBLE":30,"RSTRING":31,"RCHAR":32,"RBOOLEAN":33,"MAS":34,"MENOS":35,"MULTI":36,"DIV":37,"PORCENTAJE":38,"POTENCIA":39,"AMPERSON":40,"AND":41,"OR":42,"NOT":43,"MAYORQUE":44,"MAYORIGUAL":45,"MENORIGUAL":46,"MENORQUE":47,"IGUALIGUAL":48,"DIFERENTE":49,"ENTERO":50,"DECIMAL":51,"CADENA":52,"CHAR":53,"NULL":54,"TRUE":55,"FALSE":56,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"PUNTOCOMA",15:"COMA",16:"ID",17:"IGUAL",18:"e",19:"RPRINT",20:"PARA",22:"PARC",23:"RPRINTLN",24:"RIF",26:"LLAVA",27:"LLAVC",28:"RELSE",29:"RINT",30:"RDOUBLE",31:"RSTRING",32:"RCHAR",33:"RBOOLEAN",34:"MAS",35:"MENOS",36:"MULTI",37:"DIV",38:"PORCENTAJE",39:"POTENCIA",40:"AMPERSON",41:"AND",42:"OR",43:"NOT",44:"MAYORQUE",45:"MAYORIGUAL",46:"MENORIGUAL",47:"MENORQUE",48:"IGUALIGUAL",49:"DIFERENTE",50:"ENTERO",51:"DECIMAL",52:"CADENA",53:"CHAR",54:"NULL",55:"TRUE",56:"FALSE"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,2],[6,2],[6,1],[6,1],[10,2],[14,3],[14,5],[14,1],[14,3],[7,4],[9,4],[11,7],[11,11],[11,9],[12,5],[12,7],[12,7],[21,3],[21,1],[13,1],[13,1],[13,1],[13,1],[13,1],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,2],[25,3],[25,3],[25,3],[25,2],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1]],
=======
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[1,9],$V2=[1,11],$V3=[1,12],$V4=[1,13],$V5=[1,14],$V6=[1,15],$V7=[1,16],$V8=[5,18,22,23,25,27,28,29,30,31],$V9=[1,38],$Va=[1,29],$Vb=[1,28],$Vc=[1,30],$Vd=[1,31],$Ve=[1,32],$Vf=[1,33],$Vg=[1,34],$Vh=[1,35],$Vi=[1,36],$Vj=[1,37],$Vk=[8,14],$Vl=[1,45],$Vm=[14,21],$Vn=[1,46],$Vo=[1,47],$Vp=[1,48],$Vq=[1,49],$Vr=[1,50],$Vs=[1,51],$Vt=[1,52],$Vu=[1,53],$Vv=[1,54],$Vw=[1,55],$Vx=[1,56],$Vy=[1,57],$Vz=[1,58],$VA=[1,59],$VB=[1,60],$VC=[8,14,21,32,33,34,35,36,37,38,39,40,42,43,44,45,46,47],$VD=[8,14,21,39,40],$VE=[8,14,21,32,33,38,39,40,42,43,44,45,46,47],$VF=[8,14,21,32,33,34,35,36,38,39,40,42,43,44,45,46,47],$VG=[8,14,21,39,40,42,43,44,45,46,47],$VH=[8,14,21,39,40,46,47];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"start":3,"instrucciones":4,"EOF":5,"instruccion":6,"print_instr":7,"PUNTOCOMA":8,"println_instr":9,"declaracion":10,"if_instr":11,"tipo":12,"lista_simbolos":13,"COMA":14,"ID":15,"IGUAL":16,"expr":17,"RPRINT":18,"PARA":19,"lista_parametros":20,"PARC":21,"RPRINTLN":22,"RIF":23,"LLAVA":24,"LLAVC":25,"RELSE":26,"RINT":27,"RDOUBLE":28,"RSTRING":29,"RCHAR":30,"RBOOLEAN":31,"MAS":32,"MENOS":33,"MULTI":34,"DIV":35,"PORCENTAJE":36,"POTENCIA":37,"AMPERSON":38,"AND":39,"OR":40,"NOT":41,"MAYORQUE":42,"MAYORIGUAL":43,"MENORIGUAL":44,"MENORQUE":45,"IGUALIGUAL":46,"DIFERENTE":47,"ENTERO":48,"DECIMAL":49,"CADENA":50,"CHAR":51,"NULL":52,"TRUE":53,"FALSE":54,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"PUNTOCOMA",14:"COMA",15:"ID",16:"IGUAL",18:"RPRINT",19:"PARA",21:"PARC",22:"RPRINTLN",23:"RIF",24:"LLAVA",25:"LLAVC",26:"RELSE",27:"RINT",28:"RDOUBLE",29:"RSTRING",30:"RCHAR",31:"RBOOLEAN",32:"MAS",33:"MENOS",34:"MULTI",35:"DIV",36:"PORCENTAJE",37:"POTENCIA",38:"AMPERSON",39:"AND",40:"OR",41:"NOT",42:"MAYORQUE",43:"MAYORIGUAL",44:"MENORIGUAL",45:"MENORQUE",46:"IGUALIGUAL",47:"DIFERENTE",48:"ENTERO",49:"DECIMAL",50:"CADENA",51:"CHAR",52:"NULL",53:"TRUE",54:"FALSE"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,2],[6,1],[6,1],[10,3],[13,3],[13,5],[13,1],[13,3],[7,4],[9,4],[11,7],[11,11],[20,3],[20,1],[12,1],[12,1],[12,1],[12,1],[12,1],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,2],[17,3],[17,3],[17,3],[17,2],[17,3],[17,3],[17,3],[17,3],[17,3],[17,3],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1],[17,1]],
>>>>>>> Stashed changes
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 console.log($$[$0-1]); this.$ = new Ast();  this.$.instrucciones = $$[$0-1]; return this.$; 
break;
case 2:
 this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 3:
 this.$= new Array(); this.$.push($$[$0]); 
break;
case 4: case 5: case 6:
 this.$ = $$[$0-1] 
break;
case 7: case 8:
 this.$ = $$[$0] 
break;
case 9:
 this.$ = new Declaracion($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].last_column,$$[$0]); 
break;
case 10:
<<<<<<< Updated upstream
 this.$ = $$[$0-2]; this.$.push(new Simbolo($$[$0],null,null,_$[$0-2].first_line, _$[$0-2].first_column,null)); 
=======
 this.$ = $$[$0-4]; this.$.push(new Simbolo($$[$0-2],null,null,_$[$0-4].first_line, _$[$0-4].first_column,$$[$0])); 
>>>>>>> Stashed changes
break;
case 11:
 this.$ = $$[$0-4]; this.$.push(new Simbolo($$[$0-2],null,null,_$[$0-4].first_line, _$[$0-4].first_column,null)); 
break;
case 12:
 this.$ = new Array(); this.$.push(new Simbolo($$[$0],null,null,_$[$0].first_line, _$[$0].first_column,null)); 
break;
case 13:
 this.$ = new Array(); this.$.push(new Simbolo($$[$0-2],null,null,_$[$0-2].first_line, _$[$0-2].first_column,$$[$0])); 
break;
case 14:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column, false); 
break;
case 15:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column, true); 
break;
case 16:
 this.$ = new If($$[$0-4], $$[$0-1], null, _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 17:
 this.$ = new If($$[$0-8], $$[$0-5], $$[$0-1], _$[$0-10].first_line, _$[$0-10].first_column); 
break;
case 18:
 this.$ = new If($$[$0-6], $$[$0-3], [$$[$0]], _$[$0-8].first_line, _$[$0-8].first_column); 
break;
case 19:
 this.$ = new Ifsinllave($$[$0-2], $$[$0], null, _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 20:
 this.$ = new Ifsinllave($$[$0-4], $$[$0-2], $$[$0], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 21:
 this.$ = new Ifsinllave($$[$0-4], $$[$0-2], [$$[$0]], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 22:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 23:
 this.$ = new Array(); this.$.push($$[$0]);
break;
case 24:
 this.$ = TIPO.ENTERO; 
break;
case 25:
 this.$ = TIPO.DECIMAL; 
break;
case 26:
 this.$ = TIPO.CADENA; 
break;
case 27:
 this.$ = TIPO.CHARACTER; 
break;
case 28:
 this.$ = TIPO.BOOLEANO; 
break;
case 29:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MAS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 30:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MENOS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 31:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POR,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 32:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.DIV,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 33:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MOD,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 34:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POT,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 35:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.AMPERSON,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 36:
 this.$ = new Aritmetica($$[$0],OperadorAritmetico.UMENOS,$$[$0], _$[$0-1].first_line, _$[$0-1].first_column, true); 
break;
case 37:
 this.$ = $$[$0-1]; 
break;
case 38:
 this.$ = new Logica($$[$0-2], OperadorLogico.AND, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 39:
 this.$ = new Logica($$[$0-2], OperadorLogico.OR, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 40:
 this.$ = new Logica($$[$0], OperadorLogico.NOT, null, $$[$0-1].first_line, $$[$0-1].last_column, true); 
break;
case 41:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 42:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 43:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 44:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 45:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.IGUALIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 46:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.DIFERENTE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 47:
 this.$ = new Primitivo(Number($$[$0]), TIPO.ENTERO, _$[$0].first_line, _$[$0].first_column); 
break;
case 48:
 this.$ = new Primitivo(Number($$[$0]), TIPO.DECIMAL, _$[$0].first_line, _$[$0].first_column); 
break;
case 49:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CADENA, _$[$0].first_line, _$[$0].first_column); 
break;
case 50:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CHARACTER, _$[$0].first_line, _$[$0].first_column); 
break;
case 51:
 this.$ = new Primitivo(null, TIPO.NULO, _$[$0].first_line, _$[$0].first_column); 
break;
case 52:
 this.$ = new Primitivo(true, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 53:
 this.$ = new Primitivo(false, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 54:
 this.$ = new Identificador($$[$0] , _$[$0].first_line, _$[$0].last_column); 
break;
}
},
<<<<<<< Updated upstream
table: [{3:1,4:2,6:3,7:4,9:5,10:6,11:7,12:8,13:11,19:$V0,23:$V1,24:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},{1:[3]},{5:[1,18],6:19,7:4,9:5,10:6,11:7,12:8,13:11,19:$V0,23:$V1,24:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},o($V8,[2,3]),{8:[1,20]},{8:[1,21]},{8:[1,22]},o($V9,[2,7]),o($V9,[2,8]),{20:[1,23]},{20:[1,24]},{14:25,16:[1,26]},{20:[1,27]},{16:[2,24]},{16:[2,25]},{16:[2,26]},{16:[2,27]},{16:[2,28]},{1:[2,1]},o($V8,[2,2]),o($V9,[2,4]),o($V9,[2,5]),o($V9,[2,6]),{16:$Va,20:$Vb,21:28,25:29,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,21:41,25:29,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{8:[2,9],15:[1,42]},o($Vl,[2,12],{17:[1,43]}),{16:$Va,20:$Vb,25:44,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{15:$Vm,22:[1,45]},o($Vn,[2,23],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,41:$Vv,42:$Vw,44:$Vx,45:$Vy,46:$Vz,47:$VA,48:$VB,49:$VC}),{16:$Va,20:$Vb,25:62,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:63,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:64,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},o($VD,[2,47]),o($VD,[2,48]),o($VD,[2,49]),o($VD,[2,50]),o($VD,[2,51]),o($VD,[2,52]),o($VD,[2,53]),o($VD,[2,54]),{15:$Vm,22:[1,65]},{16:[1,66]},{18:[1,67]},{22:[1,68],34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,41:$Vv,42:$Vw,44:$Vx,45:$Vy,46:$Vz,47:$VA,48:$VB,49:$VC},{8:[2,14]},{16:$Va,20:$Vb,25:69,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:70,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:71,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:72,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:73,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:74,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:75,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:76,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:77,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:78,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:79,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:80,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:81,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:82,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:83,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},{16:$Va,20:$Vb,25:84,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},o($VD,[2,36]),{22:[1,85],34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,41:$Vv,42:$Vw,44:$Vx,45:$Vy,46:$Vz,47:$VA,48:$VB,49:$VC},o($VE,[2,40],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,44:$Vx,45:$Vy,46:$Vz,47:$VA,48:$VB,49:$VC}),{8:[2,15]},o($Vl,[2,10],{17:[1,86]}),o($Vl,[2,13]),{6:88,7:4,9:5,10:6,11:7,12:8,13:11,19:$V0,23:$V1,24:$V2,26:$VF,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},o($Vn,[2,22],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,41:$Vv,42:$Vw,44:$Vx,45:$Vy,46:$Vz,47:$VA,48:$VB,49:$VC}),o($VG,[2,29],{36:$Vq,37:$Vr,38:$Vs,39:$Vt}),o($VG,[2,30],{36:$Vq,37:$Vr,38:$Vs,39:$Vt}),o($VH,[2,31],{39:$Vt}),o($VH,[2,32],{39:$Vt}),o($VH,[2,33],{39:$Vt}),o($VD,[2,34]),o($VG,[2,35],{36:$Vq,37:$Vr,38:$Vs,39:$Vt}),o($VE,[2,38],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,44:$Vx,45:$Vy,46:$Vz,47:$VA,48:$VB,49:$VC}),o([15,22,42],[2,39],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,41:$Vv,44:$Vx,45:$Vy,46:$Vz,47:$VA,48:$VB,49:$VC}),o($VI,[2,41],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu}),o($VI,[2,42],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu}),o($VI,[2,43],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu}),o($VI,[2,44],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu}),o($VJ,[2,45],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,44:$Vx,45:$Vy,46:$Vz,47:$VA}),o($VJ,[2,46],{34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,44:$Vx,45:$Vy,46:$Vz,47:$VA}),o($VD,[2,37]),{18:[1,89]},{4:90,6:3,7:4,9:5,10:6,11:7,12:8,13:11,19:$V0,23:$V1,24:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},o($V8,[2,19],{28:[1,91]}),o($Vl,[2,11]),{6:19,7:4,9:5,10:6,11:7,12:8,13:11,19:$V0,23:$V1,24:$V2,27:[1,92],29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},{6:93,7:4,9:5,10:6,11:7,12:94,13:11,19:$V0,23:$V1,24:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},o($V8,[2,16],{28:[1,95]}),o($V9,[2,20]),o($V9,[2,21]),{11:97,24:[1,98],26:[1,96]},{4:99,6:3,7:4,9:5,10:6,11:7,12:8,13:11,19:$V0,23:$V1,24:$V2,29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},o($V9,[2,18]),{20:[1,100]},{6:19,7:4,9:5,10:6,11:7,12:8,13:11,19:$V0,23:$V1,24:$V2,27:[1,101],29:$V3,30:$V4,31:$V5,32:$V6,33:$V7},{16:$Va,20:$Vb,25:102,35:$Vc,43:$Vd,50:$Ve,51:$Vf,52:$Vg,53:$Vh,54:$Vi,55:$Vj,56:$Vk},o($V9,[2,17]),{22:[1,103],34:$Vo,35:$Vp,36:$Vq,37:$Vr,38:$Vs,39:$Vt,40:$Vu,41:$Vv,42:$Vw,44:$Vx,45:$Vy,46:$Vz,47:$VA,48:$VB,49:$VC},{26:$VF}],
defaultActions: {13:[2,24],14:[2,25],15:[2,26],16:[2,27],17:[2,28],18:[2,1],45:[2,14],65:[2,15]},
=======
table: [{3:1,4:2,6:3,7:4,9:5,10:6,11:7,12:10,18:$V0,22:$V1,23:$V2,27:$V3,28:$V4,29:$V5,30:$V6,31:$V7},{1:[3]},{5:[1,17],6:18,7:4,9:5,10:6,11:7,12:10,18:$V0,22:$V1,23:$V2,27:$V3,28:$V4,29:$V5,30:$V6,31:$V7},o($V8,[2,3]),{8:[1,19]},{8:[1,20]},o($V8,[2,6]),o($V8,[2,7]),{19:[1,21]},{19:[1,22]},{13:23,15:[1,24]},{19:[1,25]},{15:[2,19]},{15:[2,20]},{15:[2,21]},{15:[2,22]},{15:[2,23]},{1:[2,1]},o($V8,[2,2]),o($V8,[2,4]),o($V8,[2,5]),{15:$V9,17:27,19:$Va,20:26,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:27,19:$Va,20:39,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{8:[1,40],14:[1,41]},o($Vk,[2,11],{16:[1,42]}),{15:$V9,17:43,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{14:$Vl,21:[1,44]},o($Vm,[2,18],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,42:$Vw,43:$Vx,44:$Vy,45:$Vz,46:$VA,47:$VB}),{15:$V9,17:61,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:62,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:63,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},o($VC,[2,42]),o($VC,[2,43]),o($VC,[2,44]),o($VC,[2,45]),o($VC,[2,46]),o($VC,[2,47]),o($VC,[2,48]),o($VC,[2,49]),{14:$Vl,21:[1,64]},o($V8,[2,8]),{15:[1,65]},{15:$V9,17:66,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{21:[1,67],32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,42:$Vw,43:$Vx,44:$Vy,45:$Vz,46:$VA,47:$VB},{8:[2,13]},{15:$V9,17:68,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:69,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:70,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:71,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:72,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:73,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:74,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:75,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:76,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:77,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:78,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:79,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:80,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:81,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:82,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{15:$V9,17:83,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},o($VC,[2,31]),{21:[1,84],32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,42:$Vw,43:$Vx,44:$Vy,45:$Vz,46:$VA,47:$VB},o($VD,[2,35],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,42:$Vw,43:$Vx,44:$Vy,45:$Vz,46:$VA,47:$VB}),{8:[2,14]},o($Vk,[2,9],{16:[1,85]}),o($Vk,[2,12],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,42:$Vw,43:$Vx,44:$Vy,45:$Vz,46:$VA,47:$VB}),{24:[1,86]},o($Vm,[2,17],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,42:$Vw,43:$Vx,44:$Vy,45:$Vz,46:$VA,47:$VB}),o($VE,[2,24],{34:$Vp,35:$Vq,36:$Vr,37:$Vs}),o($VE,[2,25],{34:$Vp,35:$Vq,36:$Vr,37:$Vs}),o($VF,[2,26],{37:$Vs}),o($VF,[2,27],{37:$Vs}),o($VF,[2,28],{37:$Vs}),o($VC,[2,29]),o($VE,[2,30],{34:$Vp,35:$Vq,36:$Vr,37:$Vs}),o($VD,[2,33],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,42:$Vw,43:$Vx,44:$Vy,45:$Vz,46:$VA,47:$VB}),o([8,14,21,40],[2,34],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,42:$Vw,43:$Vx,44:$Vy,45:$Vz,46:$VA,47:$VB}),o($VG,[2,36],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt}),o($VG,[2,37],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt}),o($VG,[2,38],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt}),o($VG,[2,39],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt}),o($VH,[2,40],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,42:$Vw,43:$Vx,44:$Vy,45:$Vz}),o($VH,[2,41],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,42:$Vw,43:$Vx,44:$Vy,45:$Vz}),o($VC,[2,32]),{15:$V9,17:87,19:$Va,33:$Vb,41:$Vc,48:$Vd,49:$Ve,50:$Vf,51:$Vg,52:$Vh,53:$Vi,54:$Vj},{4:88,6:3,7:4,9:5,10:6,11:7,12:10,18:$V0,22:$V1,23:$V2,27:$V3,28:$V4,29:$V5,30:$V6,31:$V7},o($Vk,[2,10],{32:$Vn,33:$Vo,34:$Vp,35:$Vq,36:$Vr,37:$Vs,38:$Vt,39:$Vu,40:$Vv,42:$Vw,43:$Vx,44:$Vy,45:$Vz,46:$VA,47:$VB}),{6:18,7:4,9:5,10:6,11:7,12:10,18:$V0,22:$V1,23:$V2,25:[1,89],27:$V3,28:$V4,29:$V5,30:$V6,31:$V7},o($V8,[2,15],{26:[1,90]}),{24:[1,91]},{4:92,6:3,7:4,9:5,10:6,11:7,12:10,18:$V0,22:$V1,23:$V2,27:$V3,28:$V4,29:$V5,30:$V6,31:$V7},{6:18,7:4,9:5,10:6,11:7,12:10,18:$V0,22:$V1,23:$V2,25:[1,93],27:$V3,28:$V4,29:$V5,30:$V6,31:$V7},o($V8,[2,16])],
defaultActions: {12:[2,19],13:[2,20],14:[2,21],15:[2,22],16:[2,23],17:[2,1],44:[2,13],64:[2,14]},
>>>>>>> Stashed changes
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


    /*::::::::::::::::::     AST      ::::::::::::::::::*/
    const { Ast } = require("../dist/Ast/Ast");

    /*::::::::::::::::::     ENUMs      ::::::::::::::::::*/
    const { TIPO, OperadorAritmetico, OperadorLogico, OperadorRelacional } = require("../dist/TablaSimbolos/Tipo");
    /*::::::::::::::::::     Expresiones      ::::::::::::::::::*/
    const { Primitivo } = require("../dist/Expresiones/Primitivo");
    const { Identificador } = require("../dist/Expresiones/Identificador");
    /*..............     Operaciones      ...............*/
    const { Aritmetica } = require("../dist/Expresiones/Operaciones/Aritmeticas");
    const { Logica } = require("../dist/Expresiones/Operaciones/Logicas");
    const { Relacional } = require("../dist/Expresiones/Operaciones/Relacionales");

    /*::::::::::::::::::     Instrucciones      ::::::::::::::::::*/
    const { Print } = require("../dist/Instrucciones/Print");
    /*..............     Condicionales      ...............*/
    const { If } = require("../dist/Instrucciones/Condicionales/If");
    const { Ifsinllave } = require("../dist/Instrucciones/Condicionales/Ifsinllave");
    /*..............     DECLARACION Y ASIGNACION      ...............*/
    const { Declaracion } = require("../dist/Instrucciones/Declaracion");
    const { Simbolo } = require("../dist/TablaSimbolos/Simbolo");

/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip comments */
break;
case 1:this.begin('comment');
break;
case 2:this.popState();
break;
case 3:/* skip comment content*/
break;
case 4:/* skip whitespace */
break;
case 5: return 19 
break;
case 6: return 23 
break;
case 7: return 24 
break;
<<<<<<< Updated upstream
case 8: return 28 
break;
case 9: return 54 
break;
case 10: return 55 
break;
case 11: return 56 
break;
case 12: return 29 
break;
case 13: return 30 
break;
case 14: return 33 
break;
case 15: return 32 
break;
case 16: return 31 
break;
case 17: return 34 
break;
case 18: return 35 
break;
case 19: return 36 
break;
case 20: return 37 
break;
case 21: return 38 
break;
case 22: return 39 
break;
case 23: return 45 
break;
case 24: return 46 
break;
case 25: return 47 
break;
case 26: return 44 
break;
case 27: return 49 
break;
case 28: return 48 
=======
case 8: return 26 
break;
case 9: return 52 
break;
case 10: return 53 
break;
case 11: return 54 
break;
case 12: return 27 
break;
case 13: return 28 
break;
case 14: return 31 
break;
case 15: return 30 
break;
case 16: return 29 
break;
case 17: return 32 
break;
case 18: return 33 
break;
case 19: return 34 
break;
case 20: return 35 
break;
case 21: return 36 
break;
case 22: return 37 
break;
case 23: return 43 
break;
case 24: return 44 
break;
case 25: return 45 
break;
case 26: return 42 
break;
case 27: return 47 
break;
case 28: return 46 
>>>>>>> Stashed changes
break;
case 29: return 17 
break;
<<<<<<< Updated upstream
case 30: return 41 
break;
case 31: return 42 
break;
case 32: return 43 
break;
case 33: return 40 
=======
case 30: return 39 
break;
case 31: return 40 
break;
case 32: return 41 
break;
case 33: return 38 
>>>>>>> Stashed changes
break;
case 34: return 'INCRE'
break;
case 35: return 'DECRE'
break;
case 36: return 20 
break;
case 37: return 22 
break;
case 38: return 'CORA' 
break;
case 39: return 'CORC' 
break;
<<<<<<< Updated upstream
case 40: return 26 
break;
case 41: return 27 
=======
case 40: return 24 
break;
case 41: return 25 
>>>>>>> Stashed changes
break;
case 42: return 'PUNTO' 
break;
case 43: return 8 
break;
case 44: return 15 
break;
case 45: return 'INTERROGACION' 
break;
case 46: return 'DOSPUNTOS' 
break;
<<<<<<< Updated upstream
case 47:return 51;
break;
case 48:return 50;
=======
case 47:return 49;
break;
case 48:return 48;
>>>>>>> Stashed changes
break;
case 49:return 16;
break;
<<<<<<< Updated upstream
case 50:return 52;
break;
case 51:return 53;
=======
case 50:return 50;
break;
case 51:return 51;
>>>>>>> Stashed changes
break;
case 52:
                                        console.error('Este es un error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column);
                                    
break;
case 53:/* skip whitespace */
break;
case 54:return 5
break;
}
},
rules: [/^(?:\/\/.*)/i,/^(?:\/\*)/i,/^(?:\*\/)/i,/^(?:.)/i,/^(?:\s+)/i,/^(?:print\b)/i,/^(?:println\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:null\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:boolean\b)/i,/^(?:char\b)/i,/^(?:String\b)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:\^)/i,/^(?:>=)/i,/^(?:<=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:!=)/i,/^(?:==)/i,/^(?:=)/i,/^(?:&&)/i,/^(?:\|\|)/i,/^(?:!)/i,/^(?:&)/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\.)/i,/^(?:;)/i,/^(?:,)/i,/^(?:\?)/i,/^(?::)/i,/^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/i,/^(?:[0-9]+)/i,/^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ]*)/i,/^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/i,/^(?:('((\\([\'\"\\bfnrtv]))|([^\'\\]))'))/i,/^(?:.)/i,/^(?:[\r\n\t])/i,/^(?:$)/i],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = gramatica;
exports.Parser = gramatica.Parser;
exports.parse = function () { return gramatica.parse.apply(gramatica, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../dist/Ast/Ast":5,"../dist/Expresiones/Identificador":8,"../dist/Expresiones/Operaciones/Aritmeticas":9,"../dist/Expresiones/Operaciones/Logicas":10,"../dist/Expresiones/Operaciones/Relacionales":11,"../dist/Expresiones/Primitivo":12,"../dist/Instrucciones/Condicionales/If":13,"../dist/Instrucciones/Condicionales/Ifsinllave":14,"../dist/Instrucciones/Declaracion":15,"../dist/Instrucciones/Print":16,"../dist/TablaSimbolos/Simbolo":20,"../dist/TablaSimbolos/Tipo":22,"_process":3,"fs":1,"path":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
class Ast {
    constructor() {
        this.consola = "";
        this.TSglobal = null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno = "";
        this.instrucciones = new Array();
        this.funciones = new Array();
        this.structs = new Array();
        this.Errores = new Array();
        this.consola = "";
        this.TSglobal = null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno = "";
    }
    // public ejecutar(table: TablaSimbolos, tree: Ast){
    //     // 1ERA PASADA: 
    //     // GUARDAR FUNCIONES  Y METODOS
    //     // for( let instr of this.instrucciones){
    //     // }
    //     // 2DA PASADA
    //     // EJECUTAMOS TODAS LAS FUNCIONES
    //     this.instrucciones.forEach(instruccion => {
    //         instruccion.ejecutar(table, tree);
    //     });
    // }
    getInstrucciones() {
        return this.instrucciones;
    }
    setInstrucciones(instrucciones) {
        this.instrucciones = instrucciones;
    }
    getErrores() {
        return this.Errores;
    }
    setErrores(excepciones) {
        this.Errores = excepciones;
    }
    addError(error) {
        this.Errores.concat(error);
        // this.updateConsola(error.toString());
    }
    getConsola() {
        return this.consola;
    }
    setConsola(consola) {
        this.consola = consola;
    }
    updateConsolaPrintln(cadena) {
        // console.log("cad println: " + cadena);
        this.consola += cadena + '\n';
    }
    updateConsolaPrint(cadena) {
        // console.log("cad print: " + cadena);
        this.consola += cadena;
    }
    getTSGlobal() {
        return this.TSglobal;
    }
    setTSGlobal(TSglobal) {
        this.TSglobal = TSglobal;
    }
    getFunction(name) {
        this.funciones.forEach(function (func) {
            // console.log(func);
            if (func.name == name) {
                return func;
            }
        });
        return null;
    }
    addFunction(funcion) {
        this.funciones.concat(funcion);
    }
    getStruct(name) {
        this.structs.forEach(struct => {
            if (struct.id = name) {
                return struct;
            }
        });
        return null;
    }
    addStruct(struct) {
        this.structs.concat(struct);
    }
}
exports.Ast = Ast;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errores = void 0;
class Errores {
    constructor(tipo, descripcion, fila, columna) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }
}
exports.Errores = Errores;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodo = void 0;
class Nodo {
    constructor(token, lexema) {
        this.token = token;
        this.lexema = lexema;
        this.hijos = new Array();
    }
    /**
     * @method setChilds agregar listado de hijos
     * @param hijos
     */
    setChilds(hijos) {
        this.hijos = hijos;
    }
    /**
     * @function getChilds retorna array de childs
     * @returns retorna array de nodos
     */
    getChilds() {
        return this.hijos;
    }
    /**
     * @method addChildNode agregar Hijo
     * @param nuevo Nodo
     */
    addChildNode(nuevo) {
        this.hijos.push(nuevo);
    }
    /**
     * @function getValor retorna el nombre del token
     * @returns retorna el token
     */
    getValor() {
        return this.lexema;
    }
    /**
     * @function setValor retorna el nombre del token
     * @returns retorna el token
     */
    setValor(valor) {
        this.lexema = valor;
    }
    /**
     * @function getToken retorna el nombre del token
     * @returns retorna el token
     */
    getToken() {
        return this.token;
    }
    /**
     * @function GraficarSintactico Hace la estructura de la grafica
     * @returns retorna la cadena total de la grafica
     */
    GraficarSintactico() {
        let grafica = `digraph {\n\n${this.GraficarNodos(this, "0")} \n\n}`;
        return grafica;
    }
    /**
     * @function GraficarNodos
     * @param nodo nodo posicion actual
     * @param i id nodo a graficar
     * @returns retorna string de nodos
     */
    GraficarNodos(nodo, i) {
        let k = 0;
        let r = "";
        let nodoTerm = nodo.token;
        nodoTerm = nodoTerm.replace("\"", "");
        r = `node${i}[label = \"${nodoTerm}\"];\n`;
        for (let j = 0; j <= nodo.hijos.length - 1; j++) {
            r = `${r}node${i} -> node${i}${k}\n`;
            r = r + this.GraficarNodos(nodo.hijos[j], "" + i + k);
            k = k + 1;
        }
        if (!(nodo.lexema.match('')) || !(nodo.lexema.match(""))) {
            let nodoToken = nodo.lexema;
            nodoToken = nodoToken.replace("\"", "");
            r = r + `node${i}c[label = \"${nodoToken}\"];\n`;
            r = r + `node${i} -> node${i}c\n`;
        }
        return r;
    }
}
exports.Nodo = Nodo;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identificador = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
class Identificador {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
        this.tipo = null;
    }
    ejecutar(table, tree) {
        console.log("prooobleeemas");
        console.log(table.existeEnActual(this.id));
        this.symbol = table.getSymbolTabla(this.id);
        if (this.symbol == null) {
            return new Errores_1.Errores("Semantico", "Variable " + this.id + " NO coincide con la busqueda", this.fila, this.columna);
        }
        this.tipo = this.symbol.getTipo();
        return this.symbol.getValor();
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("IDENTIFICADOR", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id.toString(), ""));
        return padre;
    }
}
exports.Identificador = Identificador;

},{"../Ast/Errores":6,"../Ast/Nodo":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Aritmetica {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = null;
    }
    ejecutar(table, tree) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipoGeneral;
        if (this.expU == false) {
            valor_exp1 = this.exp1.ejecutar(tree, table);
            valor_exp2 = this.exp2.ejecutar(tree, table);
            tipoGeneral = this.getTipoMax(this.exp1.tipo, this.exp2.tipo);
        }
        else {
            valor_expU = this.exp1.ejecutar(tree, table);
        }
        /**
         * Para las siguientes validaciones nos basamos en la tabla de
         * de las operaciones aritmeticas permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case Tipo_1.OperadorAritmetico.MAS:
                if (tipoGeneral == Tipo_1.TIPO.CADENA) {
                    // this.tipo = TIPO.CADENA;
                    // return valor_exp1.toString() + valor_exp2.toString();
                    return new Errores_1.Errores("Semantico", "Suma - Error de tipos STRING, no concatenable", this.fila, this.columna);
                }
                else if (tipoGeneral == Tipo_1.TIPO.BOOLEANO) {
                    return new Errores_1.Errores("Semantico", "Suma - Error de tipo booleano", this.fila, this.columna);
                }
                else if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) + valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) + valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 + valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) + valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "Suma - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 + valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 + valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "Suma - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.UMENOS:
                if (this.exp1.tipo == Tipo_1.TIPO.ENTERO || this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                    return -valor_expU;
                }
                else {
                    return new Errores_1.Errores("Semantico", "UNARIO - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.MENOS:
                if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) - valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) - valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 - valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) - valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "Resta - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 - valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 - valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "Resta - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.POR:
                if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) * valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) * valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 * valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) * valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "POR - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 * valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 * valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "POR - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.DIV:
                if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) / valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) / valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 / valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) / valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "DIV - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 / valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 / valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "DIV - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.MOD:
                if (tipoGeneral == Tipo_1.TIPO.CHARACTER) {
                    if (this.exp1.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) % valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1 % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.DECIMAL) {
                        this.tipo = Tipo_1.TIPO.DECIMAL;
                        return valor_exp1.charCodeAt(0) % valor_exp2;
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER && this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp1.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1 % valor_exp2.charCodeAt(0);
                    }
                    else if (this.exp2.tipo == Tipo_1.TIPO.CHARACTER) {
                        this.tipo = Tipo_1.TIPO.ENTERO;
                        return valor_exp1.charCodeAt(0) % valor_exp2;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "MOD - Error de tipo ", this.fila, this.columna);
                    }
                }
                else if (tipoGeneral == Tipo_1.TIPO.DECIMAL) {
                    this.tipo = Tipo_1.TIPO.DECIMAL;
                    return valor_exp1 % valor_exp2;
                }
                else if (tipoGeneral == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.ENTERO;
                    return valor_exp1 % valor_exp2;
                }
                else {
                    return new Errores_1.Errores("Semantico", "MOD - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.POT:
                if (this.exp1.tipo == Tipo_1.TIPO.CADENA && this.exp2.tipo == Tipo_1.TIPO.ENTERO) {
                    this.tipo = Tipo_1.TIPO.CADENA;
                    return valor_exp1.toString().repeat(valor_exp2);
                }
                else {
                    return new Errores_1.Errores("Semantico", "POTENCIA - Error de tipo ", this.fila, this.columna);
                }
                break;
            case Tipo_1.OperadorAritmetico.AMPERSON:
                if (this.exp1.tipo == Tipo_1.TIPO.CADENA && this.exp2.tipo == Tipo_1.TIPO.CADENA) {
                    this.tipo = Tipo_1.TIPO.CADENA;
                    return valor_exp1.toString() + valor_exp2.toString();
                }
                else {
                    return new Errores_1.Errores("Semantico", "Concatenacion - Error de tipo ", this.fila, this.columna);
                }
                // if(typeof valor_exp1 === 'number'){
                //     if(typeof valor_exp2 === 'number'){
                //         return Math.pow(valor_exp1, valor_exp2);
                //     }
                // }
                break;
            //TODO: Agregar otros casos de aritmeticas (POTENCIA, MODULO)
            default:
                //TODO: agregar errror que ser produjo algo inesperado.
                break;
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    getTipo(ts, ast) {
        let valor = this.ejecutar(ts, ast);
        if (typeof valor === 'number') {
            return Tipo_1.TIPO.DECIMAL;
        }
        else if (typeof valor === 'string') {
            return Tipo_1.TIPO.CADENA;
        }
        else if (typeof valor === 'boolean') {
            return Tipo_1.TIPO.BOOLEANO;
        }
    }
    getTipoMax(tipoIzq, tipoDer) {
        if (tipoIzq == Tipo_1.TIPO.NULO || tipoDer == Tipo_1.TIPO.NULO) {
            return Tipo_1.TIPO.NULO;
        }
        if (tipoIzq == Tipo_1.TIPO.CADENA || tipoDer == Tipo_1.TIPO.CADENA) {
            return Tipo_1.TIPO.CADENA;
        }
        if (tipoIzq == Tipo_1.TIPO.CHARACTER || tipoDer == Tipo_1.TIPO.CHARACTER) {
            return Tipo_1.TIPO.CADENA;
        }
        if (tipoIzq == Tipo_1.TIPO.BOOLEANO || tipoDer == Tipo_1.TIPO.BOOLEANO) {
            return Tipo_1.TIPO.BOOLEANO;
        }
        if (tipoIzq == Tipo_1.TIPO.DECIMAL || tipoDer == Tipo_1.TIPO.DECIMAL) {
            return Tipo_1.TIPO.DECIMAL;
        }
        if (tipoIzq == Tipo_1.TIPO.ENTERO || tipoDer == Tipo_1.TIPO.ENTERO) {
            return Tipo_1.TIPO.ENTERO;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Exp. Aritmetica", "");
        if (this.expU) {
            padre.addChildNode(new Nodo_1.Nodo(this.operador.toString(), ""));
            padre.addChildNode(this.exp1.recorrer());
        }
        else {
            padre.addChildNode(this.exp1.recorrer());
            padre.addChildNode(new Nodo_1.Nodo(this.operador.toString(), ""));
            padre.addChildNode(this.exp2.recorrer());
        }
        return padre;
    }
    getValor(tipo, valor) {
        // if (tipo == TIPO.ENTERO){
        //     return valor.valueOf()
        // }
        // else if (tipo == TIPO.DECIMAL){
        //     return valor.valueOf()
        // }
        // else if (tipo == TIPO.BOOLEANO){
        //     return bool(valor)
        // }
        // else if (tipo == TIPO.CHARACTER){
        //     return str(valor)
        // }
        // else if (tipo == TIPO.CADENA){
        //     return str(valor)
        // }
    }
}
exports.Aritmetica = Aritmetica;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":22}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logica = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Errores_1 = require("../../Ast/Errores");
class Logica {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = null;
    }
    ejecutar(table, tree) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipoGeneral;
        if (this.expU == false) {
            valor_exp1 = this.exp1.ejecutar(table, tree);
            valor_exp2 = this.exp2.ejecutar(table, tree);
            tipoGeneral = this.getTipoMax(this.exp1.tipo, this.exp2.tipo);
        }
        else {
            valor_expU = this.exp1.ejecutar(table, tree);
        }
        /**
         * Para las siguientes validaciones nos basamos en la tabla de
         * de las operaciones Logicas permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case Tipo_1.OperadorLogico.AND:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        this.tipo = Tipo_1.TIPO.BOOLEANO;
                        return valor_exp1 && valor_exp2;
                    }
                    else {
                        // ERROR SEMANTICO
                        return new Errores_1.Errores("Semantico", "Logica -AND- Los tipos no coinciden ", this.fila, this.columna);
                    }
                }
                break;
            case Tipo_1.OperadorLogico.OR:
                if (typeof valor_exp1 == 'boolean') {
                    if (typeof valor_exp2 == 'boolean') {
                        this.tipo = Tipo_1.TIPO.BOOLEANO;
                        return valor_exp1 || valor_exp2;
                    }
                    else {
                        // ERROR SEMANTICO
                        return new Errores_1.Errores("Semantico", "Logica -OR- Los tipos no coinciden ", this.fila, this.columna);
                    }
                }
                break;
            case Tipo_1.OperadorLogico.NOT:
                if (typeof valor_expU == 'boolean') {
                    this.tipo = Tipo_1.TIPO.BOOLEANO;
                    return !valor_expU;
                }
                else {
                    //TODO: Error
                    return new Errores_1.Errores("Semantico", "Logica -NOT- El tipo no coincide ", this.fila, this.columna);
                }
            // TODO: Agregar caso para logica OR. 
            default:
                break;
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    getTipo(table, tree) {
        let valor = this.ejecutar(table, tree);
        if (typeof valor === 'number') {
            return Tipo_1.TIPO.DECIMAL;
        }
        else if (typeof valor === 'string') {
            return Tipo_1.TIPO.CADENA;
        }
        else if (typeof valor === 'boolean') {
            return Tipo_1.TIPO.BOOLEANO;
        }
    }
    getTipoMax(tipoIzq, tipoDer) {
        if (tipoIzq == Tipo_1.TIPO.NULO || tipoDer == Tipo_1.TIPO.NULO) {
            return Tipo_1.TIPO.NULO;
        }
        if (tipoIzq == Tipo_1.TIPO.CADENA || tipoDer == Tipo_1.TIPO.CADENA) {
            return Tipo_1.TIPO.CADENA;
        }
        if (tipoIzq == Tipo_1.TIPO.CHARACTER || tipoDer == Tipo_1.TIPO.CHARACTER) {
            return Tipo_1.TIPO.CADENA;
        }
        if (tipoIzq == Tipo_1.TIPO.BOOLEANO || tipoDer == Tipo_1.TIPO.BOOLEANO) {
            return Tipo_1.TIPO.BOOLEANO;
        }
        if (tipoIzq == Tipo_1.TIPO.DECIMAL || tipoDer == Tipo_1.TIPO.DECIMAL) {
            return Tipo_1.TIPO.DECIMAL;
        }
        if (tipoIzq == Tipo_1.TIPO.ENTERO || tipoDer == Tipo_1.TIPO.ENTERO) {
            return Tipo_1.TIPO.ENTERO;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Exp. Logica", "");
        if (this.expU) {
            padre.addChildNode(new Nodo_1.Nodo(this.operador, ""));
            padre.addChildNode(this.exp1.recorrer());
        }
        else {
            padre.addChildNode(this.exp1.recorrer());
            padre.addChildNode(new Nodo_1.Nodo(this.operador, ""));
            padre.addChildNode(this.exp2.recorrer());
        }
        return padre;
    }
}
exports.Logica = Logica;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":22}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relacional = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Relacional {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = Tipo_1.TIPO.BOOLEANO;
    }
    ejecutar(table, tree) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipoGeneral;
        if (this.expU == false) {
            valor_exp1 = this.exp1.ejecutar(table, tree);
            valor_exp2 = this.exp2.ejecutar(table, tree);
            tipoGeneral = this.getTipoMax(this.exp1.tipo, this.exp2.tipo);
        }
        else {
            valor_expU = this.exp1.ejecutar(table, tree);
        }
        /**
         * Para las siguientes validaciones nos basamos en la tabla de
         * de las operaciones relacionales permitidas que soporta el lenguaje descrito en el enunciado.
         */
        switch (this.operador) {
            case Tipo_1.OperadorRelacional.IGUALIGUAL:
                return this.igualigual(valor_exp1, valor_exp2);
            case Tipo_1.OperadorRelacional.DIFERENTE:
                return this.diferente(valor_exp1, valor_exp2);
            case Tipo_1.OperadorRelacional.MENORQUE:
                return this.menorque(valor_exp1, valor_exp2);
            case Tipo_1.OperadorRelacional.MENORIGUAL:
                return this.menorigual(valor_exp1, valor_exp2);
            case Tipo_1.OperadorRelacional.MAYORQUE:
                return this.mayorque(valor_exp1, valor_exp2);
            case Tipo_1.OperadorRelacional.MAYORIGUAL:
                return this.mayoigual(valor_exp1, valor_exp2);
            default:
                break;
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    getTipo(table, tree) {
        let valor = this.ejecutar(table, tree);
        if (typeof valor === 'number') {
            return Tipo_1.TIPO.DECIMAL;
        }
        else if (typeof valor === 'string') {
            return Tipo_1.TIPO.CADENA;
        }
        else if (typeof valor === 'boolean') {
            return Tipo_1.TIPO.BOOLEANO;
        }
    }
    igualigual(valor_exp1, valor_exp2) {
        if (typeof valor_exp1 == 'number') {
            if (typeof valor_exp2 == 'number') {
                return valor_exp1 == valor_exp2;
            }
            else if (typeof valor_exp2 == 'boolean') {
                //Error Semantico
            }
            else if (typeof valor_exp2 == 'string') {
                //char
                if (valor_exp2.length == 1) {
                    let num = valor_exp2.charCodeAt(0);
                    return valor_exp1 == num;
                }
                else {
                    //String 
                    //Error semantico
                }
            }
        }
        else if (typeof valor_exp1 == 'boolean') {
            if (typeof valor_exp2 == 'number') {
                //Error semantico
            }
            else if (typeof valor_exp2 == 'boolean') {
                return valor_exp1 == valor_exp2;
            }
            else if (typeof valor_exp2 == 'string') {
                //Error semantico
            }
        }
        else if (typeof valor_exp1 == 'string') {
            if (valor_exp1.length == 1) {
                //char
                if (typeof valor_exp2 == 'number') {
                    let num = valor_exp1.charCodeAt(0);
                    return num == valor_exp2;
                }
                else if (typeof valor_exp2 == 'boolean') {
                    //Error semantico
                }
                else if (typeof valor_exp2 == 'string') {
                    return valor_exp1 == valor_exp2;
                }
            }
            else {
                //cadena
                if (typeof valor_exp2 == 'number') {
                    //error semantico
                }
                else if (typeof valor_exp2 == 'boolean') {
                    //Error semantico
                }
                else if (typeof valor_exp2 == 'string') {
                    return valor_exp1 == valor_exp2;
                }
            }
        }
    }
    diferente(valor_exp1, valor_exp2) {
        if (typeof valor_exp1 == 'number') {
            if (typeof valor_exp2 == 'number') {
                return valor_exp1 != valor_exp2;
            }
            else if (typeof valor_exp2 == 'boolean') {
                //Error Semantico
            }
            else if (typeof valor_exp2 == 'string') {
                //char
                if (valor_exp2.length == 1) {
                    let num = valor_exp2.charCodeAt(0);
                    return valor_exp1 != num;
                }
                else {
                    //String 
                    //Error semantico
                }
            }
        }
        else if (typeof valor_exp1 == 'boolean') {
            if (typeof valor_exp2 == 'number') {
                //Error semantico
            }
            else if (typeof valor_exp2 == 'boolean') {
                return valor_exp1 != valor_exp2;
            }
            else if (typeof valor_exp2 == 'string') {
                //Error semantico
            }
        }
        else if (typeof valor_exp1 == 'string') {
            if (valor_exp1.length == 1) {
                //char
                if (typeof valor_exp2 == 'number') {
                    let num = valor_exp1.charCodeAt(0);
                    return num != valor_exp2;
                }
                else if (typeof valor_exp2 == 'boolean') {
                    //Error semantico
                }
                else if (typeof valor_exp2 == 'string') {
                    return valor_exp1 != valor_exp2;
                }
            }
            else {
                //cadena
                if (typeof valor_exp2 == 'number') {
                    //error semantico
                }
                else if (typeof valor_exp2 == 'boolean') {
                    //Error semantico
                }
                else if (typeof valor_exp2 == 'string') {
                    return valor_exp1 != valor_exp2;
                }
            }
        }
    }
    menorque(valor_exp1, valor_exp2) {
        if (typeof valor_exp1 == 'number') {
            if (typeof valor_exp2 == 'number') {
                return valor_exp1 < valor_exp2;
            }
            else if (typeof valor_exp2 == 'boolean') {
                //Error semantico
            }
            else if (typeof valor_exp2 == 'string') {
                if (valor_exp2.length == 1) {
                    let num = valor_exp2.charCodeAt(0);
                    return valor_exp1 < num;
                }
                else {
                    // Error semantico 
                }
            }
        }
        else if (typeof valor_exp1 == 'boolean') {
            //Error semantico
        }
        else if (typeof valor_exp1 == 'string') {
            if (valor_exp1.length == 1) {
                if (typeof valor_exp2 == 'number') {
                    let num = valor_exp1.charCodeAt(0);
                    return num < valor_exp2;
                }
                else if (typeof valor_exp2 == 'boolean') {
                    //Error semantico
                }
                else if (typeof valor_exp2 == 'string') {
                    if (valor_exp2.length == 1) {
                        let num1 = valor_exp1.charCodeAt(0);
                        let num2 = valor_exp2.charCodeAt(0);
                        return num1 < num2;
                    }
                    else {
                        //Error semantico
                    }
                }
            }
            else {
                //cadena
                //error semantico
            }
        }
    }
    menorigual(valor_exp1, valor_exp2) {
        if (typeof valor_exp1 == 'number') {
            if (typeof valor_exp2 == 'number') {
                return valor_exp1 <= valor_exp2;
            }
            else if (typeof valor_exp2 == 'boolean') {
                //Error semantico
            }
            else if (typeof valor_exp2 == 'string') {
                if (valor_exp2.length == 1) {
                    let num = valor_exp2.charCodeAt(0);
                    return valor_exp1 <= num;
                }
                else {
                    // Error semantico 
                }
            }
        }
        else if (typeof valor_exp1 == 'boolean') {
            //Error semantico
        }
        else if (typeof valor_exp1 == 'string') {
            if (valor_exp1.length == 1) {
                if (typeof valor_exp2 == 'number') {
                    let num = valor_exp1.charCodeAt(0);
                    return num <= valor_exp2;
                }
                else if (typeof valor_exp2 == 'boolean') {
                    //Error semantico
                }
                else if (typeof valor_exp2 == 'string') {
                    if (valor_exp2.length == 1) {
                        let num1 = valor_exp1.charCodeAt(0);
                        let num2 = valor_exp2.charCodeAt(0);
                        return num1 <= num2;
                    }
                    else {
                        //Error semantico
                    }
                }
            }
            else {
                //cadena
                //error semantico
            }
        }
    }
    mayorque(valor_exp1, valor_exp2) {
        if (typeof valor_exp1 == 'number') {
            if (typeof valor_exp2 == 'number') {
                return valor_exp1 > valor_exp2;
            }
            else if (typeof valor_exp2 == 'boolean') {
                //Error semantico
            }
            else if (typeof valor_exp2 == 'string') {
                if (valor_exp2.length == 1) {
                    let num = valor_exp2.charCodeAt(0);
                    return valor_exp1 > num;
                }
                else {
                    // Error semantico 
                }
            }
        }
        else if (typeof valor_exp1 == 'boolean') {
            //Error semantico
        }
        else if (typeof valor_exp1 == 'string') {
            if (valor_exp1.length == 1) {
                if (typeof valor_exp2 == 'number') {
                    let num = valor_exp1.charCodeAt(0);
                    return num > valor_exp2;
                }
                else if (typeof valor_exp2 == 'boolean') {
                    //Error semantico
                }
                else if (typeof valor_exp2 == 'string') {
                    if (valor_exp2.length == 1) {
                        let num1 = valor_exp1.charCodeAt(0);
                        let num2 = valor_exp2.charCodeAt(0);
                        return num1 > num2;
                    }
                    else {
                        //Error semantico
                    }
                }
            }
            else {
                //cadena
                //error semantico
            }
        }
    }
    mayoigual(valor_exp1, valor_exp2) {
        if (typeof valor_exp1 == 'number') {
            if (typeof valor_exp2 == 'number') {
                return valor_exp1 >= valor_exp2;
            }
            else if (typeof valor_exp2 == 'boolean') {
                //Error semantico
            }
            else if (typeof valor_exp2 == 'string') {
                if (valor_exp2.length == 1) {
                    let num = valor_exp2.charCodeAt(0);
                    return valor_exp1 >= num;
                }
                else {
                    // Error semantico 
                }
            }
        }
        else if (typeof valor_exp1 == 'boolean') {
            //Error semantico
        }
        else if (typeof valor_exp1 == 'string') {
            if (valor_exp1.length == 1) {
                if (typeof valor_exp2 == 'number') {
                    let num = valor_exp1.charCodeAt(0);
                    return num >= valor_exp2;
                }
                else if (typeof valor_exp2 == 'boolean') {
                    //Error semantico
                }
                else if (typeof valor_exp2 == 'string') {
                    if (valor_exp2.length == 1) {
                        let num1 = valor_exp1.charCodeAt(0);
                        let num2 = valor_exp2.charCodeAt(0);
                        return num1 >= num2;
                    }
                    else {
                        //Error semantico
                    }
                }
            }
            else {
                //cadena
                //error semantico
            }
        }
    }
    getTipoMax(tipoIzq, tipoDer) {
        if (tipoIzq == Tipo_1.TIPO.NULO || tipoDer == Tipo_1.TIPO.NULO) {
            return Tipo_1.TIPO.NULO;
        }
        if (tipoIzq == Tipo_1.TIPO.CADENA || tipoDer == Tipo_1.TIPO.CADENA) {
            return Tipo_1.TIPO.CADENA;
        }
        if (tipoIzq == Tipo_1.TIPO.CHARACTER || tipoDer == Tipo_1.TIPO.CHARACTER) {
            return Tipo_1.TIPO.CADENA;
        }
        if (tipoIzq == Tipo_1.TIPO.BOOLEANO || tipoDer == Tipo_1.TIPO.BOOLEANO) {
            return Tipo_1.TIPO.BOOLEANO;
        }
        if (tipoIzq == Tipo_1.TIPO.DECIMAL || tipoDer == Tipo_1.TIPO.DECIMAL) {
            return Tipo_1.TIPO.DECIMAL;
        }
        if (tipoIzq == Tipo_1.TIPO.ENTERO || tipoDer == Tipo_1.TIPO.ENTERO) {
            return Tipo_1.TIPO.ENTERO;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Exp. Relacional", "");
        if (this.expU) {
            padre.addChildNode(new Nodo_1.Nodo(this.operador, ""));
            padre.addChildNode(this.exp1.recorrer());
        }
        else {
            padre.addChildNode(this.exp1.recorrer());
            padre.addChildNode(new Nodo_1.Nodo(this.operador, ""));
            padre.addChildNode(this.exp2.recorrer());
        }
        return padre;
    }
}
exports.Relacional = Relacional;

},{"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":22}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Nodo_1 = require("../Ast/Nodo");
class Primitivo {
    constructor(valor, tipo, fila, columna) {
        this.valor = valor;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        return this.valor;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("PRIMITIVO", "");
        padre.addChildNode(new Nodo_1.Nodo(this.valor.toString(), ""));
        return padre;
    }
}
exports.Primitivo = Primitivo;

},{"../Ast/Nodo":7}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const Tipo_1 = require("./../../TablaSimbolos/Tipo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
class If {
    constructor(condicion, lista_ifs, lista_elses, fila, columna) {
        this.condicion = condicion;
        this.lista_ifs = lista_ifs;
        this.lista_elses = lista_elses;
        this.columna = columna;
        this.fila = fila;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
            if (valor_condicion) {
                this.lista_ifs.forEach(ins => {
                    let res = ins.ejecutar(ts_local, tree);
                    //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                    if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return res;
                    }
                    else {
                        if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return ins;
                        }
                        else {
                            if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return ins;
                            }
                        }
                    }
                });
            }
            else {
                for (let ins of this.lista_elses) {
                    let res = ins.ejecutar(ts_local, tree);
                    //TODO verificar si res es de tipo CONTINUE, RETORNO 
                    if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return res;
                    }
                    else {
                        if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return ins;
                        }
                        else {
                            if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return ins;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
}
exports.If = If;

},{"../../TablaSimbolos/TablaSimbolos":21,"../Transferencia/Break":17,"../Transferencia/Continuar":18,"../Transferencia/Return":19,"./../../TablaSimbolos/Tipo":22}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ifsinllave = void 0;
const Tipo_1 = require("./../../TablaSimbolos/Tipo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
class Ifsinllave {
    constructor(condicion, ins_ifs, ins_elses, fila, columna) {
        this.condicion = condicion;
        this.ins_ifs = ins_ifs;
        this.ins_elses = ins_elses;
        this.columna = columna;
        this.fila = fila;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
            if (valor_condicion) {
                let res = this.ins_ifs.ejecutar(ts_local, tree);
                //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                if (this.ins_ifs instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                    return res;
                }
                else {
                    if (this.ins_ifs instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        return this.ins_ifs;
                    }
                    else {
                        if (this.ins_ifs instanceof Return_1.Return || res instanceof Return_1.Return) {
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return this.ins_ifs;
                        }
                    }
                }
            }
            else {
                if (this.ins_elses instanceof Array) {
                    this.ins_elses.forEach(ins => {
                        let res = ins.ejecutar(ts_local, tree);
                        if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                            return res;
                        }
                        else {
                            if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return ins;
                            }
                            else {
                                if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                                    // controlador.graficarEntornos(controlador,ts_local," (case)");
                                    return ins;
                                }
                            }
                        }
                    });
                    //TODO verificar si res es de tipo CONTINUE, RETORNO 
                }
                else {
                    let res = this.ins_elses.ejecutar(ts_local, tree);
                    //TODO verificar si res es de tipo CONTINUE, RETORNO 
                    if (this.ins_elses instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return res;
                    }
                    else {
                        if (this.ins_elses instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                            // controlador.graficarEntornos(controlador,ts_local," (case)");
                            return this.ins_elses;
                        }
                        else {
                            if (this.ins_elses instanceof Return_1.Return || res instanceof Return_1.Return) {
                                // controlador.graficarEntornos(controlador,ts_local," (case)");
                                return this.ins_elses;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
}
exports.Ifsinllave = Ifsinllave;

},{"../../TablaSimbolos/TablaSimbolos":21,"../Transferencia/Break":17,"../Transferencia/Continuar":18,"../Transferencia/Return":19,"./../../TablaSimbolos/Tipo":22}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../Ast/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
class Declaracion {
    constructor(tipo, simbolos, fila, columna) {
        this.arreglo = false;
        // this.id = id;
        this.tipo = tipo;
        this.simbolos = simbolos;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = false;
    }
    ejecutar(table, tree) {
        for (let simbolo of this.simbolos) {
            let variable = simbolo;
            console.log(variable.id);
            if (variable.valor != null) {
                let valor = variable.valor.ejecutar(table, tree);
                //Verificando TIPOS de Variable
                let tipo_valor = variable.tipo;
                if (valor instanceof Errores_1.Errores) {
                    return valor;
                }
                if (tipo_valor == this.tipo) {
                    //--> Lo agregamos a la tabla de simbolos 
                    let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, valor);
                    table.setSymbolTabla(nuevo_simb);
                }
                else {
                    //Error no se puede declarar por incopatibilidad de simbolos
                    return new Errores_1.Errores("Semantico", "Declaracion " + variable.id + " -No coincide el tipo", simbolo.getFila(), simbolo.getColumna());
                }
            }
            else {
                //-- Se agrega a la tabla de simbolos 
                console.log("id " + variable.id);
                let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, null);
                table.setSymbolTabla(nuevo_simb);
            }
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Declaracion = Declaracion;

},{"../Ast/Errores":6,"../TablaSimbolos/Simbolo":20}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = require("../Ast/Nodo");
class Print {
    constructor(parametros, fila, columna, tipo) {
        this.parametros = parametros;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
    }
    ejecutar(table, tree) {
        // console.log("print params: " + this.parametros.toString());
        //TODO: verificar que el tipo del valor sea primitivo
        this.value = "";
        this.parametros.forEach((expresion) => {
            let valor = expresion.ejecutar(table, tree);
            console.log("print exp val: " + String(valor));
            console.log(valor);
            if (this.tipo) {
                this.value += valor.toString() + "\n";
                // tree.updateConsolaPrintln(String(this.value))
            }
            else {
                this.value += valor.toString();
                // tree.updateConsolaPrint(String(this.value))
            }
            return valor;
        });
        // if(this.tipo){
        //     tree.updateConsolaPrintln(this.value.toString())
        // }else{
        tree.updateConsolaPrint(this.value.toString());
        // }
        return null;
    }
    translate3d(table, tree) {
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Print", "");
        padre.addChildNode(new Nodo_1.Nodo("print", ""));
        padre.addChildNode(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        // hijo.addChildNode(this.parametros.recorrer());
        padre.addChildNode(hijo);
        padre.addChildNode(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Print = Print;

},{"../Ast/Nodo":7}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detener = void 0;
class Detener {
    constructor() { }
    ejecutar(table, tree) {
        return this;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.Detener = Detener;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continuar = void 0;
const Nodo_1 = require("../../Ast/Nodo");
class Continuar {
    constructor() {
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    ejecutar(table, tree) {
        return this;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("CONTINUE", "");
        return padre;
    }
}
exports.Continuar = Continuar;

},{"../../Ast/Nodo":7}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const Nodo_1 = require("../../Ast/Nodo");
class Return {
    constructor(valor) {
        this.valor = valor;
    }
    ejecutar(table, tree) {
        if (this.valor != null) {
            return this.valor.ejecutar(table, tree);
        }
        else {
            return null;
        }
        // this.tipo = this.valor.tipo;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("RETURN", "");
        padre.addChildNode(new Nodo_1.Nodo("return", ""));
        if (this.valor != null) {
            // padre.addChildNode(this.valor.recorrer());
        }
        return padre;
    }
}
exports.Return = Return;

},{"../../Ast/Nodo":7}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
class Simbolo {
    constructor(id, tipo, arreglo, fila, columna, valor, structEnv = null) {
        this.id = id;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.valor = valor;
        this.arreglo = arreglo;
        this.structEnv = structEnv;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getTipo() {
        return this.tipo;
    }
    setTipo(tipo) {
        this.tipo = tipo;
    }
    getValor() {
        return this.valor;
    }
    setValor(valor) {
        this.valor = valor;
    }
    getFila() {
        return this.fila;
    }
    getColumna() {
        return this.columna;
    }
    getArreglo() {
        return this.arreglo;
    }
}
exports.Simbolo = Simbolo;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSimbolos = void 0;
const Errores_1 = require("../Ast/Errores");
class TablaSimbolos {
    constructor(anterior) {
        this.anterior = anterior;
        this.tabla = new Map();
    }
    setSymbolTabla(simbolo) {
        if (this.existeEnActual(simbolo.id)) {
            console.log("Entreeeeee");
            return new Errores_1.Errores("Semantico", "Variable " + simbolo.getId() + " Existe", simbolo.getFila(), simbolo.getColumna());
        }
        else {
            // this.tabla[simbolo.getId()] = simbolo;
            this.tabla.set(simbolo.getId(), simbolo);
            console.log("set simbolo " + simbolo.getId() + " " + simbolo.getValor());
        }
        return null;
    }
    existeEnActual(id) {
        let entorno = this;
        let existe = entorno.tabla.get(id);
        if (existe != null) {
            return true;
        }
        return false;
    }
    getSymbolTabla(id) {
        let tablaActual = this;
        while (tablaActual != null) {
            let existe = tablaActual.tabla.get(id);
            if (existe != null) {
                return existe;
            }
            else {
                tablaActual = this.anterior;
            }
        }
        return null;
    }
    updateSymbolTabla(simbolo) {
        let tablaActual = this;
        while (tablaActual != null) {
            if (simbolo.id in tablaActual.tabla) {
                // validacion DE TIPO
                if (tablaActual.tabla[simbolo.id].getTipo() == simbolo.getTipo()) {
                    tablaActual.tabla[simbolo.id].setValor(simbolo.getValor());
                    tablaActual.tabla[simbolo.id].setTipo(simbolo.getTipo());
                    // AGREGAR STRUCT ACA
                    return null;
                }
                return new Errores_1.Errores("Semantico", "Tipo de dato diferente en asignacion", simbolo.getFila(), simbolo.getColumna());
            }
            else {
                tablaActual = this.anterior;
            }
            return new Errores_1.Errores("Semantico", "Varibale no encontrada en asignacion", simbolo.getFila(), simbolo.getColumna());
        }
    }
}
exports.TablaSimbolos = TablaSimbolos;

<<<<<<< Updated upstream
},{}],22:[function(require,module,exports){
=======
},{"../Ast/Errores":6}],21:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
/**
 * @enum de Tipo nos permite enumerar los tipos del lenguaje
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperadorLogico = exports.OperadorRelacional = exports.OperadorAritmetico = exports.TIPO = void 0;
var TIPO;
(function (TIPO) {
    TIPO[TIPO["ENTERO"] = 0] = "ENTERO";
    TIPO[TIPO["DECIMAL"] = 1] = "DECIMAL";
    TIPO[TIPO["BOOLEANO"] = 2] = "BOOLEANO";
    TIPO[TIPO["CHARACTER"] = 3] = "CHARACTER";
    TIPO[TIPO["CADENA"] = 4] = "CADENA";
    TIPO[TIPO["NULO"] = 5] = "NULO";
    TIPO[TIPO["ARREGLO"] = 6] = "ARREGLO";
    TIPO[TIPO["ANY"] = 7] = "ANY";
    TIPO[TIPO["RANGO"] = 8] = "RANGO";
    TIPO[TIPO["STRUCT"] = 9] = "STRUCT";
    TIPO[TIPO["VOID"] = 10] = "VOID";
})(TIPO = exports.TIPO || (exports.TIPO = {}));
var OperadorAritmetico;
(function (OperadorAritmetico) {
    OperadorAritmetico[OperadorAritmetico["MAS"] = 0] = "MAS";
    OperadorAritmetico[OperadorAritmetico["MENOS"] = 1] = "MENOS";
    OperadorAritmetico[OperadorAritmetico["POR"] = 2] = "POR";
    OperadorAritmetico[OperadorAritmetico["DIV"] = 3] = "DIV";
    OperadorAritmetico[OperadorAritmetico["POT"] = 4] = "POT";
    OperadorAritmetico[OperadorAritmetico["MOD"] = 5] = "MOD";
    OperadorAritmetico[OperadorAritmetico["UMENOS"] = 6] = "UMENOS";
    OperadorAritmetico[OperadorAritmetico["UMENOSMENOS"] = 7] = "UMENOSMENOS";
    OperadorAritmetico[OperadorAritmetico["UMASMAS"] = 8] = "UMASMAS";
    OperadorAritmetico[OperadorAritmetico["AMPERSON"] = 9] = "AMPERSON";
})(OperadorAritmetico = exports.OperadorAritmetico || (exports.OperadorAritmetico = {}));
var OperadorRelacional;
(function (OperadorRelacional) {
    OperadorRelacional[OperadorRelacional["MENORQUE"] = 0] = "MENORQUE";
    OperadorRelacional[OperadorRelacional["MAYORQUE"] = 1] = "MAYORQUE";
    OperadorRelacional[OperadorRelacional["MENORIGUAL"] = 2] = "MENORIGUAL";
    OperadorRelacional[OperadorRelacional["MAYORIGUAL"] = 3] = "MAYORIGUAL";
    OperadorRelacional[OperadorRelacional["IGUALIGUAL"] = 4] = "IGUALIGUAL";
    OperadorRelacional[OperadorRelacional["DIFERENTE"] = 5] = "DIFERENTE";
})(OperadorRelacional = exports.OperadorRelacional || (exports.OperadorRelacional = {}));
var OperadorLogico;
(function (OperadorLogico) {
    OperadorLogico[OperadorLogico["NOT"] = 0] = "NOT";
    OperadorLogico[OperadorLogico["AND"] = 1] = "AND";
    OperadorLogico[OperadorLogico["OR"] = 2] = "OR";
})(OperadorLogico = exports.OperadorLogico || (exports.OperadorLogico = {}));

},{}],23:[function(require,module,exports){
// const { TablaSimbolos } = require("./Clases/TablaSimbolos/TablaSimbolos");

// import Nodo from "../../Ast/Nodo";

var myTab = document.getElementById('myTab');
var itemAbrir = document.getElementById('itemAbrir');
let result;
let astTraduccion;
let entornoAnalizar;
// let listaErrores = Lista_Error.getInstancia();
const {Ast} = require("./dist/Ast/Ast");
const gramatica = require("./Analizadores/gramatica");
const {Primitivo} = require("./dist/Expresiones/Primitivo");
const {TablaSimbolos} = require("./dist/TablaSimbolos/TablaSimbolos");
// import {Instruccion} from("./dist/Interfaces/Instruccion");
// const Lista_Imprimir = require("./dist/Lista_imprimir");

const compilar = document.getElementById('compilarProyecto');

var text = CodeMirror.fromTextArea(document.getElementById("textAreaEntrada"),{
    mode: "javascript",
    theme:"ttcn",
    lineNumbers:true,
    autoCloseBrackets: true
});
text.setSize(null,520);

var cantTabs = 1;
var editor = new Editor(text);
var editores = [];
editores.push(editor);

function Editor(codeEditor){    
    this.codeEditor = codeEditor;
}


itemAbrir.addEventListener('click', async () => {

    const { value: file } = await Swal.fire({
        title: 'Abrir Archivo',
        input: 'file',
        inputAttributes: {
            'accept': '*',
            'aria-label': 'Selected File'
        }
    })

    if (file) {
        var reader = new FileReader()
        reader.onload = (e) => {

            var myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

            var currentTab = undefined;
            var indexTab = 1;
            var auxiliar = 1;

            myTabs.forEach(element => {

                var itemA = element.querySelector("a");

                var bandera = itemA.getAttribute('aria-selected')

                if (bandera == 'true') {
                    currentTab = itemA.id;
                    indexTab = auxiliar;
                }

                auxiliar = auxiliar + 1;
            });

            var contents = e.target.result;
            editores[indexTab-1].codeEditor.setValue(contents);
            
        }
        reader.readAsText(file);
    }
    else{
        alert('Error al cargar Archivo.');
    }

});

function agregarNuevoTab() {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementById('#myTab');
    tablinks = document.getElementById('#myTabContent');
    cantTabs = cantTabs + 1;

    $('#myTab').append('<li class = "nav-item"> <a class="nav-link" id = "tab' + cantTabs + '" data-toggle="tab" href="#panel' + cantTabs + '" role="tab" aria-controls="panel' + cantTabs + '" aria-selected="false" >Tab ' + cantTabs + '</a>   </li>');
    $('#myTabContent').append('<div class="tab-pane fade" id="panel' + cantTabs + '" role="tabpanel" aria-labelledby="tab"' + cantTabs + '>  <div> <textarea class="form-control" rows="21" id="text' + cantTabs + '" > </textarea>  </div> </div>');

    var editorActual = CodeMirror.fromTextArea(document.getElementById('text' + cantTabs), {
        mode: "javascript",
        theme: "ttcn",
        lineNumbers: true
    });
    editorActual.setSize(null, 520);
    var nuevoEditor = new Editor(editorActual);
    editores.push(nuevoEditor);
    
}

function eliminarTab() {


    if( cantTabs == 1 ){
        alert('No se puede eliminar todas las pestañas de trabajo.')
        return;
    }

    var myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

    var currentTab = undefined;
    var indexTab = 0;
    var auxiliar = 0;

    myTabs.forEach(element => {

        var itemA = element.querySelector("a");

        var bandera = itemA.getAttribute('aria-selected')

        if (bandera == 'true') {
            currentTab = itemA.id;
            indexTab = auxiliar;
        }

        auxiliar = auxiliar + 1;
    });

    var tabSeleccionado = document.getElementById(currentTab);
    var idPanelTab = tabSeleccionado.getAttribute('aria-controls');
    var panelTab = document.getElementById(idPanelTab);
    
    var padre = tabSeleccionado.parentElement;
    padre.remove()

    var panelTabSeleccionado = document.getElementById(panelTab.id);
    var padre = panelTabSeleccionado.parentElement
    padre.removeChild(panelTabSeleccionado);

    editores.splice(indexTab,1);
    cantTabs = cantTabs - 1;

}

function limpiarTab(){

    var myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

    var indexTab = 0;
    var auxiliar = 0;

    myTabs.forEach(element => {

        var itemA = element.querySelector("a");

        var bandera = itemA.getAttribute('aria-selected')

        if (bandera == 'true') {
            currentTab = itemA.id;
            indexTab = auxiliar;
        }

        auxiliar = auxiliar + 1;
    });

    editores[indexTab].codeEditor.setValue('');
    
}

compilar.addEventListener('click', () => {

    // let listaImprimir = Lista_Imprimir.getInstance();
    // alert("dsfasdfa");
    let myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

    let indexTab = 0;
    let auxiliar = 0;

    myTabs.forEach(element => {

        var itemA = element.querySelector("a");

        var bandera = itemA.getAttribute('aria-selected')

        if (bandera == 'true') {
            currentTab = itemA.id;
            indexTab = auxiliar;
        }

        auxiliar = auxiliar + 1;
    });
    
    //parse(editores[indexTab].codeEditor.getValue());
    
    var txtConsola = document.getElementById("textAreaConsola");
    $("#textAreaConsola").val("");

    try{
        result = gramatica.parse(editores[indexTab].codeEditor.getValue());
        
        let tablaSimbolos = new TablaSimbolos();
        let astEjecucion = new Ast();
        result.instrucciones.forEach(res => {
            console.log("hola")
            console.log(res)
            res.ejecutar(tablaSimbolos, result);
        });
    
        let texto = "::::::::::::::::::::::::::::::::::::::::::::::::    SALIDA CONSOLA  ::::::::::::::::::::::::::::::::::::::::::::::::\n";
        
        texto += result.getConsola();
        $("#textAreaConsola").val(texto);
        txtConsola.append(texto);
        Swal.fire(
            '¡Gramatica correcta!'
        );
    }catch(e){
        Swal.fire(
            'Gramatica incorrecta\n:' + e
        );
        // alert(e);
    }


});

function reporteAST(){  

    let arbol = new Arbol();
    
    //parse(editores[indexTab].codeEditor.getValue());
    let result = arbol.generarDot(result);
    //console.log(result);

    var clickedTab = document.getElementById("clickedTab");
    clickedTab.innerHTML = "";
    clickedTab.innerHTML = "<h3>Reporte AST</h3>"
    var viz = new Viz();
    viz.renderSVGElement(result).then(function (element) {
        clickedTab.appendChild(element);
    })
    .catch((error) => {
        console.error(error);
    });
}

function traducirProyecto(){

    let myTabs = document.querySelectorAll("#myTab.nav-tabs >li");

    let indexTab = 0;
    let auxiliar = 0;

    myTabs.forEach(element => {

        var itemA = element.querySelector("a");

        var bandera = itemA.getAttribute('aria-selected')

        if (bandera == 'true') {
            currentTab = itemA.id;
            indexTab = auxiliar;
        }

        auxiliar = auxiliar + 1;
    });

    try{
        //listaImprimir.length = 0;
        listaErrores.length = 0;
        astTraduccion = traduccion.parse(editores[indexTab].codeEditor.getValue());
        let entorno = new Entorno(null);
        entorno.setGlobal(entorno);
        entorno.setPadre(null);
        //astTraduccion.entornoGlobal.setGlobal(result.entornoGlobal);
        //astTraduccion.entornoGlobal.setPadre(null);
        let textoTraduccion = astTraduccion.traducir(entorno);
    
        agregarNuevoTab();
        let tam =  editores.length;
        editores[tam-1].codeEditor.setValue(textoTraduccion);
        //txtConsola.append(texto);
        //listaImprimir = [];
        

        

        alert('Gramatica Correcta');
    }catch(e){
        alert('Grmatica Incorrecta');
        alert(e);
    }

}

function reporteErrores(){
    
    CuerpoTablaErrores.innerHTML = '';
    numero = 1     
    
    let aux = 1;
    //alert("Tam: "+listaErrores.length);
    listaErrores.forEach(
        element =>{
            let textoAuxilarTipo = "";
            if( element.isErrorLexico() ){
                textoAuxilarTipo = "Error Léxico";
                //texto += "\n--Error Lexico "+"Descripcion: "+element.getMensaje()+" Fila: "+element.getFila()+ " Columna: "+element.getColumna();
            }else if(element.isErrorSintactico()){
                textoAuxilarTipo = "Error Sintáctico";
                //texto += "\n--Error Sintactico "+"Descripcion: "+element.getMensaje()+" Fila: "+element.getFila()+ " Columna: "+element.getColumna();
            }
            else{
                textoAuxilarTipo = "Error Semántico";
                //texto += "\n--Error Semántico "+" Descripcion: "+element.getMensaje()+" Fila: "+element.getFila()+ " Columna: "+element.getColumna();
            }

            CuerpoTablaErrores.innerHTML += `
            <tr>
            <th scope="row">${aux}</th>
            <td>${textoAuxilarTipo}</td>
            <td>${element.getMensaje()}</td>
            <td>${element.getFila()}</td>
            <td>${element.getColumna()}</td>
            </tr>
            `

            aux++;
            
        }
    );

}

function reporteTablaSimbolos(){
    CuerpoTablaSimbolos.innerHTML = '';
    let texto = entornoAnalizar.imprimirEntorno();
    CuerpoTablaSimbolos.innerHTML += tetxto;

}

function reporteAST_Traduccion(){
    let arbol = new Arbol();
    
    //parse(editores[indexTab].codeEditor.getValue());
    let result = arbol.generarDot(astTraduccion);
    //console.log(result);

    var clickedTab = document.getElementById("clickedTab");
    clickedTab.innerHTML = "";
    clickedTab.innerHTML = "<h3>Reporte AST Traduccion</h3>"
    var viz = new Viz();
    viz.renderSVGElement(result).then(function (element) {
        clickedTab.appendChild(element);
    })
    .catch((error) => {
        console.error(error);
    });
}
/*var viz = new Viz();
viz.renderSVGElement(text).then(function (element) {
        div.appendChild(element);
    })
    .catch((error) => {
        viz = new Viz();
        console.error(error);
    });*/
//
},{"./Analizadores/gramatica":4,"./dist/Ast/Ast":5,"./dist/Expresiones/Primitivo":12,"./dist/TablaSimbolos/TablaSimbolos":21}]},{},[23])(23)
});
