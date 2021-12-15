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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,25],$V1=[1,39],$V2=[1,30],$V3=[1,26],$V4=[1,27],$V5=[1,31],$V6=[1,32],$V7=[1,33],$V8=[1,34],$V9=[1,35],$Va=[1,36],$Vb=[1,38],$Vc=[1,37],$Vd=[1,28],$Ve=[1,40],$Vf=[1,41],$Vg=[1,42],$Vh=[1,43],$Vi=[1,44],$Vj=[2,5,31,32,35,43,47,48,50,52,55,56,57,58,59,60,61,64,93,94,95,96,97],$Vk=[2,5,31,32,35,43,47,48,49,50,52,55,56,57,58,59,60,61,64,93,94,95,96,97],$Vl=[1,56],$Vm=[32,70,78],$Vn=[2,117],$Vo=[1,63],$Vp=[1,66],$Vq=[1,70],$Vr=[1,67],$Vs=[1,68],$Vt=[1,69],$Vu=[1,71],$Vv=[1,74],$Vw=[1,114],$Vx=[1,88],$Vy=[1,79],$Vz=[1,113],$VA=[1,89],$VB=[1,105],$VC=[1,104],$VD=[1,106],$VE=[1,107],$VF=[1,108],$VG=[1,109],$VH=[1,110],$VI=[1,115],$VJ=[1,116],$VK=[1,78],$VL=[1,80],$VM=[1,81],$VN=[1,82],$VO=[1,83],$VP=[1,84],$VQ=[1,85],$VR=[1,86],$VS=[1,87],$VT=[1,93],$VU=[1,94],$VV=[1,95],$VW=[1,96],$VX=[1,97],$VY=[1,98],$VZ=[1,102],$V_=[1,103],$V$=[2,118],$V01=[8,36],$V11=[2,36],$V21=[1,127],$V31=[1,137],$V41=[1,138],$V51=[1,139],$V61=[1,161],$V71=[1,145],$V81=[1,146],$V91=[1,147],$Va1=[1,148],$Vb1=[1,149],$Vc1=[1,150],$Vd1=[1,151],$Ve1=[1,152],$Vf1=[1,153],$Vg1=[1,154],$Vh1=[1,155],$Vi1=[1,156],$Vj1=[1,157],$Vk1=[1,158],$Vl1=[1,159],$Vm1=[1,160],$Vn1=[8,33,35,36,46,53,71,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$Vo1=[2,144],$Vp1=[1,165],$Vq1=[1,166],$Vr1=[1,168],$Vs1=[2,149],$Vt1=[2,153],$Vu1=[1,171],$Vv1=[1,183],$Vw1=[32,78],$Vx1=[1,194],$Vy1=[36,46],$Vz1=[1,201],$VA1=[32,70],$VB1=[53,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$VC1=[39,78],$VD1=[1,233],$VE1=[8,33,35,36,46,71,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$VF1=[8,33,35,36,46,71,105,106,121],$VG1=[2,146],$VH1=[2,147],$VI1=[2,150],$VJ1=[1,237],$VK1=[36,71],$VL1=[8,33,35,36,46,53,70,71,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$VM1=[1,261],$VN1=[8,33,35,36,39,46,53,70,71,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$VO1=[1,276],$VP1=[8,33,35,36,46,71,98,99,104,105,106,108,109,110,111,112,113,121],$VQ1=[8,33,35,36,46,71,98,99,100,101,102,104,105,106,108,109,110,111,112,113,121],$VR1=[8,33,35,36,46,71,105,106,108,109,110,111,112,113,121],$VS1=[8,33,35,36,46,71,105,106,112,113,121],$VT1=[8,33,35,36,46,71],$VU1=[35,36],$VV1=[1,312],$VW1=[35,52,55],$VX1=[1,339],$VY1=[8,53,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"start":3,"instrucciones":4,"EOF":5,"instruccion":6,"print_instr":7,"PUNTOCOMA":8,"println_instr":9,"main_":10,"funciones":11,"declaracion":12,"asignacion":13,"if_llav_instr":14,"if_instr":15,"switch_instr":16,"break_instr":17,"continue_instr":18,"return_instr":19,"while_instr":20,"for_instr":21,"dowhile_instr":22,"for_in_instr":23,"decl_arr_instr":24,"llamada":25,"modif_arr_instr":26,"structs":27,"nat_push_instr":28,"tipo":29,"lista_simbolos":30,"RSTRUCT":31,"ID":32,"LLAVA":33,"instrucciones_struct":34,"LLAVC":35,"COMA":36,"attribute":37,"attributeDeclaStruct":38,"IGUAL":39,"expr":40,"INCRE":41,"DECRE":42,"RPRINT":43,"PARA":44,"lista_parametros":45,"PARC":46,"RPRINTLN":47,"RIF":48,"RELSE":49,"RSWITCH":50,"lista_cases":51,"RDEFAULT":52,"DOSPUNTOS":53,"case":54,"RCASE":55,"RBREAK":56,"RCONTINUE":57,"RRETURN":58,"RWHILE":59,"RDO":60,"RFOR":61,"actualizacion":62,"RIN":63,"RVOID":64,"RMAIN":65,"lista_parametros_func":66,"parametro_func":67,"lista_dim":68,"lista_exp_arr":69,"CORA":70,"CORC":71,"lista_exp_arr_c":72,"HASH":73,"lista_exp":74,"rango":75,"RBEGIN":76,"REND":77,"PUNTO":78,"RPUSH":79,"accesoAsignaStruct":80,"nat_matematicas":81,"RSIN":82,"RCOS":83,"RTAN":84,"RSQRT":85,"RLOG":86,"nat_parse":87,"RPARSE":88,"nat_conversion":89,"nat_conversion_tipos":90,"RTOINT":91,"RTODOUBLE":92,"RINT":93,"RDOUBLE":94,"RSTRING":95,"RCHAR":96,"RBOOLEAN":97,"MAS":98,"MENOS":99,"MULTI":100,"DIV":101,"PORCENTAJE":102,"POTENCIA":103,"AMPERSON":104,"AND":105,"OR":106,"NOT":107,"MAYORQUE":108,"MAYORIGUAL":109,"MENORIGUAL":110,"MENORQUE":111,"IGUALIGUAL":112,"DIFERENTE":113,"ENTERO":114,"DECIMAL":115,"CADENA":116,"CHAR":117,"NULL":118,"TRUE":119,"FALSE":120,"INTERROGACION":121,"RPOP":122,"RLENGTH":123,"RCHAROFPOS":124,"RSUBSTRING":125,"RTOUPPER":126,"RTOLOWER":127,"RSTRING_N":128,"RTYPEOF":129,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"PUNTOCOMA",31:"RSTRUCT",32:"ID",33:"LLAVA",35:"LLAVC",36:"COMA",39:"IGUAL",41:"INCRE",42:"DECRE",43:"RPRINT",44:"PARA",46:"PARC",47:"RPRINTLN",48:"RIF",49:"RELSE",50:"RSWITCH",52:"RDEFAULT",53:"DOSPUNTOS",55:"RCASE",56:"RBREAK",57:"RCONTINUE",58:"RRETURN",59:"RWHILE",60:"RDO",61:"RFOR",63:"RIN",64:"RVOID",65:"RMAIN",70:"CORA",71:"CORC",73:"HASH",76:"RBEGIN",77:"REND",78:"PUNTO",79:"RPUSH",82:"RSIN",83:"RCOS",84:"RTAN",85:"RSQRT",86:"RLOG",88:"RPARSE",91:"RTOINT",92:"RTODOUBLE",93:"RINT",94:"RDOUBLE",95:"RSTRING",96:"RCHAR",97:"RBOOLEAN",98:"MAS",99:"MENOS",100:"MULTI",101:"DIV",102:"PORCENTAJE",103:"POTENCIA",104:"AMPERSON",105:"AND",106:"OR",107:"NOT",108:"MAYORQUE",109:"MAYORIGUAL",110:"MENORIGUAL",111:"MENORQUE",112:"IGUALIGUAL",113:"DIFERENTE",114:"ENTERO",115:"DECIMAL",116:"CADENA",117:"CHAR",118:"NULL",119:"TRUE",120:"FALSE",121:"INTERROGACION",122:"RPOP",123:"RLENGTH",124:"RCHAROFPOS",125:"RSUBSTRING",126:"RTOUPPER",127:"RTOLOWER",128:"RSTRING_N",129:"RTYPEOF"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,2],[6,1],[6,1],[6,2],[6,2],[6,1],[6,1],[6,1],[6,2],[6,2],[6,2],[6,1],[6,1],[6,2],[6,1],[6,2],[6,2],[6,2],[6,2],[6,2],[6,1],[12,2],[27,5],[34,3],[34,1],[37,2],[37,2],[38,1],[38,3],[30,3],[30,5],[30,1],[30,3],[13,3],[13,2],[13,2],[13,4],[7,4],[9,4],[14,7],[14,11],[14,9],[15,5],[15,7],[15,7],[16,7],[16,9],[16,10],[51,2],[51,1],[54,4],[45,3],[45,1],[17,1],[18,1],[19,2],[19,1],[20,7],[22,8],[21,11],[21,11],[62,3],[62,2],[62,2],[23,7],[10,7],[10,6],[10,1],[11,7],[11,8],[11,1],[66,3],[66,1],[67,2],[67,1],[25,3],[25,4],[24,5],[24,3],[24,3],[68,3],[68,2],[69,4],[69,3],[69,2],[72,3],[72,1],[74,4],[74,3],[26,4],[75,3],[75,3],[75,3],[75,3],[28,6],[28,5],[80,3],[80,1],[81,1],[81,1],[81,1],[81,1],[81,1],[87,6],[89,4],[90,1],[90,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,2],[40,3],[40,3],[40,3],[40,2],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,5],[40,2],[40,2],[40,3],[40,1],[40,2],[40,1],[40,3],[40,1],[40,3],[40,3],[40,4],[40,6],[40,3],[40,3],[40,4],[40,1],[40,1],[40,4],[40,4]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
   this.$ = new Ast();  this.$.instrucciones = $$[$0-1]; this.$.Errores = errores.slice();
                                                return this.$; 
break;
case 2:
 this.$ = $$[$0-1];if($$[$0]!=null){ this.$.push($$[$0]);} 
break;
case 3:
 this.$= new Array(); if($$[$0]!=null){this.$.push($$[$0]); }
break;
case 4: case 5: case 8: case 9: case 13: case 14: case 15: case 18: case 20: case 21: case 22: case 23: case 24:
 this.$ = $$[$0-1] 
break;
case 6: case 7: case 10: case 11: case 12: case 16: case 17: case 19:
 this.$ = $$[$0] 
break;
case 25:
 
                                                errores.push(new Errores("Sintactico", `Error sintactico: ${yytext}.`, this._$.first_line, this._$.first_column));
                                                this.$ =null;
                                            
break;
case 26:
 this.$ = new Declaracion($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 27:
 this.$ = new Struct($$[$0-3],$$[$0-1],_$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 28: case 56: case 76: case 90:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 29:
 this.$= new Array(); this.$.push($$[$0]); 
break;
case 30:
this.$ = new StructInStruct($$[$0-1],$$[$0],_$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 31:
 this.$ = new Declaracion($$[$0-1], [$$[$0]], _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 32:
 this.$=new Simbolo($$[$0],null,null,_$[$0].first_line, _$[$0].first_column,null); 
break;
case 33:
 this.$=new Simbolo($$[$0-2],null,null,_$[$0-2].first_line, _$[$0-2].first_column,$$[$0]); 
break;
case 34:
 this.$ = $$[$0-2]; this.$.push(new Simbolo($$[$0],null,null,_$[$0-2].first_line, _$[$0-2].first_column,null)); 
break;
case 35:
 this.$ = $$[$0-4]; this.$.push(new Simbolo($$[$0-2],null,null,_$[$0-4].first_line, _$[$0-4].first_column,$$[$0])); 
break;
case 36:
 this.$ = new Array(); this.$.push(new Simbolo($$[$0],null,null,_$[$0].first_line, _$[$0].first_column,null)); 
break;
case 37:
 this.$ = new Array(); this.$.push(new Simbolo($$[$0-2],null,null,_$[$0-2].first_line, _$[$0-2].first_column,$$[$0])); 
break;
case 38:

                                                if($$[$0] instanceof Array){
                                                    // console.log("asignacion arreglo");
                                                    this.$ = new DeclaracionArr(null, null, $$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].last_column);
                                                }else{
                                                    // console.log("asignacion normal");
                                                    this.$ = new Asignacion($$[$0-2] ,$$[$0], _$[$0-2].first_line, _$[$0-2].last_column);
                                                }
                                            
break;
case 39: case 67:
 this.$ = new Asignacion($$[$0-1] ,new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false), _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 40: case 68:
 this.$ = new Asignacion($$[$0-1] ,new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false), _$[$0-1].first_line, _$[$0-1].last_column); 
break;
case 41:
 this.$ = new DeclararStruct($$[$0-3],$$[$0-2],$$[$0],_$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 42:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column, false); 
break;
case 43:
 this.$ = new Print($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column, true); 
break;
case 44:
 this.$ = new If($$[$0-4], $$[$0-1], null,null, _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 45:
 this.$ = new If($$[$0-8], $$[$0-5], $$[$0-1],null, _$[$0-10].first_line, _$[$0-10].first_column); 
break;
case 46:
 this.$ = new If($$[$0-6], $$[$0-3],null, $$[$0], _$[$0-8].first_line, _$[$0-8].first_column); 
break;
case 47:
 this.$ = new Ifsinllave($$[$0-2], $$[$0], [], _$[$0-4].first_line, _$[$0-4].first_column); 
break;
case 48:
 this.$ = new Ifsinllave($$[$0-4], $$[$0-2], $$[$0], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 49:
 this.$ = new Ifsinllave($$[$0-4], $$[$0-2], [$$[$0]], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 50:
 this.$ = new Switch($$[$0-4], $$[$0-1], [], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 51:
 this.$ = new Switch($$[$0-6], [], $$[$0-1], _$[$0-8].first_line, _$[$0-8].first_column); 
break;
case 52:
 this.$ = new Switch($$[$0-7], $$[$0-4], $$[$0-1], _$[$0-9].first_line, _$[$0-9].first_column); 
break;
case 53:
 this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 54: case 57:
 this.$ = new Array(); this.$.push($$[$0]);
break;
case 55:
 this.$ = new Case($$[$0-2], $$[$0], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 58:
 this.$ = new Detener(_$[$0].first_line, _$[$0].first_column); 
break;
case 59:
 this.$ = new Continuar(_$[$0].first_line, _$[$0].first_column); 
break;
case 60:
 this.$ = new Return($$[$0],_$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 61:
 this.$ = new Return(new Primitivo(null, TIPO.NULO, _$[$0].first_line, _$[$0].first_column),_$[$0].first_line, _$[$0].first_column); 
break;
case 62:
 this.$ = new While($$[$0-4], $$[$0-1], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 63:
 this.$ = new DoWhile($$[$0-1], $$[$0-5], _$[$0-7].first_line, _$[$0-7].last_column); 
break;
case 64: case 65:
 this.$ = new For($$[$0-8], $$[$0-6], $$[$0-4], $$[$0-1], _$[$0-10].first_line, _$[$0-10].first_column); 
break;
case 66:
 this.$ = new Asignacion($$[$0-2] ,$$[$0], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 69:
 this.$ = new ForIn($$[$0-5], $$[$0-3], $$[$0-1], _$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 70:
 this.$ = new Main($$[$0-1],_$[$0-6].first_line, _$[$0-6].first_column); 
break;
case 71:
 this.$ = new Main([],_$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 72:
   errores.push(new Errores("Sintactico", "No hay instrucciones dentro de Main.", this._$.first_line, this._$.first_column));
                                                this.$=null;
                                            
break;
case 73:
 this.$ = new Funcion($$[$0-5], $$[$0-6], [], $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 74:
 this.$ = new Funcion($$[$0-6], $$[$0-7], $$[$0-4], $$[$0-1], _$[$0-7].first_line, _$[$0-7].last_column); 
break;
case 75:
   errores.push(new Errores("Sintactico", `No hay instrucciones en la funcion.`, this._$.first_line, this._$.first_column));
                                                this.$=null;
                                            
break;
case 77: case 91:
 this.$ = new Array(); this.$.push($$[$0]); 
break;
case 78:
 this.$ = {"tipo" : $$[$0-1], "arreglo": false, "id": $$[$0]}; 
break;
case 79:
 this.$ = {"tipo" : TIPO.ANY, "arreglo": false, "id": $$[$0]}; 
break;
case 80:
 this.$ = new Llamada($$[$0-2] , [], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 81:
 this.$ = new Llamada($$[$0-3] , $$[$0-1] , _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 82:
 this.$ = new DeclaracionArr($$[$0-4], $$[$0-3], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 83:
 this.$ = new DeclaracionArr(null, null, $$[$0-2], $$[$0-1], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 84:
 this.$ = new DeclaracionArr($$[$0-2], $$[$0-1], $$[$0], null, _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 85:
 this.$ = $$[$0-2]; this.$.push($$[$0-1]+1); 
break;
case 86:
 this.$ = new Array(); this.$.push(1); 
break;
case 87: case 92:
 this.$ = $$[$0-3]; this.$.push($$[$0-1]); 
break;
case 88: case 93:
 this.$ = new Array(); this.$.push($$[$0-1]); 
break;
case 89:
 this.$ = new Copiar($$[$0], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 94:
 this.$ = new ModificacionArr($$[$0-3], $$[$0-2], $$[$0], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 95: case 96: case 97: case 98:
 this.$ = {"inicio": $$[$0-2], "fin": $$[$0]}; 
break;
case 99:
 this.$ = new Push(new Identificador($$[$0-5] , _$[$0-5].first_line, _$[$0-5].last_column), $$[$0-1], _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 100:
  
                                                // let first = $$[$0-4];
                                                // if (first instanceof Identificador)
                                                // {
                                                //     this.$ = new Asignacion(first.id ,$$[$0-2], _$[$0-4].first_line, _$[$0-4].last_column);
                                                // }else{
                                                    let accesoPadre = new AccesoStruct(new Identificador($$[$0-4] , _$[$0-4].first_line, _$[$0-4].last_column),$$[$0-2],_$[$0-4].first_line, _$[$0-4].first_column);
                                                    this.$ = new AsignaVariable(accesoPadre,$$[$0], _$[$0-4].first_line, _$[$0-4].last_column);
                                                    // this.$ = $$[$0-4];
                                                    // this.$.instruccion = new Asignacion(null ,$$[$0], _$[$0-4].first_line, _$[$0-4].last_column); 
                                                // }
                                            
break;
case 101:
 this.$ = new AccesoStruct($$[$0-2],new Identificador($$[$0] , _$[$0-2].first_line, _$[$0-2].last_column),_$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 102: case 144:
 this.$ = new Identificador($$[$0] , _$[$0].first_line, _$[$0].last_column); 
break;
case 103: case 104: case 105: case 106: case 107: case 110: case 111: case 149: case 161: case 162:
 this.$ = $$[$0]; 
break;
case 108:
 this.$ = new Parse($$[$0-5], $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); 
break;
case 109:
 this.$ = new To($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 112:
 this.$ = TIPO.ENTERO; 
break;
case 113:
 this.$ = TIPO.DECIMAL; 
break;
case 114:
 this.$ = TIPO.CADENA; 
break;
case 115:
 this.$ = TIPO.CHARACTER; 
break;
case 116:
 this.$ = TIPO.BOOLEANO; 
break;
case 117:
 this.$ = TIPO.VOID; 
break;
case 118:
 this.$ = TIPO.STRUCT; 
break;
case 119:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MAS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 120:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MENOS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 121:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POR,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 122:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.DIV,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 123:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MOD,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 124:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POT,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 125:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.AMPERSON,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 126:
 this.$ = new Aritmetica($$[$0],OperadorAritmetico.UMENOS,$$[$0], _$[$0-1].first_line, _$[$0-1].first_column, true); 
break;
case 127: case 148:
 this.$ = $$[$0-1]; 
break;
case 128:
 this.$ = new Logica($$[$0-2], OperadorLogico.AND, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 129:
 this.$ = new Logica($$[$0-2], OperadorLogico.OR, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 130:
 this.$ = new Logica($$[$0], OperadorLogico.NOT, null, $$[$0-1].first_line, $$[$0-1].last_column, true); 
break;
case 131:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 132:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 133:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 134:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 135:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.IGUALIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 136:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.DIFERENTE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 137:
 this.$ = new Primitivo(Number($$[$0]), TIPO.ENTERO, _$[$0].first_line, _$[$0].first_column); 
break;
case 138:
 this.$ = new Primitivo(Number($$[$0]), TIPO.DECIMAL, _$[$0].first_line, _$[$0].first_column); 
break;
case 139:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CADENA, _$[$0].first_line, _$[$0].first_column); 
break;
case 140:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CHARACTER, _$[$0].first_line, _$[$0].first_column); 
break;
case 141:
 this.$ = new Primitivo(null, TIPO.NULO, _$[$0].first_line, _$[$0].first_column); 
break;
case 142:
 this.$ = new Primitivo(true, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 143:
 this.$ = new Primitivo(false, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 145:
this.$ = new Ternario($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].first_column);
break;
case 146:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
case 147:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
case 150:
 this.$ = new AccesoArr($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 151:
 this.$ = new Rango(TIPO.RANGO, [$$[$0].inicio, $$[$0].fin], _$[$0].first_line, _$[$0].last_column); 
break;
case 152:
   if( $$[$0] instanceof Pop || $$[$0] instanceof Length || $$[$0] instanceof CharOfPos ||
                                            $$[$0] instanceof subString || $$[$0] instanceof toUpper || $$[$0] instanceof toLower){
                                            this.$ = $$[$0];
                                            let identifica =new Identificador($$[$0-2] , _$[$0-2].first_line, _$[$0-2].last_column);
                                            this.$.id = identifica.id;
                                        }else{
                                            this.$ = new AccesoStruct(new Identificador($$[$0-2] , _$[$0-2].first_line, _$[$0-2].last_column),$$[$0],_$[$0-2].first_line, _$[$0-2].first_column);
                                        }
                                    
break;
case 153:
 this.$ = new Arreglo(TIPO.ARREGLO, $$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 154:
 this.$ = new Pop(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 155:
 this.$ = new Length(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 156:
 this.$ = new CharOfPos(null, $$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 157:
 this.$ = new subString(null, $$[$0-3], $$[$0-1], _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 158:
 this.$ = new toUpper(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 159:
 this.$ = new toLower(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 160:
 this.$ = new Matematicas($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 163:
 this.$ = new StringN($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 164:
 this.$ = new TypeOfN($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
}
},
table: [{2:$V0,3:1,4:2,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{1:[3]},{2:$V0,5:[1,45],6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vj,[2,3]),{8:[1,47]},{8:[1,48]},o($Vk,[2,6]),o($Vk,[2,7]),{8:[1,49]},{8:[1,50]},o($Vk,[2,10]),o($Vk,[2,11]),o($Vk,[2,12]),{8:[1,51]},{8:[1,52]},{8:[1,53]},o($Vk,[2,16]),o($Vk,[2,17]),{8:[1,54]},o($Vk,[2,19]),{8:[1,55]},{8:$Vl},{8:[1,57]},{8:[1,58]},{8:[1,59]},o($Vk,[2,25]),{44:[1,60]},{44:[1,61]},o($Vm,$Vn,{65:[1,62]}),{30:64,32:$Vo,68:65,70:$Vp},{32:$Vq,39:$Vr,41:$Vs,42:$Vt,44:$Vu,70:$Vv,74:72,78:[1,73]},{44:[1,75]},{44:[1,76]},{8:[2,58]},{8:[2,59]},{8:[2,61],25:90,29:111,31:$Vw,32:$Vx,40:77,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{44:[1,117]},{32:[1,119],44:[1,118]},{33:[1,120]},o([70,78],$V$,{32:[1,121]}),o($Vm,[2,112]),o($Vm,[2,113]),o($Vm,[2,114]),o($Vm,[2,115]),o($Vm,[2,116]),{1:[2,1]},o($Vj,[2,2]),o($Vk,[2,4]),o($Vk,[2,5]),o($Vk,[2,8]),o($Vk,[2,9]),o($Vk,[2,13]),o($Vk,[2,14]),o($Vk,[2,15]),o($Vk,[2,18]),o($Vk,[2,20]),o($Vk,[2,21]),o($Vk,[2,22]),o($Vk,[2,23]),o($Vk,[2,24]),{25:90,29:111,31:$Vw,32:$Vx,40:123,44:$Vy,45:122,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:123,44:$Vy,45:124,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{44:[1,125]},o($V01,$V11,{39:$V21,44:[1,126]}),{8:[2,26],36:[1,128]},{32:[1,129],70:[1,130]},{71:[1,131]},{25:90,29:111,31:$Vw,32:$Vx,40:132,44:$Vy,64:$Vz,69:133,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{8:[2,39]},{8:[2,40]},{39:[1,134]},{25:90,29:111,31:$Vw,32:$Vx,40:123,44:$Vy,45:136,46:[1,135],64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{39:$V31,70:$V41},{32:[1,141],79:$V51,80:140},{25:90,29:111,31:$Vw,32:$Vx,40:142,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:143,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:144,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{8:[2,60],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{25:90,29:111,31:$Vw,32:$Vx,40:162,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:163,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:164,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vn1,[2,137]),o($Vn1,[2,138]),o($Vn1,[2,139]),o($Vn1,[2,140]),o($Vn1,[2,141]),o($Vn1,[2,142]),o($Vn1,[2,143]),o($Vn1,$Vo1,{74:167,41:$Vp1,42:$Vq1,44:$Vu,70:$Vv,78:$Vr1}),{25:90,29:111,31:$Vw,32:$Vx,40:170,44:$Vy,64:$Vz,69:92,70:$VA,72:169,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vn1,$Vs1),o($Vn1,[2,151]),o($Vn1,$Vt1,{70:$Vu1}),{44:[1,172]},{44:[1,173]},{44:[1,174]},{44:[1,175]},{44:[1,176]},{44:[1,177]},{44:[1,178]},o($Vn1,[2,161]),o($Vn1,[2,162]),{44:[1,179]},{44:[1,180]},{53:[1,181]},{32:[1,182]},{44:[2,103]},{44:[2,104]},{44:[2,105]},{44:[2,106]},{44:[2,107]},{78:$Vv1},{44:[1,184]},o($Vw1,$Vn),o($Vw1,$V$),{44:[2,110]},{44:[2,111]},{25:90,29:111,31:$Vw,32:$Vx,40:185,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{12:187,13:186,29:189,31:$Vw,32:[1,188],64:$Vz,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{63:[1,190]},{2:$V0,4:191,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{33:[1,192]},{36:$Vx1,46:[1,193]},o($Vy1,[2,57],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),{36:$Vx1,46:[1,195]},{46:[1,196]},{29:200,31:$Vw,32:$Vz1,46:[1,197],64:$Vz,66:198,67:199,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{25:90,29:111,31:$Vw,32:$Vx,40:202,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{32:[1,203]},{8:[2,84],39:[1,204]},{71:[1,205]},o($VA1,[2,86]),{8:[2,38],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o($VB1,$Vt1,{8:[2,83],70:$Vu1}),{25:90,29:111,31:$Vw,32:$Vx,40:206,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vn1,[2,80]),{36:$Vx1,46:[1,207]},{25:90,29:111,31:$Vw,32:$Vx,40:208,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:209,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{44:[1,210]},{39:[1,211],78:[1,212]},o($VC1,[2,102]),{53:$V61,71:[1,213],98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{46:[1,214],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{46:[1,215],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{25:90,29:111,31:$Vw,32:$Vx,40:216,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:217,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:218,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:219,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:220,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:221,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:222,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:223,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:224,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:225,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:226,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:227,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:228,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:229,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:230,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:231,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:232,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,77:$VD1,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VE1,[2,126],{53:$V61}),{46:[1,234],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o($VF1,[2,130],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1}),o($Vn1,$VG1),o($Vn1,$VH1),o($Vn1,$VI1,{70:$V41}),{25:90,29:111,31:$Vw,32:$Vx,40:235,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{36:$VJ1,71:[1,236]},o($VK1,[2,91],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),{25:90,29:111,31:$Vw,32:$Vx,40:170,44:$Vy,64:$Vz,69:92,70:$VA,72:238,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{46:[1,239]},{46:[1,240]},{25:90,29:111,31:$Vw,32:$Vx,40:241,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:242,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{46:[1,243]},{46:[1,244]},{25:90,29:111,31:$Vw,32:$Vx,40:245,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:246,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:247,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:249,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,77:[1,248],81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VL1,[2,89]),{88:[1,250]},{25:90,29:111,31:$Vw,32:$Vx,40:251,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{46:[1,252],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{8:[1,253]},{8:[1,254]},{32:$Vq,39:[1,255],41:$Vs,42:$Vt},{30:64,32:[1,256]},{25:90,29:111,31:$Vw,32:$Vx,40:257,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,258],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{29:262,31:$Vw,32:$VM1,34:259,37:260,64:$Vz,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{8:[2,42]},{25:90,29:111,31:$Vw,32:$Vx,40:263,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{8:[2,43]},{33:[1,264]},{33:[1,265]},{36:[1,267],46:[1,266]},o($Vy1,[2,77]),{32:[1,268]},o($Vy1,[2,79]),o($V01,[2,37],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),o($V01,[2,34],{39:[1,269]}),{69:270,70:[1,271],73:$VB},o($VA1,[2,85]),{8:[2,41],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o($Vn1,[2,81]),{8:[2,94],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{53:$V61,71:[1,272],98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{25:90,29:111,31:$Vw,32:$Vx,40:273,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:274,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{32:[1,275]},o($VN1,[2,93]),{2:$V0,6:277,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,33:$VO1,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{33:[1,278]},o($VP1,[2,119],{53:$V61,100:$V91,101:$Va1,102:$Vb1,103:$Vc1}),o($VP1,[2,120],{53:$V61,100:$V91,101:$Va1,102:$Vb1,103:$Vc1}),o($VQ1,[2,121],{53:$V61,103:$Vc1}),o($VQ1,[2,122],{53:$V61,103:$Vc1}),o($VQ1,[2,123],{53:$V61,103:$Vc1}),o($VE1,[2,124],{53:$V61}),o($VP1,[2,125],{53:$V61,100:$V91,101:$Va1,102:$Vb1,103:$Vc1}),o($VF1,[2,128],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1}),o([8,33,35,36,46,71,106,121],[2,129],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1}),o($VR1,[2,131],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1}),o($VR1,[2,132],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1}),o($VR1,[2,133],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1}),o($VR1,[2,134],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1}),o($VS1,[2,135],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1}),o($VS1,[2,136],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1}),{53:[1,279],98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o($VT1,[2,95],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),o($Vn1,[2,97]),o($Vn1,[2,127]),o($VP1,[2,152],{53:$V61,100:$V91,101:$Va1,102:$Vb1,103:$Vc1}),o($VL1,[2,148]),{25:90,29:111,31:$Vw,32:$Vx,40:280,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{36:$VJ1,71:[1,281]},o($Vn1,[2,154]),o($Vn1,[2,155]),{46:[1,282],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{36:[1,283],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o($Vn1,[2,158]),o($Vn1,[2,159]),{46:[1,284],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{46:[1,285],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{46:[1,286],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o($Vn1,[2,96]),o($VT1,[2,98],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),{44:[1,287]},{46:[1,288],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{33:[1,289]},{25:90,29:111,31:$Vw,32:$Vx,40:290,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:291,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:132,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($V01,$V11,{39:$V21}),{33:[1,292],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{59:[1,293]},{35:[1,294],36:[1,295]},o($VU1,[2,29]),{32:[1,296]},{32:[1,298],38:297},o($Vy1,[2,56],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),{2:$V0,4:299,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,300],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,4:301,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{33:[1,302]},{29:200,31:$Vw,32:$Vz1,64:$Vz,67:303,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vy1,[2,78]),{25:90,29:111,31:$Vw,32:$Vx,40:304,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{8:[2,82],70:$Vu1},{25:90,29:111,31:$Vw,32:$Vx,40:170,44:$Vy,64:$Vz,69:92,70:$VA,72:305,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VN1,[2,92]),{46:[1,306],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{8:[2,100],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o($VC1,[2,101]),{2:$V0,4:307,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vj,[2,47],{49:[1,308]}),{51:309,52:[1,310],54:311,55:$VV1},{25:90,29:111,31:$Vw,32:$Vx,40:313,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,77:$VD1,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VK1,[2,90],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),o($VL1,[2,87]),o($Vn1,[2,156]),{25:90,29:111,31:$Vw,32:$Vx,40:314,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vn1,[2,160]),o($Vn1,[2,163]),o($Vn1,[2,164]),{25:90,29:111,31:$Vw,32:$Vx,40:315,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vn1,[2,109]),{2:$V0,4:316,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{8:[1,317],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{8:[1,318],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{2:$V0,4:319,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{44:[1,320]},{8:[2,27]},{29:262,31:$Vw,32:$VM1,37:321,64:$Vz,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($VU1,[2,30]),o($VU1,[2,31]),o($VU1,[2,32],{39:[1,322]}),{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,323],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vk,[2,71]),{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,324],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,4:325,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vy1,[2,76]),o($V01,[2,35],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),{36:$VJ1,71:[1,326]},{8:[2,99]},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,327],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,6:328,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:329,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{35:[1,330],52:[1,331],54:332,55:$VV1},{53:[1,333]},o($VW1,[2,54]),{25:90,29:111,31:$Vw,32:$Vx,40:334,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VT1,[2,145],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),{46:[1,335],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{46:[1,336],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,337],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{32:$VX1,62:338},{32:$VX1,62:340},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,341],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{25:90,29:111,31:$Vw,32:$Vx,40:342,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VU1,[2,28]),{25:90,29:111,31:$Vw,32:$Vx,40:343,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vk,[2,70]),o($Vk,[2,73]),{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,344],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o([8,70],[2,88]),o($Vj,[2,44],{49:[1,345]}),o($Vk,[2,48]),o($Vk,[2,49]),o($Vk,[2,50]),{53:[1,346]},o($VW1,[2,53]),{2:$V0,4:347,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{53:[1,348],98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o($Vn1,[2,157]),o($Vn1,[2,108]),o($Vk,[2,62]),{46:[1,349]},{39:[1,350],41:[1,351],42:[1,352]},{46:[1,353]},o($Vk,[2,69]),{46:[1,354],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o($VU1,[2,33],{53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1}),o($Vk,[2,74]),{14:356,33:[1,355],48:[1,357]},{2:$V0,4:358,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,359],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,4:360,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:362,26:22,27:23,28:24,29:363,31:$V1,32:[1,361],40:232,43:$V3,44:$Vy,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,69:92,70:$VA,73:$VB,75:91,76:$VC,77:$VD1,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{33:[1,364]},{25:90,29:111,31:$Vw,32:$Vx,40:365,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{46:[2,67]},{46:[2,68]},{33:[1,366]},{8:[2,63]},{2:$V0,4:367,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vk,[2,46]),{44:[1,368]},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,369],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vk,[2,51]),o($VW1,[2,55],{7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,6:46,2:$V0,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi}),o($VB1,$Vo1,{74:372,32:$Vq,39:$Vr,41:[1,370],42:[1,371],44:$Vu,70:$Vv,78:[1,373]}),o($VB1,$Vs1,{8:$Vl}),{30:64,32:$Vo,68:65,70:$Vp,78:$Vv1},{2:$V0,4:374,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{46:[2,66],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},{2:$V0,4:375,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,376],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{25:90,29:111,31:$Vw,32:$Vx,40:377,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vk,[2,52]),o($VY1,$VG1),o($VY1,$VH1),o($VB1,$VI1,{39:$V31,70:$V41}),{25:90,29:111,31:$Vw,32:[1,378],40:235,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,79:$V51,80:140,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,379],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,380],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vk,[2,45]),{46:[1,381],53:$V61,98:$V71,99:$V81,100:$V91,101:$Va1,102:$Vb1,103:$Vc1,104:$Vd1,105:$Ve1,106:$Vf1,108:$Vg1,109:$Vh1,110:$Vi1,111:$Vj1,112:$Vk1,113:$Vl1,121:$Vm1},o([39,53,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$Vo1,{74:167,41:$Vp1,42:$Vq1,44:$Vu,70:$Vv,78:$Vr1}),o($Vk,[2,64]),o($Vk,[2,65]),{33:$VO1}],
defaultActions: {33:[2,58],34:[2,59],45:[2,1],68:[2,39],69:[2,40],106:[2,103],107:[2,104],108:[2,105],109:[2,106],110:[2,107],115:[2,110],116:[2,111],193:[2,42],195:[2,43],294:[2,27],306:[2,99],351:[2,67],352:[2,68],354:[2,63]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
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

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};

    let errores = [];


    /*::::::::::::::::::     AST      ::::::::::::::::::*/
    const { Ast } = require("../dist/Ast/Ast");
    const { Errores } = require("../dist/Ast/Errores");
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
options: {"case-sensitive":true},
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
case 5: return 43 
break;
case 6: return 47 
break;
case 7: return 48 
break;
case 8: return 49 
break;
case 9: return 50 
break;
case 10: return 55 
break;
case 11: return 52 
break;
case 12: return 59 
break;
case 13: return 61 
break;
case 14: return 60 
break;
case 15: return 63 
break;
case 16: return 118 
break;
case 17: return 119 
break;
case 18: return 120 
break;
case 19: return 93 
break;
case 20: return 94 
break;
case 21: return 97 
break;
case 22: return 96 
break;
case 23: return 95 
break;
case 24: return 64 
break;
case 25: return 65 
break;
case 26: return 31 
break;
case 27: return 56 
break;
case 28: return 57 
break;
case 29: return 58 
break;
case 30: return 76 
break;
case 31: return 77 
break;
case 32: return 122 
break;
case 33: return 79 
break;
case 34: return 123 
break;
case 35: return 124 
break;
case 36: return 125 
break;
case 37: return 126 
break;
case 38: return 127 
break;
case 39: return 82 
break;
case 40: return 83 
break;
case 41: return 84 
break;
case 42: return 86 
break;
case 43: return 85 
break;
case 44: return 88 
break;
case 45: return 91 
break;
case 46: return 92 
break;
case 47: return 128 
break;
case 48: return 129 
break;
case 49: return 41
break;
case 50: return 42
break;
case 51: return 98 
break;
case 52: return 99 
break;
case 53: return 100 
break;
case 54: return 101 
break;
case 55: return 102 
break;
case 56: return 103 
break;
case 57: return 109 
break;
case 58: return 110 
break;
case 59: return 111 
break;
case 60: return 108 
break;
case 61: return 113 
break;
case 62: return 112 
break;
case 63: return 39 
break;
case 64: return 105 
break;
case 65: return 106 
break;
case 66: return 107 
break;
case 67: return 104 
break;
case 68: return 44 
break;
case 69: return 46 
break;
case 70: return 70 
break;
case 71: return 71 
break;
case 72: return 33 
break;
case 73: return 35 
break;
case 74: return 78 
break;
case 75: return 8 
break;
case 76: return 36 
break;
case 77: return 121 
break;
case 78: return 53 
break;
case 79: return 73 
break;
case 80:return 115;
break;
case 81:return 114;
break;
case 82:return 32;
break;
case 83:return 116;
break;
case 84:return 117;
break;
case 85:
            // console.error('Este es un error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column);
            errores.push(new Errores("Lexico", `Error lexico '${yy_.yytext}'.`, yy_.yylloc.first_line, yy_.yylloc.first_column));
        
break;
case 86:/* skip whitespace */
break;
case 87:return 5
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*)/,/^(?:\*\/)/,/^(?:.)/,/^(?:\s+)/,/^(?:print\b)/,/^(?:println\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:while\b)/,/^(?:for\b)/,/^(?:do\b)/,/^(?:in\b)/,/^(?:null\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:boolean\b)/,/^(?:char\b)/,/^(?:String\b)/,/^(?:void\b)/,/^(?:main\b)/,/^(?:struct\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:return\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:pop\b)/,/^(?:push\b)/,/^(?:lenght\b)/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:log10\b)/,/^(?:sqrt\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:\+\+)/,/^(?:--)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:\^)/,/^(?:>=)/,/^(?:<=)/,/^(?:<)/,/^(?:>)/,/^(?:!=)/,/^(?:==)/,/^(?:=)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:!)/,/^(?:&)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:\.)/,/^(?:;)/,/^(?:,)/,/^(?:\?)/,/^(?::)/,/^(?:#)/,/^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/,/^(?:[0-9]+)/,/^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ]*)/,/^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/,/^(?:('((\\([\'\"\\bfnrtv]))|([^\'\\]))'))/,/^(?:.)/,/^(?:[\r\n\t])/,/^(?:$)/],
conditions: {"comment":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87],"inclusive":true},"INITIAL":{"rules":[0,1,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87],"inclusive":true}}
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
},{"../dist/Ast/Ast":5,"../dist/Ast/Errores":6,"../dist/Expresiones/Arreglos/AccesoArr":8,"../dist/Expresiones/Arreglos/Arreglo":9,"../dist/Expresiones/Arreglos/Copiar":10,"../dist/Expresiones/Arreglos/Rango":11,"../dist/Expresiones/Identificador":12,"../dist/Expresiones/Llamada":13,"../dist/Expresiones/Operaciones/Aritmeticas":14,"../dist/Expresiones/Operaciones/Logicas":15,"../dist/Expresiones/Operaciones/Relacionales":16,"../dist/Expresiones/Primitivo":17,"../dist/Expresiones/Struct/AccesoStruct":18,"../dist/Expresiones/Ternario":19,"../dist/Instrucciones/Arreglos/DeclaracionArr":20,"../dist/Instrucciones/Arreglos/ModificacionArr":21,"../dist/Instrucciones/Asignacion":22,"../dist/Instrucciones/Ciclicas/DoWhile":23,"../dist/Instrucciones/Ciclicas/For":24,"../dist/Instrucciones/Ciclicas/ForIn":25,"../dist/Instrucciones/Ciclicas/While":26,"../dist/Instrucciones/Condicionales/Case":27,"../dist/Instrucciones/Condicionales/If":28,"../dist/Instrucciones/Condicionales/Ifsinllave":29,"../dist/Instrucciones/Condicionales/Switch":30,"../dist/Instrucciones/Declaracion":31,"../dist/Instrucciones/Metodos/Funcion":32,"../dist/Instrucciones/Metodos/Main":33,"../dist/Instrucciones/Metodos/Nativas/Arreglos/Pop":34,"../dist/Instrucciones/Metodos/Nativas/Arreglos/Push":35,"../dist/Instrucciones/Metodos/Nativas/Cadenas/CharOfPos":36,"../dist/Instrucciones/Metodos/Nativas/Cadenas/subString":37,"../dist/Instrucciones/Metodos/Nativas/Cadenas/toLower":38,"../dist/Instrucciones/Metodos/Nativas/Cadenas/toUpper":39,"../dist/Instrucciones/Metodos/Nativas/Length":40,"../dist/Instrucciones/Metodos/Nativas/Matematicas":41,"../dist/Instrucciones/Metodos/Nativas/Numericas/Parse":42,"../dist/Instrucciones/Metodos/Nativas/Numericas/To":43,"../dist/Instrucciones/Metodos/Nativas/StringN":44,"../dist/Instrucciones/Metodos/Nativas/TypeOfN":45,"../dist/Instrucciones/Print":46,"../dist/Instrucciones/Struct/AsignaVariable":47,"../dist/Instrucciones/Struct/DeclararStruct":48,"../dist/Instrucciones/Struct/Struct":49,"../dist/Instrucciones/Struct/StructInStruct":50,"../dist/Instrucciones/Transferencia/Break":51,"../dist/Instrucciones/Transferencia/Continuar":52,"../dist/Instrucciones/Transferencia/Return":53,"../dist/TablaSimbolos/Simbolo":54,"../dist/TablaSimbolos/Tipo":56,"_process":3,"fs":1,"path":2}],5:[function(require,module,exports){
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

},{"../Instrucciones/Arreglos/DeclaracionArr":20,"../Instrucciones/Arreglos/ModificacionArr":21,"../Instrucciones/Asignacion":22,"../Instrucciones/Declaracion":31,"../Instrucciones/Metodos/Funcion":32,"../Instrucciones/Metodos/Main":33,"../Instrucciones/Struct/Struct":49,"../Instrucciones/Transferencia/Break":51,"../Instrucciones/Transferencia/Continuar":52,"../Instrucciones/Transferencia/Return":53,"../TablaSimbolos/TablaSimbolos":55,"./../Instrucciones/Struct/DeclararStruct":48,"./Errores":6}],6:[function(require,module,exports){
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
const Nodo_1 = require("../../Ast/Nodo");
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
            // console.log("AccArr exp val: " + this.expresiones);
            // console.log("AccArr exp size: " + this.expresiones.length);
            let value = this.buscarDimensiones(table, tree, this.expresiones, simbolo.getValor());
            // console.log("val acc arr: " + value);
            if (value instanceof Errores_1.Errores) {
                return value;
            }
            // if(!isNaN(value)){
            //     return parseInt(value);
            // }
            return value;
            // if(value instanceof Array){
            //     return new Errores("Semantico", "Acceso a arreglo incompleto.", this.fila, this.columna);
            // }
        }
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Acceso ARR", "");
        // padre.addChildNode(new Nodo(this.id,""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
    buscarDimensiones(table, tree, expresiones, arreglo) {
        // let value = null;
        if (expresiones.length == 0) {
            return arreglo;
        }
        if (!(arreglo instanceof Array)) {
            return new Errores_1.Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        // Obteniendo las dimensiones
        let dimension = expresiones.shift();
        // console.log("accArr exp: " + expresiones);
        // Posicion en dimension
        let num = dimension.ejecutar(table, tree);
        // console.log("accArr num dim: " + num);
        // console.log("accArr arr: " + arreglo);
        // if(num instanceof Errores){
        //     return num;
        // }
        if (dimension.tipo != Tipo_1.TIPO.ENTERO) {
            return new Errores_1.Errores("Semantico", "Expresion diferente a entero en arreglo.", this.fila, this.columna);
        }
        if (!isNaN(arreglo[num])) {
            // console.log("aaaaaaaa");
            return arreglo[num];
        }
        // console.log("arreglo[num]: " + arreglo[num]);
        if (arreglo[num] != undefined || arreglo[num] != null) {
            // console.log("no null");
            if (this.tipo == Tipo_1.TIPO.CADENA || this.tipo == Tipo_1.TIPO.CHARACTER) {
                return this.buscarDimensiones(tree, table, expresiones.slice(), arreglo[num][0]);
            }
            else {
                // console.log("no str");
                return this.buscarDimensiones(tree, table, expresiones.slice(), arreglo[num][0]);
            }
        }
        else {
            // console.log("null");
            return new Errores_1.Errores("Semantico", "Posicion inexistente en el arreglo.", this.fila, this.columna);
        }
    }
}
exports.AccesoArr = AccesoArr;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":56,"./Rango":11}],9:[function(require,module,exports){
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
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Arreglo", "");
        padre.addChildNode(new Nodo_1.Nodo(this.valor.join(), ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
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
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Copiar", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
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
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Rango", "");
        padre.addChildNode(this.valor.join());
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

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Tipo":56}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Errores_1 = require("../Ast/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Nodo_1 = require("../Ast/Nodo");
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
                        // alert("valexp ll: " + valueExpr);
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
        let padre = new Nodo_1.Nodo("LLAMADA FUNCION", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id.toString(), ""));
        let params = new Nodo_1.Nodo("PARAMETROS", "");
        for (let param of this.parameters) {
            params.addChildNode(new Nodo_1.Nodo(param.id, ""));
        }
        padre.addChildNode(params);
        return padre;
    }
}
exports.Llamada = Llamada;

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Simbolo":54,"../TablaSimbolos/TablaSimbolos":55,"../TablaSimbolos/Tipo":56}],14:[function(require,module,exports){
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
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("ARITMETICAS", "");
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":56}],15:[function(require,module,exports){
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
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("EXP LOGICAS", "");
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":56}],16:[function(require,module,exports){
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
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("EXP RELACIONAL", "");
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

},{"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":56}],17:[function(require,module,exports){
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
const Nodo_1 = require("../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("ACCESO STRUCT", "");
        if (this.idStruct != null) {
            padre.addChildNode(this.idStruct.recorrer(table, tree));
        }
        if (this.expresiones != null) {
            padre.addChildNode(this.expresiones.recorrer(table, tree));
        }
        return padre;
    }
}
exports.AccesoStruct = AccesoStruct;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../Instrucciones/Struct/Struct":49,"../../TablaSimbolos/TablaSimbolos":55,"../../TablaSimbolos/Tipo":56,"../Identificador":12}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("TERNARIO", "");
        padre.addChildNode(this.condicion.recorrer(table, tree));
        padre.addChildNode(new Nodo_1.Nodo("?", ""));
        padre.addChildNode(this.instTrue.recorrer(table, tree));
        padre.addChildNode(new Nodo_1.Nodo(":", ""));
        padre.addChildNode(this.instFalse.recorrer(table, tree));
        return padre;
    }
}
exports.Ternario = Ternario;

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Tipo":56}],20:[function(require,module,exports){
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
        // if(this.expresiones != null){
        //     console.log("declArr exp: " + this.expresiones);
        // }
        // Creando arreglo
        let value;
        // ASIGNACION
        if (this.tipo_arr == null && this.dimensiones == null) {
            // Asignando variable de tipo arreglo con su valor
            if (table.existe(this.id)) {
                // Creando arreglo
                this.tipo_arr = table.getSymbolTabla(this.id).getTipo();
                if (this.expresiones instanceof Copiar_1.Copiar) {
                    // console.log("AS ARR COPIAR");
                    value = this.expresiones.ejecutar(table, tree);
                    // console.log("AS ARR COPIAR VAL: " + value);
                    if (value == null) {
                        return new Errores_1.Errores("Semantico", "Arreglo nulo.", this.fila, this.columna);
                    }
                }
                else {
                    // console.log("AS ARR ");
                    value = this.crearDimensiones(table, tree, this.expresiones.slice()); // Devuelve el arreglo de dimensiones
                    // let value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
                    // value = this.arr;
                    // console.log("value declArr: " + value);
                    // console.log("type declArr: " + typeof(value));
                    // console.log("type declArr: " + typeof(this.arr));
                    // console.log("tipo declArr: " + this.tipo_arr);
                    if (value instanceof Errores_1.Errores) {
                        return value;
                    }
                }
                // Creando simbolo
                let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo_arr, true, this.fila, this.columna, value);
                if (nuevo_simb.arreglo) {
                    // Obteniendo variable y asignar valor
                    let result = table.updateSymbolTabla(nuevo_simb);
                    if (result instanceof Errores_1.Errores) {
                        return result;
                    }
                }
                else {
                    return new Errores_1.Errores("Semantico", `La variable '${this.id}', no es de tipo arreglo.`, this.fila, this.columna);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "Variable no encontrada.", this.fila, this.columna);
            }
        } // DECLARACION
        else if (this.expresiones == null) {
            // console.log("DECL ARR ");
            // Verificando dimensiones
            if (this.dimensiones != null) {
                if (this.dimensiones != this.dimensiones.length) {
                    return new Errores_1.Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
                }
            }
            // Creando variable de tipo arreglo
            let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo_arr, true, this.fila, this.columna, []);
            let result = table.setSymbolTabla(nuevo_simb);
            if (result instanceof Errores_1.Errores) {
                return result;
            }
        } // DECLARACION Y ASIGNACION
        else {
            // Verificando dimensiones
            if (this.dimensiones != null) {
                if (this.dimensiones != this.dimensiones.length) {
                    return new Errores_1.Errores("Semantico", "Dimensiones diferentes en el arreglo.", this.fila, this.columna);
                }
            }
            // Creando arreglo
            if (this.expresiones instanceof Copiar_1.Copiar) {
                // console.log("DECL Y AS ARR COPIAR");
                value = this.expresiones.ejecutar(table, tree);
                // console.log("DECL ARR COPIAR VAL: " + value);
                if (value == null) {
                    return new Errores_1.Errores("Semantico", "Arreglo nulo.", this.fila, this.columna);
                }
            }
            else {
                // console.log("DECL Y AS ARR ");
                value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
                // console.log("crearArr value: " + value);
                // console.log("crearArr size: " + value.length);
                // let value = this.crearDimensiones(table, tree, this.expresiones[0].slice()); // Devuelve el arreglo de dimensiones
                // value = this.arr;
                // console.log("value declArr: " + value);
                // console.log("type declArr: " + typeof(value));
                // console.log("type declArr: " + typeof(this.arr));
                // console.log("tipo declArr: " + this.tipo_arr);
                if (value instanceof Errores_1.Errores) {
                    return value;
                }
            }
            // Creando variable de tipo arreglo con su valor
            let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo_arr, true, this.fila, this.columna, value);
            let result = table.setSymbolTabla(nuevo_simb);
            if (result instanceof Errores_1.Errores) {
                return result;
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
    crearDimensiones(table, tree, expresiones) {
        let arr = Array();
        while (true) {
            if (!(expresiones.length == 0)) {
                let dimension = expresiones.shift();
                // console.log("crearArr dim: " + dimension);
                if (Array.isArray(dimension)) {
                    arr.push([this.crearDimensiones(table, tree, dimension.slice())]);
                }
                else {
                    let num = dimension.ejecutar(table, tree);
                    if (dimension.tipo != this.tipo_arr) {
                        let res = new Errores_1.Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
                        tree.Errores.push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    else {
                        dimension.tipo = this.tipo_arr;
                        arr.push(num);
                        this.crearDimensiones(tree, table, expresiones.slice());
                    }
                }
            }
            else {
                break;
            }
        }
        return arr;
    }
}
exports.DeclaracionArr = DeclaracionArr;

},{"../../Ast/Errores":6,"../../Expresiones/Arreglos/Copiar":10,"../../TablaSimbolos/Simbolo":54,"../../TablaSimbolos/Tipo":56}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModificacionArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class ModificacionArr {
    //ID lista_exp IGUAL expr
    constructor(id, expresiones, valor, fila, columna) {
        this.arreglo = true;
        this.dim = 0;
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
                // result = this.valor;
                // return result;
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
        return new Nodo_1.Nodo("Modificacion Array", "");
    }
    modificarDimensiones(table, tree, expresiones, arreglo, valor) {
        // let value = null;
        if (expresiones.length == 0) {
            if (arreglo instanceof Array) {
                return new Errores_1.Errores("Semantico", "Modificacion de arreglo incompleto.", this.fila, this.columna);
            }
            return valor;
        }
        if (!(arreglo instanceof Array)) {
            return new Errores_1.Errores("Semantico", "Acceso de mas en el arreglo.", this.fila, this.columna);
        }
        let exp_tmp = expresiones.shift();
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
            return new Errores_1.Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
        }
        else {
            if (arreglo[num] != undefined) {
                let value = this.modificarDimensiones(tree, table, expresiones.slice(), arreglo[num][0].slice(), valor);
                if (value instanceof Errores_1.Errores) {
                    return value;
                }
                // console.log("arreglo[num]: " + arreglo[num].toString());
                if (value != null) {
                    arreglo[num] = valor;
                }
            }
            else {
                // console.log("null");
                return new Errores_1.Errores("Semantico", "Posicion inexistente en el arreglo.", this.fila, this.columna);
            }
        }
        return null;
    }
}
exports.ModificacionArr = ModificacionArr;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":56}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("ASIGNACION", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(this.expresion.recorrer(table, tree));
        return padre;
    }
}
exports.Asignacion = Asignacion;

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Simbolo":54,"./Transferencia/Return":53}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
const Nodo_1 = require("../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("DO WHILE", "");
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.lista_instrucciones) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(NodoInstr);
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.condicion.ejecutar(table, tree));
        padre.addChildNode(condicion);
        return padre;
    }
}
exports.DoWhile = DoWhile;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../Transferencia/Break":51,"../Transferencia/Continuar":52,"../Transferencia/Return":53}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const Return_1 = require("./../Transferencia/Return");
const Continuar_1 = require("./../Transferencia/Continuar");
const Nodo_1 = require("../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("FOR", "");
        let decla = new Nodo_1.Nodo("DECLARACION", "");
        decla.addChildNode(this.declaracion_asignacion.recorrer(table, tree));
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.condicion.ejecutar(table, tree));
        let actualizacion = new Nodo_1.Nodo("ACTUALIZACION", "");
        actualizacion.addChildNode(this.actualizacion.ejecutar(table, tree));
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.lista_instrucciones) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(decla);
        padre.addChildNode(condicion);
        padre.addChildNode(actualizacion);
        padre.addChildNode(NodoInstr);
        return padre;
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.For = For;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../../TablaSimbolos/Tipo":56,"../Transferencia/Break":51,"./../Transferencia/Continuar":52,"./../Transferencia/Return":53}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForIn = void 0;
const Identificador_1 = require("./../../Expresiones/Identificador");
const Return_1 = require("../Transferencia/Return");
const Continuar_1 = require("../Transferencia/Continuar");
const Nodo_1 = require("../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("FOR-IN", "");
        let iterador = new Nodo_1.Nodo("ITERADOR", "");
        iterador.addChildNode(new Nodo_1.Nodo(this.iterador, ""));
        let rango = new Nodo_1.Nodo("RANGO", "");
        rango.addChildNode(this.rango.recorrer(table, tree));
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.lista_instrucciones) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(iterador);
        padre.addChildNode(rango);
        padre.addChildNode(NodoInstr);
        return padre;
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.ForIn = ForIn;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../Expresiones/Arreglos/AccesoArr":8,"../../TablaSimbolos/Simbolo":54,"../../TablaSimbolos/TablaSimbolos":55,"../../TablaSimbolos/Tipo":56,"../Transferencia/Break":51,"../Transferencia/Continuar":52,"../Transferencia/Return":53,"./../../Expresiones/Identificador":12}],26:[function(require,module,exports){
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
        let padre = new Nodo_1.Nodo("WHILE", "");
        padre.addChildNode(new Nodo_1.Nodo("while", ""));
        // padre.addChildNode(new Nodo("(",""));
        padre.addChildNode(this.condicion.recorrer(table, tree));
        // padre.addChildNode(new Nodo(")",""));
        // padre.addChildNode(new Nodo("{",""));
        padre.addChildNode(new Nodo_1.Nodo("INSTRUCCIONES", ""));
        for (let ins of this.lista_instrucciones) {
            padre.addChildNode(ins.recorrer(table, tree));
        }
        // padre.addChildNode(new Nodo("}",""));
        return padre;
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.While = While;

},{"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../../TablaSimbolos/Tipo":56,"../Transferencia/Break":51,"../Transferencia/Continuar":52,"../Transferencia/Return":53,"./../../Ast/Errores":6}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = void 0;
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../Transferencia/Break");
const Continuar_1 = require("../Transferencia/Continuar");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
class Case {
    constructor(valor_case, lista_instrucciones, fila, columna) {
        this.valor_case = valor_case;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        // console.log("cs valcs: " + this.valor_case);
        // console.log("cs valorsw: " + this.valor_sw);
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
        let padre = new Nodo_1.Nodo("CASE", "");
        let expresion = new Nodo_1.Nodo("EXPRESION", "");
        expresion.addChildNode(this.valor_case.recorrer(table, tree));
        padre.addChildNode(expresion);
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.lista_instrucciones) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(NodoInstr);
        return padre;
    }
}
exports.Case = Case;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../Transferencia/Break":51,"../Transferencia/Continuar":52,"../Transferencia/Return":53}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const Tipo_1 = require("./../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../Ast/Nodo");
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
        // console.log("if cond: " + valor_condicion);
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
        let padre = new Nodo_1.Nodo("IF", "");
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.condicion.ejecutar(table, tree));
        // LISTA IFS
        let listaIfs = new Nodo_1.Nodo("INSTRUCCIONES IFS", "");
        for (let instr of this.lista_ifs) {
            listaIfs.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(listaIfs);
        // LISTA IFS
        if (this.lista_elses != null) {
            let listaElse = new Nodo_1.Nodo("INSTRUCCIONES Else", "");
            for (let instr of this.lista_elses) {
                listaElse.addChildNode(instr.recorrer(table, tree));
            }
            padre.addChildNode(listaElse);
        }
        // LISTA IFS
        if (this.lista_ifelse != null) {
            padre.addChildNode(this.lista_ifelse.recorrer(table, tree));
        }
        return padre;
    }
    getBool(val) {
        return !!JSON.parse(String(val).toLowerCase());
    }
}
exports.If = If;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../Transferencia/Break":51,"../Transferencia/Continuar":52,"../Transferencia/Return":53,"./../../TablaSimbolos/Tipo":56}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ifsinllave = void 0;
const Tipo_1 = require("./../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("IF", "");
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.condicion.ejecutar(table, tree));
        // LISTA IFS
        let listaIfs = new Nodo_1.Nodo("INSTRUCCIONES IFS", "");
        // for(let instr of this.lista_ifs)
        // {
        //     listaIfs.addChildNode(instr.recorrer(table,tree));
        // }
        // padre.addChildNode(listaIfs);
        // LISTA IFS
        if (this.ins_ifs != null) {
            listaIfs.addChildNode(this.ins_ifs.recorrer(table, tree));
        }
        padre.addChildNode(condicion);
        padre.addChildNode(listaIfs);
        // LISTA IFS
        if (this.ins_elses != null) {
            padre.addChildNode(this.ins_elses.recorrer(table, tree));
        }
        return padre;
    }
}
exports.Ifsinllave = Ifsinllave;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../Transferencia/Break":51,"../Transferencia/Continuar":52,"../Transferencia/Return":53,"./../../TablaSimbolos/Tipo":56}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Nodo_1 = require("../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("SWITCH", "");
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.valor_sw.ejecutar(table, tree));
        let listaCase = new Nodo_1.Nodo("LISTA CASE", "");
        for (let instr of this.lista_case) {
            listaCase.addChildNode(instr.recorrer(table, tree));
        }
        let listaDefault = new Nodo_1.Nodo("LISTA DEFAULT", "");
        if (this.lista_default != null) {
            for (let instr of this.lista_default) {
                listaDefault.addChildNode(instr.recorrer(table, tree));
            }
        }
        return padre;
    }
}
exports.Switch = Switch;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../Transferencia/Break":51,"../Transferencia/Return":53}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
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
                    // console.log("entre tipo declaracion");
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
        let padre = new Nodo_1.Nodo("DECLARACION", "");
        for (let sim of this.simbolos) {
            sim.valor.recorrer(table, tree);
        }
        return padre;
    }
}
exports.Declaracion = Declaracion;

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Simbolo":54,"../TablaSimbolos/Tipo":56}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("FUNCION", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        let params = new Nodo_1.Nodo("PARAMETROS", "");
        for (let par of this.parameters) {
            let parametro = new Nodo_1.Nodo("PARAMETRO", "");
            parametro.addChildNode(par["tipo"]);
            parametro.addChildNode(par["id"]);
            params.addChildNode(parametro);
        }
        padre.addChildNode(params);
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.instructions) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(NodoInstr);
        return padre;
    }
}
exports.Funcion = Funcion;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../Transferencia/Break":51,"../Transferencia/Continuar":52,"../Transferencia/Return":53}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
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
            // console.log(instr)
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
        let padre = new Nodo_1.Nodo("MAIN", "");
        let NodoInstr = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let instr of this.instructions) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(NodoInstr);
        return padre;
    }
}
exports.Main = Main;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../Transferencia/Break":51,"../Transferencia/Continuar":52,"../Transferencia/Return":53}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pop = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Nodo_1 = require("../../../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("POP", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        return padre;
    }
}
exports.Pop = Pop;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Push = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Nodo_1 = require("../../../../Ast/Nodo");
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
                // console.log("push tipo arr: " + arr.getTipo());
                // console.log("push tipo val: " + this.expresion);
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
        let padre = new Nodo_1.Nodo("PUSH", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(this.expresion.ejecutar(table, tree));
        return padre;
    }
}
exports.Push = Push;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharOfPos = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
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
                // console.log("charofpos tipo cadena: " + cadena.getTipo());
                // console.log("charofpos tipo pos: " + this.expresion);
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
        let padre = new Nodo_1.Nodo("CharOfPos", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        let instruccion = new Nodo_1.Nodo("INSTRUCCION", "");
        instruccion.addChildNode(this.expresion.recorrer(table, tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        padre.addChildNode(instruccion);
        return padre;
    }
}
exports.CharOfPos = CharOfPos;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":56}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subString = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
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
                // console.log("charofpos tipo cadena: " + cadena.getTipo());
                // console.log("charofpos tipo inicio: " + this.inicio);
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
        let padre = new Nodo_1.Nodo("CharOfPos", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        let instruccion = new Nodo_1.Nodo("INICIO", "");
        instruccion.addChildNode(this.inicio.recorrer(table, tree));
        let fin = new Nodo_1.Nodo("FIN", "");
        fin.addChildNode(this.fin.recorrer(table, tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        padre.addChildNode(instruccion);
        padre.addChildNode(fin);
        return padre;
    }
}
exports.subString = subString;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":56}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLower = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("toLower", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.toLower = toLower;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":56}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUpper = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("toLower", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.toUpper = toUpper;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":56}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Length = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Nodo_1 = require("../../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("Length", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.Length = Length;

},{"../../../Ast/Errores":6,"../../../Ast/Nodo":7,"../../../TablaSimbolos/Tipo":56}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matematicas = void 0;
const Identificador_1 = require("./../../../Expresiones/Identificador");
const Errores_1 = require("../../../Ast/Errores");
const Nodo_1 = require("../../../Ast/Nodo");
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
                // console.log("es id");
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
        let padre = new Nodo_1.Nodo("Matematicas", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, "")); //this.tipo_funcion.toString()
        let tipoN = new Nodo_1.Nodo("TIPO_FUNCION", "");
        tipoN.addChildNode(new Nodo_1.Nodo(this.tipo_funcion.toString(), ""));
        let instruccion = new Nodo_1.Nodo("INSTRUCCION", "");
        instruccion.addChildNode(this.expresion.recorrer(table, tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        padre.addChildNode(tipoN);
        padre.addChildNode(instruccion);
        return padre;
    }
}
exports.Matematicas = Matematicas;

},{"../../../Ast/Errores":6,"../../../Ast/Nodo":7,"./../../../Expresiones/Identificador":12}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parse = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Tipo_1 = require("../../../../TablaSimbolos/Tipo");
const Nodo_1 = require("../../../../Ast/Nodo");
class Parse {
    constructor(tipo_funcion, parameters, fila, columna) {
        this.tipo_funcion = tipo_funcion;
        this.parameters = parameters;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        // console.log("parse params: " + this.parameters);
        let cadena = this.parameters.ejecutar(table, tree);
        // console.log("parse cadena: " + this.parameters.tipo);
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
        let padre = new Nodo_1.Nodo("Parse", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(this.parameters.ejecutar(table, tree));
        return padre;
    }
}
exports.Parse = Parse;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":56}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.To = void 0;
const Errores_1 = require("../../../../Ast/Errores");
const Nodo_1 = require("../../../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("toLower", "");
        padre.addChildNode(new Nodo_1.Nodo(this.tipo_conversion.toString(), ""));
        padre.addChildNode(this.parameters.ejecutar(table, tree));
        return padre;
    }
}
exports.To = To;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringN = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Nodo_1 = require("../../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("StringN", "");
        // padre.addChildNode(new Nodo(this.id,""));
        padre.addChildNode(this.expresion.ejecutar(table, tree));
        return padre;
    }
}
exports.StringN = StringN;

},{"../../../Ast/Errores":6,"../../../Ast/Nodo":7,"../../../TablaSimbolos/Tipo":56}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOfN = void 0;
const Errores_1 = require("../../../Ast/Errores");
const Nodo_1 = require("../../../Ast/Nodo");
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
        else {
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
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("TypeOfN", "");
        // padre.addChildNode(new Nodo(this.id,""));
        padre.addChildNode(this.expresion.ejecutar(table, tree));
        6;
        return padre;
    }
    getTipo(tipo) {
        switch (tipo) {
            case Tipo_1.TIPO.CADENA:
                return "String";
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

},{"../../../Ast/Errores":6,"../../../Ast/Nodo":7,"../../../TablaSimbolos/Tipo":56}],46:[function(require,module,exports){
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
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Print", "");
        // padre.addChildNode(new Nodo("print",""));
        // padre.addChildNode(new Nodo("(",""));
        let hijo = new Nodo_1.Nodo("EXPRESIONES", "");
        for (let par of this.parametros) {
            hijo.addChildNode(par.recorrer(table, tree));
        }
        padre.addChildNode(hijo);
        // padre.addChildNode(new Nodo(")",""));
        return padre;
    }
}
exports.Print = Print;

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Simbolo":54,"../TablaSimbolos/Tipo":56,"./Transferencia/Return":53}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignaVariable = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Asignacion_1 = require("../Asignacion");
class AsignaVariable {
    constructor(idStruct, idAcceso, fila, columna) {
        this.idStruct = idStruct; // Acceso | ID
        this.instruccion = idAcceso; // Acceso | ID
        this.fila = fila;
        this.columna = columna;
        // this.instruccion = null;
    }
    ejecutar(table, tree) {
        let resultAcceso = null;
        resultAcceso = this.idStruct.ejecutar(table, tree);
        if (resultAcceso instanceof Errores_1.Errores)
            return resultAcceso;
        if (this.idStruct instanceof Simbolo_1.Simbolo) {
            resultAcceso = this.idStruct;
        }
        // let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor,tree); //devuelve un Simbolo
        // //retorno el simbolo si este ya fue 
        // EJCUTANDO CAMBIO 
        if (this.instruccion instanceof Asignacion_1.Asignacion) {
            let valorExpr = this.instruccion.expresion.ejecutar(table, tree); // Ejecutando ID, o Primitivo, Acceso
            if (valorExpr instanceof Errores_1.Errores)
                return valorExpr;
            if (valorExpr instanceof Simbolo_1.Simbolo) // es un id (struct, o Variable normal)
             {
                /**
                 * Puede venir:
                 * struct -> struct
                 * struct -> nulo
                 * var -> primitivo
                 * --- tipo = tipo
                 */
                if (resultAcceso.tipo = Tipo_1.TIPO.STRUCT && this.instruccion.expresion.tipo == resultAcceso.tipo && (valorExpr.tipoStruct == resultAcceso.tipoStruct)) // validando Simbolo struct = struct
                 {
                    resultAcceso.valor = valorExpr;
                }
                else if (this.instruccion.expresion.tipo == Tipo_1.TIPO.NULO) {
                    resultAcceso.valor = null;
                }
                else if (resultAcceso.tipo == this.instruccion.expresion.tipo) {
                    resultAcceso.valor = valorExpr;
                }
                else {
                    return new Errores_1.Errores("Semantico", "AsignaVariable " + this.idStruct.id + " Error en asignacion ", this.fila, this.columna);
                }
            }
        }
        return resultAcceso;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("AsignaVariableStruct", "");
        padre.addChildNode(this.idStruct.ejecutar(table, tree));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
    queondaaparte() {
        // if(!(this.idStruct instanceof Identificador)){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO ID", this.fila, this.columna);
        // }
        // // console.log("acceso")
        // let simboloStruct = this.idStruct.ejecutar(table,tree);
        // // this.id= this.idStruct.id; 
        // if (simboloStruct == null){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO coincide con la busqueda Struct", this.fila, this.columna);
        // }
        // if(!(this.idAcceso instanceof Identificador || this.idAcceso instanceof AsignaVariable || this.idAcceso instanceof Struct )){
        //     return new Errores("Semantico", "AsignaVariable " + this.idStruct.id + " NO es TIPO Identificador/AccesoStruct/Struct", this.fila, this.columna);
        // }
        // // if (this.idAcceso instanceof AsignaVariable)
        // // {
        // //     this.idAcceso.instruccion = this.instruccion
        // // }
        // // if (this.instruccion !=null /*&& this.ultimo==true*/ && this.instruccion instanceof Asignacion && this.idAcceso instanceof Identificador )
        // // {
        // //     this.instruccion.id =  this.idAcceso.id ;
        // //     if (this.idAcceso instanceof Identificador && this.idStruct instanceof Identificador){
        // //         let result = this.instruccion.ejecutar(simboloStruct.valor,tree);
        // //         if (result instanceof Errores)
        // //             return result;
        // //         return result;
        // //     }
        // // }
        // let resultAcceso = this.idAcceso.ejecutar(simboloStruct.valor,tree); //devuelve un Simbolo
        // //retorno el simbolo si este ya fue 
        // if (resultAcceso instanceof Simbolo && (this.idAcceso instanceof Identificador || this.idAcceso instanceof AsignaVariable)){
        //     return resultAcceso;
        // }  
        console.log("");
    }
}
exports.AsignaVariable = AsignaVariable;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Simbolo":54,"../../TablaSimbolos/Tipo":56,"../Asignacion":22}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclararStruct = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
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
                    if (SymbolStructNow.variables[count].tipo == expr.tipo || SymbolStructNow.variables[count].tipo == Tipo_1.TIPO.ANY || expr.tipo == Tipo_1.TIPO.NULO) //Valida Tipos
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
        let padre = new Nodo_1.Nodo("DECLARAR STRUCT", "");
        let tipoStruct = new Nodo_1.Nodo("TIPO STRUCT", "");
        tipoStruct.addChildNode(new Nodo_1.Nodo(this.tipoStruct, ""));
        padre.addChildNode(tipoStruct);
        padre.addChildNode(this.llamada.recorrer(table, tree));
        return padre;
    }
}
exports.DeclararStruct = DeclararStruct;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../Expresiones/Llamada":13,"../../TablaSimbolos/Simbolo":54,"../../TablaSimbolos/TablaSimbolos":55,"../../TablaSimbolos/Tipo":56}],49:[function(require,module,exports){
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
const Nodo_1 = require("../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("STRUCTS", "");
        let NodoInstr = new Nodo_1.Nodo("DECLARACIONES", "");
        for (let instr of this.instructions) {
            NodoInstr.addChildNode(instr.recorrer(table, tree));
        }
        padre.addChildNode(NodoInstr);
        return padre;
    }
}
exports.Struct = Struct;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":55,"../../TablaSimbolos/Tipo":56,"../Arreglos/DeclaracionArr":20,"../Declaracion":31,"../Transferencia/Break":51,"../Transferencia/Continuar":52,"../Transferencia/Return":53,"./DeclararStruct":48,"./StructInStruct":50}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructInStruct = void 0;
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
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
        let padre = new Nodo_1.Nodo("StructInStruct", "");
        let NodoInstr = new Nodo_1.Nodo("TIPO STRUCT", "");
        NodoInstr.addChildNode(new Nodo_1.Nodo(this.tipoStruct, ""));
        let id = new Nodo_1.Nodo("ID", "");
        id.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(NodoInstr);
        padre.addChildNode(id);
        return padre;
    }
}
exports.StructInStruct = StructInStruct;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Simbolo":54,"../../TablaSimbolos/Tipo":56}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detener = void 0;
const Nodo_1 = require("../../Ast/Nodo");
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
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Break", "");
        return padre;
    }
}
exports.Detener = Detener;

},{"../../Ast/Nodo":7}],52:[function(require,module,exports){
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

},{"../../Ast/Nodo":7}],53:[function(require,module,exports){
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
            padre.addChildNode(this.expresion.recorrer());
        }
        return padre;
    }
}
exports.Return = Return;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
class Simbolo {
    constructor(id, tipo, arreglo, fila, columna, valor, structEnv = false) {
        this.id = id;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.valor = valor;
        this.arreglo = arreglo;
        this.structEnv = structEnv;
        // console.log("simbolor: "+this.valor);
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
        let cadena = "";
        // if (this.valor instanceof TablaSimbolos)
        // {
        if (this.valor != null) {
            // console.log(this.valor.tabla)
            cadena += this.valor.toStringTable();
        }
        else {
            return this.id + "(null)";
        }
        // }
        return this.id + "(" + cadena + ")";
    }
}
exports.Simbolo = Simbolo;

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSimbolos = void 0;
const Errores_1 = require("../Ast/Errores");
const Tipo_1 = require("./Tipo");
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
            // console.log("set simbolo " +  simbolo.getId() + " " + simbolo.getValor())
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
        if (this.tabla == null) {
            return "null";
        }
        JSON.stringify((this.tabla.forEach((key, value) => {
            // console.log(value)
            // console.log( key['valor'] +"," )
            if (key != null && key['valor'] instanceof TablaSimbolos) {
                cadena += key.toStringStruct();
            }
            else {
                cadena += key['valor'] + ",";
            }
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
                if (existe.getTipo() == simbolo.getTipo()
                    || (simbolo.getTipo() == Tipo_1.TIPO.STRUCT && simbolo.getTipo() == existe.getTipo())
                    || (existe.getTipo() == Tipo_1.TIPO.STRUCT && simbolo.getTipo() == Tipo_1.TIPO.NULO)) {
                    existe.setValor(simbolo.getValor());
                    existe.setTipo(simbolo.getTipo());
                    // AGREGAR STRUCT ACA
                    return null;
                }
                // console.log(`tipoo exp: ${existe.getTipo()} tipo variableSym: ${simbolo.getTipo()}`);
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

},{"../Ast/Errores":6,"./Tipo":56}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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
        result = gramatica.parse(editores[indexTab].codeEditor.getValue()); // return ast
        // result.Errores = gramatica.errores.slice()
        console.log(result);
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

reporteAST.addEventListener('click', () => {  

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
});

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

reporteErrores.addEventListener('click', () => {
    
    CuerpoTablaErrores.innerHTML = '';
    numero = 1     
    
    let aux = 1;
    //alert("Tam: "+listaErrores.length);
    result.Errores.forEach(
        element =>{
            let textoAuxilarTipo = "";
            if( element.tipo == "Lexico" ){
                textoAuxilarTipo = "Lexico";
                //texto += "\n--Error Lexico "+"Descripcion: "+element.getMensaje()+" Fila: "+element.getFila()+ " Columna: "+element.getColumna();
            }else if(element.tipo == "Sintactico"){
                textoAuxilarTipo = "Sintactico";
                //texto += "\n--Error Sintactico "+"Descripcion: "+element.getMensaje()+" Fila: "+element.getFila()+ " Columna: "+element.getColumna();
            }
            else{
                textoAuxilarTipo = "Semantico";
                //texto += "\n--Error Semántico "+" Descripcion: "+element.getMensaje()+" Fila: "+element.getFila()+ " Columna: "+element.getColumna();
            }

            CuerpoTablaErrores.innerHTML += `
            <tr>
            <th scope="row">${aux}</th>
            <td>${textoAuxilarTipo}</td>
            <td>${element.descripcion}</td>
            <td>${element.fila}</td>
            <td>${element.columna}</td>
            </tr>
            `
            aux++;
            
        }
    );

});

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
},{"./Analizadores/gramatica":4,"./dist/Ast/Ast":5,"./dist/Expresiones/Primitivo":17,"./dist/TablaSimbolos/TablaSimbolos":55}]},{},[57])(57)
});
