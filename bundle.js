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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,12],$V1=[1,10],$V2=[1,11],$V3=[1,14],$V4=[1,15],$V5=[1,16],$V6=[1,17],$V7=[1,18],$V8=[1,19],$V9=[5,17,22,26,27,29,31,32,33,34,35],$Va=[5,17,22,26,27,29,30,31,32,33,34,35],$Vb=[1,46],$Vc=[1,37],$Vd=[1,36],$Ve=[1,38],$Vf=[1,39],$Vg=[1,40],$Vh=[1,41],$Vi=[1,42],$Vj=[1,43],$Vk=[1,44],$Vl=[1,45],$Vm=[8,16],$Vn=[1,53],$Vo=[16,25],$Vp=[1,54],$Vq=[1,55],$Vr=[1,56],$Vs=[1,57],$Vt=[1,58],$Vu=[1,59],$Vv=[1,60],$Vw=[1,61],$Vx=[1,62],$Vy=[1,63],$Vz=[1,64],$VA=[1,65],$VB=[1,66],$VC=[1,67],$VD=[1,68],$VE=[8,16,25,36,37,38,39,40,41,42,43,44,46,47,48,49,50,51],$VF=[8,16,25,43,44],$VG=[1,96],$VH=[8,16,25,36,37,42,43,44,46,47,48,49,50,51],$VI=[8,16,25,36,37,38,39,40,42,43,44,46,47,48,49,50,51],$VJ=[8,16,25,43,44,46,47,48,49,50,51],$VK=[8,16,25,43,44,50,51];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"start":3,"instrucciones":4,"EOF":5,"instruccion":6,"print_instr":7,"PUNTOCOMA":8,"println_instr":9,"asignacion":10,"declaracion":11,"if_llav_instr":12,"if_instr":13,"tipo":14,"lista_simbolos":15,"COMA":16,"ID":17,"IGUAL":18,"expr":19,"INCRE":20,"DECRE":21,"RPRINT":22,"PARA":23,"lista_parametros":24,"PARC":25,"RPRINTLN":26,"RIF":27,"LLAVA":28,"LLAVC":29,"RELSE":30,"RINT":31,"RDOUBLE":32,"RSTRING":33,"RCHAR":34,"RBOOLEAN":35,"MAS":36,"MENOS":37,"MULTI":38,"DIV":39,"PORCENTAJE":40,"POTENCIA":41,"AMPERSON":42,"AND":43,"OR":44,"NOT":45,"MAYORQUE":46,"MAYORIGUAL":47,"MENORIGUAL":48,"MENORQUE":49,"IGUALIGUAL":50,"DIFERENTE":51,"ENTERO":52,"DECIMAL":53,"CADENA":54,"CHAR":55,"NULL":56,"TRUE":57,"FALSE":58,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"PUNTOCOMA",16:"COMA",17:"ID",18:"IGUAL",20:"INCRE",21:"DECRE",22:"RPRINT",23:"PARA",25:"PARC",26:"RPRINTLN",27:"RIF",28:"LLAVA",29:"LLAVC",30:"RELSE",31:"RINT",32:"RDOUBLE",33:"RSTRING",34:"RCHAR",35:"RBOOLEAN",36:"MAS",37:"MENOS",38:"MULTI",39:"DIV",40:"PORCENTAJE",41:"POTENCIA",42:"AMPERSON",43:"AND",44:"OR",45:"NOT",46:"MAYORQUE",47:"MAYORIGUAL",48:"MENORIGUAL",49:"MENORQUE",50:"IGUALIGUAL",51:"DIFERENTE",52:"ENTERO",53:"DECIMAL",54:"CADENA",55:"CHAR",56:"NULL",57:"TRUE",58:"FALSE"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,2],[6,2],[6,2],[6,1],[6,1],[11,2],[15,3],[15,5],[15,1],[15,3],[10,3],[10,2],[10,2],[7,4],[9,4],[12,7],[12,11],[12,9],[13,5],[13,7],[13,7],[24,3],[24,1],[14,1],[14,1],[14,1],[14,1],[14,1],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,2],[19,3],[19,3],[19,3],[19,2],[19,3],[19,3],[19,3],[19,3],[19,3],[19,3],[19,1],[19,1],[19,1],[19,1],[19,1],[19,1],[19,1],[19,1],[19,2],[19,2]],
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
case 4: case 5: case 6: case 7:
 this.$ = $$[$0-1] 
break;
case 8: case 9:
 this.$ = $$[$0] 
break;
case 10:
 this.$ = new Declaracion($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 11:
 this.$ = $$[$0-2]; this.$.push(new Simbolo($$[$0],null,null,_$[$0-2].first_line, _$[$0-2].first_column,null)); 
break;
case 12:
 this.$ = $$[$0-4]; this.$.push(new Simbolo($$[$0-2],null,null,_$[$0-4].first_line, _$[$0-4].first_column,$$[$0])); 
break;
case 13:
 this.$ = new Array(); this.$.push(new Simbolo($$[$0],null,null,_$[$0].first_line, _$[$0].first_column,null)); 
break;
case 14:
 this.$ = new Array(); this.$.push(new Simbolo($$[$0-2],null,null,_$[$0-2].first_line, _$[$0-2].first_column,$$[$0])); 
break;
case 15:
 this.$ = new Asignacion($$[$0-2] ,$$[$0], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 16:
 this.$ = new Asignacion($$[$0-1] ,new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false), _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 17:
 this.$ = new Asignacion($$[$0-1] ,new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false), _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 18:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column, false); 
break;
case 19:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column, true); 
break;
case 20:
 this.$ = new If($$[$0-4], $$[$0-1], null, _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 21:
 this.$ = new If($$[$0-8], $$[$0-5], $$[$0-1], _$[$0-10].first_line, _$[$0-10].first_column); 
break;
case 22:
 this.$ = new If($$[$0-6], $$[$0-3], [$$[$0]], _$[$0-8].first_line, _$[$0-8].first_column); 
break;
case 23:
 this.$ = new Ifsinllave($$[$0-2], $$[$0], null, _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 24:
 this.$ = new Ifsinllave($$[$0-4], $$[$0-2], $$[$0], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 25:
 this.$ = new Ifsinllave($$[$0-4], $$[$0-2], [$$[$0]], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 26:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 27:
 this.$ = new Array(); this.$.push($$[$0]);
break;
case 28:
 this.$ = TIPO.ENTERO; 
break;
case 29:
 this.$ = TIPO.DECIMAL; 
break;
case 30:
 this.$ = TIPO.CADENA; 
break;
case 31:
 this.$ = TIPO.CHARACTER; 
break;
case 32:
 this.$ = TIPO.BOOLEANO; 
break;
case 33:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MAS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 34:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MENOS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 35:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POR,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 36:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.DIV,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 37:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MOD,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 38:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POT,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 39:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.AMPERSON,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 40:
 this.$ = new Aritmetica($$[$0],OperadorAritmetico.UMENOS,$$[$0], _$[$0-1].first_line, _$[$0-1].first_column, true); 
break;
case 41:
 this.$ = $$[$0-1]; 
break;
case 42:
 this.$ = new Logica($$[$0-2], OperadorLogico.AND, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 43:
 this.$ = new Logica($$[$0-2], OperadorLogico.OR, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 44:
 this.$ = new Logica($$[$0], OperadorLogico.NOT, null, $$[$0-1].first_line, $$[$0-1].last_column, true); 
break;
case 45:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 46:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 47:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 48:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 49:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.IGUALIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 50:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.DIFERENTE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 51:
 this.$ = new Primitivo(Number($$[$0]), TIPO.ENTERO, _$[$0].first_line, _$[$0].first_column); 
break;
case 52:
 this.$ = new Primitivo(Number($$[$0]), TIPO.DECIMAL, _$[$0].first_line, _$[$0].first_column); 
break;
case 53:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CADENA, _$[$0].first_line, _$[$0].first_column); 
break;
case 54:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CHARACTER, _$[$0].first_line, _$[$0].first_column); 
break;
case 55:
 this.$ = new Primitivo(null, TIPO.NULO, _$[$0].first_line, _$[$0].first_column); 
break;
case 56:
 this.$ = new Primitivo(true, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 57:
 this.$ = new Primitivo(false, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 58:
 this.$ = new Identificador($$[$0] , _$[$0].first_line, _$[$0].last_column); 
break;
case 59:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
case 60:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
}
},
table: [{3:1,4:2,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:13,17:$V0,22:$V1,26:$V2,27:$V3,31:$V4,32:$V5,33:$V6,34:$V7,35:$V8},{1:[3]},{5:[1,20],6:21,7:4,9:5,10:6,11:7,12:8,13:9,14:13,17:$V0,22:$V1,26:$V2,27:$V3,31:$V4,32:$V5,33:$V6,34:$V7,35:$V8},o($V9,[2,3]),{8:[1,22]},{8:[1,23]},{8:[1,24]},{8:[1,25]},o($Va,[2,8]),o($Va,[2,9]),{23:[1,26]},{23:[1,27]},{18:[1,28],20:[1,29],21:[1,30]},{15:31,17:[1,32]},{23:[1,33]},{17:[2,28]},{17:[2,29]},{17:[2,30]},{17:[2,31]},{17:[2,32]},{1:[2,1]},o($V9,[2,2]),o($Va,[2,4]),o($Va,[2,5]),o($Va,[2,6]),o($Va,[2,7]),{17:$Vb,19:35,23:$Vc,24:34,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:35,23:$Vc,24:47,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:48,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{8:[2,16]},{8:[2,17]},{8:[2,10],16:[1,49]},o($Vm,[2,13],{18:[1,50]}),{17:$Vb,19:51,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{16:$Vn,25:[1,52]},o($Vo,[2,27],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,43:$Vw,44:$Vx,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD}),{17:$Vb,19:69,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:70,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:71,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},o($VE,[2,51]),o($VE,[2,52]),o($VE,[2,53]),o($VE,[2,54]),o($VE,[2,55]),o($VE,[2,56]),o($VE,[2,57]),o($VE,[2,58],{20:[1,72],21:[1,73]}),{16:$Vn,25:[1,74]},{8:[2,15],36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,43:$Vw,44:$Vx,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD},{17:[1,75]},{17:$Vb,19:76,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{25:[1,77],36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,43:$Vw,44:$Vx,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD},{8:[2,18]},{17:$Vb,19:78,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:79,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:80,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:81,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:82,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:83,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:84,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:85,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:86,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:87,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:88,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:89,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:90,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:91,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:92,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{17:$Vb,19:93,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},o($VE,[2,40]),{25:[1,94],36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,43:$Vw,44:$Vx,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD},o($VF,[2,44],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD}),o($VE,[2,59]),o($VE,[2,60]),{8:[2,19]},o($Vm,[2,11],{18:[1,95]}),o($Vm,[2,14],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,43:$Vw,44:$Vx,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD}),{6:97,7:4,9:5,10:6,11:7,12:8,13:9,14:13,17:$V0,22:$V1,26:$V2,27:$V3,28:$VG,31:$V4,32:$V5,33:$V6,34:$V7,35:$V8},o($Vo,[2,26],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,43:$Vw,44:$Vx,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD}),o($VH,[2,33],{38:$Vr,39:$Vs,40:$Vt,41:$Vu}),o($VH,[2,34],{38:$Vr,39:$Vs,40:$Vt,41:$Vu}),o($VI,[2,35],{41:$Vu}),o($VI,[2,36],{41:$Vu}),o($VI,[2,37],{41:$Vu}),o($VE,[2,38]),o($VH,[2,39],{38:$Vr,39:$Vs,40:$Vt,41:$Vu}),o($VF,[2,42],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD}),o([8,16,25,44],[2,43],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,43:$Vw,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD}),o($VJ,[2,45],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv}),o($VJ,[2,46],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv}),o($VJ,[2,47],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv}),o($VJ,[2,48],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv}),o($VK,[2,49],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,46:$Vy,47:$Vz,48:$VA,49:$VB}),o($VK,[2,50],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,46:$Vy,47:$Vz,48:$VA,49:$VB}),o($VE,[2,41]),{17:$Vb,19:98,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},{4:99,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:13,17:$V0,22:$V1,26:$V2,27:$V3,31:$V4,32:$V5,33:$V6,34:$V7,35:$V8},o($V9,[2,23],{30:[1,100]}),o($Vm,[2,12],{36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,43:$Vw,44:$Vx,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD}),{6:21,7:4,9:5,10:6,11:7,12:8,13:9,14:13,17:$V0,22:$V1,26:$V2,27:$V3,29:[1,101],31:$V4,32:$V5,33:$V6,34:$V7,35:$V8},{6:102,7:4,9:5,10:6,11:7,12:8,13:103,14:13,17:$V0,22:$V1,26:$V2,27:$V3,31:$V4,32:$V5,33:$V6,34:$V7,35:$V8},o($V9,[2,20],{30:[1,104]}),o($Va,[2,24]),o($Va,[2,25]),{12:106,27:[1,107],28:[1,105]},{4:108,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:13,17:$V0,22:$V1,26:$V2,27:$V3,31:$V4,32:$V5,33:$V6,34:$V7,35:$V8},o($Va,[2,22]),{23:[1,109]},{6:21,7:4,9:5,10:6,11:7,12:8,13:9,14:13,17:$V0,22:$V1,26:$V2,27:$V3,29:[1,110],31:$V4,32:$V5,33:$V6,34:$V7,35:$V8},{17:$Vb,19:111,23:$Vc,37:$Vd,45:$Ve,52:$Vf,53:$Vg,54:$Vh,55:$Vi,56:$Vj,57:$Vk,58:$Vl},o($Va,[2,21]),{25:[1,112],36:$Vp,37:$Vq,38:$Vr,39:$Vs,40:$Vt,41:$Vu,42:$Vv,43:$Vw,44:$Vx,46:$Vy,47:$Vz,48:$VA,49:$VB,50:$VC,51:$VD},{28:$VG}],
defaultActions: {15:[2,28],16:[2,29],17:[2,30],18:[2,31],19:[2,32],20:[2,1],29:[2,16],30:[2,17],52:[2,18],74:[2,19]},
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
    const { Asignacion } = require("../dist/Instrucciones/Asignacion");
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
case 5: return 22 
break;
case 6: return 26 
break;
case 7: return 27 
break;
case 8: return 30 
break;
case 9: return 56 
break;
case 10: return 57 
break;
case 11: return 58 
break;
case 12: return 31 
break;
case 13: return 32 
break;
case 14: return 35 
break;
case 15: return 34 
break;
case 16: return 33 
break;
case 17: return 20
break;
case 18: return 21
break;
case 19: return 36 
break;
case 20: return 37 
break;
case 21: return 38 
break;
case 22: return 39 
break;
case 23: return 40 
break;
case 24: return 41 
break;
case 25: return 47 
break;
case 26: return 48 
break;
case 27: return 49 
break;
case 28: return 46 
break;
case 29: return 51 
break;
case 30: return 50 
break;
case 31: return 18 
break;
case 32: return 43 
break;
case 33: return 44 
break;
case 34: return 45 
break;
case 35: return 42 
break;
case 36: return 23 
break;
case 37: return 25 
break;
case 38: return 'CORA' 
break;
case 39: return 'CORC' 
break;
case 40: return 28 
break;
case 41: return 29 
break;
case 42: return 'PUNTO' 
break;
case 43: return 8 
break;
case 44: return 16 
break;
case 45: return 'INTERROGACION' 
break;
case 46: return 'DOSPUNTOS' 
break;
case 47:return 53;
break;
case 48:return 52;
break;
case 49:return 17;
break;
case 50:return 54;
break;
case 51:return 55;
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
rules: [/^(?:\/\/.*)/i,/^(?:\/\*)/i,/^(?:\*\/)/i,/^(?:.)/i,/^(?:\s+)/i,/^(?:print\b)/i,/^(?:println\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:null\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:boolean\b)/i,/^(?:char\b)/i,/^(?:String\b)/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:\^)/i,/^(?:>=)/i,/^(?:<=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:!=)/i,/^(?:==)/i,/^(?:=)/i,/^(?:&&)/i,/^(?:\|\|)/i,/^(?:!)/i,/^(?:&)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\.)/i,/^(?:;)/i,/^(?:,)/i,/^(?:\?)/i,/^(?::)/i,/^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/i,/^(?:[0-9]+)/i,/^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ]*)/i,/^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/i,/^(?:('((\\([\'\"\\bfnrtv]))|([^\'\\]))'))/i,/^(?:.)/i,/^(?:[\r\n\t])/i,/^(?:$)/i],
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
},{"../dist/Ast/Ast":5,"../dist/Expresiones/Identificador":8,"../dist/Expresiones/Operaciones/Aritmeticas":9,"../dist/Expresiones/Operaciones/Logicas":10,"../dist/Expresiones/Operaciones/Relacionales":11,"../dist/Expresiones/Primitivo":12,"../dist/Instrucciones/Asignacion":13,"../dist/Instrucciones/Condicionales/If":14,"../dist/Instrucciones/Condicionales/Ifsinllave":15,"../dist/Instrucciones/Declaracion":16,"../dist/Instrucciones/Print":17,"../dist/TablaSimbolos/Simbolo":21,"../dist/TablaSimbolos/Tipo":23,"_process":3,"fs":1,"path":2}],5:[function(require,module,exports){
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
        // console.log(table.existeEnActual(this.id));
        console.log((table));
        // table.getSymbolTabla(this.id);
        this.symbol = table.getSymbolTabla(this.id);
        // console.log(table.getSymbolTabla(this.id));
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
            valor_exp1 = this.exp1.ejecutar(table, tree);
            valor_exp2 = this.exp2.ejecutar(table, tree);
            tipoGeneral = this.getTipoMax(this.exp1.tipo, this.exp2.tipo);
        }
        else {
            valor_expU = this.exp1.ejecutar(table, tree);
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
                    this.tipo = this.exp1.tipo;
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":23}],10:[function(require,module,exports){
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":23}],11:[function(require,module,exports){
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

},{"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":23}],12:[function(require,module,exports){
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
exports.Asignacion = void 0;
const Errores_1 = require("../Ast/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
class Asignacion {
    constructor(id, expresion, fila, columna) {
        this.id = id;
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (table.existe(this.id)) {
            let valor = this.expresion.ejecutar(table, tree);
            console.log(valor);
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            /**
             * Agregar struct y arreglos aca
             */
            let result = table.updateSymbolTabla(new Simbolo_1.Simbolo(this.id, this.expresion.tipo, null, this.fila, this.columna, valor));
            if (result instanceof Errores_1.Errores) {
                console.log(`tipoo exp: ${this.expresion.tipo} `);
                console.log(`error en updateSymbol ${this.id} `);
                return result;
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "Variable no encontrada en asignacion", this.fila, this.columna);
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Asignacion = Asignacion;

},{"../Ast/Errores":6,"../TablaSimbolos/Simbolo":21}],14:[function(require,module,exports){
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

},{"../../TablaSimbolos/TablaSimbolos":22,"../Transferencia/Break":18,"../Transferencia/Continuar":19,"../Transferencia/Return":20,"./../../TablaSimbolos/Tipo":23}],15:[function(require,module,exports){
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

},{"../../TablaSimbolos/TablaSimbolos":22,"../Transferencia/Break":18,"../Transferencia/Continuar":19,"../Transferencia/Return":20,"./../../TablaSimbolos/Tipo":23}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../Ast/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
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
            // console.log(variable.id)
            if (variable.valor != null) {
                let valor = variable.valor.ejecutar(table, tree);
                //Verificando TIPOS de Variable
                let tipo_valor = variable.valor.tipo;
                if (valor instanceof Errores_1.Errores) {
                    return valor;
                }
                if (tipo_valor == this.tipo) {
                    console.log("entree tipo declaracion");
                    //--> Lo agregamos a la tabla de simbolos 
                    let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, valor);
                    table.setSymbolTabla(nuevo_simb);
                }
                else {
                    // console.log("errorrr tipo declaracion");
                    // console.log("tipo actual: " + tipo_valor + " tipo var es: " + this.tipo)
                    //Error no se puede declarar por incopatibilidad de simbolos
                    return new Errores_1.Errores("Semantico", "Declaracion " + variable.id + " -No coincide el tipo", simbolo.getFila(), simbolo.getColumna());
                }
            }
            else {
                //-- DECLARACION 1ERA VEZ -Se agrega a la tabla de simbolos 
                let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, null);
                switch (this.tipo) {
                    case Tipo_1.TIPO.ENTERO:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, 0);
                        break;
                    case Tipo_1.TIPO.DECIMAL:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, 0.00);
                        break;
                    case Tipo_1.TIPO.CADENA:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, null);
                        break;
                    case Tipo_1.TIPO.BOOLEANO:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, false);
                        break;
                    case Tipo_1.TIPO.CHARACTER:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, '0');
                        break;
                    default:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, null, variable.fila, variable.columna, null);
                        break;
                }
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

},{"../Ast/Errores":6,"../TablaSimbolos/Simbolo":21,"../TablaSimbolos/Tipo":23}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Print {
    constructor(parametros, fila, columna, tipo) {
        this.parametros = parametros;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
    }
    ejecutar(table, tree) {
        //TODO: verificar que el tipo del valor sea primitivo
        this.value = "";
        for (let expresion of this.parametros) {
            let valor = expresion.ejecutar(table, tree);
            console.log("print exp val: " + String(valor));
            console.log(valor);
            // Validaciones de TIPOS A Imprimir
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            if (expresion.tipo == Tipo_1.TIPO.ARREGLO) {
            }
            if (this.tipo) {
                // this.value += valor.toString() + "\n";
                tree.updateConsolaPrintln(String(valor));
            }
            else {
                this.value += valor.toString();
                tree.updateConsolaPrint(String(valor));
            }
            // return null;    
        }
        // this.parametros.forEach((expresion: Instruccion) => {
        // });
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

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Tipo":23}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"../../Ast/Nodo":7}],20:[function(require,module,exports){
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

},{"../../Ast/Nodo":7}],21:[function(require,module,exports){
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
        console.log("simbolor: " + this.valor);
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

},{}],22:[function(require,module,exports){
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
    existe(id) {
        let entorno = this;
        while (entorno != null) {
            let existe = entorno.tabla.get(id);
            if (existe != null) {
                return true;
            }
            entorno = entorno.anterior;
        }
        return false;
    }
    /**
     * @function  getSymbolTabla
     * @param id
     * @returns
     */
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
            let existe = tablaActual.tabla.get(simbolo.id);
            if (existe != null) {
                // validacion DE TIPO
                if (existe.getTipo() == simbolo.getTipo()) {
                    existe.setValor(simbolo.getValor());
                    existe.setTipo(simbolo.getTipo());
                    // AGREGAR STRUCT ACA
                    return null;
                }
                console.log(`tipoo exp: ${existe.getTipo()} `);
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

},{"../Ast/Errores":6}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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
},{"./Analizadores/gramatica":4,"./dist/Ast/Ast":5,"./dist/Expresiones/Primitivo":12,"./dist/TablaSimbolos/TablaSimbolos":22}]},{},[24])(24)
});
