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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,38],$V1=[1,29],$V2=[1,25],$V3=[1,26],$V4=[1,30],$V5=[1,31],$V6=[1,32],$V7=[1,33],$V8=[1,34],$V9=[1,35],$Va=[1,37],$Vb=[1,36],$Vc=[1,27],$Vd=[1,39],$Ve=[1,40],$Vf=[1,41],$Vg=[1,42],$Vh=[1,43],$Vi=[5,31,32,35,42,46,47,49,51,54,55,56,57,58,59,60,63,91,92,93,94,95],$Vj=[5,31,32,35,42,46,47,48,49,51,54,55,56,57,58,59,60,63,91,92,93,94,95],$Vk=[1,55],$Vl=[32,69,77],$Vm=[2,107],$Vn=[1,62],$Vo=[1,65],$Vp=[1,69],$Vq=[1,66],$Vr=[1,67],$Vs=[1,68],$Vt=[1,70],$Vu=[1,73],$Vv=[1,113],$Vw=[1,87],$Vx=[1,78],$Vy=[1,112],$Vz=[1,88],$VA=[1,104],$VB=[1,103],$VC=[1,105],$VD=[1,106],$VE=[1,107],$VF=[1,108],$VG=[1,109],$VH=[1,114],$VI=[1,115],$VJ=[1,101],$VK=[1,77],$VL=[1,79],$VM=[1,80],$VN=[1,81],$VO=[1,82],$VP=[1,83],$VQ=[1,84],$VR=[1,85],$VS=[1,86],$VT=[1,92],$VU=[1,93],$VV=[1,94],$VW=[1,95],$VX=[1,96],$VY=[1,97],$VZ=[1,102],$V_=[2,108],$V$=[32,69],$V01=[2,104],$V11=[8,37],$V21=[2,34],$V31=[1,126],$V41=[1,135],$V51=[1,136],$V61=[1,137],$V71=[1,157],$V81=[1,141],$V91=[1,142],$Va1=[1,143],$Vb1=[1,144],$Vc1=[1,145],$Vd1=[1,146],$Ve1=[1,147],$Vf1=[1,148],$Vg1=[1,149],$Vh1=[1,150],$Vi1=[1,151],$Vj1=[1,152],$Vk1=[1,153],$Vl1=[1,154],$Vm1=[1,155],$Vn1=[1,156],$Vo1=[8,33,37,45,52,70,96,97,98,99,100,101,102,103,104,106,107,108,109,110,111,119],$Vp1=[2,134],$Vq1=[2,139],$Vr1=[1,167],$Vs1=[1,179],$Vt1=[32,77],$Vu1=[1,190],$Vv1=[37,45],$Vw1=[1,197],$Vx1=[1,227],$Vy1=[8,33,37,45,70,96,97,98,99,100,101,102,103,104,106,107,108,109,110,111,119],$Vz1=[8,33,37,45,70,103,104,119],$VA1=[2,136],$VB1=[2,137],$VC1=[2,140],$VD1=[1,231],$VE1=[37,70],$VF1=[8,33,37,45,52,69,70,96,97,98,99,100,101,102,103,104,106,107,108,109,110,111,119],$VG1=[1,254],$VH1=[8,33,37,38,45,52,69,70,96,97,98,99,100,101,102,103,104,106,107,108,109,110,111,119],$VI1=[1,267],$VJ1=[8,33,37,45,70,96,97,102,103,104,106,107,108,109,110,111,119],$VK1=[8,33,37,45,70,96,97,98,99,100,102,103,104,106,107,108,109,110,111,119],$VL1=[8,33,37,45,70,103,104,106,107,108,109,110,111,119],$VM1=[8,33,37,45,70,103,104,110,111,119],$VN1=[8,33,37,45,70],$VO1=[31,32,35,63,91,92,93,94,95],$VP1=[1,302],$VQ1=[35,51,54],$VR1=[1,328],$VS1=[52,96,97,98,99,100,101,102,103,104,106,107,108,109,110,111,119],$VT1=[8,52,96,97,98,99,100,101,102,103,104,106,107,108,109,110,111,119];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"start":3,"instrucciones":4,"EOF":5,"instruccion":6,"print_instr":7,"PUNTOCOMA":8,"println_instr":9,"main_":10,"funciones":11,"declaracion":12,"asignacion":13,"if_llav_instr":14,"if_instr":15,"switch_instr":16,"break_instr":17,"continue_instr":18,"return_instr":19,"while_instr":20,"for_instr":21,"dowhile_instr":22,"for_in_instr":23,"decl_arr_instr":24,"llamada":25,"modif_arr_instr":26,"structs":27,"nat_push_instr":28,"tipo":29,"lista_simbolos":30,"RSTRUCT":31,"ID":32,"LLAVA":33,"instrucciones_struct":34,"LLAVC":35,"attribute":36,"COMA":37,"IGUAL":38,"expr":39,"INCRE":40,"DECRE":41,"RPRINT":42,"PARA":43,"lista_parametros":44,"PARC":45,"RPRINTLN":46,"RIF":47,"RELSE":48,"RSWITCH":49,"lista_cases":50,"RDEFAULT":51,"DOSPUNTOS":52,"case":53,"RCASE":54,"RBREAK":55,"RCONTINUE":56,"RRETURN":57,"RWHILE":58,"RDO":59,"RFOR":60,"actualizacion":61,"RIN":62,"RVOID":63,"RMAIN":64,"lista_parametros_func":65,"parametro_func":66,"lista_dim":67,"lista_exp_arr":68,"CORA":69,"CORC":70,"lista_exp_arr_c":71,"HASH":72,"lista_exp":73,"rango":74,"RBEGIN":75,"REND":76,"PUNTO":77,"RPUSH":78,"nat_matematicas":79,"RSIN":80,"RCOS":81,"RTAN":82,"RSQRT":83,"RLOG":84,"nat_parse":85,"RPARSE":86,"nat_conversion":87,"nat_conversion_tipos":88,"RTOINT":89,"RTODOUBLE":90,"RINT":91,"RDOUBLE":92,"RSTRING":93,"RCHAR":94,"RBOOLEAN":95,"MAS":96,"MENOS":97,"MULTI":98,"DIV":99,"PORCENTAJE":100,"POTENCIA":101,"AMPERSON":102,"AND":103,"OR":104,"NOT":105,"MAYORQUE":106,"MAYORIGUAL":107,"MENORIGUAL":108,"MENORQUE":109,"IGUALIGUAL":110,"DIFERENTE":111,"ENTERO":112,"DECIMAL":113,"CADENA":114,"CHAR":115,"NULL":116,"TRUE":117,"FALSE":118,"INTERROGACION":119,"RPOP":120,"RLENGTH":121,"RCHAROFPOS":122,"RSUBSTRING":123,"RTOUPPER":124,"RTOLOWER":125,"RTYPEOF":126,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"PUNTOCOMA",31:"RSTRUCT",32:"ID",33:"LLAVA",35:"LLAVC",37:"COMA",38:"IGUAL",40:"INCRE",41:"DECRE",42:"RPRINT",43:"PARA",45:"PARC",46:"RPRINTLN",47:"RIF",48:"RELSE",49:"RSWITCH",51:"RDEFAULT",52:"DOSPUNTOS",54:"RCASE",55:"RBREAK",56:"RCONTINUE",57:"RRETURN",58:"RWHILE",59:"RDO",60:"RFOR",62:"RIN",63:"RVOID",64:"RMAIN",69:"CORA",70:"CORC",72:"HASH",75:"RBEGIN",76:"REND",77:"PUNTO",78:"RPUSH",80:"RSIN",81:"RCOS",82:"RTAN",83:"RSQRT",84:"RLOG",86:"RPARSE",89:"RTOINT",90:"RTODOUBLE",91:"RINT",92:"RDOUBLE",93:"RSTRING",94:"RCHAR",95:"RBOOLEAN",96:"MAS",97:"MENOS",98:"MULTI",99:"DIV",100:"PORCENTAJE",101:"POTENCIA",102:"AMPERSON",103:"AND",104:"OR",105:"NOT",106:"MAYORQUE",107:"MAYORIGUAL",108:"MENORIGUAL",109:"MENORQUE",110:"IGUALIGUAL",111:"DIFERENTE",112:"ENTERO",113:"DECIMAL",114:"CADENA",115:"CHAR",116:"NULL",117:"TRUE",118:"FALSE",119:"INTERROGACION",120:"RPOP",121:"RLENGTH",122:"RCHAROFPOS",123:"RSUBSTRING",124:"RTOUPPER",125:"RTOLOWER",126:"RTYPEOF"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,2],[6,1],[6,1],[6,2],[6,2],[6,1],[6,1],[6,1],[6,2],[6,2],[6,2],[6,1],[6,1],[6,2],[6,1],[6,2],[6,2],[6,2],[6,2],[6,2],[12,2],[27,5],[34,2],[34,1],[36,0],[36,3],[36,2],[30,3],[30,5],[30,1],[30,3],[13,3],[13,2],[13,2],[13,4],[7,4],[9,4],[14,7],[14,11],[14,9],[15,5],[15,7],[15,7],[16,7],[16,9],[16,10],[50,2],[50,1],[53,4],[44,3],[44,1],[17,1],[18,1],[19,2],[20,7],[22,8],[21,11],[21,11],[61,3],[61,2],[61,2],[23,7],[10,7],[10,6],[11,7],[11,8],[65,3],[65,1],[66,2],[66,1],[25,3],[25,4],[24,5],[67,3],[67,2],[68,4],[68,3],[68,2],[71,3],[71,1],[73,4],[73,3],[26,4],[74,3],[74,3],[74,3],[74,3],[28,6],[79,1],[79,1],[79,1],[79,1],[79,1],[85,6],[87,4],[88,1],[88,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[39,3],[39,3],[39,3],[39,3],[39,3],[39,3],[39,3],[39,2],[39,3],[39,3],[39,3],[39,2],[39,3],[39,3],[39,3],[39,3],[39,3],[39,3],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,5],[39,2],[39,2],[39,3],[39,1],[39,2],[39,1],[39,3],[39,1],[39,3],[39,3],[39,4],[39,6],[39,3],[39,3],[39,4],[39,1],[39,1],[39,4],[39,4]],
=======
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,38],$V1=[1,29],$V2=[1,25],$V3=[1,26],$V4=[1,30],$V5=[1,31],$V6=[1,32],$V7=[1,33],$V8=[1,34],$V9=[1,35],$Va=[1,37],$Vb=[1,36],$Vc=[1,27],$Vd=[1,39],$Ve=[1,40],$Vf=[1,41],$Vg=[1,42],$Vh=[1,43],$Vi=[5,31,32,35,42,46,47,49,51,54,55,56,57,58,59,60,63,86,87,88,89,90],$Vj=[5,31,32,35,42,46,47,48,49,51,54,55,56,57,58,59,60,63,86,87,88,89,90],$Vk=[1,55],$Vl=[32,69],$Vm=[2,106],$Vn=[1,69],$Vo=[1,66],$Vp=[1,67],$Vq=[1,68],$Vr=[1,70],$Vs=[1,73],$Vt=[1,87],$Vu=[1,78],$Vv=[1,88],$Vw=[1,100],$Vx=[1,99],$Vy=[1,101],$Vz=[1,102],$VA=[1,103],$VB=[1,104],$VC=[1,105],$VD=[1,77],$VE=[1,79],$VF=[1,80],$VG=[1,81],$VH=[1,82],$VI=[1,83],$VJ=[1,84],$VK=[1,85],$VL=[1,86],$VM=[1,92],$VN=[1,93],$VO=[1,94],$VP=[1,95],$VQ=[1,96],$VR=[1,97],$VS=[2,107],$VT=[8,37],$VU=[2,34],$VV=[1,116],$VW=[1,125],$VX=[1,126],$VY=[1,127],$VZ=[1,149],$V_=[1,133],$V$=[1,134],$V01=[1,135],$V11=[1,136],$V21=[1,137],$V31=[1,138],$V41=[1,139],$V51=[1,140],$V61=[1,141],$V71=[1,142],$V81=[1,143],$V91=[1,144],$Va1=[1,145],$Vb1=[1,146],$Vc1=[1,147],$Vd1=[1,148],$Ve1=[8,33,37,45,52,70,91,92,93,94,95,96,97,98,99,101,102,103,104,105,106,114],$Vf1=[2,133],$Vg1=[1,153],$Vh1=[1,154],$Vi1=[1,156],$Vj1=[2,138],$Vk1=[1,159],$Vl1=[1,175],$Vm1=[1,174],$Vn1=[1,180],$Vo1=[37,45],$Vp1=[1,187],$Vq1=[38,77],$Vr1=[1,219],$Vs1=[8,33,37,45,70,91,92,93,94,95,96,97,98,99,101,102,103,104,105,106,114],$Vt1=[8,33,37,45,70,98,99,114],$Vu1=[2,135],$Vv1=[2,136],$Vw1=[2,139],$Vx1=[1,223],$Vy1=[37,70],$Vz1=[8,33,37,45,52,69,70,91,92,93,94,95,96,97,98,99,101,102,103,104,105,106,114],$VA1=[1,242],$VB1=[8,33,37,38,45,52,69,70,91,92,93,94,95,96,97,98,99,101,102,103,104,105,106,114],$VC1=[1,257],$VD1=[8,33,37,45,70,91,92,97,98,99,101,102,103,104,105,106,114],$VE1=[8,33,37,45,70,91,92,93,94,95,97,98,99,101,102,103,104,105,106,114],$VF1=[8,33,37,45,70,98,99,101,102,103,104,105,106,114],$VG1=[8,33,37,45,70,98,99,105,106,114],$VH1=[8,33,37,45,70],$VI1=[31,32,35,63,86,87,88,89,90],$VJ1=[1,288],$VK1=[35,51,54],$VL1=[1,312],$VM1=[52,91,92,93,94,95,96,97,98,99,101,102,103,104,105,106,114],$VN1=[8,52,91,92,93,94,95,96,97,98,99,101,102,103,104,105,106,114];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"start":3,"instrucciones":4,"EOF":5,"instruccion":6,"print_instr":7,"PUNTOCOMA":8,"println_instr":9,"main_":10,"funciones":11,"declaracion":12,"asignacion":13,"if_llav_instr":14,"if_instr":15,"switch_instr":16,"break_instr":17,"continue_instr":18,"return_instr":19,"while_instr":20,"for_instr":21,"dowhile_instr":22,"for_in_instr":23,"decl_arr_instr":24,"llamada":25,"modif_arr_instr":26,"structs":27,"nat_push_instr":28,"tipo":29,"lista_simbolos":30,"RSTRUCT":31,"ID":32,"LLAVA":33,"instrucciones_struct":34,"LLAVC":35,"attribute":36,"COMA":37,"IGUAL":38,"expr":39,"INCRE":40,"DECRE":41,"RPRINT":42,"PARA":43,"lista_parametros":44,"PARC":45,"RPRINTLN":46,"RIF":47,"RELSE":48,"RSWITCH":49,"lista_cases":50,"RDEFAULT":51,"DOSPUNTOS":52,"case":53,"RCASE":54,"RBREAK":55,"RCONTINUE":56,"RRETURN":57,"RWHILE":58,"RDO":59,"RFOR":60,"actualizacion":61,"RIN":62,"RVOID":63,"RMAIN":64,"lista_parametros_func":65,"parametro_func":66,"lista_dim":67,"lista_exp_arr":68,"CORA":69,"CORC":70,"lista_exp_arr_c":71,"HASH":72,"lista_exp":73,"rango":74,"RBEGIN":75,"REND":76,"PUNTO":77,"RPUSH":78,"accesoAsignaStruct":79,"nat_matematicas":80,"RSIN":81,"RCOS":82,"RTAN":83,"RSQRT":84,"RLOG":85,"RINT":86,"RDOUBLE":87,"RSTRING":88,"RCHAR":89,"RBOOLEAN":90,"MAS":91,"MENOS":92,"MULTI":93,"DIV":94,"PORCENTAJE":95,"POTENCIA":96,"AMPERSON":97,"AND":98,"OR":99,"NOT":100,"MAYORQUE":101,"MAYORIGUAL":102,"MENORIGUAL":103,"MENORQUE":104,"IGUALIGUAL":105,"DIFERENTE":106,"ENTERO":107,"DECIMAL":108,"CADENA":109,"CHAR":110,"NULL":111,"TRUE":112,"FALSE":113,"INTERROGACION":114,"RPOP":115,"RLENGTH":116,"RCHAROFPOS":117,"RSUBSTRING":118,"RTOUPPER":119,"RTOLOWER":120,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"PUNTOCOMA",31:"RSTRUCT",32:"ID",33:"LLAVA",35:"LLAVC",37:"COMA",38:"IGUAL",40:"INCRE",41:"DECRE",42:"RPRINT",43:"PARA",45:"PARC",46:"RPRINTLN",47:"RIF",48:"RELSE",49:"RSWITCH",51:"RDEFAULT",52:"DOSPUNTOS",54:"RCASE",55:"RBREAK",56:"RCONTINUE",57:"RRETURN",58:"RWHILE",59:"RDO",60:"RFOR",62:"RIN",63:"RVOID",64:"RMAIN",69:"CORA",70:"CORC",72:"HASH",75:"RBEGIN",76:"REND",77:"PUNTO",78:"RPUSH",81:"RSIN",82:"RCOS",83:"RTAN",84:"RSQRT",85:"RLOG",86:"RINT",87:"RDOUBLE",88:"RSTRING",89:"RCHAR",90:"RBOOLEAN",91:"MAS",92:"MENOS",93:"MULTI",94:"DIV",95:"PORCENTAJE",96:"POTENCIA",97:"AMPERSON",98:"AND",99:"OR",100:"NOT",101:"MAYORQUE",102:"MAYORIGUAL",103:"MENORIGUAL",104:"MENORQUE",105:"IGUALIGUAL",106:"DIFERENTE",107:"ENTERO",108:"DECIMAL",109:"CADENA",110:"CHAR",111:"NULL",112:"TRUE",113:"FALSE",114:"INTERROGACION",115:"RPOP",116:"RLENGTH",117:"RCHAROFPOS",118:"RSUBSTRING",119:"RTOUPPER",120:"RTOLOWER"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,2],[6,1],[6,1],[6,2],[6,2],[6,1],[6,1],[6,1],[6,2],[6,2],[6,2],[6,1],[6,1],[6,2],[6,1],[6,2],[6,2],[6,2],[6,2],[6,2],[12,2],[27,5],[34,2],[34,1],[36,0],[36,3],[36,2],[30,3],[30,5],[30,1],[30,3],[13,3],[13,2],[13,2],[13,4],[7,4],[9,4],[14,7],[14,11],[14,9],[15,5],[15,7],[15,7],[16,7],[16,9],[16,10],[50,2],[50,1],[53,4],[44,3],[44,1],[17,1],[18,1],[19,2],[20,7],[22,8],[21,11],[21,11],[61,3],[61,2],[61,2],[23,7],[10,7],[10,6],[11,7],[11,8],[65,3],[65,1],[66,2],[66,1],[25,3],[25,4],[24,5],[67,3],[67,2],[68,4],[68,3],[68,2],[71,3],[71,1],[73,4],[73,3],[26,4],[74,3],[74,3],[74,3],[74,3],[28,6],[28,5],[79,3],[79,1],[80,1],[80,1],[80,1],[80,1],[80,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[39,3],[39,3],[39,3],[39,3],[39,3],[39,3],[39,3],[39,2],[39,3],[39,3],[39,3],[39,2],[39,3],[39,3],[39,3],[39,3],[39,3],[39,3],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,5],[39,2],[39,2],[39,3],[39,1],[39,2],[39,1],[39,3],[39,1],[39,3],[39,3],[39,4],[39,6],[39,3],[39,3],[39,4]],
>>>>>>> Stashed changes
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 console.log($$[$0-1]); this.$ = new Ast();  this.$.instrucciones = $$[$0-1]; return this.$; 
break;
case 2: case 27: case 51:
 this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 3: case 28:
 this.$= new Array(); this.$.push($$[$0]); 
break;
case 4: case 5: case 8: case 9: case 13: case 14: case 15: case 18: case 20: case 21: case 22: case 23: case 24: case 31:
 this.$ = $$[$0-1] 
break;
case 6: case 7: case 10: case 11: case 12: case 16: case 17: case 19:
 this.$ = $$[$0] 
break;
case 25:
 this.$ = new Declaracion($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 26:
 this.$ = new Struct($$[$0-3],$$[$0-1],_$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 30:
this.$ = new StructInStruct($$[$0-2],$$[$0-1],_$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 32:
 this.$ = $$[$0-2]; this.$.push(new Simbolo($$[$0],null,null,_$[$0-2].first_line, _$[$0-2].first_column,null)); 
break;
case 33:
 this.$ = $$[$0-4]; this.$.push(new Simbolo($$[$0-2],null,null,_$[$0-4].first_line, _$[$0-4].first_column,$$[$0])); 
break;
case 34:
 this.$ = new Array(); this.$.push(new Simbolo($$[$0],null,null,_$[$0].first_line, _$[$0].first_column,null)); 
break;
case 35:
 this.$ = new Array(); this.$.push(new Simbolo($$[$0-2],null,null,_$[$0-2].first_line, _$[$0-2].first_column,$$[$0])); 
break;
case 36: case 63:
 this.$ = new Asignacion($$[$0-2] ,$$[$0], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 37: case 64:
 this.$ = new Asignacion($$[$0-1] ,new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false), _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 38: case 65:
 this.$ = new Asignacion($$[$0-1] ,new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false), _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 39:
 this.$ = new DeclararStruct($$[$0-3],$$[$0-2],$$[$0],_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 40:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column, false); 
break;
case 41:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column, true); 
break;
case 42:
 this.$ = new If($$[$0-4], $$[$0-1], null,null, _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 43:
 this.$ = new If($$[$0-8], $$[$0-5], $$[$0-1],null, _$[$0-10].first_line, _$[$0-10].first_column); 
break;
case 44:
 this.$ = new If($$[$0-6], $$[$0-3],null, $$[$0], _$[$0-8].first_line, _$[$0-8].first_column); 
break;
case 45:
 this.$ = new Ifsinllave($$[$0-2], $$[$0], [], _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 46:
 this.$ = new Ifsinllave($$[$0-4], $$[$0-2], $$[$0], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 47:
 this.$ = new Ifsinllave($$[$0-4], $$[$0-2], [$$[$0]], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 48:
 this.$ = new Switch($$[$0-4], $$[$0-1], [], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 49:
 this.$ = new Switch($$[$0-6], [], $$[$0-1], _$[$0-8].first_line, _$[$0-8].first_column); 
break;
case 50:
 this.$ = new Switch($$[$0-7], $$[$0-4], $$[$0-1], _$[$0-9].first_line, _$[$0-9].first_column); 
break;
case 52: case 55:
 this.$ = new Array(); this.$.push($$[$0]);
break;
case 53:
 this.$ = new Case($$[$0-2], $$[$0], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 54: case 71: case 83:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 56:
 this.$ = new Detener(_$[$0].first_line, _$[$0].first_column); 
break;
case 57:
 this.$ = new Continuar(_$[$0].first_line, _$[$0].first_column); 
break;
case 58:
 this.$ = new Return($$[$0],_$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 59:
 this.$ = new While($$[$0-4], $$[$0-1], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 60:
 this.$ = new DoWhile($$[$0-1], $$[$0-5], _$[$0-7].first_line, _$[$0-7].last_column); 
break;
case 61: case 62:
 this.$ = new For($$[$0-8], $$[$0-6], $$[$0-4], $$[$0-1], _$[$0-10].first_line, _$[$0-10].first_column); 
break;
case 66:
 this.$ = new ForIn($$[$0-5], $$[$0-3], $$[$0-1], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 67:
this.$ = new Main($$[$0-1],_$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 68:
this.$ = new Main([],_$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 69:
 this.$ = new Funcion($$[$0-5], $$[$0-6], [], $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 70:
 this.$ = new Funcion($$[$0-6], $$[$0-7], $$[$0-4], $$[$0-1], _$[$0-7].first_line, _$[$0-7].last_column); 
break;
case 72: case 84:
 this.$ = new Array(); this.$.push($$[$0]); 
break;
case 73:
 this.$ = {"tipo" : $$[$0-1], "arreglo": false, "id": $$[$0]}; 
break;
case 74:
 this.$ = {"tipo" : TIPO.ANY, "arreglo": false, "id": $$[$0]}; 
break;
case 75:
 this.$ = new Llamada($$[$0-2] , [], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 76:
 this.$ = new Llamada($$[$0-3] , $$[$0-1] , _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 77:
 this.$ = new DeclaracionArr($$[$0-4], $$[$0-3], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 78:
 this.$ = $$[$0-2]; this.$.push($$[$0-1]+1); 
break;
case 79:
 this.$ = new Array(); this.$.push(1); 
break;
case 80: case 85:
 this.$ = $$[$0-3]; this.$.push($$[$0-1]); 
break;
case 81: case 86:
 this.$ = new Array(); this.$.push($$[$0-1]); 
break;
case 82:
 this.$ = new Copiar($$[$0], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 87:
 this.$ = new ModificacionArr($$[$0-3], $$[$0-2], $$[$0], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 88: case 89: case 90: case 91:
 this.$ = {"inicio": $$[$0-2], "fin": $$[$0]}; 
break;
case 92:
 this.$ = new Push(new Identificador($$[$0-5] , _$[$0-5].first_line, _$[$0-5].last_column), $$[$0-1], _$[$0-5].first_line, _$[$0-5].first_column); 
break;
<<<<<<< Updated upstream
case 93: case 94: case 95: case 96: case 97: case 100: case 101: case 139: case 151: case 152:
 this.$ = $$[$0]; 
break;
case 98:
 this.$ = new Parse($$[$0-5], $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); 
break;
case 99:
 this.$ = new To($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 102:
 this.$ = TIPO.ENTERO; 
break;
case 103:
 this.$ = TIPO.DECIMAL; 
break;
case 104:
 this.$ = TIPO.CADENA; 
break;
case 105:
 this.$ = TIPO.CHARACTER; 
break;
case 106:
 this.$ = TIPO.BOOLEANO; 
break;
case 107:
 this.$ = TIPO.VOID; 
break;
case 108:
 this.$ = TIPO.STRUCT; 
break;
case 109:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MAS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 110:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MENOS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 111:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POR,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 112:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.DIV,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 113:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MOD,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 114:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POT,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 115:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.AMPERSON,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 116:
 this.$ = new Aritmetica($$[$0],OperadorAritmetico.UMENOS,$$[$0], _$[$0-1].first_line, _$[$0-1].first_column, true); 
break;
case 117: case 138:
 this.$ = $$[$0-1]; 
break;
case 118:
 this.$ = new Logica($$[$0-2], OperadorLogico.AND, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 119:
 this.$ = new Logica($$[$0-2], OperadorLogico.OR, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 120:
 this.$ = new Logica($$[$0], OperadorLogico.NOT, null, $$[$0-1].first_line, $$[$0-1].last_column, true); 
break;
case 121:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 122:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 123:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 124:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 125:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.IGUALIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 126:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.DIFERENTE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 127:
 this.$ = new Primitivo(Number($$[$0]), TIPO.ENTERO, _$[$0].first_line, _$[$0].first_column); 
break;
case 128:
 this.$ = new Primitivo(Number($$[$0]), TIPO.DECIMAL, _$[$0].first_line, _$[$0].first_column); 
break;
case 129:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CADENA, _$[$0].first_line, _$[$0].first_column); 
break;
case 130:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CHARACTER, _$[$0].first_line, _$[$0].first_column); 
break;
case 131:
 this.$ = new Primitivo(null, TIPO.NULO, _$[$0].first_line, _$[$0].first_column); 
break;
case 132:
 this.$ = new Primitivo(true, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 133:
 this.$ = new Primitivo(false, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 134:
 this.$ = new Identificador($$[$0] , _$[$0].first_line, _$[$0].last_column); 
break;
case 135:
this.$ = new Ternario($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].first_column);
break;
case 136:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
case 137:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
case 140:
 this.$ = new AccesoArr($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 141:
 this.$ = new Rango(TIPO.RANGO, [$$[$0].inicio, $$[$0].fin], _$[$0].first_line, _$[$0].last_column); 
break;
case 142:
=======
case 93:
  
                                                // let first = $$[$0-4];
                                                // if (first instanceof Identificador)
                                                // {
                                                //     this.$ = new Asignacion(first.id ,$$[$0-2], _$[$0-4].first_line, _$[$0-4].last_column);
                                                // }else{
                                                    this.$ = new AsignaVariable(new Identificador($$[$0-4] , _$[$0-4].first_line, _$[$0-4].last_column),$$[$0-2],_$[$0-4].first_line, _$[$0-4].first_column);
                                                    // this.$ = $$[$0-4];
                                                    this.$.instruccion = new Asignacion(null ,$$[$0], _$[$0-4].first_line, _$[$0-4].last_column); 
                                                // }
                                            
break;
case 94:
   this.$ = new AsignaVariable($$[$0-2],new Identificador($$[$0] , _$[$0-2].first_line, _$[$0-2].last_column),_$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 95:
   this.$ = new Identificador($$[$0] , _$[$0].first_line, _$[$0].last_column);
break;
case 96: case 97: case 98: case 99: case 100: case 138:
 this.$ = $$[$0]; 
break;
case 101:
 this.$ = TIPO.ENTERO; 
break;
case 102:
 this.$ = TIPO.DECIMAL; 
break;
case 103:
 this.$ = TIPO.CADENA; 
break;
case 104:
 this.$ = TIPO.CHARACTER; 
break;
case 105:
 this.$ = TIPO.BOOLEANO; 
break;
case 106:
 this.$ = TIPO.VOID; 
break;
case 107:
 this.$ = TIPO.STRUCT; 
break;
case 108:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MAS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 109:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MENOS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 110:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POR,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 111:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.DIV,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 112:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MOD,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 113:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POT,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 114:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.AMPERSON,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 115:
 this.$ = new Aritmetica($$[$0],OperadorAritmetico.UMENOS,$$[$0], _$[$0-1].first_line, _$[$0-1].first_column, true); 
break;
case 116: case 137:
 this.$ = $$[$0-1]; 
break;
case 117:
 this.$ = new Logica($$[$0-2], OperadorLogico.AND, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 118:
 this.$ = new Logica($$[$0-2], OperadorLogico.OR, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 119:
 this.$ = new Logica($$[$0], OperadorLogico.NOT, null, $$[$0-1].first_line, $$[$0-1].last_column, true); 
break;
case 120:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 121:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 122:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 123:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 124:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.IGUALIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 125:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.DIFERENTE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 126:
 this.$ = new Primitivo(Number($$[$0]), TIPO.ENTERO, _$[$0].first_line, _$[$0].first_column); 
break;
case 127:
 this.$ = new Primitivo(Number($$[$0]), TIPO.DECIMAL, _$[$0].first_line, _$[$0].first_column); 
break;
case 128:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CADENA, _$[$0].first_line, _$[$0].first_column); 
break;
case 129:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CHARACTER, _$[$0].first_line, _$[$0].first_column); 
break;
case 130:
 this.$ = new Primitivo(null, TIPO.NULO, _$[$0].first_line, _$[$0].first_column); 
break;
case 131:
 this.$ = new Primitivo(true, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 132:
 this.$ = new Primitivo(false, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 133:
 this.$ = new Identificador($$[$0] , _$[$0].first_line, _$[$0].last_column); 
break;
case 134:
this.$ = new Ternario($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].first_column);
break;
case 135:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
case 136:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
case 139:
 this.$ = new AccesoArr($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 140:
 this.$ = new Rango(TIPO.RANGO, [$$[$0].inicio, $$[$0].fin], _$[$0].first_line, _$[$0].last_column); 
break;
case 141:
>>>>>>> Stashed changes
   if( $$[$0] instanceof Pop || $$[$0] instanceof Length || $$[$0] instanceof CharOfPos ||
                                            $$[$0] instanceof subString || $$[$0] instanceof toUpper || $$[$0] instanceof toLower){
                                            this.$ = $$[$0];
                                            let identifica =new Identificador($$[$0-2] , _$[$0-2].first_line, _$[$0-2].last_column);
                                            this.$.id = identifica.id;
                                        }else{
                                            this.$ = new AccesoStruct(new Identificador($$[$0-2] , _$[$0-2].first_line, _$[$0-2].last_column),$$[$0],_$[$0-2].first_line, _$[$0-2].first_column);
                                        }
                                    
break;
<<<<<<< Updated upstream
case 143:
 this.$ = new Arreglo(TIPO.ARREGLO, $$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 144:
 this.$ = new Pop(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 145:
 this.$ = new Length(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 146:
 this.$ = new CharOfPos(null, $$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 147:
 this.$ = new subString(null, $$[$0-3], $$[$0-1], _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 148:
 this.$ = new toUpper(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 149:
 this.$ = new toLower(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 150:
=======
case 142:
 this.$ = new Arreglo(TIPO.ARREGLO, $$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 143:
 this.$ = new Pop(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 144:
 this.$ = new Length(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 145:
 this.$ = new CharOfPos(null, $$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 146:
 this.$ = new subString(null, $$[$0-3], $$[$0-1], _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 147:
 this.$ = new toUpper(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 148:
 this.$ = new toLower(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 149:
>>>>>>> Stashed changes
 this.$ = new Matematicas($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 153:
 this.$ = new StringN($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 154:
 this.$ = new TypeOfN($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
}
},
<<<<<<< Updated upstream
table: [{3:1,4:2,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{1:[3]},{5:[1,44],6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o($Vi,[2,3]),{8:[1,46]},{8:[1,47]},o($Vj,[2,6]),o($Vj,[2,7]),{8:[1,48]},{8:[1,49]},o($Vj,[2,10]),o($Vj,[2,11]),o($Vj,[2,12]),{8:[1,50]},{8:[1,51]},{8:[1,52]},o($Vj,[2,16]),o($Vj,[2,17]),{8:[1,53]},o($Vj,[2,19]),{8:[1,54]},{8:$Vk},{8:[1,56]},{8:[1,57]},{8:[1,58]},{43:[1,59]},{43:[1,60]},o($Vl,$Vm,{64:[1,61]}),{30:63,32:$Vn,67:64,69:$Vo},{32:$Vp,38:$Vq,40:$Vr,41:$Vs,43:$Vt,69:$Vu,73:71,77:[1,72]},{43:[1,74]},{43:[1,75]},{8:[2,56]},{8:[2,57]},{25:89,29:110,31:$Vv,32:$Vw,39:76,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{43:[1,116]},{32:[1,118],43:[1,117]},{33:[1,119]},o([69,77],$V_,{32:[1,120]}),o($Vl,[2,102]),o($Vl,[2,103]),o($V$,$V01),o($Vl,[2,105]),o($Vl,[2,106]),{1:[2,1]},o($Vi,[2,2]),o($Vj,[2,4]),o($Vj,[2,5]),o($Vj,[2,8]),o($Vj,[2,9]),o($Vj,[2,13]),o($Vj,[2,14]),o($Vj,[2,15]),o($Vj,[2,18]),o($Vj,[2,20]),o($Vj,[2,21]),o($Vj,[2,22]),o($Vj,[2,23]),o($Vj,[2,24]),{25:89,29:110,31:$Vv,32:$Vw,39:122,43:$Vx,44:121,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:122,43:$Vx,44:123,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{43:[1,124]},o($V11,$V21,{38:$V31,43:[1,125]}),{8:[2,25],37:[1,127]},{32:[1,128],69:[1,129]},{70:[1,130]},{25:89,29:110,31:$Vv,32:$Vw,39:131,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{8:[2,37]},{8:[2,38]},{38:[1,132]},{25:89,29:110,31:$Vv,32:$Vw,39:122,43:$Vx,44:134,45:[1,133],63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{38:$V41,69:$V51},{78:$V61},{25:89,29:110,31:$Vv,32:$Vw,39:138,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:139,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:140,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{8:[2,58],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{25:89,29:110,31:$Vv,32:$Vw,39:158,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:159,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:160,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($Vo1,[2,127]),o($Vo1,[2,128]),o($Vo1,[2,129]),o($Vo1,[2,130]),o($Vo1,[2,131]),o($Vo1,[2,132]),o($Vo1,[2,133]),o($Vo1,$Vp1,{73:163,40:[1,161],41:[1,162],43:$Vt,69:$Vu,77:[1,164]}),{25:89,29:110,31:$Vv,32:$Vw,39:166,43:$Vx,63:$Vy,68:91,69:$Vz,71:165,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($Vo1,$Vq1),o($Vo1,[2,141]),o($Vo1,[2,143],{69:$Vr1}),{43:[1,168]},{43:[1,169]},{43:[1,170]},{43:[1,171]},{43:[1,172]},{43:[1,173]},{43:[1,174]},o($Vo1,[2,151]),o($Vo1,[2,152]),o($Vl,$V01,{43:[1,175]}),{43:[1,176]},{52:[1,177]},{32:[1,178]},{43:[2,93]},{43:[2,94]},{43:[2,95]},{43:[2,96]},{43:[2,97]},{77:$Vs1},{43:[1,180]},o($Vt1,$Vm),o($Vt1,$V_),{43:[2,100]},{43:[2,101]},{25:89,29:110,31:$Vv,32:$Vw,39:181,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{12:183,13:182,29:185,31:$Vv,32:[1,184],63:$Vy,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{62:[1,186]},{4:187,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{33:[1,188]},{37:$Vu1,45:[1,189]},o($Vv1,[2,55],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1}),{37:$Vu1,45:[1,191]},{45:[1,192]},{29:196,31:$Vv,32:$Vw1,45:[1,193],63:$Vy,65:194,66:195,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{25:89,29:110,31:$Vv,32:$Vw,39:198,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{32:[1,199]},{38:[1,200]},{70:[1,201]},o($V$,[2,79]),{8:[2,36],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{25:89,29:110,31:$Vv,32:$Vw,39:202,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($Vo1,[2,75]),{37:$Vu1,45:[1,203]},{25:89,29:110,31:$Vv,32:$Vw,39:204,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:205,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{43:[1,206]},{52:$V71,70:[1,207],96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{45:[1,208],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{45:[1,209],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{25:89,29:110,31:$Vv,32:$Vw,39:210,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:211,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:212,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:213,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:214,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:215,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:216,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:217,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:218,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:219,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:220,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:221,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:222,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:223,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:224,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:225,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:226,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,76:$Vx1,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($Vy1,[2,116],{52:$V71}),{45:[1,228],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},o($Vz1,[2,120],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1}),o($Vo1,$VA1),o($Vo1,$VB1),o($Vo1,$VC1,{69:$V51}),{25:89,29:110,31:$Vv,32:$Vw,39:229,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{37:$VD1,70:[1,230]},o($VE1,[2,84],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1}),{25:89,29:110,31:$Vv,32:$Vw,39:166,43:$Vx,63:$Vy,68:91,69:$Vz,71:232,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{45:[1,233]},{45:[1,234]},{25:89,29:110,31:$Vv,32:$Vw,39:235,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:236,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{45:[1,237]},{45:[1,238]},{25:89,29:110,31:$Vv,32:$Vw,39:239,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:240,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:241,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:243,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,76:[1,242],79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($VF1,[2,82]),{86:[1,244]},{25:89,29:110,31:$Vv,32:$Vw,39:245,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{45:[1,246],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{8:[1,247]},{8:[1,248]},{32:$Vp,38:$Vq,40:$Vr,41:$Vs},{30:63,32:[1,249]},{25:89,29:110,31:$Vv,32:$Vw,39:250,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,251],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{12:255,29:185,31:$Vv,32:$VG1,34:252,35:[2,29],36:253,63:$Vy,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{8:[2,40]},{25:89,29:110,31:$Vv,32:$Vw,39:256,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{8:[2,41]},{33:[1,257]},{33:[1,258]},{37:[1,260],45:[1,259]},o($Vv1,[2,72]),{32:[1,261]},o($Vv1,[2,74]),o($V11,[2,35],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1}),o($V11,[2,32],{38:[1,262]}),{68:263,69:[1,264],72:$VA},o($V$,[2,78]),{8:[2,39],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},o($Vo1,[2,76]),{8:[2,87],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{52:$V71,70:[1,265],96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{25:89,29:110,31:$Vv,32:$Vw,39:266,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($VH1,[2,86]),{6:268,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,33:$VI1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{33:[1,269]},o($VJ1,[2,109],{52:$V71,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1}),o($VJ1,[2,110],{52:$V71,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1}),o($VK1,[2,111],{52:$V71,101:$Vd1}),o($VK1,[2,112],{52:$V71,101:$Vd1}),o($VK1,[2,113],{52:$V71,101:$Vd1}),o($Vy1,[2,114],{52:$V71}),o($VJ1,[2,115],{52:$V71,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1}),o($Vz1,[2,118],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1}),o([8,33,37,45,70,104,119],[2,119],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1}),o($VL1,[2,121],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1}),o($VL1,[2,122],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1}),o($VL1,[2,123],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1}),o($VL1,[2,124],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1}),o($VM1,[2,125],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1}),o($VM1,[2,126],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1}),{52:[1,270],96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},o($VN1,[2,88],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1}),o($Vo1,[2,90]),o($Vo1,[2,117]),o($VJ1,[2,142],{52:$V71,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1}),o($VF1,[2,138]),{25:89,29:110,31:$Vv,32:$Vw,39:271,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{37:$VD1,70:[1,272]},o($Vo1,[2,144]),o($Vo1,[2,145]),{45:[1,273],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{37:[1,274],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},o($Vo1,[2,148]),o($Vo1,[2,149]),{45:[1,275],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{45:[1,276],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{45:[1,277],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},o($Vo1,[2,89]),o($VN1,[2,91],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1}),{43:[1,278]},{45:[1,279],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{33:[1,280]},{25:89,29:110,31:$Vv,32:$Vw,39:281,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{25:89,29:110,31:$Vv,32:$Vw,39:282,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($V11,$V21,{38:$V31}),{33:[1,283],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{58:[1,284]},{12:255,29:185,31:$Vv,32:$VG1,35:[1,285],36:286,63:$Vy,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o($VO1,[2,28]),{32:[1,287]},{8:[1,288]},o($Vv1,[2,54],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1}),{4:289,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,290],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{4:291,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{33:[1,292]},{29:196,31:$Vv,32:$Vw1,63:$Vy,66:293,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o($Vv1,[2,73]),{25:89,29:110,31:$Vv,32:$Vw,39:294,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{8:[2,77],69:$Vr1},{25:89,29:110,31:$Vv,32:$Vw,39:166,43:$Vx,63:$Vy,68:91,69:$Vz,71:295,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($VH1,[2,85]),{45:[1,296],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{4:297,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o($Vi,[2,45],{48:[1,298]}),{50:299,51:[1,300],53:301,54:$VP1},{25:89,29:110,31:$Vv,32:$Vw,39:303,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,76:$Vx1,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($VE1,[2,83],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1}),o($VF1,[2,80]),o($Vo1,[2,146]),{25:89,29:110,31:$Vv,32:$Vw,39:304,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($Vo1,[2,150]),o($Vo1,[2,153]),o($Vo1,[2,154]),{25:89,29:110,31:$Vv,32:$Vw,39:305,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($Vo1,[2,99]),{4:306,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{8:[1,307],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{8:[1,308],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{4:309,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{43:[1,310]},{8:[2,26]},o($VO1,[2,27]),{8:[1,311]},o($VO1,[2,31]),{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,312],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o($Vj,[2,68]),{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,313],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{4:314,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o($Vv1,[2,71]),o($V11,[2,33],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1}),{37:$VD1,70:[1,315]},{8:[2,92]},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,316],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{6:317,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:318,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{35:[1,319],51:[1,320],53:321,54:$VP1},{52:[1,322]},o($VQ1,[2,52]),{25:89,29:110,31:$Vv,32:$Vw,39:323,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($VN1,[2,135],{52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1}),{45:[1,324],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{45:[1,325],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,326],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{32:$VR1,61:327},{32:$VR1,61:329},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,330],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{25:89,29:110,31:$Vv,32:$Vw,39:331,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($VO1,[2,30]),o($Vj,[2,67]),o($Vj,[2,69]),{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,332],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o([8,69],[2,81]),o($Vi,[2,42],{48:[1,333]}),o($Vj,[2,46]),o($Vj,[2,47]),o($Vj,[2,48]),{52:[1,334]},o($VQ1,[2,51]),{4:335,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{52:[1,336],96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},o($Vo1,[2,147]),o($Vo1,[2,98]),o($Vj,[2,59]),{45:[1,337]},{38:[1,338],40:[1,339],41:[1,340]},{45:[1,341]},o($Vj,[2,66]),{45:[1,342],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},o($Vj,[2,70]),{14:344,33:[1,343],47:[1,345]},{4:346,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,347],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{4:348,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:350,26:22,27:23,28:24,29:351,31:$V0,32:[1,349],39:226,42:$V2,43:$Vx,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,68:91,69:$Vz,72:$VA,74:90,75:$VB,76:$Vx1,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{33:[1,352]},{25:89,29:110,31:$Vv,32:$Vw,39:353,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{45:[2,64]},{45:[2,65]},{33:[1,354]},{8:[2,60]},{4:355,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o($Vj,[2,44]),{43:[1,356]},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,357],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o($Vj,[2,49]),o($VQ1,[2,53],{7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,6:45,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh}),o($VS1,$Vp1,{73:360,32:$Vp,38:$Vq,40:[1,358],41:[1,359],43:$Vt,69:$Vu,77:[1,361]}),o($VS1,$Vq1,{8:$Vk}),{30:63,32:$Vn,67:64,69:$Vo,77:$Vs1},{4:362,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{45:[2,63],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},{4:363,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,364],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{25:89,29:110,31:$Vv,32:$Vw,39:365,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},o($Vj,[2,50]),o($VT1,$VA1),o($VT1,$VB1),o($VS1,$VC1,{38:$V41,69:$V51}),{25:89,29:110,31:$Vv,32:$Vw,39:229,43:$Vx,63:$Vy,68:91,69:$Vz,72:$VA,74:90,75:$VB,78:$V61,79:98,80:$VC,81:$VD,82:$VE,83:$VF,84:$VG,85:99,87:100,88:111,89:$VH,90:$VI,91:$Vd,92:$Ve,93:$VJ,94:$Vg,95:$Vh,97:$VK,105:$VL,112:$VM,113:$VN,114:$VO,115:$VP,116:$VQ,117:$VR,118:$VS,120:$VT,121:$VU,122:$VV,123:$VW,124:$VX,125:$VY,126:$VZ},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,366],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,367],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,91:$Vd,92:$Ve,93:$Vf,94:$Vg,95:$Vh},o($Vj,[2,43]),{45:[1,368],52:$V71,96:$V81,97:$V91,98:$Va1,99:$Vb1,100:$Vc1,101:$Vd1,102:$Ve1,103:$Vf1,104:$Vg1,106:$Vh1,107:$Vi1,108:$Vj1,109:$Vk1,110:$Vl1,111:$Vm1,119:$Vn1},o($Vj,[2,61]),o($Vj,[2,62]),{33:$VI1}],
defaultActions: {32:[2,56],33:[2,57],44:[2,1],67:[2,37],68:[2,38],105:[2,93],106:[2,94],107:[2,95],108:[2,96],109:[2,97],114:[2,100],115:[2,101],189:[2,40],191:[2,41],285:[2,26],296:[2,92],339:[2,64],340:[2,65],342:[2,60]},
=======
table: [{3:1,4:2,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{1:[3]},{5:[1,44],6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o($Vi,[2,3]),{8:[1,46]},{8:[1,47]},o($Vj,[2,6]),o($Vj,[2,7]),{8:[1,48]},{8:[1,49]},o($Vj,[2,10]),o($Vj,[2,11]),o($Vj,[2,12]),{8:[1,50]},{8:[1,51]},{8:[1,52]},o($Vj,[2,16]),o($Vj,[2,17]),{8:[1,53]},o($Vj,[2,19]),{8:[1,54]},{8:$Vk},{8:[1,56]},{8:[1,57]},{8:[1,58]},{43:[1,59]},{43:[1,60]},o($Vl,$Vm,{64:[1,61]}),{30:63,32:[1,62],67:64,69:[1,65]},{32:$Vn,38:$Vo,40:$Vp,41:$Vq,43:$Vr,69:$Vs,73:71,77:[1,72]},{43:[1,74]},{43:[1,75]},{8:[2,56]},{8:[2,57]},{25:89,32:$Vt,39:76,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{43:[1,106]},{32:[1,108],43:[1,107]},{33:[1,109]},{32:[1,110],69:$VS},o($Vl,[2,101]),o($Vl,[2,102]),o($Vl,[2,103]),o($Vl,[2,104]),o($Vl,[2,105]),{1:[2,1]},o($Vi,[2,2]),o($Vj,[2,4]),o($Vj,[2,5]),o($Vj,[2,8]),o($Vj,[2,9]),o($Vj,[2,13]),o($Vj,[2,14]),o($Vj,[2,15]),o($Vj,[2,18]),o($Vj,[2,20]),o($Vj,[2,21]),o($Vj,[2,22]),o($Vj,[2,23]),o($Vj,[2,24]),{25:89,32:$Vt,39:112,43:$Vu,44:111,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:112,43:$Vu,44:113,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{43:[1,114]},o($VT,$VU,{38:$VV,43:[1,115]}),{8:[2,25],37:[1,117]},{32:[1,118],69:[1,119]},{70:[1,120]},{25:89,32:$Vt,39:121,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{8:[2,37]},{8:[2,38]},{38:[1,122]},{25:89,32:$Vt,39:112,43:$Vu,44:124,45:[1,123],68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{38:$VW,69:$VX},{32:[1,129],78:$VY,79:128},{25:89,32:$Vt,39:130,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:131,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:132,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{8:[2,58],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{25:89,32:$Vt,39:150,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:151,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:152,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($Ve1,[2,126]),o($Ve1,[2,127]),o($Ve1,[2,128]),o($Ve1,[2,129]),o($Ve1,[2,130]),o($Ve1,[2,131]),o($Ve1,[2,132]),o($Ve1,$Vf1,{73:155,40:$Vg1,41:$Vh1,43:$Vr,69:$Vs,77:$Vi1}),{25:89,32:$Vt,39:158,43:$Vu,68:91,69:$Vv,71:157,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($Ve1,$Vj1),o($Ve1,[2,140]),o($Ve1,[2,142],{69:$Vk1}),{43:[1,160]},{43:[1,161]},{43:[1,162]},{43:[1,163]},{43:[1,164]},{43:[1,165]},{43:[1,166]},{52:[1,167]},{32:[1,168]},{43:[2,96]},{43:[2,97]},{43:[2,98]},{43:[2,99]},{43:[2,100]},{25:89,32:$Vt,39:169,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{12:171,13:170,29:173,31:$Vl1,32:[1,172],63:$Vm1,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{62:[1,176]},{4:177,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{33:[1,178]},{37:$Vn1,45:[1,179]},o($Vo1,[2,55],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1}),{37:$Vn1,45:[1,181]},{45:[1,182]},{29:186,31:$Vl1,32:$Vp1,45:[1,183],63:$Vm1,65:184,66:185,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{25:89,32:$Vt,39:188,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{32:[1,189]},{38:[1,190]},{70:[1,191]},o($Vl,[2,79]),{8:[2,36],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{25:89,32:$Vt,39:192,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($Ve1,[2,75]),{37:$Vn1,45:[1,193]},{25:89,32:$Vt,39:194,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:195,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{43:[1,196]},{38:[1,197],77:[1,198]},o($Vq1,[2,95]),{52:$VZ,70:[1,199],91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{45:[1,200],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{45:[1,201],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{25:89,32:$Vt,39:202,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:203,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:204,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:205,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:206,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:207,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:208,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:209,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:210,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:211,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:212,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:213,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:214,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:215,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:216,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:217,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:218,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,76:$Vr1,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($Vs1,[2,115],{52:$VZ}),{45:[1,220],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},o($Vt1,[2,119],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1}),o($Ve1,$Vu1),o($Ve1,$Vv1),o($Ve1,$Vw1,{69:$VX}),{25:89,32:$Vt,39:221,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{37:$Vx1,70:[1,222]},o($Vy1,[2,84],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1}),{25:89,32:$Vt,39:158,43:$Vu,68:91,69:$Vv,71:224,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{45:[1,225]},{45:[1,226]},{25:89,32:$Vt,39:227,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:228,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{45:[1,229]},{45:[1,230]},{25:89,32:$Vt,39:231,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:233,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,76:[1,232],80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($Vz1,[2,82]),{45:[1,234],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{8:[1,235]},{8:[1,236]},{32:$Vn,38:$Vo,40:$Vp,41:$Vq},{30:63,32:[1,237]},{32:$Vm},{32:$VS},{25:89,32:$Vt,39:238,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,239],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{12:243,29:173,31:$Vl1,32:$VA1,34:240,35:[2,29],36:241,63:$Vm1,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{8:[2,40]},{25:89,32:$Vt,39:244,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{8:[2,41]},{33:[1,245]},{33:[1,246]},{37:[1,248],45:[1,247]},o($Vo1,[2,72]),{32:[1,249]},o($Vo1,[2,74]),o($VT,[2,35],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1}),o($VT,[2,32],{38:[1,250]}),{68:251,69:[1,252],72:$Vw},o($Vl,[2,78]),{8:[2,39],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},o($Ve1,[2,76]),{8:[2,87],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{52:$VZ,70:[1,253],91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{25:89,32:$Vt,39:254,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:255,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{32:[1,256]},o($VB1,[2,86]),{6:258,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,33:$VC1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{33:[1,259]},o($VD1,[2,108],{52:$VZ,93:$V01,94:$V11,95:$V21,96:$V31}),o($VD1,[2,109],{52:$VZ,93:$V01,94:$V11,95:$V21,96:$V31}),o($VE1,[2,110],{52:$VZ,96:$V31}),o($VE1,[2,111],{52:$VZ,96:$V31}),o($VE1,[2,112],{52:$VZ,96:$V31}),o($Vs1,[2,113],{52:$VZ}),o($VD1,[2,114],{52:$VZ,93:$V01,94:$V11,95:$V21,96:$V31}),o($Vt1,[2,117],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1}),o([8,33,37,45,70,99,114],[2,118],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1}),o($VF1,[2,120],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41}),o($VF1,[2,121],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41}),o($VF1,[2,122],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41}),o($VF1,[2,123],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41}),o($VG1,[2,124],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,101:$V71,102:$V81,103:$V91,104:$Va1}),o($VG1,[2,125],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,101:$V71,102:$V81,103:$V91,104:$Va1}),{52:[1,260],91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},o($VH1,[2,88],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1}),o($Ve1,[2,90]),o($Ve1,[2,116]),o($VD1,[2,141],{52:$VZ,93:$V01,94:$V11,95:$V21,96:$V31}),o($Vz1,[2,137]),{25:89,32:$Vt,39:261,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{37:$Vx1,70:[1,262]},o($Ve1,[2,143]),o($Ve1,[2,144]),{45:[1,263],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{37:[1,264],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},o($Ve1,[2,147]),o($Ve1,[2,148]),{45:[1,265],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},o($Ve1,[2,89]),o($VH1,[2,91],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1}),{33:[1,266]},{25:89,32:$Vt,39:267,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{25:89,32:$Vt,39:268,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($VT,$VU,{38:$VV}),{33:[1,269],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{58:[1,270]},{12:243,29:173,31:$Vl1,32:$VA1,35:[1,271],36:272,63:$Vm1,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o($VI1,[2,28]),{32:[1,273]},{8:[1,274]},o($Vo1,[2,54],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1}),{4:275,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,276],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{4:277,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{33:[1,278]},{29:186,31:$Vl1,32:$Vp1,63:$Vm1,66:279,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o($Vo1,[2,73]),{25:89,32:$Vt,39:280,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{8:[2,77],69:$Vk1},{25:89,32:$Vt,39:158,43:$Vu,68:91,69:$Vv,71:281,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($VB1,[2,85]),{45:[1,282],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{8:[2,93],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},o($Vq1,[2,94]),{4:283,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o($Vi,[2,45],{48:[1,284]}),{50:285,51:[1,286],53:287,54:$VJ1},{25:89,32:$Vt,39:289,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,76:$Vr1,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($Vy1,[2,83],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1}),o($Vz1,[2,80]),o($Ve1,[2,145]),{25:89,32:$Vt,39:290,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($Ve1,[2,149]),{4:291,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{8:[1,292],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{8:[1,293],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{4:294,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{43:[1,295]},{8:[2,26]},o($VI1,[2,27]),{8:[1,296]},o($VI1,[2,31]),{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,297],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o($Vj,[2,68]),{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,298],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{4:299,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o($Vo1,[2,71]),o($VT,[2,33],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1}),{37:$Vx1,70:[1,300]},{8:[2,92]},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,301],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{6:302,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:303,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{35:[1,304],51:[1,305],53:306,54:$VJ1},{52:[1,307]},o($VK1,[2,52]),{25:89,32:$Vt,39:308,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($VH1,[2,134],{52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1}),{45:[1,309],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,310],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{32:$VL1,61:311},{32:$VL1,61:313},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,314],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{25:89,32:$Vt,39:315,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($VI1,[2,30]),o($Vj,[2,67]),o($Vj,[2,69]),{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,316],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o([8,69],[2,81]),o($Vi,[2,42],{48:[1,317]}),o($Vj,[2,46]),o($Vj,[2,47]),o($Vj,[2,48]),{52:[1,318]},o($VK1,[2,51]),{4:319,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{52:[1,320],91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},o($Ve1,[2,146]),o($Vj,[2,59]),{45:[1,321]},{38:[1,322],40:[1,323],41:[1,324]},{45:[1,325]},o($Vj,[2,66]),{45:[1,326],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},o($Vj,[2,70]),{14:328,33:[1,327],47:[1,329]},{4:330,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,331],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{4:332,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:334,26:22,27:23,28:24,29:28,31:$V0,32:[1,333],39:218,42:$V2,43:$Vu,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,76:$Vr1,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{33:[1,335]},{25:89,32:$Vt,39:336,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{45:[2,64]},{45:[2,65]},{33:[1,337]},{8:[2,60]},{4:338,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o($Vj,[2,44]),{43:[1,339]},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,340],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o($Vj,[2,49]),o($VK1,[2,53],{7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,6:45,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh}),o($VM1,$Vf1,{73:343,32:$Vn,38:$Vo,40:[1,341],41:[1,342],43:$Vr,69:$Vs,77:[1,344]}),o($VM1,$Vj1,{8:$Vk}),{4:345,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{45:[2,63],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},{4:346,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,347],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{25:89,32:$Vt,39:348,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},o($Vj,[2,50]),o($VN1,$Vu1),o($VN1,$Vv1),o($VM1,$Vw1,{38:$VW,69:$VX}),{25:89,32:[1,349],39:221,43:$Vu,68:91,69:$Vv,72:$Vw,74:90,75:$Vx,78:$VY,79:128,80:98,81:$Vy,82:$Vz,83:$VA,84:$VB,85:$VC,92:$VD,100:$VE,107:$VF,108:$VG,109:$VH,110:$VI,111:$VJ,112:$VK,113:$VL,115:$VM,116:$VN,117:$VO,118:$VP,119:$VQ,120:$VR},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,350],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},{6:45,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:28,31:$V0,32:$V1,35:[1,351],42:$V2,46:$V3,47:$V4,49:$V5,55:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,63:$Vc,86:$Vd,87:$Ve,88:$Vf,89:$Vg,90:$Vh},o($Vj,[2,43]),{45:[1,352],52:$VZ,91:$V_,92:$V$,93:$V01,94:$V11,95:$V21,96:$V31,97:$V41,98:$V51,99:$V61,101:$V71,102:$V81,103:$V91,104:$Va1,105:$Vb1,106:$Vc1,114:$Vd1},o([38,52,91,92,93,94,95,96,97,98,99,101,102,103,104,105,106,114],$Vf1,{73:155,40:$Vg1,41:$Vh1,43:$Vr,69:$Vs,77:$Vi1}),o($Vj,[2,61]),o($Vj,[2,62]),{33:$VC1}],
defaultActions: {32:[2,56],33:[2,57],44:[2,1],67:[2,37],68:[2,38],101:[2,96],102:[2,97],103:[2,98],104:[2,99],105:[2,100],174:[2,106],175:[2,107],179:[2,40],181:[2,41],271:[2,26],282:[2,92],323:[2,64],324:[2,65],326:[2,60]},
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
    const { Ternario } = require("../dist/Expresiones/Ternario");
    const { Llamada } = require("../dist/Expresiones/Llamada");
    /*..............     Operaciones      ...............*/
    const { Aritmetica } = require("../dist/Expresiones/Operaciones/Aritmeticas");
    const { Logica } = require("../dist/Expresiones/Operaciones/Logicas");
    const { Relacional } = require("../dist/Expresiones/Operaciones/Relacionales");
    /*::::::::::::::::::     Instrucciones      ::::::::::::::::::*/
    const { Print } = require("../dist/Instrucciones/Print");
    const { Main } = require("../dist/Instrucciones/Metodos/Main");
    const { Funcion } = require("../dist/Instrucciones/Metodos/Funcion");
    
    /*..............     Condicionales      ...............*/
    const { If } = require("../dist/Instrucciones/Condicionales/If");
    const { Ifsinllave } = require("../dist/Instrucciones/Condicionales/Ifsinllave");
    const { Switch } = require("../dist/Instrucciones/Condicionales/Switch");
    const { Case } = require("../dist/Instrucciones/Condicionales/Case");
    /*..............     Transferencia      ...............*/
    const { Detener } = require("../dist/Instrucciones/Transferencia/Break");
    const { Continuar } = require("../dist/Instrucciones/Transferencia/Continuar");
    const { Return } = require("../dist/Instrucciones/Transferencia/Return");
    /*..............     Ciclicas      ...............*/
    const { While } = require("../dist/Instrucciones/Ciclicas/While");
    const { DoWhile } = require("../dist/Instrucciones/Ciclicas/DoWhile");
    const { For } = require("../dist/Instrucciones/Ciclicas/For");
    const { ForIn } = require("../dist/Instrucciones/Ciclicas/ForIn");
    /*..............     Declaracion y asignacion      ...............*/
    const { Declaracion } = require("../dist/Instrucciones/Declaracion");
    const { Asignacion } = require("../dist/Instrucciones/Asignacion");
    const { Simbolo } = require("../dist/TablaSimbolos/Simbolo");
    /*..............     Arreglos      ...............*/
    const { DeclaracionArr } = require("../dist/Instrucciones/Arreglos/DeclaracionArr");
    const { AccesoArr } = require("../dist/Expresiones/Arreglos/AccesoArr");
    const { ModificacionArr } = require("../dist/Instrucciones/Arreglos/ModificacionArr");
    const { Rango } = require("../dist/Expresiones/Arreglos/Rango");
    const { Arreglo } = require("../dist/Expresiones/Arreglos/Arreglo");
    const { Copiar } = require("../dist/Expresiones/Arreglos/Copiar");
    /*..............     Struct      ...............*/
    const { Struct } = require("../dist/Instrucciones/Struct/Struct");
    const { DeclararStruct } = require("../dist/Instrucciones/Struct/DeclararStruct");
    const { AccesoStruct } = require("../dist/Expresiones/Struct/AccesoStruct");
    const { StructInStruct } = require("../dist/Instrucciones/Struct/StructInStruct");
    const { AsignaVariable } = require("../dist/Instrucciones/Struct/AsignaVariable");
    /* ..............      Nativas      ...............*/
    /* -------- Arreglos */
    const { Length } = require("../dist/Instrucciones/Metodos/Nativas/Length");
    const { Pop } = require("../dist/Instrucciones/Metodos/Nativas/Arreglos/Pop");
    const { Push } = require("../dist/Instrucciones/Metodos/Nativas/Arreglos/Push");
    /* -------- Cadenas */
    const { CharOfPos } = require("../dist/Instrucciones/Metodos/Nativas/Cadenas/CharOfPos");
    const { subString } = require("../dist/Instrucciones/Metodos/Nativas/Cadenas/subString");
    const { toUpper } = require("../dist/Instrucciones/Metodos/Nativas/Cadenas/toUpper");
    const { toLower } = require("../dist/Instrucciones/Metodos/Nativas/Cadenas/toLower");
    /* -------- Matematicas */
    const { Matematicas } = require("../dist/Instrucciones/Metodos/Nativas/Matematicas");
    /* -------- Numericas */
    const { Parse } = require("../dist/Instrucciones/Metodos/Nativas/Numericas/Parse");
    const { To } = require("../dist/Instrucciones/Metodos/Nativas/Numericas/To");
    /* -------- Generales */
    const { StringN } = require("../dist/Instrucciones/Metodos/Nativas/StringN");
    const { TypeOfN } = require("../dist/Instrucciones/Metodos/Nativas/TypeOfN");
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
case 5: return 42 
break;
case 6: return 46 
break;
case 7: return 47 
break;
case 8: return 48 
break;
case 9: return 49 
break;
case 10: return 54 
break;
case 11: return 51 
break;
case 12: return 58 
break;
case 13: return 60 
break;
case 14: return 59 
break;
case 15: return 62 
break;
<<<<<<< Updated upstream
case 16: return 116 
break;
case 17: return 117 
break;
case 18: return 118 
break;
case 19: return 91 
break;
case 20: return 92 
break;
case 21: return 95 
break;
case 22: return 94 
break;
case 23: return 93 
=======
case 16: return 111 
break;
case 17: return 112 
break;
case 18: return 113 
break;
case 19: return 86 
break;
case 20: return 87 
break;
case 21: return 90 
break;
case 22: return 89 
break;
case 23: return 88 
>>>>>>> Stashed changes
break;
case 24: return 63 
break;
case 25: return 64 
break;
case 26: return 31 
break;
case 27: return 55 
break;
case 28: return 56 
break;
case 29: return 57 
break;
case 30: return 75 
break;
case 31: return 76 
break;
<<<<<<< Updated upstream
case 32: return 120 
break;
case 33: return 78 
break;
case 34: return 121 
break;
case 35: return 122 
break;
case 36: return 123 
break;
case 37: return 124 
break;
case 38: return 125 
=======
case 32: return 115 
break;
case 33: return 78 
break;
case 34: return 116 
break;
case 35: return 117 
break;
case 36: return 118 
break;
case 37: return 119 
break;
case 38: return 120 
>>>>>>> Stashed changes
break;
case 39: return 81 
break;
case 40: return 82 
break;
case 41: return 83 
break;
case 42: return 85 
break;
case 43: return 84 
break;
case 44: return 86 
break;
case 45: return 89 
break;
case 46: return 91 
break;
<<<<<<< Updated upstream
case 47: return 126 
break;
case 48: return 40
break;
case 49: return 41
break;
case 50: return 96 
break;
case 51: return 97 
break;
case 52: return 98 
break;
case 53: return 99 
break;
case 54: return 100 
break;
case 55: return 101 
break;
case 56: return 107 
break;
case 57: return 108 
break;
case 58: return 109 
break;
case 59: return 106 
=======
case 47: return 92 
break;
case 48: return 93 
break;
case 49: return 94 
break;
case 50: return 95 
break;
case 51: return 96 
break;
case 52: return 102 
break;
case 53: return 103 
break;
case 54: return 104 
break;
case 55: return 101 
break;
case 56: return 106 
break;
case 57: return 105 
>>>>>>> Stashed changes
break;
case 60: return 111 
break;
<<<<<<< Updated upstream
case 61: return 110 
break;
case 62: return 38 
break;
case 63: return 103 
break;
case 64: return 104 
=======
case 59: return 98 
break;
case 60: return 99 
break;
case 61: return 100 
break;
case 62: return 97 
>>>>>>> Stashed changes
break;
case 65: return 105 
break;
case 66: return 102 
break;
case 67: return 43 
break;
case 68: return 45 
break;
case 69: return 69 
break;
case 70: return 70 
break;
case 71: return 33 
break;
case 72: return 35 
break;
case 73: return 77 
break;
<<<<<<< Updated upstream
case 74: return 8 
=======
case 72: return 114 
>>>>>>> Stashed changes
break;
case 75: return 37 
break;
case 76: return 119 
break;
<<<<<<< Updated upstream
case 77: return 52 
break;
case 78: return 72 
=======
case 75:return 108;
break;
case 76:return 107;
>>>>>>> Stashed changes
break;
case 79:return 113;
break;
<<<<<<< Updated upstream
case 80:return 112;
break;
case 81:return 32;
=======
case 78:return 109;
break;
case 79:return 110;
>>>>>>> Stashed changes
break;
case 82:return 114;
break;
case 83:return 115;
break;
case 84:
                                        console.error('Este es un error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column);
                                    
break;
case 85:/* skip whitespace */
break;
case 86:return 5
break;
}
},
rules: [/^(?:\/\/.*)/i,/^(?:\/\*)/i,/^(?:\*\/)/i,/^(?:.)/i,/^(?:\s+)/i,/^(?:print\b)/i,/^(?:println\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:switch\b)/i,/^(?:case\b)/i,/^(?:default\b)/i,/^(?:while\b)/i,/^(?:for\b)/i,/^(?:do\b)/i,/^(?:in\b)/i,/^(?:null\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:boolean\b)/i,/^(?:char\b)/i,/^(?:String\b)/i,/^(?:void\b)/i,/^(?:main\b)/i,/^(?:struct\b)/i,/^(?:break\b)/i,/^(?:continue\b)/i,/^(?:return\b)/i,/^(?:begin\b)/i,/^(?:end\b)/i,/^(?:pop\b)/i,/^(?:push\b)/i,/^(?:lenght\b)/i,/^(?:caracterOfPosition\b)/i,/^(?:subString\b)/i,/^(?:toUppercase\b)/i,/^(?:toLowercase\b)/i,/^(?:sin\b)/i,/^(?:cos\b)/i,/^(?:tan\b)/i,/^(?:log10\b)/i,/^(?:sqrt\b)/i,/^(?:parse\b)/i,/^(?:toInt\b)/i,/^(?:toDouble\b)/i,/^(?:typeof\b)/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:%)/i,/^(?:\^)/i,/^(?:>=)/i,/^(?:<=)/i,/^(?:<)/i,/^(?:>)/i,/^(?:!=)/i,/^(?:==)/i,/^(?:=)/i,/^(?:&&)/i,/^(?:\|\|)/i,/^(?:!)/i,/^(?:&)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\{)/i,/^(?:\})/i,/^(?:\.)/i,/^(?:;)/i,/^(?:,)/i,/^(?:\?)/i,/^(?::)/i,/^(?:#)/i,/^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/i,/^(?:[0-9]+)/i,/^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ]*)/i,/^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/i,/^(?:('((\\([\'\"\\bfnrtv]))|([^\'\\]))'))/i,/^(?:.)/i,/^(?:[\r\n\t])/i,/^(?:$)/i],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86],"inclusive":true}}
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
<<<<<<< Updated upstream
},{"../dist/Ast/Ast":5,"../dist/Expresiones/Arreglos/AccesoArr":8,"../dist/Expresiones/Arreglos/Arreglo":9,"../dist/Expresiones/Arreglos/Copiar":10,"../dist/Expresiones/Arreglos/Rango":11,"../dist/Expresiones/Identificador":12,"../dist/Expresiones/Llamada":13,"../dist/Expresiones/Operaciones/Aritmeticas":14,"../dist/Expresiones/Operaciones/Logicas":15,"../dist/Expresiones/Operaciones/Relacionales":16,"../dist/Expresiones/Primitivo":17,"../dist/Expresiones/Struct/AccesoStruct":18,"../dist/Expresiones/Ternario":19,"../dist/Instrucciones/Arreglos/DeclaracionArr":20,"../dist/Instrucciones/Arreglos/ModificacionArr":21,"../dist/Instrucciones/Asignacion":22,"../dist/Instrucciones/Ciclicas/DoWhile":23,"../dist/Instrucciones/Ciclicas/For":24,"../dist/Instrucciones/Ciclicas/ForIn":25,"../dist/Instrucciones/Ciclicas/While":26,"../dist/Instrucciones/Condicionales/Case":27,"../dist/Instrucciones/Condicionales/If":28,"../dist/Instrucciones/Condicionales/Ifsinllave":29,"../dist/Instrucciones/Condicionales/Switch":30,"../dist/Instrucciones/Declaracion":31,"../dist/Instrucciones/Metodos/Funcion":32,"../dist/Instrucciones/Metodos/Main":33,"../dist/Instrucciones/Metodos/Nativas/Arreglos/Pop":34,"../dist/Instrucciones/Metodos/Nativas/Arreglos/Push":35,"../dist/Instrucciones/Metodos/Nativas/Cadenas/CharOfPos":36,"../dist/Instrucciones/Metodos/Nativas/Cadenas/subString":37,"../dist/Instrucciones/Metodos/Nativas/Cadenas/toLower":38,"../dist/Instrucciones/Metodos/Nativas/Cadenas/toUpper":39,"../dist/Instrucciones/Metodos/Nativas/Length":40,"../dist/Instrucciones/Metodos/Nativas/Matematicas":41,"../dist/Instrucciones/Metodos/Nativas/Numericas/Parse":42,"../dist/Instrucciones/Metodos/Nativas/Numericas/To":43,"../dist/Instrucciones/Metodos/Nativas/StringN":44,"../dist/Instrucciones/Metodos/Nativas/TypeOfN":45,"../dist/Instrucciones/Print":46,"../dist/Instrucciones/Struct/DeclararStruct":47,"../dist/Instrucciones/Struct/Struct":48,"../dist/Instrucciones/Struct/StructInStruct":49,"../dist/Instrucciones/Transferencia/Break":50,"../dist/Instrucciones/Transferencia/Continuar":51,"../dist/Instrucciones/Transferencia/Return":52,"../dist/TablaSimbolos/Simbolo":53,"../dist/TablaSimbolos/Tipo":55,"_process":3,"fs":1,"path":2}],5:[function(require,module,exports){
=======
},{"../dist/Ast/Ast":5,"../dist/Expresiones/Arreglos/AccesoArr":8,"../dist/Expresiones/Arreglos/Arreglo":9,"../dist/Expresiones/Arreglos/Copiar":10,"../dist/Expresiones/Arreglos/Rango":11,"../dist/Expresiones/Identificador":12,"../dist/Expresiones/Llamada":13,"../dist/Expresiones/Operaciones/Aritmeticas":14,"../dist/Expresiones/Operaciones/Logicas":15,"../dist/Expresiones/Operaciones/Relacionales":16,"../dist/Expresiones/Primitivo":17,"../dist/Expresiones/Struct/AccesoStruct":18,"../dist/Expresiones/Ternario":19,"../dist/Instrucciones/Arreglos/DeclaracionArr":20,"../dist/Instrucciones/Arreglos/ModificacionArr":21,"../dist/Instrucciones/Asignacion":22,"../dist/Instrucciones/Ciclicas/DoWhile":23,"../dist/Instrucciones/Ciclicas/For":24,"../dist/Instrucciones/Ciclicas/ForIn":25,"../dist/Instrucciones/Ciclicas/While":26,"../dist/Instrucciones/Condicionales/Case":27,"../dist/Instrucciones/Condicionales/If":28,"../dist/Instrucciones/Condicionales/Ifsinllave":29,"../dist/Instrucciones/Condicionales/Switch":30,"../dist/Instrucciones/Declaracion":31,"../dist/Instrucciones/Metodos/Funcion":32,"../dist/Instrucciones/Metodos/Main":33,"../dist/Instrucciones/Metodos/Nativas/Arreglos/Pop":34,"../dist/Instrucciones/Metodos/Nativas/Arreglos/Push":35,"../dist/Instrucciones/Metodos/Nativas/Cadenas/CharOfPos":36,"../dist/Instrucciones/Metodos/Nativas/Cadenas/subString":37,"../dist/Instrucciones/Metodos/Nativas/Cadenas/toLower":38,"../dist/Instrucciones/Metodos/Nativas/Cadenas/toUpper":39,"../dist/Instrucciones/Metodos/Nativas/Length":40,"../dist/Instrucciones/Metodos/Nativas/Matematicas":41,"../dist/Instrucciones/Print":42,"../dist/Instrucciones/Struct/AsignaVariable":43,"../dist/Instrucciones/Struct/DeclararStruct":44,"../dist/Instrucciones/Struct/Struct":45,"../dist/Instrucciones/Struct/StructInStruct":46,"../dist/Instrucciones/Transferencia/Break":47,"../dist/Instrucciones/Transferencia/Continuar":48,"../dist/Instrucciones/Transferencia/Return":49,"../dist/TablaSimbolos/Simbolo":50,"../dist/TablaSimbolos/Tipo":52,"_process":3,"fs":1,"path":2}],5:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
const DeclararStruct_1 = require("./../Instrucciones/Struct/DeclararStruct");
const Asignacion_1 = require("../Instrucciones/Asignacion");
const Declaracion_1 = require("../Instrucciones/Declaracion");
const Main_1 = require("../Instrucciones/Metodos/Main");
const Funcion_1 = require("../Instrucciones/Metodos/Funcion");
const Break_1 = require("../Instrucciones/Transferencia/Break");
const Continuar_1 = require("../Instrucciones/Transferencia/Continuar");
const Return_1 = require("../Instrucciones/Transferencia/Return");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
const Errores_1 = require("./Errores");
const Struct_1 = require("../Instrucciones/Struct/Struct");
const DeclaracionArr_1 = require("../Instrucciones/Arreglos/DeclaracionArr");
const ModificacionArr_1 = require("../Instrucciones/Arreglos/ModificacionArr");
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
        // this.TSglobal =  null;
        this.dot = "";
        this.contador = 0;
        this.strEntorno = "";
        this.TSglobal = new TablaSimbolos_1.TablaSimbolos(null);
    }
    ejecutar() {
        let tree = this;
        tree.setTSGlobal(new TablaSimbolos_1.TablaSimbolos(null));
        // 1ERA PASADA: 
        // GUARDAR FUNCIONES  Y METODOS
        for (let instr of this.instrucciones) {
            // let value = null;
            if (instr instanceof Funcion_1.Funcion) {
                this.addFunction(instr);
            }
            if (instr instanceof Struct_1.Struct) {
                this.addStruct(instr);
            }
            if (instr instanceof Declaracion_1.Declaracion || instr instanceof Asignacion_1.Asignacion || instr instanceof DeclaracionArr_1.DeclaracionArr || instr instanceof DeclararStruct_1.DeclararStruct || instr instanceof ModificacionArr_1.ModificacionArr) {
                let value = instr.ejecutar(this.TSglobal, tree);
                if (value instanceof Errores_1.Errores) {
                    this.getErrores().push(value);
                    this.updateConsolaPrintln(value.toString());
                }
                if (value instanceof Break_1.Detener) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if (value instanceof Continuar_1.Continuar) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Continue fuera de Instruccion Ciclo", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if (value instanceof Return_1.Return) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Return fuera de Metodos/Control/Ciclos", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
            }
        }
        // 2DA PASADA
        // EJECUTAMOS TODAS LAS FUNCIONES
        for (let instr of this.instrucciones) {
            let countMain = 0;
            if (instr instanceof Main_1.Main) {
                countMain++;
                if (countMain == 2) {
                    let error = new Errores_1.Errores("Semantico", "Existe mas de un metodo main", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                    break;
                }
                let value = instr.ejecutar(this.TSglobal, tree);
                if (value instanceof Break_1.Detener) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if (value instanceof Continuar_1.Continuar) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Continue fuera de Instruccion Ciclo", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
                if (value instanceof Return_1.Return) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Return fuera de Metodos/Control/Ciclos", instr.fila, instr.columna);
                    this.getErrores().push(error);
                    this.updateConsolaPrintln(error.toString());
                }
            }
            // instr.ejecutar(this.TSglobal, this);
        }
        ;
        // 3RA PASADA
        // VALIDACION FUERA DE MAIN
        for (let instr of this.instrucciones) {
            if (!(instr instanceof Declaracion_1.Declaracion || instr instanceof Asignacion_1.Asignacion || instr instanceof Main_1.Main || instr instanceof Funcion_1.Funcion || instr instanceof Struct_1.Struct || instr instanceof DeclaracionArr_1.DeclaracionArr || instr instanceof ModificacionArr_1.ModificacionArr)) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Fuera de main", instr.fila, instr.columna);
                this.getErrores().push(error);
                this.updateConsolaPrintln(error.toString());
            }
        }
    }
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
        this.printInHtml(cadena + '\n');
    }
    updateConsolaPrint(cadena) {
        // console.log("cad print: " + cadena);
        // document.getElementById("textAreaConsola")
        this.consola += cadena;
        this.printInHtml(cadena);
    }
    printInHtml(cadena) {
        let textarea = document.querySelector('#textAreaConsola');
        let value = textarea.value;
        value += cadena;
        textarea.value = value;
    }
    getTSGlobal() {
        return this.TSglobal;
    }
    setTSGlobal(TSglobal) {
        this.TSglobal = TSglobal;
    }
    getFunction(name) {
        let tree = this;
        // console.log(name);
        // console.log(this.funciones);
        // this.funciones.forEach(function (func) {
        for (let func of tree.funciones) {
            // console.log(func);
            if (func.id == name) {
                return func;
            }
        }
        return null;
    }
    addFunction(funcion) {
        // console.log(funcion.id);
        this.funciones.push(funcion);
        // console.log(this.funciones)
        // console.log("entre funciont add");
    }
    getStruct(name) {
        let tree = this;
        // this.structs.forEach(struct => {
        for (let struct of tree.structs) {
            if (struct.id == name) {
                return struct;
            }
        }
        return null;
    }
    addStruct(struct) {
        this.structs.push(struct);
    }
}
exports.Ast = Ast;

<<<<<<< Updated upstream
},{"../Instrucciones/Arreglos/DeclaracionArr":20,"../Instrucciones/Arreglos/ModificacionArr":21,"../Instrucciones/Asignacion":22,"../Instrucciones/Declaracion":31,"../Instrucciones/Metodos/Funcion":32,"../Instrucciones/Metodos/Main":33,"../Instrucciones/Struct/Struct":48,"../Instrucciones/Transferencia/Break":50,"../Instrucciones/Transferencia/Continuar":51,"../Instrucciones/Transferencia/Return":52,"../TablaSimbolos/TablaSimbolos":54,"./../Instrucciones/Struct/DeclararStruct":47,"./Errores":6}],6:[function(require,module,exports){
=======
},{"../Instrucciones/Arreglos/DeclaracionArr":20,"../Instrucciones/Arreglos/ModificacionArr":21,"../Instrucciones/Asignacion":22,"../Instrucciones/Declaracion":31,"../Instrucciones/Metodos/Funcion":32,"../Instrucciones/Metodos/Main":33,"../Instrucciones/Struct/Struct":45,"../Instrucciones/Transferencia/Break":47,"../Instrucciones/Transferencia/Continuar":48,"../Instrucciones/Transferencia/Return":49,"../TablaSimbolos/TablaSimbolos":51,"./../Instrucciones/Struct/DeclararStruct":44,"./Errores":6}],6:[function(require,module,exports){
>>>>>>> Stashed changes
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
    toString() {
        return this.tipo + " - " + this.descripcion + " [" + String(this.fila) + "," + String(this.columna) + "]";
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
exports.AccesoArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Rango_1 = require("./Rango");
class AccesoArr {
    constructor(id, expresiones, fila, columna) {
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (this.expresiones instanceof AccesoArr) {
            return this.expresiones.ejecutar(table, tree);
        }
        let simbolo = table.getSymbolTabla(this.id);
        if (simbolo == null) {
            return new Errores_1.Errores("Semantico", "No se encontro la variable " + this.id + ".", this.fila, this.columna);
        }
        this.tipo = simbolo.getTipo();
        if (!simbolo.getArreglo()) {
            return new Errores_1.Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
        }
        // console.log("AccArr exp val: " + this.expresiones[0]);
        // console.log("AccArr exp size: " + this.expresiones[0].length);
        // console.log("AccArr exp type: " + (this.expresiones[0].tipo));
        if (this.expresiones[0] instanceof Rango_1.Rango) {
            // console.log("AccArr RANK");
            let rank = this.expresiones[0].ejecutar(table, tree);
            // console.log("AccArr rank type: " + (rank instanceof Array));
            // console.log("rank[0] type: " + (typeof(rank[0]) == "string"));
            // console.log("rank accArr: " + rank);
            if (rank == null) {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.id + "\', no es un rango.", this.fila, this.columna);
            }
            let begin;
            if (rank[0] == "begin") {
                begin = 0;
            }
            else {
                begin = rank[0].ejecutar(table, tree);
            }
            if (begin instanceof Errores_1.Errores) {
                return begin;
            }
            let end;
            if (rank[1] == "end") {
                end = simbolo.getValor().length;
            }
            else {
                end = rank[1].ejecutar(table, tree);
            }
            if (end instanceof Errores_1.Errores) {
                return end;
            }
            // console.log("begin: " + begin);
            // console.log("end: " + end);
            let array = [];
            let contador = begin;
            while (contador <= end) {
                array.push(simbolo.getValor()[contador]);
                contador++;
            }
            return array;
        }
        else {
            // console.log("AccArr NOT RANK");
            let value = this.buscarDimensiones(table, tree, this.expresiones, simbolo.getValor());
            // console.log("val acc arr: " + value);
            if (value instanceof Errores_1.Errores) {
                return value;
            }
            if (value instanceof Array) {
                return new Errores_1.Errores("Semantico", "Acceso a arreglo incompleto.", this.fila, this.columna);
            }
            return value;
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
    buscarDimensiones(table, tree, expresiones, arreglo) {
        let value = null;
        if (expresiones.length == 0) {
            return arreglo;
        }
        if (!(arreglo instanceof Array)) {
            return new Errores_1.Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        let dimension = expresiones.pop();
        let num = dimension.ejecutar(table, tree);
        if (num instanceof Errores_1.Errores) {
            return num;
        }
        if (dimension.tipo != Tipo_1.TIPO.ENTERO) {
            return new Errores_1.Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        value = this.buscarDimensiones(tree, table, expresiones, arreglo[num]);
        return value;
    }
}
exports.AccesoArr = AccesoArr;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/Tipo":55,"./Rango":11}],9:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/Tipo":52,"./Rango":11}],9:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arreglo = void 0;
const Nodo_1 = require("../../Ast/Nodo");
class Arreglo {
    constructor(tipo, valor, fila, columna) {
        this.tipo = tipo;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        return this.valor;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Rango", "");
        return padre;
    }
}
exports.Arreglo = Arreglo;

},{"../../Ast/Nodo":7}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Copiar = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Errores_1 = require("../../Ast/Errores");
class Copiar {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("COPARR: " + this.id);
        let simbolo = table.getSymbolTabla(this.id.toString());
        if (simbolo != null) {
            if (simbolo.getArreglo()) {
                this.tipo = simbolo.getTipo();
                return simbolo.getValor();
            }
            else {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "No se encontro la variable " + this.id + ".", this.fila, this.columna);
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Rango", "");
        return padre;
    }
}
exports.Copiar = Copiar;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rango = void 0;
const Nodo_1 = require("../../Ast/Nodo");
class Rango {
    constructor(tipo, valor, fila, columna) {
        this.tipo = tipo;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // let valor = [];
        // this.valor.push(this.inicio);
        // valor.push(this.fin);
        return this.valor;
    }
    getValor() {
        return this.inicio + "," + this.fin;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Rango", "");
        return padre;
    }
}
exports.Rango = Rango;

},{"../../Ast/Nodo":7}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identificador = void 0;
const Errores_1 = require("../Ast/Errores");
const Tipo_1 = require("../TablaSimbolos/Tipo");
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
        // console.log((table));
        // table.getSymbolTabla(this.id);
        this.symbol = table.getSymbolTabla(this.id);
        // console.log(table.getSymbolTabla(this.id));
        if (this.symbol == null) {
            return new Errores_1.Errores("Semantico", "Variable " + this.id + " NO coincide con la busqueda", this.fila, this.columna);
        }
        this.tipo = this.symbol.getTipo();
        // console.log(`tipo id: ${this.tipo}`)
        if (this.tipo == Tipo_1.TIPO.STRUCT) {
            this.tipoStruct = this.symbol.getTipoStruct();
            return this.symbol;
        }
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

<<<<<<< Updated upstream
},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Tipo":55}],13:[function(require,module,exports){
=======
},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Tipo":52}],13:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Errores_1 = require("../Ast/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Llamada {
    constructor(id, parameters, fila, columna, arreglo = false) {
        this.arreglo = false;
        this.id = id;
        this.parameters = parameters;
        this.fila = fila;
        this.columna = columna;
        this.arreglo = arreglo;
    }
    ejecutar(table, tree) {
        let resultFunc = tree.getFunction(this.id);
        if (resultFunc == null) {
            return new Errores_1.Errores("Semantico", "Funcion no encontrada en asignacion", this.fila, this.columna);
        }
        // Ejecutando parametros
        let newTable = new TablaSimbolos_1.TablaSimbolos(tree.getTSGlobal());
        // valido tama;o de   parametros parameters de funcion y parametros de llamada
        if (this.parameters.length == resultFunc.parameters.length) {
            let count = 0;
            for (let expr of this.parameters) {
                let valueExpr = expr.ejecutar(table, tree);
                if (valueExpr instanceof Errores_1.Errores) {
                    return new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                }
                if (resultFunc.parameters[count].tipo == expr.tipo || resultFunc.parameters[count].tipo == Tipo_1.TIPO.ANY) //Valida Tipos
                 {
                    let symbol;
                    if (resultFunc.parameters[count].tipo == Tipo_1.TIPO.ANY) {
                        alert("valexp ll: " + valueExpr);
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), expr.tipo, this.arreglo, this.fila, this.columna, valueExpr); // seteo para variables nativas
                    }
                    else {
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), resultFunc.parameters[count].tipo, this.arreglo, this.fila, this.columna, valueExpr);
                    }
                    let resultTable = newTable.setSymbolTabla(symbol);
                    if (resultTable instanceof Errores_1.Errores)
                        return resultTable;
                }
                else {
                    return new Errores_1.Errores("Semantico", "Verificacion de Tipo de Parametros no coincide", this.fila, this.columna);
                }
                count++;
            }
        }
        else {
            console.log(`tam param call: ${this.parameters.length} func ${resultFunc.parameters.length}`);
            return new Errores_1.Errores("Semantico", "Tamaño de Tipo de Parametros no coincide", this.fila, this.columna);
        }
        let valor = resultFunc.ejecutar(newTable, tree);
        if (valor instanceof Errores_1.Errores) {
            return valor;
        }
        this.tipo = resultFunc.tipo;
        return valor;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Llamada = Llamada;

<<<<<<< Updated upstream
},{"../Ast/Errores":6,"../TablaSimbolos/Simbolo":53,"../TablaSimbolos/TablaSimbolos":54,"../TablaSimbolos/Tipo":55}],14:[function(require,module,exports){
=======
},{"../Ast/Errores":6,"../TablaSimbolos/Simbolo":50,"../TablaSimbolos/TablaSimbolos":51,"../TablaSimbolos/Tipo":52}],14:[function(require,module,exports){
>>>>>>> Stashed changes
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
                // if (this.exp1.tipo == TIPO.CADENA && this.exp2.tipo == TIPO.CADENA ){
                this.tipo = Tipo_1.TIPO.CADENA;
                return valor_exp1.toString() + valor_exp2.toString();
                // }else{
                // return new Errores("Semantico", "Concatenacion - Error de tipo ", this.fila, this.columna);
                // }
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

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":55}],15:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":52}],15:[function(require,module,exports){
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":55}],16:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":52}],16:[function(require,module,exports){
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
},{"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":55}],17:[function(require,module,exports){
=======
},{"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":52}],17:[function(require,module,exports){
>>>>>>> Stashed changes
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

},{"../Ast/Nodo":7}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoStruct = void 0;
const Errores_1 = require("../../Ast/Errores");
const Struct_1 = require("../../Instrucciones/Struct/Struct");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Identificador_1 = require("../Identificador");
class AccesoStruct {
    constructor(idStruct, expresiones, fila, columna) {
        this.idStruct = idStruct;
        this.expresiones = expresiones;
        this.fila = fila,
            this.columna = columna;
        this.tipo = Tipo_1.TIPO.STRUCT;
    }
    ejecutar(table, tree) {
        if (!(this.idStruct instanceof Identificador_1.Identificador)) {
            return new Errores_1.Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO ID", this.fila, this.columna);
        }
        console.log("acceso");
        let simboloStruct = this.idStruct.ejecutar(table, tree);
        // this.id= this.idStruct.id; 
        if (simboloStruct == null) {
            return new Errores_1.Errores("Semantico", "AccesoStruct " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        }
        // if (simboloStruct.tipo != TIPO.STRUCT)
        // {
        //     return new Errores("Semantico", "Struct " + this.id + " NO es TIPO STRUCT", this.fila, this.columna);
        // }
        // Acceso atributos
        // let value = this.accesoAttribute(this.expresiones, simboloStruct.valor)
        console.log(this.idStruct);
        console.log(this.expresiones);
        console.log(simboloStruct);
        if (!(this.expresiones instanceof Identificador_1.Identificador || this.expresiones instanceof AccesoStruct || this.expresiones instanceof Struct_1.Struct)) {
            return new Errores_1.Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        }
        if (!(simboloStruct.valor instanceof TablaSimbolos_1.TablaSimbolos)) {
            return new Errores_1.Errores("Semantico", "AccesoStruct " + this.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        }
        let resultAcceso = this.expresiones.ejecutar(simboloStruct.valor, tree);
        return resultAcceso;
        // let entornoAttributes = simboloStruct.getValor();
        // if (this.expresiones.expresiones.length >0)
        // {
        //     return this.accesoAttribute(this.expresiones.expresiones,entornoAttributes,tree);
        // }else{
        //     return null;
        // }
        // let valueId = null;
        // for (let expr of this.expresiones)
        // {
        //     return valueId = expr.ejecutar(entornoAttributes,tree);
        // }
    }
    accesoAttribute(expresion, entornoPadre, tree) {
        // let entornoAttributes = null;
        // if (expresion.tipo == TIPO.STRUCT)
        // {
        //     entornoAttributes = entorno.getValor();
        // }
        if (entornoPadre == null) {
            return new Errores_1.Errores("Semantico", "Acceso Atributo Struct: " + this.id + ", no encontrado", this.fila, this.columna);
            ;
        }
        else {
            let resultIdentificador = expresion.identificador.ejecutar(entornoPadre, tree); //TablaSimbolos || resultado
            //recomiendo su array de expresiones
            if (resultIdentificador instanceof TablaSimbolos_1.TablaSimbolos && expresion.expresiones.length > 0) {
                // 2 if is TablasSimbolos
                return this.accesoAttribute(expresion.expresiones, resultIdentificador, tree);
            }
            else {
                //error
                if (resultIdentificador instanceof Errores_1.Errores) {
                    return resultIdentificador;
                }
                return resultIdentificador;
            }
            // if (value instanceof Errores)
            // {
            //     tree.getErrores().push(result);
            //     tree.updateConsolaPrintln(result.toString());
            // }
            // if (result instanceof Identificador)
            // {
            //     if (result.tipo == TIPO.STRUCT){}
            //     {
            //     }
            // }
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.AccesoStruct = AccesoStruct;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../Instrucciones/Struct/Struct":48,"../../TablaSimbolos/TablaSimbolos":54,"../../TablaSimbolos/Tipo":55,"../Identificador":12}],19:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../Instrucciones/Struct/Struct":45,"../../TablaSimbolos/TablaSimbolos":51,"../../TablaSimbolos/Tipo":52,"../Identificador":12}],19:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
const Errores_1 = require("../Ast/Errores");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Ternario {
    constructor(condicion, True, False, fila, columna) {
        this.condicion = condicion;
        this.instTrue = True;
        this.instFalse = False;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
            this.tipo = Tipo_1.TIPO.BOOLEANO;
            if (valor_condicion) {
                let result = this.instTrue.ejecutar(table, tree);
                this.tipo = this.instTrue.tipo;
                return result;
            }
            else {
                let result = this.instFalse.ejecutar(table, tree);
                this.tipo = this.instFalse.tipo;
                return result;
            }
            // return valor_condicion ? this.instTrue.ejecutar(table,tree): this.instFalse.ejecutar(table,tree); 
        }
        else {
            let error = new Errores_1.Errores('Semantico', `La condicion del ternario no es booleana.`, this.fila, this.columna);
            return (error);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Ternario = Ternario;

<<<<<<< Updated upstream
},{"../Ast/Errores":6,"../TablaSimbolos/Tipo":55}],20:[function(require,module,exports){
=======
},{"../Ast/Errores":6,"../TablaSimbolos/Tipo":52}],20:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Copiar_1 = require("../../Expresiones/Arreglos/Copiar");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DeclaracionArr {
    //tipo lista_dim ID IGUAL lista_exp_arr
    constructor(tipo_arr, dimensiones, id, expresiones, fila, columna) {
        this.tipo = Tipo_1.TIPO.ARREGLO;
        this.arreglo = true;
        this.arr = Array();
        this.tipo_arr = tipo_arr;
        this.dimensiones = dimensiones;
        this.id = id;
        this.expresiones = expresiones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // Verificando dimensiones
        if (this.dimensiones != null) {
            if (this.dimensiones != this.dimensiones.length) {
                return new Errores_1.Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
            }
        }
        // Creando arreglo
        let value;
        if (this.expresiones instanceof Copiar_1.Copiar) {
            console.log("DECL ARR COPIAR");
            value = this.expresiones.ejecutar(table, tree);
            console.log("DECL ARR COPIAR VAL: " + value);
            if (value == null) {
                return new Errores_1.Errores("Semantico", "Arreglo nulo.", this.fila, this.columna);
            }
        }
        else {
            console.log("DECL ARR ");
            this.crearDimensiones(table, tree, this.expresiones[0]); // Devuelve el arreglo de dimensiones
            // let value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
            value = this.arr;
            console.log("value declArr: " + value);
            // console.log("type declArr: " + typeof(value));
            // console.log("type declArr: " + typeof(this.arr));
            // console.log("tipo declArr: " + this.tipo_arr);
            if (value instanceof Errores_1.Errores) {
                return value;
            }
        }
        let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo_arr, true, this.fila, this.columna, value);
        let result = table.setSymbolTabla(nuevo_simb);
        if (result instanceof Errores_1.Errores) {
            return result;
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
    crearDimensiones(table, tree, expresiones) {
        // console.log("expr crearD arr: " + expresiones);
        while (true) {
            if (!(expresiones.length == 0)) {
                let dimension = expresiones.shift();
                // console.log("entro crearD");
                // console.log("dim crearD arr: " + dimension);
                if (Array.isArray(dimension)) {
                    this.arr.push(this.crearDimensiones(table, tree, dimension));
                }
                else {
                    let num = dimension.ejecutar(table, tree);
                    // console.log("crearArr: num.tipo " + dimension.tipo);
                    // console.log("crearArr: this.tipo_arr " + this.tipo_arr);
                    if (dimension.tipo != this.tipo_arr) {
                        // console.log("Tipo distinto al tipo del arreglo");
                        // console.log(tree);
                        let res = new Errores_1.Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
                        tree.Errores.push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    else {
                        this.arr.push(num);
                        this.crearDimensiones(tree, table, expresiones);
                    }
                }
            }
            else {
                break;
            }
        }
    }
}
exports.DeclaracionArr = DeclaracionArr;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../Expresiones/Arreglos/Copiar":10,"../../TablaSimbolos/Simbolo":53,"../../TablaSimbolos/Tipo":55}],21:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../Expresiones/Arreglos/Copiar":10,"../../TablaSimbolos/Simbolo":50,"../../TablaSimbolos/Tipo":52}],21:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModificacionArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class ModificacionArr {
    //ID lista_exp IGUAL expr
    constructor(id, expresiones, valor, fila, columna) {
        this.arreglo = true;
        this.id = id;
        this.expresiones = expresiones;
        this.valor = valor;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let value = this.valor.ejecutar(table, tree);
        if (value instanceof Errores_1.Errores) {
            return value;
        }
        let simbolo = table.getSymbolTabla(this.id.toString());
        if (simbolo != null) {
            if (simbolo.getArreglo()) {
                if (simbolo.getTipo() != this.valor.tipo) {
                    return new Errores_1.Errores("Semantico", "Tipos de datos diferentes en modificacion de arreglo: \'" + this.id + "\'.", this.fila, this.columna);
                }
                // console.log("modArr simb.tipo: " + simbolo.getTipo());
                this.tipo_arr = simbolo.getTipo();
                let result = this.modificarDimensiones(table, tree, this.expresiones, simbolo.getValor(), value); // Devuelve el arreglo de dimensiones
                if (result instanceof Errores_1.Errores) {
                    return result;
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "Variable: \'" + this.id.toString() + "\', no encontrada.", this.fila, this.columna);
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
    modificarDimensiones(table, tree, expresiones, arreglo, valor) {
        let value = null;
        if (expresiones.length == 0) {
            if (arreglo instanceof Array) {
                return new Errores_1.Errores("Semantico", "Modificacion de arreglo incompleto.", this.fila, this.columna);
            }
            return valor;
        }
        if (!(arreglo instanceof Array)) {
            return new Errores_1.Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        let exp_tmp = expresiones.pop();
        let num = exp_tmp.ejecutar(table, tree);
        if (num instanceof Errores_1.Errores) {
            return num;
        }
        if (exp_tmp.tipo != Tipo_1.TIPO.ENTERO) {
            return new Errores_1.Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        // console.log("modArr exp: " + valor);
        // console.log("modArr tipo exp: " + this.valor.tipo);
        if (this.valor.tipo != this.tipo_arr) {
            // console.log("Tipo distinto al tipo del arreglo");
            // console.log(tree);
            let res = new Errores_1.Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
            tree.Errores.push(res);
            tree.updateConsolaPrintln(res.toString());
        }
        else {
            value = this.modificarDimensiones(tree, table, expresiones, arreglo[num], valor);
            if (value instanceof Errores_1.Errores) {
                return value;
            }
            if (value != null) {
                arreglo[num] = value;
            }
        }
        return null;
    }
}
exports.ModificacionArr = ModificacionArr;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/Tipo":55}],22:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/Tipo":52}],22:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../Ast/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Return_1 = require("./Transferencia/Return");
class Asignacion {
    constructor(id, expresion, fila, columna) {
        this.arreglo = false;
        this.id = id;
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (table.existe(this.id)) {
            let valor = this.expresion.ejecutar(table, tree);
            // console.log(valor)
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            if (valor instanceof Return_1.Return) {
                let temp;
                temp = valor;
                // // validacion struct
                /**
                 * Agregar struct y arreglos aca
                 */
                // if (temp.valor instanceof Struct){
                // }
                valor = temp.valor;
            }
            /**
             * Agregar struct y arreglos aca
             */
            // console.log(`Existe id: ${this.id} ${table.existe(this.id)}`);
            let result = table.updateSymbolTabla(new Simbolo_1.Simbolo(this.id, this.expresion.tipo, null, this.fila, this.columna, valor));
            if (result instanceof Errores_1.Errores) {
                // console.log(result);
                // console.log(`tipoo exp: ${this.expresion.tipo} `)
                // console.log(`error en updateSymbol ${this.id} `)
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

<<<<<<< Updated upstream
},{"../Ast/Errores":6,"../TablaSimbolos/Simbolo":53,"./Transferencia/Return":52}],23:[function(require,module,exports){
=======
},{"../Ast/Errores":6,"../TablaSimbolos/Simbolo":50,"./Transferencia/Return":49}],23:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
class DoWhile {
    constructor(condicion, lista_instrucciones, fila, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let valor_condicion = this.condicion.ejecutar(table, tree);
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (typeof valor_condicion == 'boolean') {
            do {
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                for (let ins of this.lista_instrucciones) {
                    let res = ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores_1.Errores) {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                    if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return null;
                    }
                    else {
                        if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                            break;
                        }
                        else {
                            if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                                return res;
                            }
                        }
                    }
                }
            } while (this.condicion.ejecutar(table, tree));
        }
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
}
exports.DoWhile = DoWhile;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":54,"../Transferencia/Break":50,"../Transferencia/Continuar":51,"../Transferencia/Return":52}],24:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":51,"../Transferencia/Break":47,"../Transferencia/Continuar":48,"../Transferencia/Return":49}],24:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const Return_1 = require("./../Transferencia/Return");
const Continuar_1 = require("./../Transferencia/Continuar");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Errores_1 = require("../../Ast/Errores");
class For {
    constructor(declaracion_asignacion, condicion, actualizacion, lista_instrucciones, fila, columna) {
        this.declaracion_asignacion = declaracion_asignacion;
        this.condicion = condicion;
        this.actualizacion = actualizacion;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // Asignacion o declaracion
        let tabla_intermedia = new TablaSimbolos_1.TablaSimbolos(table);
        let declaracion_asignacion = this.declaracion_asignacion.ejecutar(tabla_intermedia, tree);
        if (declaracion_asignacion instanceof Errores_1.Errores) {
            tree.getErrores().push(declaracion_asignacion);
            tree.updateConsolaPrintln(declaracion_asignacion.toString());
        }
        // console.log("declaracion_asignacion: " + declaracion_asignacion);
        if (declaracion_asignacion instanceof Errores_1.Errores) {
            return declaracion_asignacion;
        }
        while (true) {
            let condicion = this.condicion.ejecutar(tabla_intermedia, tree);
            if (condicion instanceof Errores_1.Errores) {
                tree.getErrores().push(condicion);
                tree.updateConsolaPrintln(condicion.toString());
            }
            // console.log("condicion: " + condicion);
            if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
                if (this.getBool(condicion)) {
                    let ts_local = new TablaSimbolos_1.TablaSimbolos(tabla_intermedia);
                    for (let ins of this.lista_instrucciones) {
                        let res = ins.ejecutar(ts_local, tree);
                        if (res instanceof Errores_1.Errores) {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
                        //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                        if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                            return null;
                        }
                        if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                            break;
                        }
                        if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                            return res;
                        }
                    }
                    let actualizacion = this.actualizacion.ejecutar(tabla_intermedia, tree);
                    if (actualizacion instanceof Errores_1.Errores) {
                        tree.getErrores().push(actualizacion);
                        tree.updateConsolaPrintln(actualizacion.toString());
                    }
                    // console.log("actualizacion: " + actualizacion);
                    if (actualizacion instanceof Errores_1.Errores) {
                        return actualizacion;
                    }
                }
                else {
                    break;
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "Valor no booleano", this.fila, this.columna);
            }
        }
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.For = For;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":54,"../../TablaSimbolos/Tipo":55,"../Transferencia/Break":50,"./../Transferencia/Continuar":51,"./../Transferencia/Return":52}],25:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":51,"../../TablaSimbolos/Tipo":52,"../Transferencia/Break":47,"./../Transferencia/Continuar":48,"./../Transferencia/Return":49}],25:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForIn = void 0;
const Identificador_1 = require("./../../Expresiones/Identificador");
const Return_1 = require("../Transferencia/Return");
const Continuar_1 = require("../Transferencia/Continuar");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Errores_1 = require("../../Ast/Errores");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const AccesoArr_1 = require("../../Expresiones/Arreglos/AccesoArr");
class ForIn {
    constructor(iterador, rango, lista_instrucciones, fila, columna) {
        this.arreglo = false;
        this.iterador = iterador;
        this.rango = rango;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (this.rango.tipo == Tipo_1.TIPO.CADENA) {
            let rango = this.rango.ejecutar(table, tree);
            if (rango instanceof Errores_1.Errores) {
                tree.getErrores().push(rango);
                tree.updateConsolaPrintln(rango.toString());
            }
            if (rango instanceof Errores_1.Errores) {
                return rango;
            }
            console.log("FOR IN CADENA");
            for (var i = 0; i < rango.length; i++) {
                let char = rango.charAt(i);
                let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.CHARACTER, this.arreglo, this.fila, this.columna, char);
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                ts_local.setSymbolTabla(nuevo_simb);
                ts_local.updateSymbolTabla(nuevo_simb);
                for (let ins of this.lista_instrucciones) {
                    let res = ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores_1.Errores) {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return null;
                    }
                    if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                        break;
                    }
                    if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                        return res;
                    }
                }
            }
        }
        else if (this.rango.tipo == Tipo_1.TIPO.ARREGLO || this.rango instanceof Array) {
            console.log("FOR IN ARR XD");
            this.rango.forEach(e => {
                let element = e.ejecutar(table, tree);
                if (element instanceof Errores_1.Errores) {
                    tree.getErrores().push(element);
                    tree.updateConsolaPrintln(element.toString());
                }
                if (element instanceof Errores_1.Errores) {
                    return element;
                }
                let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.ARREGLO, this.arreglo, this.fila, this.columna, element);
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                let result = ts_local.updateSymbolTabla(nuevo_simb);
                if (result instanceof Errores_1.Errores) {
                    result = ts_local.setSymbolTabla(nuevo_simb);
                    if (result instanceof Errores_1.Errores) {
                        tree.getErrores().push(result);
                        tree.updateConsolaPrintln(result.toString());
                    }
                }
                for (let ins of this.lista_instrucciones) {
                    let res = ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores_1.Errores) {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return null;
                    }
                    if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                        break;
                    }
                    if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                        return res;
                    }
                }
            });
        }
        else if (this.rango instanceof AccesoArr_1.AccesoArr) {
            console.log("FOR IN ARR DEC RANGO");
            // console.log(this.rango.);
            let arr = table.getSymbolTabla(this.rango.id.toString());
            if (arr != null) {
                if (arr.getArreglo()) {
                    console.log("foinarrdec rank: " + this.rango.expresiones[0]);
                    let rank = this.rango.expresiones[0].ejecutar(table, tree);
                    // console.log("AccArr rank type: " + (rank instanceof Array));
                    // console.log("rank[0] type: " + (typeof(rank[0]) == "string"));
                    // console.log("rank accArr: " + rank);
                    if (rank == null) {
                        return new Errores_1.Errores("Semantico", "La variable \'" + this.rango.id + "\', no es un rango.", this.fila, this.columna);
                    }
                    let begin;
                    if (rank[0] == "begin") {
                        begin = 0;
                    }
                    else {
                        begin = rank[0].ejecutar(table, tree);
                    }
                    if (begin instanceof Errores_1.Errores) {
                        return begin;
                    }
                    let end;
                    if (rank[1] == "end") {
                        end = arr.getValor().length;
                    }
                    else {
                        end = rank[1].ejecutar(table, tree);
                    }
                    if (end instanceof Errores_1.Errores) {
                        return end;
                    }
                    console.log("begin: " + begin);
                    console.log("end: " + end);
                    let array = [];
                    let contador = begin;
                    while (contador <= end) {
                        array.push(arr.getValor()[contador]);
                        let element = arr.getValor()[contador];
                        let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.ARREGLO, this.arreglo, this.fila, this.columna, element);
                        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                        let result = ts_local.updateSymbolTabla(nuevo_simb);
                        if (result instanceof Errores_1.Errores) {
                            result = ts_local.setSymbolTabla(nuevo_simb);
                            if (result instanceof Errores_1.Errores) {
                                tree.getErrores().push(result);
                                tree.updateConsolaPrintln(result.toString());
                            }
                        }
                        for (let ins of this.lista_instrucciones) {
                            let res = ins.ejecutar(ts_local, tree);
                            if (res instanceof Errores_1.Errores) {
                                tree.getErrores().push(res);
                                tree.updateConsolaPrintln(res.toString());
                            }
                            if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                                return null;
                            }
                            if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                                break;
                            }
                            if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                                return res;
                            }
                        }
                        contador++;
                    }
                }
                else {
                    return new Errores_1.Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no es un arreglo.", this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no existe.", this.fila, this.columna);
            }
        }
        else if (this.rango instanceof Identificador_1.Identificador) {
            let variable = table.getSymbolTabla(this.rango.id.toString());
            if (variable != null) {
                let rango = variable.getValor();
                if (rango instanceof Errores_1.Errores) {
                    tree.getErrores().push(rango);
                    tree.updateConsolaPrintln(rango.toString());
                }
                if (rango instanceof Errores_1.Errores) {
                    return rango;
                }
                if (variable.getTipo() == Tipo_1.TIPO.CADENA && !variable.getArreglo()) {
                    console.log("FOR IN VAR CADENA");
                    for (var i = 0; i < rango.length; i++) {
                        let char = rango.charAt(i);
                        let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.CHARACTER, this.arreglo, this.fila, this.columna, char);
                        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                        ts_local.setSymbolTabla(nuevo_simb);
                        ts_local.updateSymbolTabla(nuevo_simb);
                        for (let ins of this.lista_instrucciones) {
                            let res = ins.ejecutar(ts_local, tree);
                            if (res instanceof Errores_1.Errores) {
                                tree.getErrores().push(res);
                                tree.updateConsolaPrintln(res.toString());
                            }
                            if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                                return null;
                            }
                            if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                                break;
                            }
                            if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                                return res;
                            }
                        }
                    }
                }
                else if (variable.getArreglo()) {
                    console.log("FOR IN ARR DEC");
                    variable.getValor().forEach(element => {
                        let nuevo_simb = new Simbolo_1.Simbolo(this.iterador, Tipo_1.TIPO.ARREGLO, this.arreglo, this.fila, this.columna, element);
                        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                        let result = ts_local.updateSymbolTabla(nuevo_simb);
                        if (result instanceof Errores_1.Errores) {
                            result = ts_local.setSymbolTabla(nuevo_simb);
                            if (result instanceof Errores_1.Errores) {
                                tree.getErrores().push(result);
                                tree.updateConsolaPrintln(result.toString());
                            }
                        }
                        for (let ins of this.lista_instrucciones) {
                            let res = ins.ejecutar(ts_local, tree);
                            if (res instanceof Errores_1.Errores) {
                                tree.getErrores().push(res);
                                tree.updateConsolaPrintln(res.toString());
                            }
                            if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                                return null;
                            }
                            if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                                break;
                            }
                            if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                                return res;
                            }
                        }
                    });
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "La variable \'" + this.rango.id.toString() + "\', no existe.", this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "For-in no valido.", this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.ForIn = ForIn;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../Expresiones/Arreglos/AccesoArr":8,"../../TablaSimbolos/Simbolo":53,"../../TablaSimbolos/TablaSimbolos":54,"../../TablaSimbolos/Tipo":55,"../Transferencia/Break":50,"../Transferencia/Continuar":51,"../Transferencia/Return":52,"./../../Expresiones/Identificador":12}],26:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../Expresiones/Arreglos/AccesoArr":8,"../../TablaSimbolos/Simbolo":50,"../../TablaSimbolos/TablaSimbolos":51,"../../TablaSimbolos/Tipo":52,"../Transferencia/Break":47,"../Transferencia/Continuar":48,"../Transferencia/Return":49,"./../../Expresiones/Identificador":12}],26:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const Errores_1 = require("./../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
class While {
    constructor(condicion, lista_instrucciones, fila, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        while (true) {
            let valor_condicion = this.condicion.ejecutar(table, tree);
            if (valor_condicion instanceof Errores_1.Errores) {
                tree.getErrores().push(valor_condicion);
                tree.updateConsolaPrintln(valor_condicion.toString());
            }
            if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
                if (this.getBool(valor_condicion)) {
                    let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                    for (let ins of this.lista_instrucciones) {
                        let res = ins.ejecutar(ts_local, tree);
                        if (res instanceof Errores_1.Errores) {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
                        //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                        if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                            return null;
                        }
                        if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                            break;
                        }
                        if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                            return res;
                        }
                    }
                }
                else {
                    break;
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "Valor no booleano", this.fila, this.columna);
            }
        }
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("CICLO", "");
        padre.addChildNode(new Nodo_1.Nodo("while", ""));
        padre.addChildNode(new Nodo_1.Nodo("(", ""));
        padre.addChildNode(this.condicion.recorrer(table, tree));
        padre.addChildNode(new Nodo_1.Nodo(")", ""));
        padre.addChildNode(new Nodo_1.Nodo("{", ""));
        for (let ins of this.lista_instrucciones) {
            padre.addChildNode(ins.recorrer(table, tree));
        }
        padre.addChildNode(new Nodo_1.Nodo("}", ""));
        return padre;
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.While = While;

<<<<<<< Updated upstream
},{"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":54,"../../TablaSimbolos/Tipo":55,"../Transferencia/Break":50,"../Transferencia/Continuar":51,"../Transferencia/Return":52,"./../../Ast/Errores":6}],27:[function(require,module,exports){
=======
},{"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":51,"../../TablaSimbolos/Tipo":52,"../Transferencia/Break":47,"../Transferencia/Continuar":48,"../Transferencia/Return":49,"./../../Ast/Errores":6}],27:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
class Case {
    constructor(valor_case, lista_instrucciones, fila, columna) {
        this.valor_case = valor_case;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        console.log("cs valcs: " + this.valor_case);
        console.log("cs valorsw: " + this.valor_sw);
        if (this.valor_sw == this.valor_case.ejecutar(table, tree)) {
            for (let res of this.lista_instrucciones) {
                let ins = res.ejecutar(ts_local, tree);
                if (ins instanceof Errores_1.Errores) {
                    tree.getErrores().push(ins);
                    tree.updateConsolaPrintln(ins.toString());
                }
                if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                    // controlador.graficarEntornos(controlador,ts_local," (case)");
                    return ins;
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
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
}
exports.Case = Case;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":54,"../Transferencia/Break":50,"../Transferencia/Continuar":51,"../Transferencia/Return":52}],28:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":51,"../Transferencia/Break":47,"../Transferencia/Continuar":48,"../Transferencia/Return":49}],28:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const Tipo_1 = require("./../../TablaSimbolos/Tipo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
class If {
    constructor(condicion, lista_ifs, lista_elses, lista_ifelse, fila, columna) {
        this.condicion = condicion;
        this.lista_ifs = lista_ifs;
        this.lista_elses = lista_elses;
        this.lista_ifelse = lista_ifelse;
        this.columna = columna;
        this.fila = fila;
    }
    ejecutar(table, tree) {
        // let ts_local = new TablaSimbolos(table);
        let valor_condicion = this.condicion.ejecutar(table, tree);
        console.log("if cond: " + valor_condicion);
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
            if (valor_condicion == true) {
                // if(this.lista_ifs != null){
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                // this.lista_ifs.forEach(ins => {
                for (let ins of this.lista_ifs) {
                    let res = ins.ejecutar(ts_local, tree);
                    if (res instanceof Errores_1.Errores) {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    //TODO verificar si res es de tipo CONTINUE, BREAK, RETORNO 
                    if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                        return res;
                    }
                    else if (ins instanceof Continuar_1.Continuar || res instanceof Continuar_1.Continuar) {
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        break;
                    }
                    else if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                        // controlador.graficarEntornos(controlador,ts_local," (case)");
                        return res;
                    }
                }
                // }
            }
            else {
                if (this.lista_elses != null) {
                    let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                    for (let ins of this.lista_elses) {
                        let res = ins.ejecutar(ts_local, tree);
                        //TODO verificar si res es de tipo CONTINUE, RETORNO
                        if (res instanceof Errores_1.Errores) {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
                        if (res instanceof Break_1.Detener) {
                            return res;
                        }
                        if (res instanceof Continuar_1.Continuar) {
                            break;
                        }
                        if (res instanceof Return_1.Return) {
                            return res;
                        }
                    }
                }
                else if (this.lista_ifelse != null) {
                    let result = this.lista_ifelse.ejecutar(table, tree);
                    if (result instanceof Errores_1.Errores) {
                        return result;
                    }
                    if (result instanceof Break_1.Detener) {
                        return result;
                    }
                    if (result instanceof Continuar_1.Continuar) {
                        return null;
                    }
                    if (result instanceof Return_1.Return) {
                        return result;
                    }
                }
            }
        }
        else {
            return new Errores_1.Errores("Semantico", "Tipo de dato no booleano en IF", this.fila, this.columna);
        }
        // return null;
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.If = If;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":54,"../Transferencia/Break":50,"../Transferencia/Continuar":51,"../Transferencia/Return":52,"./../../TablaSimbolos/Tipo":55}],29:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":51,"../Transferencia/Break":47,"../Transferencia/Continuar":48,"../Transferencia/Return":49,"./../../TablaSimbolos/Tipo":52}],29:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ifsinllave = void 0;
const Tipo_1 = require("./../../TablaSimbolos/Tipo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
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
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
            if (valor_condicion) {
                let res = this.ins_ifs.ejecutar(ts_local, tree);
                if (res instanceof Errores_1.Errores) {
                    tree.getErrores().push(res);
                    tree.updateConsolaPrintln(res.toString());
                }
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
                        if (res instanceof Errores_1.Errores) {
                            tree.getErrores().push(res);
                            tree.updateConsolaPrintln(res.toString());
                        }
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
                    if (res instanceof Errores_1.Errores) {
                        tree.getErrores().push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
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

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":54,"../Transferencia/Break":50,"../Transferencia/Continuar":51,"../Transferencia/Return":52,"./../../TablaSimbolos/Tipo":55}],30:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":51,"../Transferencia/Break":47,"../Transferencia/Continuar":48,"../Transferencia/Return":49,"./../../TablaSimbolos/Tipo":52}],30:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
class Switch {
    constructor(valor_sw, lista_case, lista_default, fila, columna) {
        this.valor_sw = valor_sw;
        this.lista_case = lista_case;
        this.lista_default = lista_default;
        this.columna = columna;
        this.fila = fila;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        for (let sw of this.lista_case) {
            sw.valor_sw = this.valor_sw.ejecutar(ts_local, tree);
            if (sw.valor_sw instanceof Errores_1.Errores) {
                tree.getErrores().push(sw.valor_sw);
                tree.updateConsolaPrintln(sw.valor_sw.toString());
            }
        }
        let x = 0;
        for (let ins of this.lista_case) {
            let res = ins.ejecutar(ts_local, tree);
            if (res instanceof Errores_1.Errores) {
                tree.getErrores().push(res);
                tree.updateConsolaPrintln(res.toString());
            }
            if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                // controlador.graficarEntornos(controlador,ts_local," (switch)");
                x = 1;
                break;
            }
            else {
                if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                    // controlador.graficarEntornos(controlador,ts_local," (switch)");
                    return res;
                }
            }
        }
        if (x == 0) {
            for (let ins of this.lista_default) {
                let res = ins.ejecutar(ts_local, tree);
                if (res instanceof Errores_1.Errores) {
                    tree.getErrores().push(res);
                    tree.updateConsolaPrintln(res.toString());
                }
                if (ins instanceof Break_1.Detener || res instanceof Break_1.Detener) {
                    // controlador.graficarEntornos(controlador,ts_local," (switch)");
                    break;
                }
                else {
                    if (ins instanceof Return_1.Return || res instanceof Return_1.Return) {
                        // controlador.graficarEntornos(controlador,ts_local," (switch)");
                        return res;
                    }
                }
            }
        }
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer(table, tree) {
        throw new Error('Method not implemented.');
    }
}
exports.Switch = Switch;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":54,"../Transferencia/Break":50,"../Transferencia/Return":52}],31:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":51,"../Transferencia/Break":47,"../Transferencia/Return":49}],31:[function(require,module,exports){
>>>>>>> Stashed changes
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
                // console.log("variable.valor.tipo: " + variable.valor.tipo);
                if (valor instanceof Errores_1.Errores) {
                    return valor;
                }
                if (tipo_valor == this.tipo) {
                    console.log("entre tipo declaracion");
                    //--> Lo agregamos a la tabla de simbolos 
                    let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, valor);
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
                let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, null);
                switch (this.tipo) {
                    case Tipo_1.TIPO.ENTERO:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, 0);
                        break;
                    case Tipo_1.TIPO.DECIMAL:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, 0.00);
                        break;
                    case Tipo_1.TIPO.CADENA:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, null);
                        break;
                    case Tipo_1.TIPO.BOOLEANO:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, false);
                        break;
                    case Tipo_1.TIPO.CHARACTER:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, '0');
                        break;
                    default:
                        nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, null);
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

<<<<<<< Updated upstream
},{"../Ast/Errores":6,"../TablaSimbolos/Simbolo":53,"../TablaSimbolos/Tipo":55}],32:[function(require,module,exports){
=======
},{"../Ast/Errores":6,"../TablaSimbolos/Simbolo":50,"../TablaSimbolos/Tipo":52}],32:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const Errores_1 = require("../../Ast/Errores");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
class Funcion {
    constructor(id, tipo, parameters, instructions, fila, columna) {
        this.tipo = tipo;
        this.id = id;
        this.parameters = parameters;
        this.instructions = instructions;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let newTable = new TablaSimbolos_1.TablaSimbolos(table);
        if (this.instructions.length > 0) {
            for (let instr of this.instructions) {
                let result = instr.ejecutar(newTable, tree);
                if (result instanceof Errores_1.Errores) {
                    tree.getErrores().push(result);
                    tree.updateConsolaPrintln(result.toString());
                }
                if (result instanceof Break_1.Detener) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                    tree.getErrores().push(error);
                    tree.updateConsolaPrintln(error.toString());
                }
                if (result instanceof Continuar_1.Continuar) {
                    let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                    tree.getErrores().push(error);
                    tree.updateConsolaPrintln(error.toString());
                }
                if (result instanceof Return_1.Return) {
                    this.tipo = result.tipo;
                    return result.valor;
                }
            }
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
exports.Funcion = Funcion;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":54,"../Transferencia/Break":50,"../Transferencia/Continuar":51,"../Transferencia/Return":52}],33:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":51,"../Transferencia/Break":47,"../Transferencia/Continuar":48,"../Transferencia/Return":49}],33:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const Errores_1 = require("../../Ast/Errores");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
class Main {
    constructor(instructions, fila, columna) {
        this.instructions = instructions;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let newTable = new TablaSimbolos_1.TablaSimbolos(table);
        for (let instr of this.instructions) {
            let result = instr.ejecutar(newTable, tree);
            if (result instanceof Errores_1.Errores) {
                tree.getErrores().push(result);
                tree.updateConsolaPrintln(result.toString());
            }
            if (result instanceof Break_1.Detener) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Continuar_1.Continuar) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Return_1.Return) {
                return result;
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
exports.Main = Main;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":54,"../Transferencia/Break":50,"../Transferencia/Continuar":51,"../Transferencia/Return":52}],34:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":51,"../Transferencia/Break":47,"../Transferencia/Continuar":48,"../Transferencia/Return":49}],34:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pop = void 0;
const Errores_1 = require("../../../../Ast/Errores");
class Pop {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let arr = table.getSymbolTabla(this.id);
        // console.log("pop type: " + arr.tipo);
        if (arr != null) {
            if (arr.getArreglo()) {
                if (arr.getValor().length > 0) {
                    this.tipo = arr.getTipo();
                    return arr.getValor().pop();
                }
                else {
                    return new Errores_1.Errores("Semantico", `El arreglo con ID ${this.id}, esta vacio.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa POP no puede utilizase en variable con ID ${this.id}, porque no es un arreglo.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Pop = Pop;

},{"../../../../Ast/Errores":6}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Push = void 0;
const Errores_1 = require("../../../../Ast/Errores");
class Push {
    constructor(id, expresion, fila, columna) {
        this.expresion = expresion;
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("push id: " + this.id.id);
        let arr = table.getSymbolTabla(this.id.id);
        if (arr != null) {
            if (arr.getArreglo()) {
                this.tipo = arr.getTipo();
                let val = this.expresion.ejecutar(table, tree);
                if (val == null) {
                    return new Errores_1.Errores("Semantico", `No se obtuvo ningun valor a ingresar.`, this.fila, this.columna);
                }
                console.log("push tipo arr: " + arr.getTipo());
                console.log("push tipo val: " + this.expresion);
                if (this.expresion.tipo == arr.getTipo()) {
                    return arr.getValor().push(val);
                }
                else {
                    let res = new Errores_1.Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
                    tree.Errores.push(res);
                    tree.updateConsolaPrintln(res.toString());
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa PUSH no puede utilizase en variable con ID ${this.id}, porque no es un arreglo.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Push = Push;

},{"../../../../Ast/Errores":6}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharOfPos = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
class CharOfPos {
    constructor(id, expresion, fila, columna) {
        this.id = id;
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("push id: " + this.id.id);
        let cadena = table.getSymbolTabla(this.id);
        if (cadena != null) {
            if (cadena.getTipo() == Tipo_1.TIPO.CADENA && !cadena.getArreglo()) {
                this.tipo = cadena.getTipo();
                if (!(cadena.getValor().length > 0)) {
                    return new Errores_1.Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
                let pos = this.expresion.ejecutar(table, tree);
                if (pos == null) {
                    return new Errores_1.Errores("Semantico", `No se obtuvo una posicion ${pos}.`, this.fila, this.columna);
                }
                console.log("charofpos tipo cadena: " + cadena.getTipo());
                console.log("charofpos tipo pos: " + this.expresion);
                let tam = cadena.getValor().length;
                if (this.expresion.tipo == Tipo_1.TIPO.ENTERO) {
                    if (pos < tam) {
                        return cadena.getValor().charAt(pos);
                    }
                    else {
                        return new Errores_1.Errores("Semantico", `La posicion ${pos} no se encuentra dentro de ${this.id}.`, this.fila, this.columna);
                    }
                }
                else {
                    return new Errores_1.Errores("Semantico", `La posicion ${pos} no es un entero.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'caracterOfPosition' no puede utilizase en variable con ID ${this.id}, porque no es una cadena.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.CharOfPos = CharOfPos;

<<<<<<< Updated upstream
},{"../../../../Ast/Errores":6,"../../../../TablaSimbolos/Tipo":55}],37:[function(require,module,exports){
=======
},{"../../../../Ast/Errores":6,"../../../../TablaSimbolos/Tipo":52}],37:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subString = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
class subString {
    constructor(id, inicio, fin, fila, columna) {
        this.id = id;
        this.inicio = inicio;
        this.fin = fin;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("push id: " + this.id.id);
        let cadena = table.getSymbolTabla(this.id);
        if (cadena != null) {
            if (cadena.getTipo() == Tipo_1.TIPO.CADENA && !cadena.getArreglo()) {
                this.tipo = cadena.getTipo();
                let inicio = this.inicio.ejecutar(table, tree);
                if (inicio == null) {
                    return new Errores_1.Errores("Semantico", `No se obtuvo una posicion ${inicio}.`, this.fila, this.columna);
                }
                let fin = this.fin.ejecutar(table, tree);
                if (fin == null) {
                    return new Errores_1.Errores("Semantico", `No se obtuvo una posicion ${fin}.`, this.fila, this.columna);
                }
                console.log("charofpos tipo cadena: " + cadena.getTipo());
                console.log("charofpos tipo inicio: " + this.inicio);
                let tam = cadena.getValor().length;
                if (!(tam > 0)) {
                    return new Errores_1.Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
                if (this.inicio.tipo == Tipo_1.TIPO.ENTERO && this.fin.tipo == Tipo_1.TIPO.ENTERO) {
                    if (fin < tam) {
                        if (inicio >= 0) {
                            if (inicio < fin) {
                                let cont = inicio;
                                let result = "";
                                while (cont <= fin) {
                                    result += cadena.getValor().charAt(cont);
                                    cont++;
                                }
                                return result;
                            }
                            else {
                                return new Errores_1.Errores("Semantico", `La posicion ${inicio} debe ser menor que ${fin}.`, this.fila, this.columna);
                            }
                        }
                        else {
                            return new Errores_1.Errores("Semantico", `La posicion ${inicio} no se encuentra no puede ser negativa.`, this.fila, this.columna);
                        }
                    }
                    else {
                        return new Errores_1.Errores("Semantico", `La posicion ${fin} no se encuentra dentro de ${this.id}.`, this.fila, this.columna);
                    }
                }
                else {
                    return new Errores_1.Errores("Semantico", `Los accesos deben de ser de tipo entero.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'subString' no puede utilizase en variable con ID ${this.id}, porque no es una cadena.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.subString = subString;

<<<<<<< Updated upstream
},{"../../../../Ast/Errores":6,"../../../../TablaSimbolos/Tipo":55}],38:[function(require,module,exports){
=======
},{"../../../../Ast/Errores":6,"../../../../TablaSimbolos/Tipo":52}],38:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLower = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
class toLower {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("push id: " + this.id.id);
        let cadena = table.getSymbolTabla(this.id);
        if (cadena != null) {
            if (cadena.getTipo() == Tipo_1.TIPO.CADENA && !cadena.getArreglo()) {
                this.tipo = cadena.getTipo();
                if (cadena.getValor().length > 0) {
                    return cadena.getValor().toLowerCase();
                }
                else {
                    return new Errores_1.Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'toLowercase' no puede utilizase en variable con ID ${this.id}, porque no es una cadena.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.toLower = toLower;

<<<<<<< Updated upstream
},{"../../../../Ast/Errores":6,"../../../../TablaSimbolos/Tipo":55}],39:[function(require,module,exports){
=======
},{"../../../../Ast/Errores":6,"../../../../TablaSimbolos/Tipo":52}],39:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUpper = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
class toUpper {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("push id: " + this.id.id);
        let cadena = table.getSymbolTabla(this.id);
        if (cadena != null) {
            if (cadena.getTipo() == Tipo_1.TIPO.CADENA && !cadena.getArreglo()) {
                this.tipo = cadena.getTipo();
                if (cadena.getValor().length > 0) {
                    return cadena.getValor().toUpperCase();
                }
                else {
                    return new Errores_1.Errores("Semantico", `La cadena en la variable con ID: '${this.id} es vacia'.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'toUppercase' no puede utilizase en variable con ID ${this.id}, porque no es una cadena.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.toUpper = toUpper;

<<<<<<< Updated upstream
},{"../../../../Ast/Errores":6,"../../../../TablaSimbolos/Tipo":55}],40:[function(require,module,exports){
=======
},{"../../../../Ast/Errores":6,"../../../../TablaSimbolos/Tipo":52}],40:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Length = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Tipo_1 = require("../../../TablaSimbolos/Tipo");
class Length {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let arr = table.getSymbolTabla(this.id);
        // console.log("pop type: " + arr.tipo);
        if (arr != null) {
            if (arr.getArreglo() || arr.getTipo() == Tipo_1.TIPO.CADENA) {
                if (arr.getValor().length > 0) {
                    this.tipo = arr.getTipo();
                    return arr.getValor().length;
                }
                else {
                    return new Errores_1.Errores("Semantico", `El arreglo con ID ${this.id}, esta vacio.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa LENGTH no puede utilizase en variable con ID ${this.id}, porque no es un arreglo o string.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Length = Length;

<<<<<<< Updated upstream
},{"../../../Ast/Errores":6,"../../../TablaSimbolos/Tipo":55}],41:[function(require,module,exports){
=======
},{"../../../Ast/Errores":6,"../../../TablaSimbolos/Tipo":52}],41:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matematicas = void 0;
const Identificador_1 = require("./../../../Expresiones/Identificador");
const Errores_1 = require("../../../Ast/Errores");
class Matematicas {
    constructor(tipo_funcion, expresion, fila, columna) {
        this.tipo_funcion = tipo_funcion;
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let expresion = this.expresion.ejecutar(table, tree);
        if (expresion != null) {
            let valor;
            if (this.expresion instanceof Identificador_1.Identificador) {
                console.log("es id");
                valor = expresion;
            }
            else {
                valor = this.expresion.valor;
            }
            if (!isNaN(valor)) {
                this.tipo = this.expresion.tipo;
                switch (this.tipo_funcion.toString()) {
                    case "sin":
                        return Math.sin(valor);
                    case "cos":
                        return Math.cos(valor);
                    case "tan":
                        return Math.tan(valor);
                    case "log10":
                        return Math.log10(valor);
                    case "sqrt":
                        return Math.sqrt(valor);
                    default:
                        return new Errores_1.Errores("Semantico", `Nativa '${this.tipo_funcion.toString()}' invalida.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa '${this.tipo_funcion.toString()}' solamente acepta expresiones numericos.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.expresion}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Matematicas = Matematicas;

},{"../../../Ast/Errores":6,"./../../../Expresiones/Identificador":12}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parse = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
class Parse {
    constructor(tipo_funcion, parameters, fila, columna) {
        this.tipo_funcion = tipo_funcion;
        this.parameters = parameters;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        console.log("parse params: " + this.parameters);
        let cadena = this.parameters.ejecutar(table, tree);
        console.log("parse cadena: " + this.parameters.tipo);
        if (cadena != null) {
            if (this.parameters.tipo == Tipo_1.TIPO.CADENA) {
                this.tipo = this.tipo_funcion;
                switch (this.tipo_funcion) {
                    case Tipo_1.TIPO.ENTERO:
                        try {
                            return parseInt(cadena);
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a entero el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    case Tipo_1.TIPO.DECIMAL:
                        try {
                            return parseFloat(cadena);
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a double el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    case Tipo_1.TIPO.BOOLEANO:
                        try {
                            if (cadena == "1" || cadena.toUpperCase() == "true".toUpperCase()) {
                                return true;
                            }
                            else if (cadena == "0" || cadena.toUpperCase() == "false".toUpperCase()) {
                                return false;
                            }
                            else {
                                return new Errores_1.Errores("Semantico", `Valor: '${cadena.toString()}', invalido para parsear a booleano.`, this.fila, this.columna);
                            }
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a booleano el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    default:
                        return new Errores_1.Errores("Semantico", `No fue posible castear el valor '${cadena.toString()}'.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa 'PARSE' no puede utilizarse, porque '${cadena.toString()}' no es una cadena.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.id}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Parse = Parse;

},{"../../../../Ast/Errores":6,"../../../../TablaSimbolos/Tipo":55}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.To = void 0;
const Errores_1 = require("../../../../Ast/Errores");
class To {
    constructor(tipo_conversion, parameters, fila, columna) {
        this.tipo_conversion = tipo_conversion;
        this.parameters = parameters;
        this.fila = fila;
        this.columna = columna;
    }
    /**
     *
     * @param table
     * @param tree
     * @returns Valores casteados
     */
    ejecutar(table, tree) {
        // console.log("parse params: " + this.parameters);
        let cadena = this.parameters.ejecutar(table, tree);
        // console.log("parse cadena: " + this.parameters.tipo);
        if (cadena != null) {
            if (!isNaN(cadena)) {
                this.tipo = this.tipo_conversion;
                switch (this.tipo_conversion) {
                    case "toInt":
                        try {
                            return parseInt(cadena);
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a entero el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    case "toDouble":
                        try {
                            return parseFloat(cadena);
                        }
                        catch (error) {
                            return new Errores_1.Errores("Semantico", `No fue posible castear a double el valor '${cadena.toString()}'.`, this.fila, this.columna);
                        }
                    default:
                        return new Errores_1.Errores("Semantico", `No fue posible castear el valor '${cadena.toString()}'.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", `Nativa '${this.tipo_conversion}' no puede utilizarse, porque no es un numero.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `Valor invalido.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.To = To;

},{"../../../../Ast/Errores":6}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringN = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Tipo_1 = require("../../../TablaSimbolos/Tipo");
class StringN {
    constructor(expresion, fila, columna) {
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let valor = this.expresion.ejecutar(table, tree);
        // console.log("pop type: " + valor.tipo);
        if (valor != null) {
            try {
                this.tipo = Tipo_1.TIPO.CADENA;
                return valor.toString();
            }
            catch (error) {
                return new Errores_1.Errores("Semantico", `No fue posible castear a String el valor '${valor.toString()}'.`, this.fila, this.columna);
            }
        }
        else {
            return new Errores_1.Errores("Semantico", `La variable con ID ${this.expresion}, no existe.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.StringN = StringN;

},{"../../../Ast/Errores":6,"../../../TablaSimbolos/Tipo":55}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOfN = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Tipo_1 = require("../../../TablaSimbolos/Tipo");
class TypeOfN {
    constructor(expresion, fila, columna) {
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (this.expresion instanceof Array) {
            return "array";
        }
        let valor = this.expresion.ejecutar(table, tree);
        // console.log("pop type: " + valor.tipo);
        if (valor != null) {
            this.tipo = valor.tipo;
            return this.getTipo(this.expresion.tipo);
        }
        else {
            return new Errores_1.Errores("Semantico", `Valor nulo.`, this.fila, this.columna);
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
    getTipo(tipo) {
        switch (tipo) {
            case Tipo_1.TIPO.CADENA:
                return "string";
            case Tipo_1.TIPO.ENTERO:
                return "int";
            case Tipo_1.TIPO.DECIMAL:
                return "double";
            case Tipo_1.TIPO.BOOLEANO:
                return "boolean";
            case Tipo_1.TIPO.CHARACTER:
                return "char";
            case Tipo_1.TIPO.ARREGLO:
                return "array";
            case Tipo_1.TIPO.STRUCT:
                return "struct";
            case Tipo_1.TIPO.RANGO:
                return "rango";
            case Tipo_1.TIPO.NULO:
                return "null";
            default:
                return "invalido";
        }
    }
}
exports.TypeOfN = TypeOfN;

},{"../../../Ast/Errores":6,"../../../TablaSimbolos/Tipo":55}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Return_1 = require("./Transferencia/Return");
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
            // console.log("print exp val: " + String(valor));
            // console.log(valor);
            // Validaciones de TIPOS A Imprimir
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            if (valor instanceof Simbolo_1.Simbolo && valor.tipo == Tipo_1.TIPO.STRUCT) {
                let temp;
                temp = valor;
                // console.log("print STRUCT");
                // console.log(valor);
                valor = temp.toStringStruct();
            }
            if (expresion.tipo == Tipo_1.TIPO.ARREGLO) {
            }
            if (valor instanceof Return_1.Return) {
                let temp;
                temp = valor;
                valor = temp.valor;
                // validar si es un struct
            }
            this.value += valor;
            // return null;    
        }
        if (this.tipo) {
            // this.value += valor.toString() + "\n";
            (this.value != null) ? tree.updateConsolaPrintln(String(this.value)) : tree.updateConsolaPrintln("null");
            // tree.updateConsolaPrintln(String(valor))
        }
        else {
            // this.value += valor.toString();
            (this.value != null) ? tree.updateConsolaPrint(String(this.value)) : tree.updateConsolaPrint("null");
            // tree.updateConsolaPrint(String(valor))
        }
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

<<<<<<< Updated upstream
},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Simbolo":53,"../TablaSimbolos/Tipo":55,"./Transferencia/Return":52}],47:[function(require,module,exports){
=======
},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Simbolo":50,"../TablaSimbolos/Tipo":52,"./Transferencia/Return":49}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignaVariable = void 0;
const Errores_1 = require("../../Ast/Errores");
const Identificador_1 = require("../../Expresiones/Identificador");
const Asignacion_1 = require("../Asignacion");
const Struct_1 = require("./Struct");
class AsignaVariable {
    constructor(idStruct, idAcceso, fila, columna) {
        this.idStruct = idStruct;
        this.idAcceso = idAcceso;
        this.fila = fila;
        this.columna = columna;
        this.instruccion = null;
    }
    ejecutar(table, tree) {
        if (!(this.idStruct instanceof Identificador_1.Identificador)) {
            return new Errores_1.Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO ID", this.fila, this.columna);
        }
        // console.log("acceso")
        let simboloStruct = this.idStruct.ejecutar(table, tree);
        // this.id= this.idStruct.id; 
        if (simboloStruct == null) {
            return new Errores_1.Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        }
        // if (simboloStruct.tipo != TIPO.STRUCT)
        // {
        //     return new Errores("Semantico", "Struct " + this.id + " NO es TIPO STRUCT", this.fila, this.columna);
        // }
        // Acceso atributos
        // let value = this.accesoAttribute(this.expresiones, simboloStruct.valor)
        // console.log(this.idStruct)
        // console.log(this.expresiones);
        // console.log(simboloStruct);
        if (!(this.idAcceso instanceof Identificador_1.Identificador || this.idAcceso instanceof AsignaVariable || this.idAcceso instanceof Struct_1.Struct)) {
            return new Errores_1.Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        }
        if (this.idAcceso instanceof AsignaVariable) {
            this.idAcceso.instruccion = this.instruccion;
        }
        // if(!(simboloStruct.valor instanceof TablaSimbolos)){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO /Struct ", this.fila, this.columna);
        // }else{
        // }
        if (this.instruccion != null /*&& this.ultimo==true*/ && this.instruccion instanceof Asignacion_1.Asignacion && this.idAcceso instanceof Identificador_1.Identificador) {
            this.instruccion.id = this.idAcceso.id;
            if (this.idAcceso instanceof Identificador_1.Identificador && this.idStruct instanceof Identificador_1.Identificador) {
                let result = this.instruccion.ejecutar(simboloStruct.valor, tree);
                if (result instanceof Errores_1.Errores)
                    return result;
                return result;
            }
        }
        let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor, tree);
        return resultAcceso;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.AsignaVariable = AsignaVariable;

},{"../../Ast/Errores":6,"../../Expresiones/Identificador":12,"../Asignacion":22,"./Struct":45}],44:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclararStruct = void 0;
const Errores_1 = require("../../Ast/Errores");
const Llamada_1 = require("../../Expresiones/Llamada");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DeclararStruct {
    constructor(tipoStruct, id, llamada, fila, columna) {
        this.tipo = Tipo_1.TIPO.STRUCT;
        this.tipoStruct = tipoStruct; // Estudiante
        this.id = id; // variableID  
        this.fila = fila;
        this.columna = columna;
        this.llamada = llamada;
    }
    ejecutar(table, tree) {
        // Validamos si solo es declaracion sin INSTANCIAR =
        if (this.llamada == null) {
            let nuevo_simb = new Simbolo_1.Simbolo(this.id, Tipo_1.TIPO.STRUCT, false, this.fila, this.columna, null);
            nuevo_simb.tipoStruct = this.tipoStruct;
            nuevo_simb.variables = [];
            let resultStruct = table.setSymbolTabla(nuevo_simb);
            if (resultStruct instanceof Errores_1.Errores)
                return resultStruct;
            return null;
        }
        else {
            // SI NO, ES ASIGNACION CON DECLARACION=
            //1 Obtenemos Struct
            let struct = tree.getStruct(this.tipoStruct); // Struct
            // console.log(struct);
            if (struct == null) {
                return new Errores_1.Errores("Semantico", "Struct " + this.tipoStruct + ": NO coincide con la busqueda", this.fila, this.columna);
            }
            //2 EJECUTAMOS  STRUCT
            // struct.idSimbolo =this.id;
            let nuevo_simb = new Simbolo_1.Simbolo(this.id, Tipo_1.TIPO.STRUCT, false, this.fila, this.columna, new TablaSimbolos_1.TablaSimbolos(null));
            nuevo_simb.tipoStruct = this.tipoStruct;
            // tree.updateConsolaPrintln(" tamano variables: struct; " + this.variables.length);
            // tree.updateConsolaPrintln(" tamano instruccines: struct; " + this.instructions.length);
            /**
             * GUARDAMOS SIMBOLO STRUCT
             */
            let entornoAttributes = new TablaSimbolos_1.TablaSimbolos(null);
            let varSTemps = [];
            let resultStruct = struct.executeEnvironment(entornoAttributes, tree, varSTemps); // retorna variables
            if (resultStruct instanceof Errores_1.Errores)
                return resultStruct;
            table.setSymbolTabla(nuevo_simb);
            // 
            // console.log(table.getSymbolTabla(this.id));
            // 2.1 if es nulo, solo declara
            if (!(this.llamada instanceof Llamada_1.Llamada))
                return new Errores_1.Errores("Semantico", "Struct  " + this.tipoStruct + ": Expresion no es de tipo Llamada", this.fila, this.columna);
            // Ejecutando parametros
            let SymbolStructNow = table.getSymbolTabla(this.id);
            SymbolStructNow.valor = new TablaSimbolos_1.TablaSimbolos(null);
            SymbolStructNow.valor = entornoAttributes;
            SymbolStructNow.variables = varSTemps;
            // tree.updateConsolaPrintln(`to strinng Struct: ${SymbolStructNow.valor.toStringTable()}`);
            // let newTable = nuevo_simb.getValor();
            // console.log("STRUCTTTTTTTTTTTTTTTTTTTTTTT")
            // console.log(SymbolStructNow)
            // valido tama;o de   parametros parameters de funcion y parametros de llamada
            if (this.llamada.parameters.length == SymbolStructNow.variables.length) {
                let count = 0;
                for (let expr of this.llamada.parameters) {
                    let valueExpr = expr.ejecutar(table, tree);
                    if (valueExpr instanceof Errores_1.Errores) {
                        return new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.llamada.fila, this.llamada.columna);
                    }
                    if (SymbolStructNow.variables[count].tipo == expr.tipo || SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.ANY) //Valida Tipos
                     {
                        let symbol;
                        if (SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.ANY) {
                            symbol = new Simbolo_1.Simbolo(String(SymbolStructNow.variables[count].id), expr.tipo, false, this.llamada.fila, this.llamada.columna, valueExpr); // seteo para variables nativas
                        }
                        else if (SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.STRUCT) {
                            // Dos formas 1: struct intanciado|| null
                            // IF el nuevo parametro es de tipo struct
                            if (expr.tipo == Tipo_1.TIPO.STRUCT && expr.tipoStruct == this.tipoStruct) {
                                symbol = new Simbolo_1.Simbolo(SymbolStructNow.variables[count].id, Tipo_1.TIPO.STRUCT, false, this.llamada.fila, this.llamada.columna, valueExpr.valor);
                                symbol.variables = valueExpr.variables;
                                symbol.tipoStruct = this.tipoStruct;
                            }
                            if (expr.tipo == Tipo_1.TIPO.NULO) {
                                symbol = new Simbolo_1.Simbolo(SymbolStructNow.variables[count].id, Tipo_1.TIPO.STRUCT, false, this.llamada.fila, this.llamada.columna, null);
                                // symbol.variables = valueExpr.variables;
                                symbol.variables = [];
                                symbol.tipoStruct = this.tipoStruct;
                            }
                            // symbol = new Simbolo(String(struct.variables[count].id),expr.tipo, true, this.llamada.fila, this.llamada.columna, valueExpr ); // seteo para variables nativas
                        }
                        else {
                            symbol = new Simbolo_1.Simbolo(SymbolStructNow.variables[count].id, SymbolStructNow.variables[count].tipo, false, this.llamada.fila, this.llamada.columna, valueExpr);
                        }
                        // console.log(struct)
                        // console.log(symbol)
                        let resultTable = SymbolStructNow.valor.updateSymbolTabla(symbol);
                        if (resultTable instanceof Errores_1.Errores)
                            return resultTable;
                    }
                    else {
                        return new Errores_1.Errores("Semantico", "Verificacion de Tipo de Parametros no coincide", this.fila, this.columna);
                    }
                    count++;
                }
                // let resultStruct = table.updateSymbolTabla(SymbolStructNow); // Update Struct Actual
                // if (resultStruct instanceof Errores)
                //     return resultStruct
                // return null;
            }
            else {
                console.log(`tam param call: ${this.llamada.parameters.length} func ${struct.instructions.length}`);
                return new Errores_1.Errores("Semantico", "Tamaño de Tipo de Parametros no coincide", this.fila, this.columna);
            }
        }
    }
    getTipoStruct() {
        throw new Error("Method not implemented.");
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.DeclararStruct = DeclararStruct;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../Expresiones/Llamada":13,"../../TablaSimbolos/Simbolo":53,"../../TablaSimbolos/TablaSimbolos":54,"../../TablaSimbolos/Tipo":55}],48:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../Expresiones/Llamada":13,"../../TablaSimbolos/Simbolo":50,"../../TablaSimbolos/TablaSimbolos":51,"../../TablaSimbolos/Tipo":52}],45:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = void 0;
const Errores_1 = require("../../Ast/Errores");
const DeclaracionArr_1 = require("../Arreglos/DeclaracionArr");
const Declaracion_1 = require("../Declaracion");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const DeclararStruct_1 = require("./DeclararStruct");
const StructInStruct_1 = require("./StructInStruct");
class Struct {
    constructor(id, instructions, fila, columna) {
        this.id = id;
        this.idSimbolo = "";
        this.fila = fila;
        this.columna = columna;
        this.attributes = new TablaSimbolos_1.TablaSimbolos(null);
        this.instructions = instructions;
        this.tipo = Tipo_1.TIPO.STRUCT;
        this.variables = new Array();
    }
    ejecutar(table, tree) {
        // let attributes = new TablaSimbolos(null);
        // let variables = new Array();
        console.log(this.instructions);
        for (let instr of this.instructions) {
            let result = null;
            // Validando Declaraciones Asignaciones 
            if (instr instanceof Declaracion_1.Declaracion || instr instanceof StructInStruct_1.StructInStruct || instr instanceof DeclaracionArr_1.DeclaracionArr || instr instanceof DeclararStruct_1.DeclararStruct /**AGREGAR DECLA STRUCT */) {
                console.log(instr);
                result = instr.ejecutar(this.attributes, tree);
                if (instr instanceof Declaracion_1.Declaracion) {
                    for (let simbolo of instr.simbolos) {
                        // tree.updateConsolaPrintln(" simbolo: " + simbolo.id);
                        this.variables.push({ "tipo": instr.tipo, "arreglo": false, "id": simbolo.id });
                    }
                }
                if (instr instanceof StructInStruct_1.StructInStruct) {
                    this.variables.push({ "tipo": instr.tipo, "arreglo": false, "id": instr.id });
                }
            }
            // Validando Errores
            if (result instanceof Errores_1.Errores) {
                let error = new Errores_1.Errores("Semantico", "Struct - Error en Atributos Struct ", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrint(error.toString() + "/n/t->/t");
                return result;
            }
            if (result instanceof Break_1.Detener) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Continuar_1.Continuar) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Return_1.Return) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Return fuera de Metodo/Funciones/Controlador", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
                // this.tipo = result.tipo;
                // return result.valor;
            }
        }
        // Guardo Simbolo: id, tipoStruct(el Struct que es), TIPO.STRUCT, variables, Attributes: TablaSimbolos(null)
        // return variables;
        // return [table, variables];
    }
    executeEnvironment(table, tree, variables) {
        // let attributes = new TablaSimbolos(null);
        // let variables = new Array();
        console.log(this.instructions);
        for (let instr of this.instructions) {
            let result = null;
            // Validando Declaraciones Asignaciones 
            if (instr instanceof Declaracion_1.Declaracion || instr instanceof StructInStruct_1.StructInStruct || instr instanceof DeclaracionArr_1.DeclaracionArr || instr instanceof DeclararStruct_1.DeclararStruct /**AGREGAR DECLA STRUCT */) {
                console.log(instr);
                result = instr.ejecutar(table, tree);
                if (instr instanceof Declaracion_1.Declaracion) {
                    for (let simbolo of instr.simbolos) {
                        // tree.updateConsolaPrintln(" simbolo: " + simbolo.id);
                        variables.push({ "tipo": instr.tipo, "arreglo": false, "id": simbolo.id });
                    }
                }
                if (instr instanceof StructInStruct_1.StructInStruct) {
                    variables.push({ "tipo": instr.tipo, "arreglo": false, "id": instr.id, "tipoStruct": instr.tipoStruct });
                }
            }
            // Validando Errores
            if (result instanceof Errores_1.Errores) {
                let error = new Errores_1.Errores("Semantico", "Struct - Error en Atributos Struct ", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrint(error.toString() + "/n/t->/t");
                return result;
            }
            if (result instanceof Break_1.Detener) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Continuar_1.Continuar) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
            }
            if (result instanceof Return_1.Return) {
                let error = new Errores_1.Errores("Semantico", "Sentencia Return fuera de Metodo/Funciones/Controlador", this.fila, this.columna);
                tree.getErrores().push(error);
                tree.updateConsolaPrintln(error.toString());
                // this.tipo = result.tipo;
                // return result.valor;
            }
        }
        // Guardo Simbolo: id, tipoStruct(el Struct que es), TIPO.STRUCT, variables, Attributes: TablaSimbolos(null)
        // return variables;
        // return [table, variables];
    }
    getTipoStruct() {
        return this.id;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.Struct = Struct;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":54,"../../TablaSimbolos/Tipo":55,"../Arreglos/DeclaracionArr":20,"../Declaracion":31,"../Transferencia/Break":50,"../Transferencia/Continuar":51,"../Transferencia/Return":52,"./DeclararStruct":47,"./StructInStruct":49}],49:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/TablaSimbolos":51,"../../TablaSimbolos/Tipo":52,"../Arreglos/DeclaracionArr":20,"../Declaracion":31,"../Transferencia/Break":47,"../Transferencia/Continuar":48,"../Transferencia/Return":49,"./DeclararStruct":44,"./StructInStruct":46}],46:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructInStruct = void 0;
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Errores_1 = require("../../Ast/Errores");
class StructInStruct {
    constructor(tipoStruct, id, fila, columna) {
        this.tipo = Tipo_1.TIPO.STRUCT;
        this.tipoStruct = tipoStruct; // Estudiante
        this.id = id; // variableID  
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let nuevo_simb = new Simbolo_1.Simbolo(this.id, Tipo_1.TIPO.STRUCT, false, this.fila, this.columna, null);
        nuevo_simb.tipoStruct = this.tipoStruct;
        nuevo_simb.variables = [];
        let resultStruct = table.setSymbolTabla(nuevo_simb);
        if (resultStruct instanceof Errores_1.Errores)
            return resultStruct;
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        throw new Error("Method not implemented.");
    }
}
exports.StructInStruct = StructInStruct;

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../TablaSimbolos/Simbolo":53,"../../TablaSimbolos/Tipo":55}],50:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../TablaSimbolos/Simbolo":50,"../../TablaSimbolos/Tipo":52}],47:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detener = void 0;
class Detener {
    constructor(fila, columna) {
        this.fila = fila;
        this.columna = columna;
    }
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

<<<<<<< Updated upstream
},{}],51:[function(require,module,exports){
=======
},{}],48:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continuar = void 0;
const Nodo_1 = require("../../Ast/Nodo");
class Continuar {
    constructor(fila, columna) {
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        return this;
    }
    translate3d(table, tree) {
        throw new Error('Method not implemented.');
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("CONTINUE", "");
        return padre;
    }
}
exports.Continuar = Continuar;

<<<<<<< Updated upstream
},{"../../Ast/Nodo":7}],52:[function(require,module,exports){
=======
},{"../../Ast/Nodo":7}],49:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Errores_1 = require("../../Ast/Errores");
class Return {
    constructor(expresion, fila, columna) {
        this.expresion = expresion;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        if (this.expresion != null) {
            let valor = this.expresion.ejecutar(table, tree);
            if (valor instanceof Errores_1.Errores) {
                return valor;
            }
            this.tipo = this.expresion.tipo;
            this.valor = valor;
            return this;
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

<<<<<<< Updated upstream
},{"../../Ast/Errores":6,"../../Ast/Nodo":7}],53:[function(require,module,exports){
=======
},{"../../Ast/Errores":6,"../../Ast/Nodo":7}],50:[function(require,module,exports){
>>>>>>> Stashed changes
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
const TablaSimbolos_1 = require("./TablaSimbolos");
class Simbolo {
    constructor(id, tipo, arreglo, fila, columna, valor, structEnv = false) {
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
    getTipoStruct() {
        return this.tipoStruct;
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
    toStringStruct() {
        // return this.id + " - " + this.descripcion + " [" + String(this.fila) + "," + String(this.columna) + "]";
        console.log("entre a to string struct");
        let cadena = "";
        if (this.valor instanceof TablaSimbolos_1.TablaSimbolos) {
            console.log(this.valor.tabla);
            cadena = this.valor.toStringTable();
        }
        return this.id + "(" + `${cadena}` + ")";
    }
}
exports.Simbolo = Simbolo;

<<<<<<< Updated upstream
},{"./TablaSimbolos":54}],54:[function(require,module,exports){
=======
},{"./TablaSimbolos":51}],51:[function(require,module,exports){
>>>>>>> Stashed changes
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
            // console.log("Entreeeeee")
            return new Errores_1.Errores("Semantico", "Variable " + simbolo.getId() + " Existe", simbolo.getFila(), simbolo.getColumna());
        }
        else {
            // this.tabla[simbolo.getId()] = simbolo;
            this.tabla.set(simbolo.getId(), simbolo);
            console.log("set simbolo " + simbolo.getId() + " " + simbolo.getValor());
            return null;
        }
    }
    existeEnActual(id) {
        let entorno = this;
        let existe = entorno.tabla.get(id);
        if (existe != null) {
            return true;
        }
        return false;
    }
    toStringTable() {
        let cadena = "";
        if (this.anterior != null) {
            cadena = this.anterior.toStringTable();
            return cadena;
        }
        JSON.stringify((this.tabla.forEach((key, value) => {
            // console.log(value)
            // console.log( key['valor'] +"," )
            cadena += key['valor'] + ",";
        })));
        return cadena;
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
                tablaActual = tablaActual.anterior;
            }
        }
        return null;
    }
    updateSymbolTabla(simbolo) {
        // console.log(`update id: ${simbolo.id}`);
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
                console.log(`tipoo exp: ${existe.getTipo()} tipo variableSym: ${simbolo.getTipo()}`);
                return new Errores_1.Errores("Semantico", "Tipo de dato diferente en asignacion", simbolo.getFila(), simbolo.getColumna());
            }
            else {
                tablaActual = tablaActual.anterior;
            }
        }
        return new Errores_1.Errores("Semantico", "Varibale no encontrada en asignacion", simbolo.getFila(), simbolo.getColumna());
    }
}
exports.TablaSimbolos = TablaSimbolos;

<<<<<<< Updated upstream
},{"../Ast/Errores":6}],55:[function(require,module,exports){
=======
},{"../Ast/Errores":6}],52:[function(require,module,exports){
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

<<<<<<< Updated upstream
},{}],56:[function(require,module,exports){
=======
},{}],53:[function(require,module,exports){
>>>>>>> Stashed changes
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
        result.ejecutar();
    
        let texto = "::::::::::::::::::::::::::::::::::::::::::::::::    SALIDA CONSOLA  ::::::::::::::::::::::::::::::::::::::::::::::::\n";
        
        texto += result.getConsola();
        // $("#textAreaConsola").val(texto);
        // txtConsola.append(texto);
        // Swal.fire(
        //     '¡Gramatica correcta!'
        // );
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
<<<<<<< Updated upstream
},{"./Analizadores/gramatica":4,"./dist/Ast/Ast":5,"./dist/Expresiones/Primitivo":17,"./dist/TablaSimbolos/TablaSimbolos":54}]},{},[56])(56)
=======
},{"./Analizadores/gramatica":4,"./dist/Ast/Ast":5,"./dist/Expresiones/Primitivo":17,"./dist/TablaSimbolos/TablaSimbolos":51}]},{},[53])(53)
>>>>>>> Stashed changes
});
