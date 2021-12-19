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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,25],$V1=[1,39],$V2=[1,30],$V3=[1,26],$V4=[1,27],$V5=[1,31],$V6=[1,32],$V7=[1,33],$V8=[1,34],$V9=[1,35],$Va=[1,36],$Vb=[1,38],$Vc=[1,37],$Vd=[1,28],$Ve=[1,40],$Vf=[1,41],$Vg=[1,42],$Vh=[1,43],$Vi=[1,44],$Vj=[2,5,31,32,35,43,47,48,50,52,55,56,57,58,59,60,61,64,93,94,95,96,97],$Vk=[2,5,31,32,35,43,47,48,49,50,52,55,56,57,58,59,60,61,64,93,94,95,96,97],$Vl=[1,56],$Vm=[32,70,78],$Vn=[2,118],$Vo=[1,63],$Vp=[1,66],$Vq=[1,70],$Vr=[1,67],$Vs=[1,68],$Vt=[1,69],$Vu=[1,71],$Vv=[1,74],$Vw=[1,114],$Vx=[1,88],$Vy=[1,79],$Vz=[1,113],$VA=[1,89],$VB=[1,105],$VC=[1,104],$VD=[1,106],$VE=[1,107],$VF=[1,108],$VG=[1,109],$VH=[1,110],$VI=[1,115],$VJ=[1,116],$VK=[1,78],$VL=[1,80],$VM=[1,81],$VN=[1,82],$VO=[1,83],$VP=[1,84],$VQ=[1,85],$VR=[1,86],$VS=[1,87],$VT=[1,93],$VU=[1,94],$VV=[1,95],$VW=[1,96],$VX=[1,97],$VY=[1,98],$VZ=[1,102],$V_=[1,103],$V$=[2,119],$V01=[8,36],$V11=[2,36],$V21=[1,127],$V31=[1,130],$V41=[1,137],$V51=[1,138],$V61=[1,139],$V71=[1,161],$V81=[1,145],$V91=[1,146],$Va1=[1,147],$Vb1=[1,148],$Vc1=[1,149],$Vd1=[1,150],$Ve1=[1,151],$Vf1=[1,152],$Vg1=[1,153],$Vh1=[1,154],$Vi1=[1,155],$Vj1=[1,156],$Vk1=[1,157],$Vl1=[1,158],$Vm1=[1,159],$Vn1=[1,160],$Vo1=[8,33,35,36,46,53,71,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$Vp1=[2,145],$Vq1=[1,165],$Vr1=[1,166],$Vs1=[1,168],$Vt1=[2,150],$Vu1=[2,154],$Vv1=[1,171],$Vw1=[1,183],$Vx1=[1,194],$Vy1=[36,46],$Vz1=[1,201],$VA1=[32,70],$VB1=[53,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$VC1=[39,78],$VD1=[1,233],$VE1=[8,33,35,36,46,71,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$VF1=[8,33,35,36,46,71,105,106,121],$VG1=[2,147],$VH1=[2,148],$VI1=[2,151],$VJ1=[1,237],$VK1=[36,71],$VL1=[8,33,35,36,46,53,70,71,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$VM1=[1,261],$VN1=[8,33,35,36,39,46,53,70,71,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$VO1=[1,277],$VP1=[8,33,35,36,46,71,98,99,104,105,106,108,109,110,111,112,113,121],$VQ1=[8,33,35,36,46,71,98,99,100,101,102,104,105,106,108,109,110,111,112,113,121],$VR1=[8,33,35,36,46,71,105,106,108,109,110,111,112,113,121],$VS1=[8,33,35,36,46,71,105,106,112,113,121],$VT1=[8,33,35,36,46,71],$VU1=[35,36],$VV1=[1,314],$VW1=[35,52,55],$VX1=[1,341],$VY1=[8,53,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"start":3,"instrucciones":4,"EOF":5,"instruccion":6,"print_instr":7,"PUNTOCOMA":8,"println_instr":9,"main_":10,"funciones":11,"declaracion":12,"asignacion":13,"if_llav_instr":14,"if_instr":15,"switch_instr":16,"break_instr":17,"continue_instr":18,"return_instr":19,"while_instr":20,"for_instr":21,"dowhile_instr":22,"for_in_instr":23,"decl_arr_instr":24,"llamada":25,"modif_arr_instr":26,"structs":27,"nat_push_instr":28,"tipo":29,"lista_simbolos":30,"RSTRUCT":31,"ID":32,"LLAVA":33,"instrucciones_struct":34,"LLAVC":35,"COMA":36,"attribute":37,"attributeDeclaStruct":38,"IGUAL":39,"expr":40,"INCRE":41,"DECRE":42,"RPRINT":43,"PARA":44,"lista_parametros":45,"PARC":46,"RPRINTLN":47,"RIF":48,"RELSE":49,"RSWITCH":50,"lista_cases":51,"RDEFAULT":52,"DOSPUNTOS":53,"case":54,"RCASE":55,"RBREAK":56,"RCONTINUE":57,"RRETURN":58,"RWHILE":59,"RDO":60,"RFOR":61,"actualizacion":62,"RIN":63,"RVOID":64,"RMAIN":65,"lista_parametros_func":66,"parametro_func":67,"lista_dim":68,"lista_exp_arr":69,"CORA":70,"CORC":71,"lista_exp_arr_c":72,"HASH":73,"lista_exp":74,"rango":75,"RBEGIN":76,"REND":77,"PUNTO":78,"RPUSH":79,"accesoAsignaStruct":80,"nat_matematicas":81,"RSIN":82,"RCOS":83,"RTAN":84,"RSQRT":85,"RLOG":86,"nat_parse":87,"RPARSE":88,"nat_conversion":89,"nat_conversion_tipos":90,"RTOINT":91,"RTODOUBLE":92,"RINT":93,"RDOUBLE":94,"RSTRING":95,"RCHAR":96,"RBOOLEAN":97,"MAS":98,"MENOS":99,"MULTI":100,"DIV":101,"PORCENTAJE":102,"POTENCIA":103,"AMPERSON":104,"AND":105,"OR":106,"NOT":107,"MAYORQUE":108,"MAYORIGUAL":109,"MENORIGUAL":110,"MENORQUE":111,"IGUALIGUAL":112,"DIFERENTE":113,"ENTERO":114,"DECIMAL":115,"CADENA":116,"CHAR":117,"NULL":118,"TRUE":119,"FALSE":120,"INTERROGACION":121,"RPOP":122,"RLENGTH":123,"RCHAROFPOS":124,"RSUBSTRING":125,"RTOUPPER":126,"RTOLOWER":127,"RSTRING_N":128,"RTYPEOF":129,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"PUNTOCOMA",31:"RSTRUCT",32:"ID",33:"LLAVA",35:"LLAVC",36:"COMA",39:"IGUAL",41:"INCRE",42:"DECRE",43:"RPRINT",44:"PARA",46:"PARC",47:"RPRINTLN",48:"RIF",49:"RELSE",50:"RSWITCH",52:"RDEFAULT",53:"DOSPUNTOS",55:"RCASE",56:"RBREAK",57:"RCONTINUE",58:"RRETURN",59:"RWHILE",60:"RDO",61:"RFOR",63:"RIN",64:"RVOID",65:"RMAIN",70:"CORA",71:"CORC",73:"HASH",76:"RBEGIN",77:"REND",78:"PUNTO",79:"RPUSH",82:"RSIN",83:"RCOS",84:"RTAN",85:"RSQRT",86:"RLOG",88:"RPARSE",91:"RTOINT",92:"RTODOUBLE",93:"RINT",94:"RDOUBLE",95:"RSTRING",96:"RCHAR",97:"RBOOLEAN",98:"MAS",99:"MENOS",100:"MULTI",101:"DIV",102:"PORCENTAJE",103:"POTENCIA",104:"AMPERSON",105:"AND",106:"OR",107:"NOT",108:"MAYORQUE",109:"MAYORIGUAL",110:"MENORIGUAL",111:"MENORQUE",112:"IGUALIGUAL",113:"DIFERENTE",114:"ENTERO",115:"DECIMAL",116:"CADENA",117:"CHAR",118:"NULL",119:"TRUE",120:"FALSE",121:"INTERROGACION",122:"RPOP",123:"RLENGTH",124:"RCHAROFPOS",125:"RSUBSTRING",126:"RTOUPPER",127:"RTOLOWER",128:"RSTRING_N",129:"RTYPEOF"},
productions_: [0,[3,2],[4,2],[4,1],[6,2],[6,2],[6,1],[6,1],[6,2],[6,2],[6,1],[6,1],[6,1],[6,2],[6,2],[6,2],[6,1],[6,1],[6,2],[6,1],[6,2],[6,2],[6,2],[6,2],[6,2],[6,1],[12,2],[27,5],[34,3],[34,1],[37,2],[37,2],[38,1],[38,3],[30,3],[30,5],[30,1],[30,3],[13,3],[13,2],[13,2],[13,4],[7,4],[9,4],[14,7],[14,11],[14,9],[15,5],[15,7],[15,7],[16,7],[16,9],[16,10],[51,2],[51,1],[54,4],[45,3],[45,1],[17,1],[18,1],[19,2],[19,1],[20,7],[22,8],[21,11],[21,11],[62,3],[62,2],[62,2],[23,7],[10,7],[10,6],[10,1],[11,7],[11,8],[11,1],[66,3],[66,1],[67,2],[67,3],[67,1],[25,3],[25,4],[24,5],[24,3],[24,3],[68,3],[68,2],[69,4],[69,3],[69,2],[72,3],[72,1],[74,4],[74,3],[26,4],[75,3],[75,3],[75,3],[75,3],[28,6],[28,5],[80,3],[80,1],[81,1],[81,1],[81,1],[81,1],[81,1],[87,6],[89,4],[90,1],[90,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[29,1],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,2],[40,3],[40,3],[40,3],[40,2],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,1],[40,5],[40,2],[40,2],[40,3],[40,1],[40,2],[40,1],[40,3],[40,1],[40,3],[40,3],[40,4],[40,6],[40,3],[40,3],[40,4],[40,1],[40,1],[40,4],[40,4]],
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
case 28: case 56: case 76: case 91:
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
case 77: case 92:
 this.$ = new Array(); this.$.push($$[$0]); 
break;
case 78:
 this.$ = {"tipo" : $$[$0-1], "arreglo": false, "id": $$[$0]}; 
break;
case 79:
 this.$ = {"tipo" : $$[$0-2], "arreglo": true, "id": $$[$0]}; 
break;
case 80:
 this.$ = {"tipo" : TIPO.ANY, "arreglo": false, "id": $$[$0]}; 
break;
case 81:
 this.$ = new Llamada($$[$0-2] , [], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 82:
 this.$ = new Llamada($$[$0-3] , $$[$0-1] , _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 83:
 this.$ = new DeclaracionArr($$[$0-4], $$[$0-3], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 84:
 this.$ = new DeclaracionArr(null, null, $$[$0-2], $$[$0-1], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 85:
 this.$ = new DeclaracionArr($$[$0-2], $$[$0-1], $$[$0], null, _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 86:
 this.$ = $$[$0-2]; this.$.push($$[$0-1]+1); 
break;
case 87:
 this.$ = new Array(); this.$.push(1); 
break;
case 88: case 93:
 this.$ = $$[$0-3]; this.$.push($$[$0-1]); 
break;
case 89: case 94:
 this.$ = new Array(); this.$.push($$[$0-1]); 
break;
case 90:
 this.$ = new Copiar($$[$0], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 95:
 this.$ = new ModificacionArr($$[$0-3], $$[$0-2], $$[$0], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 96: case 97: case 98: case 99:
 this.$ = {"inicio": $$[$0-2], "fin": $$[$0]}; 
break;
case 100:
 this.$ = new Push(new Identificador($$[$0-5] , _$[$0-5].first_line, _$[$0-5].last_column), $$[$0-1], _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 101:
  
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
case 102:
 this.$ = new AccesoStruct($$[$0-2],new Identificador($$[$0] , _$[$0-2].first_line, _$[$0-2].last_column),_$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 103: case 145:
 this.$ = new Identificador($$[$0] , _$[$0].first_line, _$[$0].last_column); 
break;
case 104: case 105: case 106: case 107: case 108: case 111: case 112: case 150: case 162: case 163:
 this.$ = $$[$0]; 
break;
case 109:
 this.$ = new Parse($$[$0-5], $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column); 
break;
case 110:
 this.$ = new To($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 113:
 this.$ = TIPO.ENTERO; 
break;
case 114:
 this.$ = TIPO.DECIMAL; 
break;
case 115:
 this.$ = TIPO.CADENA; 
break;
case 116:
 this.$ = TIPO.CHARACTER; 
break;
case 117:
 this.$ = TIPO.BOOLEANO; 
break;
case 118:
 this.$ = TIPO.VOID; 
break;
case 119:
 this.$ = TIPO.STRUCT; 
break;
case 120:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MAS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 121:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MENOS,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 122:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POR,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 123:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.DIV,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 124:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.MOD,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 125:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.POT,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 126:
 this.$ = new Aritmetica($$[$0-2],OperadorAritmetico.AMPERSON,$$[$0], _$[$0-2].first_line, _$[$0-2].first_column, false); 
break;
case 127:
 this.$ = new Aritmetica($$[$0],OperadorAritmetico.UMENOS,$$[$0], _$[$0-1].first_line, _$[$0-1].first_column, true); 
break;
case 128: case 149:
 this.$ = $$[$0-1]; 
break;
case 129:
 this.$ = new Logica($$[$0-2], OperadorLogico.AND, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 130:
 this.$ = new Logica($$[$0-2], OperadorLogico.OR, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 131:
 this.$ = new Logica($$[$0], OperadorLogico.NOT, null, $$[$0-1].first_line, $$[$0-1].last_column, true); 
break;
case 132:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 133:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MAYORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 134:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 135:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.MENORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 136:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.IGUALIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 137:
 this.$ = new Relacional($$[$0-2], OperadorRelacional.DIFERENTE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false); 
break;
case 138:
 this.$ = new Primitivo(Number($$[$0]), TIPO.ENTERO, _$[$0].first_line, _$[$0].first_column); 
break;
case 139:
 this.$ = new Primitivo(Number($$[$0]), TIPO.DECIMAL, _$[$0].first_line, _$[$0].first_column); 
break;
case 140:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CADENA, _$[$0].first_line, _$[$0].first_column); 
break;
case 141:
 $$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0], TIPO.CHARACTER, _$[$0].first_line, _$[$0].first_column); 
break;
case 142:
 this.$ = new Primitivo(null, TIPO.NULO, _$[$0].first_line, _$[$0].first_column); 
break;
case 143:
 this.$ = new Primitivo(true, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 144:
 this.$ = new Primitivo(false, TIPO.BOOLEANO, _$[$0].first_line, _$[$0].first_column); 
break;
case 146:
this.$ = new Ternario($$[$0-4], $$[$0-2], $$[$0], _$[$0-4].first_line, _$[$0-4].first_column);
break;
case 147:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MAS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
case 148:
 this.$ = new Aritmetica(new Identificador($$[$0-1], _$[$0-1].first_line, _$[$0-1].last_column), OperadorAritmetico.MENOS,new Primitivo(Number(1), $$[$0-1].first_line, $$[$0-1].last_column), $$[$0-1].first_line, $$[$0-1].last_column, false); 
break;
case 151:
 this.$ = new AccesoArr($$[$0-1], $$[$0], _$[$0-1].first_line, _$[$0-1].first_column); 
break;
case 152:
 this.$ = new Rango(TIPO.RANGO, [$$[$0].inicio, $$[$0].fin], _$[$0].first_line, _$[$0].last_column); 
break;
case 153:
 if( $$[$0] instanceof Pop || $$[$0] instanceof Length || $$[$0] instanceof CharOfPos ||
                                            $$[$0] instanceof subString || $$[$0] instanceof toUpper || $$[$0] instanceof toLower){
                                            this.$ = $$[$0];
                                            let identifica =new Identificador($$[$0-2] , _$[$0-2].first_line, _$[$0-2].last_column);
                                            this.$.id = identifica.id;
                                        }else{
                                            this.$ = new AccesoStruct(new Identificador($$[$0-2] , _$[$0-2].first_line, _$[$0-2].last_column),$$[$0],_$[$0-2].first_line, _$[$0-2].first_column);
                                        }
                                    
break;
case 154:
 this.$ = new Arreglo(TIPO.ARREGLO, $$[$0], _$[$0].first_line, _$[$0].first_column); 
break;
case 155:
 this.$ = new Pop(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 156:
 this.$ = new Length(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 157:
 this.$ = new CharOfPos(null, $$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 158:
 this.$ = new subString(null, $$[$0-3], $$[$0-1], _$[$0-5].first_line, _$[$0-5].first_column); 
break;
case 159:
 this.$ = new toUpper(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 160:
 this.$ = new toLower(null, _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 161:
 this.$ = new Matematicas($$[$0-3], $$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 164:
 this.$ = new StringN($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
case 165:
 this.$ = new TypeOfN($$[$0-1], _$[$0-3].first_line, _$[$0-3].first_column); 
break;
}
},
table: [{2:$V0,3:1,4:2,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{1:[3]},{2:$V0,5:[1,45],6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vj,[2,3]),{8:[1,47]},{8:[1,48]},o($Vk,[2,6]),o($Vk,[2,7]),{8:[1,49]},{8:[1,50]},o($Vk,[2,10]),o($Vk,[2,11]),o($Vk,[2,12]),{8:[1,51]},{8:[1,52]},{8:[1,53]},o($Vk,[2,16]),o($Vk,[2,17]),{8:[1,54]},o($Vk,[2,19]),{8:[1,55]},{8:$Vl},{8:[1,57]},{8:[1,58]},{8:[1,59]},o($Vk,[2,25]),{44:[1,60]},{44:[1,61]},o($Vm,$Vn,{65:[1,62]}),{30:64,32:$Vo,68:65,70:$Vp},{32:$Vq,39:$Vr,41:$Vs,42:$Vt,44:$Vu,70:$Vv,74:72,78:[1,73]},{44:[1,75]},{44:[1,76]},{8:[2,58]},{8:[2,59]},{8:[2,61],25:90,29:111,31:$Vw,32:$Vx,40:77,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{44:[1,117]},{32:[1,119],44:[1,118]},{33:[1,120]},o([70,78],$V$,{32:[1,121]}),o($Vm,[2,113]),o($Vm,[2,114]),o($Vm,[2,115]),o($Vm,[2,116]),o($Vm,[2,117]),{1:[2,1]},o($Vj,[2,2]),o($Vk,[2,4]),o($Vk,[2,5]),o($Vk,[2,8]),o($Vk,[2,9]),o($Vk,[2,13]),o($Vk,[2,14]),o($Vk,[2,15]),o($Vk,[2,18]),o($Vk,[2,20]),o($Vk,[2,21]),o($Vk,[2,22]),o($Vk,[2,23]),o($Vk,[2,24]),{25:90,29:111,31:$Vw,32:$Vx,40:123,44:$Vy,45:122,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:123,44:$Vy,45:124,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{44:[1,125]},o($V01,$V11,{39:$V21,44:[1,126]}),{8:[2,26],36:[1,128]},{32:[1,129],70:$V31},{71:[1,131]},{25:90,29:111,31:$Vw,32:$Vx,40:132,44:$Vy,64:$Vz,69:133,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{8:[2,39]},{8:[2,40]},{39:[1,134]},{25:90,29:111,31:$Vw,32:$Vx,40:123,44:$Vy,45:136,46:[1,135],64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{39:$V41,70:$V51},{32:[1,141],79:$V61,80:140},{25:90,29:111,31:$Vw,32:$Vx,40:142,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:143,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:144,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{8:[2,60],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{25:90,29:111,31:$Vw,32:$Vx,40:162,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:163,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:164,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vo1,[2,138]),o($Vo1,[2,139]),o($Vo1,[2,140]),o($Vo1,[2,141]),o($Vo1,[2,142]),o($Vo1,[2,143]),o($Vo1,[2,144]),o($Vo1,$Vp1,{74:167,41:$Vq1,42:$Vr1,44:$Vu,70:$Vv,78:$Vs1}),{25:90,29:111,31:$Vw,32:$Vx,40:170,44:$Vy,64:$Vz,69:92,70:$VA,72:169,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vo1,$Vt1),o($Vo1,[2,152]),o($Vo1,$Vu1,{70:$Vv1}),{44:[1,172]},{44:[1,173]},{44:[1,174]},{44:[1,175]},{44:[1,176]},{44:[1,177]},{44:[1,178]},o($Vo1,[2,162]),o($Vo1,[2,163]),{44:[1,179]},{44:[1,180]},{53:[1,181]},{32:[1,182]},{44:[2,104]},{44:[2,105]},{44:[2,106]},{44:[2,107]},{44:[2,108]},{78:$Vw1},{44:[1,184]},o($Vm,$Vn),o($Vm,$V$),{44:[2,111]},{44:[2,112]},{25:90,29:111,31:$Vw,32:$Vx,40:185,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{12:187,13:186,29:189,31:$Vw,32:[1,188],64:$Vz,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{63:[1,190]},{2:$V0,4:191,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{33:[1,192]},{36:$Vx1,46:[1,193]},o($Vy1,[2,57],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),{36:$Vx1,46:[1,195]},{46:[1,196]},{29:200,31:$Vw,32:$Vz1,46:[1,197],64:$Vz,66:198,67:199,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{25:90,29:111,31:$Vw,32:$Vx,40:202,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{32:[1,203]},{8:[2,85],39:[1,204]},{71:[1,205]},o($VA1,[2,87]),{8:[2,38],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o($VB1,$Vu1,{8:[2,84],70:$Vv1}),{25:90,29:111,31:$Vw,32:$Vx,40:206,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vo1,[2,81]),{36:$Vx1,46:[1,207]},{25:90,29:111,31:$Vw,32:$Vx,40:208,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:209,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{44:[1,210]},{39:[1,211],78:[1,212]},o($VC1,[2,103]),{53:$V71,71:[1,213],98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{46:[1,214],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{46:[1,215],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{25:90,29:111,31:$Vw,32:$Vx,40:216,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:217,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:218,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:219,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:220,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:221,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:222,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:223,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:224,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:225,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:226,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:227,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:228,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:229,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:230,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:231,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:232,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,77:$VD1,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VE1,[2,127],{53:$V71}),{46:[1,234],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o($VF1,[2,131],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1}),o($Vo1,$VG1),o($Vo1,$VH1),o($Vo1,$VI1,{70:$V51}),{25:90,29:111,31:$Vw,32:$Vx,40:235,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{36:$VJ1,71:[1,236]},o($VK1,[2,92],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),{25:90,29:111,31:$Vw,32:$Vx,40:170,44:$Vy,64:$Vz,69:92,70:$VA,72:238,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{46:[1,239]},{46:[1,240]},{25:90,29:111,31:$Vw,32:$Vx,40:241,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:242,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{46:[1,243]},{46:[1,244]},{25:90,29:111,31:$Vw,32:$Vx,40:245,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:246,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:247,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:249,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,77:[1,248],81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VL1,[2,90]),{88:[1,250]},{25:90,29:111,31:$Vw,32:$Vx,40:251,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{46:[1,252],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{8:[1,253]},{8:[1,254]},{32:$Vq,39:[1,255],41:$Vs,42:$Vt},{30:64,32:[1,256]},{25:90,29:111,31:$Vw,32:$Vx,40:257,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,258],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{29:262,31:$Vw,32:$VM1,34:259,37:260,64:$Vz,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{8:[2,42]},{25:90,29:111,31:$Vw,32:$Vx,40:263,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{8:[2,43]},{33:[1,264]},{33:[1,265]},{36:[1,267],46:[1,266]},o($Vy1,[2,77]),{32:[1,268],68:269,70:$Vp},o($Vy1,[2,80]),o($V01,[2,37],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),o($V01,[2,34],{39:[1,270]}),{69:271,70:[1,272],73:$VB},o($VA1,[2,86]),{8:[2,41],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o($Vo1,[2,82]),{8:[2,95],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{53:$V71,71:[1,273],98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{25:90,29:111,31:$Vw,32:$Vx,40:274,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:275,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{32:[1,276]},o($VN1,[2,94]),{2:$V0,6:278,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,33:$VO1,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{33:[1,279]},o($VP1,[2,120],{53:$V71,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1}),o($VP1,[2,121],{53:$V71,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1}),o($VQ1,[2,122],{53:$V71,103:$Vd1}),o($VQ1,[2,123],{53:$V71,103:$Vd1}),o($VQ1,[2,124],{53:$V71,103:$Vd1}),o($VE1,[2,125],{53:$V71}),o($VP1,[2,126],{53:$V71,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1}),o($VF1,[2,129],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1}),o([8,33,35,36,46,71,106,121],[2,130],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1}),o($VR1,[2,132],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1}),o($VR1,[2,133],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1}),o($VR1,[2,134],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1}),o($VR1,[2,135],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1}),o($VS1,[2,136],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1}),o($VS1,[2,137],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1}),{53:[1,280],98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o($VT1,[2,96],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),o($Vo1,[2,98]),o($Vo1,[2,128]),o($VP1,[2,153],{53:$V71,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1}),o($VL1,[2,149]),{25:90,29:111,31:$Vw,32:$Vx,40:281,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{36:$VJ1,71:[1,282]},o($Vo1,[2,155]),o($Vo1,[2,156]),{46:[1,283],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{36:[1,284],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o($Vo1,[2,159]),o($Vo1,[2,160]),{46:[1,285],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{46:[1,286],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{46:[1,287],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o($Vo1,[2,97]),o($VT1,[2,99],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),{44:[1,288]},{46:[1,289],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{33:[1,290]},{25:90,29:111,31:$Vw,32:$Vx,40:291,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:292,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{25:90,29:111,31:$Vw,32:$Vx,40:132,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($V01,$V11,{39:$V21}),{33:[1,293],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{59:[1,294]},{35:[1,295],36:[1,296]},o($VU1,[2,29]),{32:[1,297]},{32:[1,299],38:298},o($Vy1,[2,56],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),{2:$V0,4:300,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,301],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,4:302,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{33:[1,303]},{29:200,31:$Vw,32:$Vz1,64:$Vz,67:304,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vy1,[2,78]),{32:[1,305],70:$V31},{25:90,29:111,31:$Vw,32:$Vx,40:306,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{8:[2,83],70:$Vv1},{25:90,29:111,31:$Vw,32:$Vx,40:170,44:$Vy,64:$Vz,69:92,70:$VA,72:307,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VN1,[2,93]),{46:[1,308],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{8:[2,101],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o($VC1,[2,102]),{2:$V0,4:309,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vj,[2,47],{49:[1,310]}),{51:311,52:[1,312],54:313,55:$VV1},{25:90,29:111,31:$Vw,32:$Vx,40:315,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,77:$VD1,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VK1,[2,91],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),o($VL1,[2,88]),o($Vo1,[2,157]),{25:90,29:111,31:$Vw,32:$Vx,40:316,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vo1,[2,161]),o($Vo1,[2,164]),o($Vo1,[2,165]),{25:90,29:111,31:$Vw,32:$Vx,40:317,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vo1,[2,110]),{2:$V0,4:318,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{8:[1,319],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{8:[1,320],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{2:$V0,4:321,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{44:[1,322]},{8:[2,27]},{29:262,31:$Vw,32:$VM1,37:323,64:$Vz,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($VU1,[2,30]),o($VU1,[2,31]),o($VU1,[2,32],{39:[1,324]}),{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,325],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vk,[2,71]),{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,326],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,4:327,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vy1,[2,76]),o($Vy1,[2,79]),o($V01,[2,35],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),{36:$VJ1,71:[1,328]},{8:[2,100]},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,329],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,6:330,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:331,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{35:[1,332],52:[1,333],54:334,55:$VV1},{53:[1,335]},o($VW1,[2,54]),{25:90,29:111,31:$Vw,32:$Vx,40:336,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VT1,[2,146],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),{46:[1,337],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{46:[1,338],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,339],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{32:$VX1,62:340},{32:$VX1,62:342},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,343],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{25:90,29:111,31:$Vw,32:$Vx,40:344,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($VU1,[2,28]),{25:90,29:111,31:$Vw,32:$Vx,40:345,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vk,[2,70]),o($Vk,[2,73]),{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,346],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o([8,70],[2,89]),o($Vj,[2,44],{49:[1,347]}),o($Vk,[2,48]),o($Vk,[2,49]),o($Vk,[2,50]),{53:[1,348]},o($VW1,[2,53]),{2:$V0,4:349,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{53:[1,350],98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o($Vo1,[2,158]),o($Vo1,[2,109]),o($Vk,[2,62]),{46:[1,351]},{39:[1,352],41:[1,353],42:[1,354]},{46:[1,355]},o($Vk,[2,69]),{46:[1,356],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o($VU1,[2,33],{53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1}),o($Vk,[2,74]),{14:358,33:[1,357],48:[1,359]},{2:$V0,4:360,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,361],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,4:362,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:364,26:22,27:23,28:24,29:365,31:$V1,32:[1,363],40:232,43:$V3,44:$Vy,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,69:92,70:$VA,73:$VB,75:91,76:$VC,77:$VD1,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{33:[1,366]},{25:90,29:111,31:$Vw,32:$Vx,40:367,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{46:[2,67]},{46:[2,68]},{33:[1,368]},{8:[2,63]},{2:$V0,4:369,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vk,[2,46]),{44:[1,370]},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,371],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vk,[2,51]),o($VW1,[2,55],{7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,6:46,2:$V0,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi}),o($VB1,$Vp1,{74:374,32:$Vq,39:$Vr,41:[1,372],42:[1,373],44:$Vu,70:$Vv,78:[1,375]}),o($VB1,$Vt1,{8:$Vl}),{30:64,32:$Vo,68:65,70:$Vp,78:$Vw1},{2:$V0,4:376,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{46:[2,66],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},{2:$V0,4:377,6:3,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,378],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{25:90,29:111,31:$Vw,32:$Vx,40:379,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},o($Vk,[2,52]),o($VY1,$VG1),o($VY1,$VH1),o($VB1,$VI1,{39:$V41,70:$V51}),{25:90,29:111,31:$Vw,32:[1,380],40:235,44:$Vy,64:$Vz,69:92,70:$VA,73:$VB,75:91,76:$VC,79:$V61,80:140,81:99,82:$VD,83:$VE,84:$VF,85:$VG,86:$VH,87:100,89:101,90:112,91:$VI,92:$VJ,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi,99:$VK,107:$VL,114:$VM,115:$VN,116:$VO,117:$VP,118:$VQ,119:$VR,120:$VS,122:$VT,123:$VU,124:$VV,125:$VW,126:$VX,127:$VY,128:$VZ,129:$V_},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,381],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},{2:$V0,6:46,7:4,9:5,10:6,11:7,12:8,13:9,14:10,15:11,16:12,17:13,18:14,19:15,20:16,21:17,22:18,23:19,24:20,25:21,26:22,27:23,28:24,29:29,31:$V1,32:$V2,35:[1,382],43:$V3,47:$V4,48:$V5,50:$V6,56:$V7,57:$V8,58:$V9,59:$Va,60:$Vb,61:$Vc,64:$Vd,93:$Ve,94:$Vf,95:$Vg,96:$Vh,97:$Vi},o($Vk,[2,45]),{46:[1,383],53:$V71,98:$V81,99:$V91,100:$Va1,101:$Vb1,102:$Vc1,103:$Vd1,104:$Ve1,105:$Vf1,106:$Vg1,108:$Vh1,109:$Vi1,110:$Vj1,111:$Vk1,112:$Vl1,113:$Vm1,121:$Vn1},o([39,53,98,99,100,101,102,103,104,105,106,108,109,110,111,112,113,121],$Vp1,{74:167,41:$Vq1,42:$Vr1,44:$Vu,70:$Vv,78:$Vs1}),o($Vk,[2,64]),o($Vk,[2,65]),{33:$VO1}],
defaultActions: {33:[2,58],34:[2,59],45:[2,1],68:[2,39],69:[2,40],106:[2,104],107:[2,105],108:[2,106],109:[2,107],110:[2,108],115:[2,111],116:[2,112],193:[2,42],195:[2,43],295:[2,27],308:[2,100],353:[2,67],354:[2,68],356:[2,63]},
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
rules: [/^(?:\/\/.*)/,/^(?:\/\*)/,/^(?:\*\/)/,/^(?:.)/,/^(?:\s+)/,/^(?:print\b)/,/^(?:println\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:while\b)/,/^(?:for\b)/,/^(?:do\b)/,/^(?:in\b)/,/^(?:null\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:int\b)/,/^(?:double\b)/,/^(?:boolean\b)/,/^(?:char\b)/,/^(?:String\b)/,/^(?:void\b)/,/^(?:main\b)/,/^(?:struct\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:return\b)/,/^(?:begin\b)/,/^(?:end\b)/,/^(?:pop\b)/,/^(?:push\b)/,/^(?:length\b)/,/^(?:caracterOfPosition\b)/,/^(?:subString\b)/,/^(?:toUppercase\b)/,/^(?:toLowercase\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:log10\b)/,/^(?:sqrt\b)/,/^(?:parse\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:string\b)/,/^(?:typeof\b)/,/^(?:\+\+)/,/^(?:--)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:\^)/,/^(?:>=)/,/^(?:<=)/,/^(?:<)/,/^(?:>)/,/^(?:!=)/,/^(?:==)/,/^(?:=)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:!)/,/^(?:&)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:\.)/,/^(?:;)/,/^(?:,)/,/^(?:\?)/,/^(?::)/,/^(?:#)/,/^(?:(([0-9]+\.[0-9]*)|(\.[0-9]+)))/,/^(?:[0-9]+)/,/^(?:[a-zA-Z_][a-zA-Z0-9_ñÑ]*)/,/^(?:("((\\([\'\"\\bfnrtv]))|([^\"\\]+))*"))/,/^(?:('((\\([\'\"\\bfnrtv]))|([^\'\\]))'))/,/^(?:.)/,/^(?:[\r\n\t])/,/^(?:$)/],
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
},{"../dist/Ast/Ast":5,"../dist/Ast/Errores":6,"../dist/Expresiones/Arreglos/AccesoArr":8,"../dist/Expresiones/Arreglos/Arreglo":9,"../dist/Expresiones/Arreglos/Copiar":10,"../dist/Expresiones/Arreglos/Rango":11,"../dist/Expresiones/Identificador":12,"../dist/Expresiones/Llamada":13,"../dist/Expresiones/Operaciones/Aritmeticas":14,"../dist/Expresiones/Operaciones/Logicas":15,"../dist/Expresiones/Operaciones/Relacionales":16,"../dist/Expresiones/Primitivo":17,"../dist/Expresiones/Struct/AccesoStruct":18,"../dist/Expresiones/Ternario":19,"../dist/Instrucciones/Arreglos/DeclaracionArr":23,"../dist/Instrucciones/Arreglos/ModificacionArr":24,"../dist/Instrucciones/Asignacion":25,"../dist/Instrucciones/Ciclicas/DoWhile":26,"../dist/Instrucciones/Ciclicas/For":27,"../dist/Instrucciones/Ciclicas/ForIn":28,"../dist/Instrucciones/Ciclicas/While":29,"../dist/Instrucciones/Condicionales/Case":30,"../dist/Instrucciones/Condicionales/If":31,"../dist/Instrucciones/Condicionales/Ifsinllave":32,"../dist/Instrucciones/Condicionales/Switch":33,"../dist/Instrucciones/Declaracion":34,"../dist/Instrucciones/Metodos/Funcion":35,"../dist/Instrucciones/Metodos/Main":36,"../dist/Instrucciones/Metodos/Nativas/Arreglos/Pop":37,"../dist/Instrucciones/Metodos/Nativas/Arreglos/Push":38,"../dist/Instrucciones/Metodos/Nativas/Cadenas/CharOfPos":39,"../dist/Instrucciones/Metodos/Nativas/Cadenas/subString":40,"../dist/Instrucciones/Metodos/Nativas/Cadenas/toLower":41,"../dist/Instrucciones/Metodos/Nativas/Cadenas/toUpper":42,"../dist/Instrucciones/Metodos/Nativas/Length":43,"../dist/Instrucciones/Metodos/Nativas/Matematicas":44,"../dist/Instrucciones/Metodos/Nativas/Numericas/Parse":45,"../dist/Instrucciones/Metodos/Nativas/Numericas/To":46,"../dist/Instrucciones/Metodos/Nativas/StringN":47,"../dist/Instrucciones/Metodos/Nativas/TypeOfN":48,"../dist/Instrucciones/Print":49,"../dist/Instrucciones/Struct/AsignaVariable":50,"../dist/Instrucciones/Struct/DeclararStruct":51,"../dist/Instrucciones/Struct/Struct":52,"../dist/Instrucciones/Struct/StructInStruct":53,"../dist/Instrucciones/Transferencia/Break":54,"../dist/Instrucciones/Transferencia/Continuar":55,"../dist/Instrucciones/Transferencia/Return":56,"../dist/TablaSimbolos/Simbolo":57,"../dist/TablaSimbolos/Tipo":59,"_process":3,"fs":1,"path":2}],5:[function(require,module,exports){
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
const Nodo_1 = require("./Nodo");
const GeneradorC3D_1 = require("../G3D/GeneradorC3D");
class Ast {
    constructor() {
        this.consola = "";
        this.dot = "";
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
        this.generadorC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
    }
    ejecutar() {
        let tree = this;
        tree.setTSGlobal(this.TSglobal);
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
    traducir() {
        let tree = this;
        tree.generadorC3d.clearCode();
        tree.setTSGlobal(this.TSglobal);
        this.instrucciones.forEach(instr => {
            instr.translate3d(this.TSglobal, tree);
        });
        let txtC3d = this.generadorC3d.getCode();
        // console.log(txtC3d)
        this.printInHtmlC3d(txtC3d);
        // this.generadorC3d.clearCode();
        return txtC3d;
    }
    printInHtmlC3d(cadena) {
        let textarea = document.querySelector('#textAreaC3d');
        let value = "";
        value += cadena;
        textarea.value = value;
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
    graphAst() {
        /**
         * ----AGREGANDO----
         * INSTRUCCIONES
         * START
         */
        let raiz = new Nodo_1.Nodo("START", "");
        let instrucciones = new Nodo_1.Nodo("INSTRUCCIONES", "");
        for (let inst of this.instrucciones) {
            instrucciones.addChildNode(inst.recorrer(this.TSglobal, this));
        }
        raiz.addChildNode(instrucciones);
        /**
         * -----RECORRIENDO----
         * >>> GRAFICANDO
         */
        this.dot = "";
        this.dot += "digraph {\n";
        this.dot += "n0[label=\"" + raiz.getToken().replace("\"", "") + "\"];\n";
        this.contador = 1;
        console.log(raiz);
        this.recorrer("n0", raiz);
        this.dot += "}";
        let textarea = document.querySelector('#textAreaConsola');
        let value = "";
        value += this.dot;
        textarea.value = value;
        return this.dot;
    }
    recorrer(idPadre, nodoPadre) {
        for (let nodo of nodoPadre.getChilds()) {
            // console.log(nodo);
            if (nodo instanceof Nodo_1.Nodo && nodo.getToken() != null) {
                let nameHijo = "n" + this.contador.toString();
                let token = nodo.getToken().toString().replace("\"", "");
                // console.log(token)
                this.dot += nameHijo + "[label=\"" + token + "\"];\n";
                this.dot += idPadre + "->" + nameHijo + ";\n";
                this.contador++;
                this.recorrer(nameHijo, nodo);
            }
        }
    }
}
exports.Ast = Ast;

},{"../G3D/GeneradorC3D":20,"../Instrucciones/Arreglos/DeclaracionArr":23,"../Instrucciones/Arreglos/ModificacionArr":24,"../Instrucciones/Asignacion":25,"../Instrucciones/Declaracion":34,"../Instrucciones/Metodos/Funcion":35,"../Instrucciones/Metodos/Main":36,"../Instrucciones/Struct/Struct":52,"../Instrucciones/Transferencia/Break":54,"../Instrucciones/Transferencia/Continuar":55,"../Instrucciones/Transferencia/Return":56,"../TablaSimbolos/TablaSimbolos":58,"./../Instrucciones/Struct/DeclararStruct":51,"./Errores":6,"./Nodo":7}],6:[function(require,module,exports){
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
        // this.tipo = simbolo.getTipo();
        if (!simbolo.getArreglo()) {
            return new Errores_1.Errores("Semantico", "La variable \'" + this.id + "\', no es un arreglo.", this.fila, this.columna);
        }
        this.tipo = simbolo.getTipo();
        // console.log("this.tipo: " + this.tipo);
        // console.log("AccArr exp val: " + this.expresiones[0]);
        // console.log("AccArr exp size: " + this.expresiones[0].length);
        // console.log("AccArr exp type: " + (this.expresiones[0].tipo));
        if (this.expresiones[0] instanceof Rango_1.Rango) {
            // console.log("AccArr RANK");
            // console.log("TIPO acc: " + this.tipo);
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
        throw new Error("Method not implemented ACCARR.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Acceso ARR", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
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
            // this.tipo = arreglo[num].tipo;
            // console.log("TIPO acc: " + this.tipo);
            return arreglo[num];
        }
        // console.log("arreglo[num]: " + arreglo[num]);
        if (arreglo[num] != undefined || arreglo[num] != null) {
            // console.log("no null");
            // this.tipo = arreglo[num].tipo;
            // console.log("TIPO acc: " + this.tipo);
            // if(expresiones == null || expresiones == undefined){
            //     return arreglo[num];
            // }
            if (this.tipo == Tipo_1.TIPO.CADENA) {
                return this.buscarDimensiones(tree, table, expresiones.slice(), arreglo[num]);
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":59,"./Rango":11}],9:[function(require,module,exports){
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
        throw new Error("Method not implemented ARR.");
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
        throw new Error("Method not implemented COPIAR.");
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
        throw new Error("Method not implemented RANGO.");
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
const Retorno_1 = require("../G3D/Retorno");
class Identificador {
    constructor(id, fila, columna) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
        this.tipo = null;
        this.lblFalse = "";
        this.lblTrue = "";
    }
    ejecutar(table, tree) {
        // console.log(table.existeEnActual(this.id));
        // console.log((table));
        // table.getSymbolTabla(this.id);
        this.symbol = table.getSymbolTabla(this.id);
        // console.log(table.getSymbolTabla(this.id));
        if (this.symbol == null) {
            return new Errores_1.Errores("Semantico", "Variable " + this.id + ", no coincide con la busqueda en Identificador.", this.fila, this.columna);
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
        const genC3d = tree.generadorC3d;
        let varSimb = table.getSymbolTabla(this.id);
        let temp = genC3d.newTemp();
        if (varSimb != null) {
            if (varSimb.isGlobal) {
                genC3d.gen_Comment("--------Id-------");
                genC3d.gen_GetStack(temp, varSimb.posicion);
                if (varSimb.tipo !== Tipo_1.TIPO.BOOLEANO) // si no es booleano
                 {
                    return new Retorno_1.Retorno(temp, true, varSimb.tipo, varSimb);
                }
                genC3d.gen_Comment("--------Id booleano-------");
                //si lo es : booleano
                let retorno = new Retorno_1.Retorno("", false, varSimb.tipo, varSimb);
                this.lblTrue = this.lblTrue == "" ? genC3d.newLabel() : this.lblTrue;
                this.lblFalse = this.lblFalse == "" ? genC3d.newLabel() : this.lblFalse;
                genC3d.gen_If(temp, '1', '==', this.lblTrue);
                genC3d.gen_Goto(this.lblFalse);
                retorno.lblTrue = this.lblTrue;
                retorno.lblFalse = this.lblFalse;
                return retorno;
            }
            else {
                genC3d.gen_Comment("--------Id-------");
                let tempAux = genC3d.newTemp();
                genC3d.freeTemp(tempAux);
                genC3d.gen_Exp(tempAux, 'p', varSimb.posicion, '+');
                genC3d.gen_GetStack(temp, tempAux);
                if (varSimb.tipo !== Tipo_1.TIPO.BOOLEANO) {
                    return new Retorno_1.Retorno(temp, true, varSimb.tipo, varSimb);
                }
                //si lo es : booleano
                genC3d.gen_Comment("--------Id booleano-------");
                const retorno = new Retorno_1.Retorno('', false, varSimb.tipo, varSimb);
                this.lblTrue = this.lblTrue == '' ? genC3d.newLabel() : this.lblTrue;
                this.lblFalse = this.lblFalse == '' ? genC3d.newLabel() : this.lblFalse;
                genC3d.gen_If(temp, '1', '==', this.lblTrue);
                genC3d.gen_Goto(this.lblFalse);
                retorno.lblTrue = this.lblTrue;
                retorno.lblFalse = this.lblFalse;
                return retorno;
            }
            const generator = tree.generadorC3d;
            if (typeof this.symbol.valor == "number") {
                return new Retorno_1.Retorno(this.symbol.valor + "", false, Tipo_1.TIPO.DECIMAL);
            }
            else if (typeof this.symbol.valor == "string") {
                // console.log("entre****");
                // console.log(this.symbol);
                const temp = generator.newTemp();
                generator.genAsignaTemp(temp, "h");
                for (let i = 0; i < this.symbol.valor.length; i++) {
                    generator.gen_SetHeap("h", this.symbol.valor.charCodeAt(i));
                    generator.nextHeap();
                }
                generator.gen_SetHeap("h", "-1");
                generator.nextHeap();
                return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
            }
            else {
                // console.log("no entre");
            }
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("IDENTIFICADOR", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id.toString(), ""));
        return padre;
    }
}
exports.Identificador = Identificador;

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../G3D/Retorno":22,"../TablaSimbolos/Tipo":59}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Identificador_1 = require("./Identificador");
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
                // console.log("expr: ");
                // console.log(expr);
                // console.log("valueExpr: " + valueExpr);
                // console.log("resultFunc.parameters[count]: ");
                // console.log(resultFunc.parameters[count]);
                if (valueExpr instanceof Errores_1.Errores) {
                    return new Errores_1.Errores("Semantico", "Sentencia Break fuera de Instruccion Ciclo/Control", this.fila, this.columna);
                }
                if (resultFunc.parameters[count].tipo == expr.tipo || resultFunc.parameters[count].tipo == Tipo_1.TIPO.ANY || (expr instanceof Identificador_1.Identificador && expr.symbol.arreglo)) //Valida Tipos
                 {
                    let symbol;
                    // console.log(resultFunc.parameters[count]);
                    if (resultFunc.parameters[count].tipo == Tipo_1.TIPO.ANY) {
                        // alert("valexp ll: " + valueExpr);
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), expr.tipo, this.arreglo, this.fila, this.columna, valueExpr); // seteo para variables nativas
                    }
                    else if (expr instanceof Identificador_1.Identificador && expr.symbol.arreglo) {
                        symbol = new Simbolo_1.Simbolo(String(resultFunc.parameters[count].id), resultFunc.parameters[count].tipo, true, this.fila, this.columna, valueExpr);
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
        throw new Error("Method not implemented LLAMADA.");
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

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Simbolo":57,"../TablaSimbolos/TablaSimbolos":58,"../TablaSimbolos/Tipo":59,"./Identificador":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Retorno_1 = require("../../G3D/Retorno");
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
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //      :::::::::::::::::::::    EJECUTAR      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //      :::::::::::::::::::::    C3D      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    translate3d(table, tree) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        if (this.expU == false) {
            valor_exp1 = this.exp1.translate3d(table, tree);
            valor_exp2 = this.exp2.translate3d(table, tree);
        }
        else {
            valor_expU = this.exp1.translate3d(table, tree);
        }
        switch (this.operador) {
            case Tipo_1.OperadorAritmetico.MAS:
                // console.log("entre a suma");
                return this.suma3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorAritmetico.MENOS:
                return this.resta3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorAritmetico.POR:
                return this.multiplicacion3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorAritmetico.DIV:
                return this.divicion3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorAritmetico.POT:
                return this.potencia(valor_exp1, valor_exp2);
            case Tipo_1.OperadorAritmetico.MOD:
                return this.modulo3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorAritmetico.UMENOS:
                return this.unario3D(valor_expU, tree);
            default:
                //Se produjo un error inesperado
                break;
        }
    }
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::::::    Aritmeticas C3D      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    suma3D(valor_exp1, valor_exp2, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        let tempAux;
        switch (valor_exp1.tipo) {
            case Tipo_1.TIPO.DECIMAL:
                switch (valor_exp2.tipo) {
                    case Tipo_1.TIPO.DECIMAL:
                        genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '+');
                        return new Retorno_1.Retorno(temp, true, valor_exp2.tipo);
                    case Tipo_1.TIPO.ENTERO:
                        genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '+');
                        return new Retorno_1.Retorno(temp, true, valor_exp2.tipo);
                    case Tipo_1.TIPO.CADENA:
                        let tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('nativa_concat_int_str');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
                    case Tipo_1.TIPO.BOOLEANO:
                    default:
                        break;
                }
                break;
            case Tipo_1.TIPO.ENTERO:
                switch (valor_exp2.tipo) {
                    case Tipo_1.TIPO.DECIMAL:
                        genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '+');
                        return new Retorno_1.Retorno(temp, true, valor_exp2.tipo);
                    case Tipo_1.TIPO.ENTERO:
                        genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '+');
                        return new Retorno_1.Retorno(temp, true, valor_exp2.tipo);
                    case Tipo_1.TIPO.CADENA:
                        let tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('nativa_concat_int_str');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
                    case Tipo_1.TIPO.BOOLEANO:
                    default:
                        break;
                }
                break;
            case Tipo_1.TIPO.CADENA:
                switch (valor_exp2.tipo) {
                    case Tipo_1.TIPO.DECIMAL:
                        tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('nativa_concat_str_int');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
                    case Tipo_1.TIPO.ENTERO:
                        tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('nativa_concat_str_int');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
                    case Tipo_1.TIPO.CADENA:
                        tempAux = genc3d.newTemp();
                        genc3d.freeTemp(tempAux);
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('nativa_concat_str_str');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
                    case Tipo_1.TIPO.BOOLEANO:
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }
    potencia(valor_exp1, valor_exp2) {
        if (typeof valor_exp1 == 'number') {
            if (typeof valor_exp2 == 'number') {
                return Math.pow(valor_exp1, valor_exp2);
            }
            else if (typeof valor_exp2 == 'boolean') {
                //Error semantico
            }
            else if (typeof valor_exp2 == 'string') {
                //Erroro semantico
            }
        }
        else if (typeof valor_exp1 == 'boolean') {
            //Erro semantico
        }
        else if (typeof valor_exp1 == 'string') {
            // Error semantico
        }
    }
    resta3D(valor_exp1, valor_exp2, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '-');
                return new Retorno_1.Retorno(temp, true, valor_exp2.tipo);
            }
        }
    }
    multiplicacion3D(valor_exp1, valor_exp2, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '*');
                return new Retorno_1.Retorno(temp, true, valor_exp2.tipo);
            }
        }
    }
    divicion3D(valor_exp1, valor_exp2, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                genc3d.gen_Exp(temp, valor_exp1.translate3d(), valor_exp2.translate3d(), '/');
                return new Retorno_1.Retorno(temp, true, valor_exp2.tipo);
            }
        }
    }
    modulo3D(valor_exp1, valor_exp2, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                genc3d.gen_Code(temp + ' = fmod(' + valor_exp1.translate3d() + ',' + valor_exp2.translate3d() + ');');
                return new Retorno_1.Retorno(temp, true, valor_exp2.tipo);
            }
        }
    }
    unario3D(valor_exp1, tree) {
        const genc3d = tree.generadorC3d;
        const temp = genc3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            genc3d.gen_Exp(temp, valor_exp1.translate3d(), '-1', '*');
            return new Retorno_1.Retorno(temp, true, valor_exp1.tipo);
        }
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
}
exports.Aritmetica = Aritmetica;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../G3D/Retorno":22,"../../TablaSimbolos/Tipo":59}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logica = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Errores_1 = require("../../Ast/Errores");
const Retorno_1 = require("../../G3D/Retorno");
const Aritmeticas_1 = require("./Aritmeticas");
const Relacionales_1 = require("./Relacionales");
class Logica {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = null;
        this.lblFalse = "";
        this.lblTrue = "";
    }
    limpiar() {
        this.lblFalse = '';
        this.lblTrue = '';
        if (this.expU == false) {
            if (this.exp1 instanceof Aritmeticas_1.Aritmetica || this.exp1 instanceof Logica || this.exp1 instanceof Relacionales_1.Relacional) {
            }
            this.exp1.limpiar();
            this.exp2.limpiar();
        }
        else {
            this.exp1.limpiar();
        }
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
                    return new Errores_1.Errores("Semantico", "Logica -NOT- El tipo no coincide ", this.fila, this.columna);
                }
            default:
                break;
        }
    }
    translate3d(table, tree) {
        switch (this.operador) {
            case Tipo_1.OperadorLogico.AND:
                return this.and3D(table, tree);
            case Tipo_1.OperadorLogico.NOT:
                break;
            case Tipo_1.OperadorLogico.OR:
                return this.or3D(table, tree);
            default:
                break;
        }
    }
    and3D(table, tree) {
        const gen3d = tree.generadorC3d;
        // validando undefined
        // if ()
        this.lblTrue = this.lblTrue == '' ? gen3d.newLabel() : this.lblTrue;
        this.lblFalse = this.lblFalse == '' ? gen3d.newLabel() : this.lblFalse;
        // console.log(this.exp1.lblTrue)
        // console.log(this.exp1.lblFalse)
        this.exp1.lblTrue = gen3d.newLabel();
        this.exp2.lblTrue = this.lblTrue;
        this.exp1.lblFalse = this.exp2.lblFalse = this.lblFalse;
        // gen3d.gen_Goto(this.exp1.lblFalse);
        const expIzq = this.exp1.translate3d(table, tree);
        // gen3d.gen_Goto(this.exp1.lblTrue);
        gen3d.gen_Label(this.exp1.lblTrue);
        const expDer = this.exp2.translate3d(table, tree);
        if (expIzq.tipo !== Tipo_1.TIPO.BOOLEANO && expDer.tipo !== Tipo_1.TIPO.BOOLEANO) {
            return;
        }
        const retorno = new Retorno_1.Retorno("", false, Tipo_1.TIPO.BOOLEANO);
        retorno.lblTrue = this.lblTrue;
        retorno.lblFalse = this.exp2.lblFalse;
        return retorno;
    }
    or3D(table, tree) {
        const gen3d = tree.generadorC3d;
        this.lblTrue = this.lblTrue == '' ? gen3d.newLabel() : this.lblTrue;
        this.lblFalse = this.lblFalse == '' ? gen3d.newLabel() : this.lblFalse;
        this.exp1.lblTrue = this.exp2.lblTrue = this.lblTrue;
        this.exp1.lblFalse = gen3d.newLabel();
        this.exp2.lblFalse = this.lblFalse;
        const expIzq = this.exp1.translate3d(table, tree);
        gen3d.gen_Label(this.exp1.lblFalse);
        const expDer = this.exp2.translate3d(table, tree);
        if (expIzq.tipo == Tipo_1.TIPO.BOOLEANO && expDer.tipo == Tipo_1.TIPO.BOOLEANO) {
            const retorno = new Retorno_1.Retorno('', false, Tipo_1.TIPO.BOOLEANO);
            retorno.lblTrue = this.lblTrue;
            retorno.lblFalse = this.exp2.lblFalse;
            return retorno;
        }
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../G3D/Retorno":22,"../../TablaSimbolos/Tipo":59,"./Aritmeticas":14,"./Relacionales":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relacional = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Retorno_1 = require("../../G3D/Retorno");
class Relacional {
    constructor(exp1, operador, exp2, fila, columna, expU) {
        this.exp1 = exp1;
        this.operador = operador;
        this.exp2 = exp2;
        this.fila = fila;
        this.columna = columna;
        this.expU = expU;
        this.tipo = Tipo_1.TIPO.BOOLEANO;
        this.lblTrue = "";
        this.lblFalse = "";
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
    limpiar() {
        this.lblFalse = '';
        this.lblTrue = '';
        if (this.expU == false) {
            this.exp1.limpiar();
            this.exp2.limpiar();
        }
        else {
            this.exp1.limpiar();
        }
    }
    translate3d(table, tree) {
        // this.limpiar()
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        if (this.expU == false) {
            valor_exp1 = this.exp1.translate3d(table, tree);
            valor_exp2 = this.exp2.translate3d(table, tree);
        }
        else {
            valor_expU = this.exp1.translate3d(table, tree);
        }
        switch (this.operador) {
            case Tipo_1.OperadorRelacional.IGUALIGUAL:
                return this.igualigual3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorRelacional.DIFERENTE:
                return this.diferente3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorRelacional.MENORQUE:
                return this.menorque3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorRelacional.MENORIGUAL:
                return this.menorigual3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorRelacional.MAYORQUE:
                return this.mayorque3D(valor_exp1, valor_exp2, tree);
            case Tipo_1.OperadorRelacional.MAYORIGUAL:
                return this.mayoigual3D(valor_exp1, valor_exp2, tree);
            default:
                break;
        }
    }
    igualigual3D(valor_exp1, valor_exp2, tree) {
        const genC3d = tree.generadorC3d;
        const temp = genC3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                return this.compararExp(valor_exp1, valor_exp2, tree, '==');
            }
        }
        else {
            if (valor_exp1.tipo == Tipo_1.TIPO.CADENA) {
                if (valor_exp2.tipo == Tipo_1.TIPO.CADENA) {
                    const tempAux = genC3d.newTemp();
                    genC3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                    genC3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                    genC3d.gen_Exp(tempAux, tempAux, '1', '+');
                    genC3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                    genC3d.gen_NextEnv(1);
                    genC3d.gen_Call('natCompararIgualStr');
                    genC3d.gen_GetStack(temp, 'p');
                    genC3d.gen_AntEnv(1);
                    this.lblTrue = this.lblTrue == '' ? genC3d.newLabel() : this.lblTrue;
                    // console.log(this.lblTrue)
                    this.lblFalse = this.lblFalse == '' ? genC3d.newLabel() : this.lblFalse;
                    // console.log(this.lblFalse)
                    genC3d.gen_If(temp, '1', '==', this.lblTrue);
                    genC3d.gen_Goto(this.lblFalse);
                    const retorno = new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.BOOLEANO);
                    retorno.lblTrue = this.lblTrue;
                    retorno.lblFalse = this.lblFalse;
                    return retorno;
                }
            }
        }
    }
    menorque3D(valor_exp1, valor_exp2, tree) {
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                return this.compararExp(valor_exp1, valor_exp2, tree, '<');
            }
        }
    }
    menorigual3D(valor_exp1, valor_exp2, tree) {
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                return this.compararExp(valor_exp1, valor_exp2, tree, '<=');
            }
        }
    }
    mayorque3D(valor_exp1, valor_exp2, tree) {
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                return this.compararExp(valor_exp1, valor_exp2, tree, '>');
            }
        }
    }
    mayoigual3D(valor_exp1, valor_exp2, tree) {
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                return this.compararExp(valor_exp1, valor_exp2, tree, '>=');
            }
        }
    }
    diferente3D(valor_exp1, valor_exp2, tree) {
        const genC3d = tree.generadorC3d;
        const temp = genC3d.newTemp();
        if (valor_exp1.tipo == Tipo_1.TIPO.DECIMAL || valor_exp1.tipo == Tipo_1.TIPO.ENTERO) {
            if (valor_exp2.tipo == Tipo_1.TIPO.DECIMAL || valor_exp2.tipo == Tipo_1.TIPO.ENTERO) {
                return this.compararExp(valor_exp1, valor_exp2, tree, '!=');
            }
        }
        else {
            if (valor_exp1.tipo == Tipo_1.TIPO.CADENA) {
                if (valor_exp2.tipo == Tipo_1.TIPO.CADENA) {
                    const tempAux = genC3d.newTemp();
                    genC3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                    genC3d.gen_SetStack(tempAux, valor_exp1.translate3d());
                    genC3d.gen_Exp(tempAux, tempAux, '1', '+');
                    genC3d.gen_SetStack(tempAux, valor_exp2.translate3d());
                    genC3d.gen_NextEnv(1);
                    genC3d.gen_Call('natCompararIgualStr');
                    genC3d.gen_GetStack(temp, 'p');
                    genC3d.gen_AntEnv(1);
                    this.lblTrue = this.lblTrue == '' ? genC3d.newLabel() : this.lblTrue;
                    this.lblFalse = this.lblFalse == '' ? genC3d.newLabel() : this.lblFalse;
                    genC3d.gen_If(temp, '1', '!=', this.lblTrue);
                    genC3d.gen_Goto(this.lblFalse);
                    const ret = new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.BOOLEANO);
                    ret.lblTrue = this.lblTrue;
                    ret.lblFalse = this.lblFalse;
                    return ret;
                }
            }
        }
    }
    compararExp(valor_exp1, valor_exp2, tree, signo) {
        const genC3d = tree.generadorC3d;
        this.lblTrue = this.lblTrue == '' ? genC3d.newLabel() : this.lblTrue;
        this.lblFalse = this.lblFalse == '' ? genC3d.newLabel() : this.lblFalse;
        genC3d.gen_If(valor_exp1.translate3d(), valor_exp2.translate3d(), signo, this.lblTrue);
        genC3d.gen_Goto(this.lblFalse);
        const ret = new Retorno_1.Retorno('', false, Tipo_1.TIPO.BOOLEANO);
        ret.lblTrue = this.lblTrue;
        ret.lblFalse = this.lblFalse;
        return ret;
    }
}
exports.Relacional = Relacional;

},{"../../Ast/Nodo":7,"../../G3D/Retorno":22,"../../TablaSimbolos/Tipo":59}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Tipo_1 = require("../TablaSimbolos/Tipo");
const Nodo_1 = require("../Ast/Nodo");
const Retorno_1 = require("../G3D/Retorno");
class Primitivo {
    constructor(valor, tipo, fila, columna) {
        this.valor = valor;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.lblFalse = "";
        this.lblTrue = "";
    }
    ejecutar(table, tree) {
        return this.valor;
    }
    translate3d(table, tree) {
        let valor = this.ejecutar(table, tree);
        const genc3d = tree.generadorC3d;
        switch (this.tipo) {
            case Tipo_1.TIPO.ENTERO:
                return new Retorno_1.Retorno(this.valor, false, Tipo_1.TIPO.ENTERO);
            case Tipo_1.TIPO.DECIMAL:
                // genc3d.gen_Comment('--------- INICIA RECORRE NUMERO ---------');
                return new Retorno_1.Retorno(this.valor, false, Tipo_1.TIPO.DECIMAL);
            case Tipo_1.TIPO.CADENA:
                const temp = genc3d.newTemp();
                genc3d.genAsignaTemp(temp, 'h');
                genc3d.gen_Comment('--------- INICIA RECORRE CADENA ');
                for (let i = 0; i < valor.length; i++) {
                    genc3d.gen_SetHeap('h', valor.charCodeAt(i));
                    genc3d.nextHeap();
                }
                genc3d.gen_Comment('--------- FIN RECORRE CADENA ');
                genc3d.gen_SetHeap('h', '-1');
                genc3d.nextHeap();
                return new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.CADENA);
            case Tipo_1.TIPO.CHARACTER:
                genc3d.gen_Comment('--------- PRIMITIVO: CHAR');
                const temp2 = genc3d.newTemp();
                genc3d.genAsignaTemp(temp2, 'h');
                genc3d.gen_SetHeap('h', valor.charCodeAt(0));
                genc3d.nextHeap();
                genc3d.gen_SetHeap('h', '-1');
                genc3d.nextHeap();
                return new Retorno_1.Retorno(temp2, true, Tipo_1.TIPO.CHARACTER);
            // return new Retorno(this.valor, false, TIPO.CHARACTER);
            case Tipo_1.TIPO.BOOLEANO:
                // genc3d.gen_Comment('--------- INICIA RECORRE BOOL ---------');
                this.lblTrue = this.lblTrue == '' ? tree.generadorC3d.newLabel() : this.lblTrue;
                this.lblFalse = this.lblFalse == '' ? tree.generadorC3d.newLabel() : this.lblFalse;
                this.valor ? tree.generadorC3d.gen_Goto(this.lblTrue) : tree.generadorC3d.gen_Goto(this.lblFalse);
                let retornar = new Retorno_1.Retorno("", false, Tipo_1.TIPO.BOOLEANO);
                retornar.lblTrue = this.lblTrue;
                retornar.lblFalse = this.lblFalse;
                return retornar;
            case Tipo_1.TIPO.NULO:
                return new Retorno_1.Retorno("-1", false, Tipo_1.TIPO.NULO);
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("PRIMITIVO", "");
        padre.addChildNode(new Nodo_1.Nodo(this.valor.toString(), ""));
        return padre;
    }
}
exports.Primitivo = Primitivo;

},{"../Ast/Nodo":7,"../G3D/Retorno":22,"../TablaSimbolos/Tipo":59}],18:[function(require,module,exports){
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
        throw new Error("Method not implemented ACCSTRC.");
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../Instrucciones/Struct/Struct":52,"../../TablaSimbolos/TablaSimbolos":58,"../../TablaSimbolos/Tipo":59,"../Identificador":12}],19:[function(require,module,exports){
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
        throw new Error("Method not implemented TERNARIO.");
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

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../TablaSimbolos/Tipo":59}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneradorC3D = void 0;
const Nativas_1 = require("./Nativas");
class GeneradorC3D {
    /**
     * SINGLETON
     */
    constructor() {
        this.isFunc = '';
        this.temporal = this.label = 0;
        this.code = [];
        this.codeFuncion = [];
        this.tempStorage = new Set();
    }
    agregarFuncion(funcion) {
        funcion.forEach((fun) => {
            this.codeFuncion.push(fun);
        });
    }
    /**
     * @method static gET INSTANCIA
     * @returns Retorna esta misma intanca (SINGLETON)
     */
    static getInstancia() {
        return this.generador || (this.generador = new this());
    }
    /**
     *
     * @returns Retorna Temp Storage, temporales usados
     */
    getTempStorage() {
        return this.tempStorage;
    }
    /**
     * limpia todos los temporales
     * @method clearTempStorage
     */
    clearTempStorage() {
        this.tempStorage.clear();
    }
    /**
     * Asinacion del set al set local de temporales
     * @param tempStorage lista :Set<string>   se asigna al set local
     */
    setTempStorage(tempStorage) {
        this.tempStorage = tempStorage;
    }
    /**
     * @method clearCode
     * Borra todo el C3D
     * Se borra temporalses, code, code de FUnciones, y el TempSotarage
     */
    clearCode() {
        this.temporal = this.label = 0;
        this.code = [];
        this.codeFuncion = [];
        this.tempStorage = new Set();
    }
    /**
     * @method clearSoloCode
     * Borra todo el codigo guardado en this.code
     */
    clearSoloCode() {
        this.code = [];
    }
    /**
     * @method GenerarCode genCode
     * Ingresa en el C3D el valor que se asigna como parametro
     * @param code se inserta en el array code[]
     */
    gen_Code(code) {
        this.code.push(this.isFunc + code);
    }
    /**
     * Retorna el C3D que se haya generado en la clase singleton
     */
    /**
     * @method ObtenerCode
     * @returns Devuelve un String con  todo el c3d
     */
    getCode() {
        let nativas = new Nativas_1.Nativas();
        let encabezado = '#include <stdio.h>\n#include <math.h>\ndouble Stack[30101999]; double Heap[30101999];\nint p; int h;\n';
        let main = `\nint main() {\n${this.code.join('\n')}\n\nreturn 0;\n}\n`;
        const funciones = this.codeFuncion.join('\n');
        this.code = [];
        let strNativas = nativas.generarNativas();
        //strNativas = ''; // comentar despues de terminar
        let c3d = `${encabezado}${this.getTemps()};\n${strNativas}\n${funciones}\n${main}`;
        return c3d;
    }
    /**
     * @method getOnlyCode
     * @returns  obtiene solo el code
     */
    getOnlyCode() {
        return this.code;
    }
    /**
     * @method setOnlyCode
     * @param codeA obtieen string[]
     */
    setOnlyCode(codeA) {
        this.code = codeA;
    }
    /**
     * @method getCodeNativas getNativas
     * @returns  el codigo como string,. concatenado
     */
    getCodeNativas() {
        return this.code.join('\n');
    }
    /**
     * @method getTemps getTemporales
     * @returns todas las temporales concatenadas String
     */
    getTemps() {
        let lista = 'double ';
        for (let i = 0; i < this.temporal; i++) {
            lista += 'T' + i;
            lista += i < this.temporal - 1 ? ',' : '';
        }
        return lista;
    }
    /**
     * @method newTemp newTemporal
     * @returns Crea un nuevo temporal : String
     */
    newTemp() {
        const temp = 'T' + this.temporal++;
        this.tempStorage.add(temp);
        return temp;
    }
    /**
     * @method newLabel
     * @returns Nuevo label : string
     */
    newLabel() {
        return 'L' + this.label++;
    }
    /**
     * @method gen_Label genLabel
     * agrega una nueva etiqueta el C3D
     * @param label : string > se agrega etiqueta al c3d
     */
    gen_Label(label) {
        // si es funcion lo agrega con el label
        this.code.push(`${this.isFunc}${label}:`);
    }
    /**
     * @method gen_Exp genExpresion
     * Genera una nueva expresion y la agrega al C3D
     * @param tem Temporal al que se le asignara la expresion
     * @param izq Expresion izquierda que se asignara al temporal
     * @param der Expresion derecha que se asignara al temporal
     * @param operator Operador de la expresion
     */
    gen_Exp(tem, iqz, der = '', operator = '') {
        this.code.push(`${this.isFunc}${tem} = ${iqz} ${operator} ${der};`);
    }
    /**
     * @method genAsignaTemp genAsignacion
     * Asigna un valor a un temporal
     * @param tem variable que recibira el parametro valor
     * @param val valor a asignar
     */
    genAsignaTemp(tem, val) {
        this.code.push(`${this.isFunc}${tem} = ${val};`);
    }
    /**
     * @method gen_Goto genGoto
     * genera un goto con el valor de label
     * Agrega al c3d
     * @param label etiqueta a donde redirigira el goto
     */
    gen_Goto(label) {
        this.code.push(`${this.isFunc}goto ${label};`);
    }
    /**
     * @method gen_If genIf
     * Genera  if -> lo agrega al C3D
     * @param izq EXPR izq de la condicion if
     * @param der EXPR der de la condicion if
     * @param op Operador boleano -> condicion
     * @param label Etiqueta de salto si la condicion es TRUE
     */
    gen_If(izq, der, op, label) {
        this.code.push(`${this.isFunc}if (${izq} ${op} ${der}) goto ${label};`);
    }
    /**
     * @method nextHeap avanzarHeap
     * Avanza el puntero heap a la posicion sigujiente
     */
    nextHeap() {
        this.code.push(this.isFunc + 'h = h + 1;');
    }
    /**
     * @method gen_GetHeap genGetHeap
     * genera /> acceso al heap en la posicion index
     * asigna al tem
     * @param temp temporal que recibira el valor del heap
     * @param index posicion del heap al cual se accedera
     */
    gen_GetHeap(temp, index) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}${temp} = Heap[${index}];`);
    }
    /**
     * @method gen_SetHeap genSetHeap
     * genera una asignacion de valor al heap en la posicion index
     * @param index posicion del heap al cual se desea acceder
     * @param valor valor que se asignara a la posicion del heap
     */
    gen_SetHeap(index, valor) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}Heap[${index}] = ${valor};`);
    }
    /**
     * @method gen_GetStack genGetStack
     * genera una asignacion a tem del valor del stack en la posicion index
     * @param temp temporal al cual se asignara el valor del stack
     * @param index posicion del stack al cual se desea acceder
     */
    gen_GetStack(temp, index) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}${temp} = Stack[${index}];`);
    }
    /**
     * @method gen_SetStack genSetStack
     * genera una asignacion al stack en la posicion index
     * @param index posicion del stack al cual se desea acceder
     * @param value valor que sera asignado al stack
     */
    gen_SetStack(index, value) {
        index = index[0] === 'T' ? '(int)' + index : index;
        this.code.push(`${this.isFunc}Stack[${index}] = ${value};`);
    }
    /**
     * @method gen_NextEnv genNextEnv
     * genera un desplazamiento del stack para generar un nuevo ambito
     * @param size posiciones que se desplazara el stack
     */
    gen_NextEnv(size) {
        this.code.push(`${this.isFunc}p = p + ${size};`);
    }
    /**
     * @method gen_AntEnv genAntEnv
     * genera un desplazamiento del stack para volver a un ambito anterios
     * @param size posiciones que se desplazara el stack
     */
    gen_AntEnv(size) {
        this.code.push(`${this.isFunc}p = p - ${size};`);
    }
    /**
     * @method gen_Call genCall
     * genera una llamada a una funcion
     * @param id nombre de la funcion
     */
    gen_Call(id) {
        this.code.push(`${this.isFunc}${id}();`);
    }
    /**
     * @method gen_Funcion genFuncion
     * Genera el encabezado de una funcion
     * @param id nombre de la funcion
     */
    gen_Funcion(id) {
        this.code.push(`\nvoid ${id}() {`);
    }
    /**
     * @method gen_EndFunction  genEndFuncion
     * Genera el cierre de la definicion de una funcion
     */
    gen_EndFunction() {
        this.code.push('}');
    }
    /**
     * @method gen_Print genPrint
     * genera un printf con el tipo de dato y el valor
     * @param formato tipo de dato que se va a imprimir
     * @param valor valor que se va a imprimir
     */
    gen_Print(formato, valor) {
        valor = valor[0] === 'T' && formato !== 'f' ? '(int)' + valor : valor;
        this.code.push(`${this.isFunc}printf("%${formato}",${valor});`);
    }
    /**
     * @method gen_PrintTrue genPrintTrue
     * genera un print del valor true
     */
    gen_PrintTrue() {
        this.gen_Print('c', 't'.charCodeAt(0));
        this.gen_Print('c', 'r'.charCodeAt(0));
        this.gen_Print('c', 'u'.charCodeAt(0));
        this.gen_Print('c', 'e'.charCodeAt(0));
    }
    /**
     * @method gen_PrintFalse gen_PrintFalse
     * genera un print del valor false
     */
    gen_PrintFalse() {
        this.gen_Print('c', 'f'.charCodeAt(0));
        this.gen_Print('c', 'a'.charCodeAt(0));
        this.gen_Print('c', 'l'.charCodeAt(0));
        this.gen_Print('c', 's'.charCodeAt(0));
        this.gen_Print('c', 'e'.charCodeAt(0));
    }
    /**
     * @method gen_PrintNull gen_PrintNull
     * genera un print del valor null
     */
    gen_PrintNull() {
        this.gen_Print('c', 'n'.charCodeAt(0));
        this.gen_Print('c', 'u'.charCodeAt(0));
        this.gen_Print('c', 'l'.charCodeAt(0));
        this.gen_Print('c', 'l'.charCodeAt(0));
    }
    /**
     * @method gen_Comment genComentario
     *
     * @param comment  comentario
     */
    gen_Comment(comment) {
        this.code.push(`${this.isFunc}// ----- ${comment} -----`);
    }
    /**
     * @method freeTemp freeTemp
     * libera temp del storage
     * @param temp temporal a liberar
     */
    freeTemp(temp) {
        if (this.tempStorage.has(temp)) {
            this.tempStorage.delete(temp);
        }
    }
    /**
     * @method gen_Temp genTemp
     * agrega un temporal al storage
     * @param temp temporal que se agregara al storage
     */
    gen_Temp(temp) {
        if (!this.tempStorage.has(temp))
            this.tempStorage.add(temp);
    }
}
exports.GeneradorC3D = GeneradorC3D;

},{"./Nativas":21}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nativas = void 0;
const GeneradorC3D_1 = require("./GeneradorC3D");
class Nativas {
    generarNativas() {
        this.natPrintStr();
        this.natCompararIgualStr();
        this.natConcatStr();
        this.natConcatInt_str();
        this.natConcatStr_int();
        this.natPrintInteger();
        //this.natCompararNoIgualStr();
        //this.natUpperCase();
        //this.natLowerCase();
        //this.natConcatDbl_str();
        //  this.natConcatStr_dbl();
        //this.natConcatStr_bol();
        // this.natConcatBol_str();
        //this.natLenghtStr();
        return GeneradorC3D_1.GeneradorC3D.getInstancia().getCodeNativas();
    }
    natLenghtStr() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let next = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natLenghtStr');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t0, 'p', '1', '+');
        genC3d.gen_GetStack(t1, t0);
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Label(next);
        genC3d.gen_GetHeap(t2, t1);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_Exp(t3, t3, '1', '+');
        genC3d.gen_Exp(t1, t1, '1', '+');
        genC3d.gen_Goto(next);
        genC3d.gen_Label(fin);
        genC3d.gen_SetStack('p', t3);
        genC3d.gen_Code('return;');
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t0);
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
    }
    natPrintStr() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let next = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natPrintStr');
        genC3d.isFunc = '\t';
        genC3d.gen_GetStack(t1, 'p');
        genC3d.gen_Label(next);
        genC3d.gen_GetHeap(t2, t1);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_Print('c', t2);
        genC3d.gen_Exp(t1, t1, '1', '+');
        genC3d.gen_Goto(next);
        genC3d.gen_Label(fin);
        genC3d.gen_Code('return;');
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
    }
    natPrintInteger() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let nextPrt = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natPrintInteger');
        genC3d.isFunc = '\t';
        genC3d.gen_GetStack(t1, 'p');
        genC3d.gen_If(t1, '0', '>=', inicio);
        genC3d.gen_Print('c', '45');
        genC3d.gen_Exp(t1, t1, '-1', '*');
        genC3d.gen_Label(inicio);
        genC3d.genAsignaTemp(t3, 'p');
        genC3d.gen_SetStack(t3, '-1');
        genC3d.gen_Exp(t3, t3, '1', '+');
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(t1, '0', '==', nextPrt);
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        genC3d.gen_SetStack(t3, t2);
        genC3d.gen_Exp(t3, t3, '1', '+');
        genC3d.gen_Exp(t1, t1, '10', '/');
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(nextPrt);
        genC3d.gen_Exp(t3, t3, '1', '-');
        genC3d.gen_GetStack(t1, t3);
        genC3d.gen_If(t1, '-1', '==', fin);
        genC3d.gen_Print('i', t1);
        genC3d.gen_Goto(nextPrt);
        genC3d.gen_Label(fin);
        genC3d.gen_Code('return;');
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
    }
    natCompararIgualStr() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let c1 = genC3d.newTemp();
        let c2 = genC3d.newTemp();
        let lblfalse = genC3d.newLabel();
        let lbltrue = genC3d.newLabel();
        let l2 = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natCompararIgualStr');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t0, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t0);
        genC3d.gen_Exp(t0, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t0);
        genC3d.gen_If(p1, '-1', '==', l2);
        genC3d.gen_If(p2, '-1', '==', lblfalse);
        genC3d.gen_Goto(inicio);
        genC3d.gen_Label(l2);
        genC3d.gen_If(p2, '-1', '==', lbltrue);
        genC3d.gen_Goto(lblfalse);
        genC3d.gen_Label(inicio);
        genC3d.gen_GetHeap(c1, p1);
        genC3d.gen_GetHeap(c2, p2);
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(c1, c2, '!=', lblfalse);
        genC3d.gen_If(c1, '-1', '==', lbltrue);
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_GetHeap(c1, p1);
        genC3d.gen_GetHeap(c2, p2);
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(lbltrue);
        genC3d.gen_SetStack('p', '1');
        genC3d.gen_Goto(fin);
        genC3d.gen_Label(lblfalse);
        genC3d.gen_SetStack('p', '0');
        genC3d.gen_Label(fin);
        genC3d.gen_Code('return;');
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
        genC3d.freeTemp(c1);
        genC3d.freeTemp(c2);
    }
    natCompararNoIgualStr() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let c1 = genC3d.newTemp();
        let c2 = genC3d.newTemp();
        let lblfalse = genC3d.newLabel();
        let lbltrue = genC3d.newLabel();
        let l2 = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natCompararNoIgualStr');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.gen_If(p1, '-1', '==', l2);
        genC3d.gen_If(p2, '-1', '==', lbltrue);
        genC3d.gen_Goto(inicio);
        genC3d.gen_Label(l2);
        genC3d.gen_If(p2, '-1', '==', lblfalse);
        genC3d.gen_Goto(lbltrue);
        genC3d.gen_Label(inicio);
        genC3d.gen_GetHeap(c1, p1);
        genC3d.gen_GetHeap(c2, p2);
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(c1, c2, '!=', lbltrue);
        genC3d.gen_If(c1, '-1', '==', lblfalse);
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_GetHeap(c1, p1);
        genC3d.gen_GetHeap(c2, p2);
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(lbltrue);
        genC3d.gen_SetStack('p', '1');
        genC3d.gen_Goto(fin);
        genC3d.gen_Label(lblfalse);
        genC3d.gen_SetStack('p', '0');
        genC3d.gen_Label(fin);
        genC3d.gen_Code('return;');
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
        genC3d.freeTemp(c1);
        genC3d.freeTemp(c2);
    }
    natUpperCase() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let t4 = genC3d.newTemp();
        let nextPos = genC3d.newLabel();
        let setChar = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natUpperCase');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(t2, t1); // carga la referencia del string
        genC3d.genAsignaTemp(t3, 'h'); // inicio de posicion vacia del heap
        genC3d.gen_Label(nextPos);
        genC3d.gen_GetHeap(t4, t2);
        genC3d.gen_If(t4, '-1', '==', fin);
        genC3d.gen_If(t4, '97', '<', setChar);
        genC3d.gen_If(t4, '122', '>', setChar);
        genC3d.gen_Exp(t4, t4, '32', '-');
        genC3d.gen_Label(setChar);
        genC3d.gen_SetHeap('h', t4);
        genC3d.nextHeap();
        genC3d.gen_Exp(t2, t2, '1', '+');
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t3);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
        genC3d.freeTemp(t4);
    }
    natLowerCase() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let t4 = genC3d.newTemp();
        let nextPos = genC3d.newLabel();
        let setChar = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natLowerCase');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(t2, t1); // carga la referencia del string
        genC3d.genAsignaTemp(t3, 'h'); // inicio de posicion vacia del heap
        genC3d.gen_Label(nextPos);
        genC3d.gen_GetHeap(t4, t2);
        genC3d.gen_If(t4, '-1', '==', fin);
        genC3d.gen_If(t4, '65', '<', setChar);
        genC3d.gen_If(t4, '90', '>', setChar);
        genC3d.gen_Exp(t4, t4, '32', '+');
        genC3d.gen_Label(setChar);
        genC3d.gen_SetHeap('h', t4);
        genC3d.nextHeap();
        genC3d.gen_Exp(t2, t2, '1', '+');
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t3);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
        genC3d.freeTemp(t4);
    }
    natConcatStr() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let str1 = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natConcatStr');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t1, 'h');
        genC3d.gen_Label(str1);
        genC3d.gen_GetHeap(t2, p1);
        genC3d.gen_If(t2, '-1', '==', str2);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Goto(str1);
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p2);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t1);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    natConcatInt_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let validar = genC3d.newLabel();
        let str1 = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natConcatInt_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_If(p1, '0', '>=', inicio);
        genC3d.gen_SetHeap('h', '45');
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '-1', '*');
        genC3d.gen_Label(inicio);
        genC3d.genAsignaTemp(t1, '0');
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(p1, '0', '==', validar);
        genC3d.gen_Exp(t1, t1, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${p1}, 10);`);
        //genC3d.gen_Exp(t2, '(int)' + p1, '10', '%');
        genC3d.gen_Exp(t1, t1, t2, '+');
        genC3d.gen_Exp(p1, p1, '10', '/');
        genC3d.gen_Code(p1 + ' = (int)' + p1 + ';');
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(validar);
        genC3d.gen_If(t1, '0', '!=', str1);
        genC3d.gen_SetHeap('h', '48');
        genC3d.nextHeap();
        genC3d.gen_Label(str1);
        genC3d.gen_If(t1, '0', '==', str2);
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        //genC3d.gen_Exp(t2, '(int)' + t1, '10', '%');
        genC3d.gen_Exp(t2, t2, '48', '+');
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(t1, t1, '10', '/');
        genC3d.gen_Code(t1 + ' = (int)' + t1 + ';');
        genC3d.gen_Goto(str1);
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p2);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    natConcatStr_int() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let pre = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let validar = genC3d.newLabel();
        let str1 = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natConcatStr_int');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p1);
        genC3d.gen_If(t2, '-1', '==', pre);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(pre);
        genC3d.gen_If(p2, '0', '>=', inicio);
        genC3d.gen_SetHeap('h', '45');
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '-1', '*');
        genC3d.gen_Label(inicio);
        genC3d.genAsignaTemp(t1, '0');
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(p2, '0', '==', validar);
        genC3d.gen_Exp(t1, t1, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${p2}, 10);`);
        //genC3d.gen_Exp(t2, '(int)' + p2, '10', '%');
        genC3d.gen_Exp(t1, t1, t2, '+');
        genC3d.gen_Exp(p2, p2, '10', '/');
        genC3d.gen_Code(p2 + ' = (int)' + p2 + ';');
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(validar);
        genC3d.gen_If(t1, '0', '!=', str1);
        genC3d.gen_SetHeap('h', '48');
        genC3d.nextHeap();
        genC3d.gen_Label(str1);
        genC3d.gen_If(t1, '0', '==', fin);
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        //genC3d.gen_Exp(t2, '(int)' + t1, '10', '%');
        genC3d.gen_Exp(t2, t2, '48', '+');
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(t1, t1, '10', '/');
        genC3d.gen_Code(t1 + ' = (int)' + t1 + ';');
        genC3d.gen_Goto(str1);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    natConcatDbl_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let t4 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let pre = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let validar = genC3d.newLabel();
        let str1 = genC3d.newLabel();
        let strd = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natConcatDbl_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_If(p1, '0', '>=', pre);
        genC3d.gen_SetHeap('h', '45');
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '-1', '*');
        genC3d.gen_Label(pre);
        genC3d.gen_Code(`${t1} = (int)${p1};`);
        //genC3d.gen_Code(`${t2} = fmod(${p1}, 1);`);
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Label(inicio);
        genC3d.gen_If(t1, '0', '==', validar);
        genC3d.gen_Exp(t3, t3, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        genC3d.gen_Exp(t3, t3, t2, '+');
        genC3d.gen_Exp(t1, t1, '10', '/');
        genC3d.gen_Code(`${t1} = (int)${t1};`);
        genC3d.gen_Goto(inicio);
        genC3d.gen_Label(validar);
        genC3d.gen_If(t3, '0', '!=', nextPos);
        genC3d.gen_SetHeap('h', '48');
        genC3d.nextHeap();
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(t3, '0', '==', str1);
        genC3d.gen_Code(`${t1} = fmod(${t3}, 10);`);
        genC3d.gen_Exp(t3, t3, '10', '/');
        genC3d.gen_Code(`${t3} = (int)${t3};`);
        genC3d.gen_Exp(t2, t1, '48', '+');
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(str1);
        genC3d.gen_SetHeap('h', '46');
        genC3d.nextHeap();
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Code(`${t1} = fmod(${p1}, 1);`);
        genC3d.gen_Label(strd);
        genC3d.gen_If(t3, '3', '==', str2);
        genC3d.gen_Exp(t1, t1, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        genC3d.gen_Code(`${t2} = (int)${t2};`);
        genC3d.gen_Exp(t4, t2, '48', '+');
        genC3d.gen_SetHeap('h', t4);
        genC3d.nextHeap();
        genC3d.gen_Exp(t3, t3, '1', '+');
        genC3d.gen_Goto(strd);
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p2);
        genC3d.gen_If(t2, '-1', '==', fin);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
        genC3d.freeTemp(t4);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    natConcatStr_dbl() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let t2 = genC3d.newTemp();
        let t3 = genC3d.newTemp();
        let t4 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let pre = genC3d.newLabel();
        let sig = genC3d.newLabel();
        let inicio = genC3d.newLabel();
        let nextPos = genC3d.newLabel();
        let validar = genC3d.newLabel();
        let str1 = genC3d.newLabel();
        let strd = genC3d.newLabel();
        let str2 = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natConcatStr_dbl');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t2, p1);
        genC3d.gen_If(t2, '-1', '==', sig);
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(sig);
        genC3d.gen_If(p2, '0', '>=', pre);
        genC3d.gen_SetHeap('h', '45');
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '-1', '*');
        genC3d.gen_Label(pre);
        genC3d.gen_Code(`${t1} = (int)${p2};`);
        //genC3d.gen_Code(`${t2} = fmod(${p2}, 1);`);
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Label(inicio);
        genC3d.gen_If(t1, '0', '==', validar);
        genC3d.gen_Exp(t3, t3, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        genC3d.gen_Exp(t3, t3, t2, '+');
        genC3d.gen_Exp(t1, t1, '10', '/');
        genC3d.gen_Code(`${t1} = (int)${t1};`);
        genC3d.gen_Goto(inicio);
        genC3d.gen_Label(validar);
        genC3d.gen_If(t3, '0', '!=', nextPos);
        genC3d.gen_SetHeap('h', '48');
        genC3d.nextHeap();
        genC3d.gen_Label(nextPos);
        genC3d.gen_If(t3, '0', '==', str1);
        genC3d.gen_Code(`${t1} = fmod(${t3}, 10);`);
        genC3d.gen_Exp(t3, t3, '10', '/');
        genC3d.gen_Code(`${t3} = (int)${t3};`);
        genC3d.gen_Exp(t2, t1, '48', '+');
        genC3d.gen_SetHeap('h', t2);
        genC3d.nextHeap();
        genC3d.gen_Goto(nextPos);
        genC3d.gen_Label(str1);
        genC3d.gen_SetHeap('h', '46');
        genC3d.nextHeap();
        genC3d.genAsignaTemp(t3, '0');
        genC3d.gen_Code(`${t1} = fmod(${p2}, 1);`);
        genC3d.gen_Label(strd);
        genC3d.gen_If(t3, '3', '==', fin);
        genC3d.gen_Exp(t1, t1, '10', '*');
        genC3d.gen_Code(`${t2} = fmod(${t1}, 10);`);
        genC3d.gen_Code(`${t2} = (int)${t2};`);
        genC3d.gen_Exp(t4, t2, '48', '+');
        genC3d.gen_SetHeap('h', t4);
        genC3d.nextHeap();
        genC3d.gen_Exp(t3, t3, '1', '+');
        genC3d.gen_Goto(strd);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(t2);
        genC3d.freeTemp(t3);
        genC3d.freeTemp(t4);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    natConcatStr_bol() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let str1 = genC3d.newLabel();
        let bol = genC3d.newLabel();
        let lblf = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natConcatStr_bol');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_Label(str1);
        genC3d.gen_GetHeap(t1, p1);
        genC3d.gen_If(t1, '-1', '==', bol);
        genC3d.gen_SetHeap('h', t1);
        genC3d.nextHeap();
        genC3d.gen_Exp(p1, p1, '1', '+');
        genC3d.gen_Goto(str1);
        genC3d.gen_Label(bol);
        genC3d.gen_If(p2, '1', '!=', lblf);
        genC3d.gen_SetHeap('h', '116');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '114');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '117');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '101');
        genC3d.nextHeap();
        genC3d.gen_Goto(fin);
        genC3d.gen_Label(lblf);
        genC3d.gen_SetHeap('h', '102');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '97');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '108');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '115');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '101');
        genC3d.nextHeap();
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
    natConcatBol_str() {
        const genC3d = GeneradorC3D_1.GeneradorC3D.getInstancia();
        let t0 = genC3d.newTemp();
        let t1 = genC3d.newTemp();
        let p1 = genC3d.newTemp();
        let p2 = genC3d.newTemp();
        let str2 = genC3d.newLabel();
        let lblf = genC3d.newLabel();
        let fin = genC3d.newLabel();
        genC3d.gen_Funcion('natConcatBol_str');
        genC3d.isFunc = '\t';
        genC3d.gen_Exp(t1, 'p', '1', '+');
        genC3d.gen_GetStack(p1, t1);
        genC3d.gen_Exp(t1, 'p', '2', '+');
        genC3d.gen_GetStack(p2, t1);
        genC3d.genAsignaTemp(t0, 'h');
        genC3d.gen_If(p1, '1', '!=', lblf);
        genC3d.gen_SetHeap('h', '116');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '114');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '117');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '101');
        genC3d.nextHeap();
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(lblf);
        genC3d.gen_SetHeap('h', '102');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '97');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '108');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '115');
        genC3d.nextHeap();
        genC3d.gen_SetHeap('h', '101');
        genC3d.nextHeap();
        genC3d.gen_Label(str2);
        genC3d.gen_GetHeap(t1, p2);
        genC3d.gen_If(t1, '-1', '==', fin);
        genC3d.gen_SetHeap('h', t1);
        genC3d.nextHeap();
        genC3d.gen_Exp(p2, p2, '1', '+');
        genC3d.gen_Goto(str2);
        genC3d.gen_Label(fin);
        genC3d.gen_SetHeap('h', '-1');
        genC3d.nextHeap();
        genC3d.gen_SetStack('p', t0);
        genC3d.gen_EndFunction();
        genC3d.isFunc = '';
        genC3d.freeTemp(t1);
        genC3d.freeTemp(p1);
        genC3d.freeTemp(p2);
    }
}
exports.Nativas = Nativas;

},{"./GeneradorC3D":20}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retorno = void 0;
class Retorno {
    constructor(valor, istemp, tipo, simbolo = null) {
        this.valor = valor;
        this.istemp = istemp;
        this.tipo = tipo;
        this.lblTrue = this.lblFalse = '';
        this.simbolo = simbolo;
    }
    translate3d() {
        return this.valor;
    }
}
exports.Retorno = Retorno;

},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionArr = void 0;
const Errores_1 = require("../../Ast/Errores");
const Nodo_1 = require("../../Ast/Nodo");
const Copiar_1 = require("../../Expresiones/Arreglos/Copiar");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
class DeclaracionArr {
    //tipo lista_dim ID IGUAL lista_exp_arr
    constructor(tipo, dimensiones, id, expresiones, fila, columna) {
        this.arreglo = true;
        this.arr = Array();
        this.tipo = tipo;
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
        if (this.tipo == null && this.dimensiones == null) {
            // Asignando variable de tipo arreglo con su valor
            if (table.existe(this.id)) {
                // Creando arreglo
                this.tipo = table.getSymbolTabla(this.id).getTipo();
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
                    // console.log("tipo declArr: " + this.tipo);
                    if (value instanceof Errores_1.Errores) {
                        return value;
                    }
                }
                // Creando simbolo
                let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo, true, this.fila, this.columna, value);
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
            let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo, true, this.fila, this.columna, []);
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
                // console.log("tipo declArr: " + this.tipo);
                if (value instanceof Errores_1.Errores) {
                    return value;
                }
            }
            // Creando variable de tipo arreglo con su valor
            let nuevo_simb = new Simbolo_1.Simbolo(this.id.toString(), this.tipo, true, this.fila, this.columna, value);
            let result = table.setSymbolTabla(nuevo_simb);
            if (result instanceof Errores_1.Errores) {
                return result;
            }
        }
        return null;
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented DECLARR.");
    }
    recorrer(table, tree) {
        return new Nodo_1.Nodo("Modificacion Array", "");
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
                    if (dimension.tipo != this.tipo) {
                        let res = new Errores_1.Errores("Semantico", "Tipo distinto al tipo del arreglo.", this.fila, this.columna);
                        tree.Errores.push(res);
                        tree.updateConsolaPrintln(res.toString());
                    }
                    else {
                        dimension.tipo = this.tipo;
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../Expresiones/Arreglos/Copiar":10,"../../TablaSimbolos/Simbolo":57}],24:[function(require,module,exports){
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
                // console.log("TIPO mod: " + this.tipo_arr);
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
        throw new Error("Method not implemented MODARR.");
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
                let value = this.modificarDimensiones(tree, table, expresiones.slice(), arreglo[num][0], valor);
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Tipo":59}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
const Retorno_1 = require("../G3D/Retorno");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
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
        let genc3d = tree.generadorC3d;
        genc3d.gen_Comment("----------- ASIGNANDO ----------");
        let varSymb = table.getSymbolTabla(this.id);
        if (varSymb == null) {
            let error = new Errores_1.Errores("C3d ", "Asignacion " + this.id + " -No se encontro", this.fila, this.columna);
            ;
            tree.updateConsolaPrintln(error.toString());
            return error;
        }
        let retActual;
        if (varSymb.isGlobal) {
            retActual = new Retorno_1.Retorno(String(varSymb.posicion), false, varSymb.tipo, varSymb);
        }
        else {
            const temp = genc3d.newTemp();
            genc3d.gen_Exp(temp, 'p', varSymb.posicion, '+');
            retActual = new Retorno_1.Retorno(temp, true, varSymb.tipo, varSymb);
        }
        //obteniendo resultado
        let valorExp = this.expresion.translate3d(table, tree);
        if (varSymb.tipo === Tipo_1.TIPO.ENTERO && valorExp.tipo === Tipo_1.TIPO.DECIMAL)
            varSymb.tipo = valorExp.tipo;
        if ((varSymb === null || varSymb === void 0 ? void 0 : varSymb.inHeap) || (varSymb === null || varSymb === void 0 ? void 0 : varSymb.isGlobal)) {
            if (varSymb.tipo == Tipo_1.TIPO.BOOLEANO) {
                let templabel = genc3d.newLabel();
                genc3d.gen_Label(valorExp.lblTrue);
                genc3d.gen_SetHeap(retActual.valor, '1');
                genc3d.gen_Goto(templabel);
                genc3d.gen_Label(valorExp.lblFalse);
                genc3d.gen_SetHeap(retActual.valor, '0');
                genc3d.gen_Label(templabel);
            }
            else {
                genc3d.gen_SetHeap(retActual.valor, valorExp.valor);
            }
        }
        else {
            if (varSymb.tipo == Tipo_1.TIPO.BOOLEANO) {
                const templabel = genc3d.newLabel();
                genc3d.gen_Label(valorExp.lblTrue);
                genc3d.gen_SetStack(retActual.valor, '1');
                genc3d.gen_Goto(templabel);
                genc3d.gen_Label(valorExp.lblFalse);
                genc3d.gen_SetStack(retActual.valor, '0');
                genc3d.gen_Label(templabel);
            }
            else {
                genc3d.gen_SetStack(retActual.valor, valorExp.valor);
            }
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("ASIGNACION", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(this.expresion.recorrer(table, tree));
        return padre;
    }
}
exports.Asignacion = Asignacion;

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../G3D/Retorno":22,"../TablaSimbolos/Simbolo":57,"../TablaSimbolos/Tipo":59,"./Transferencia/Return":56}],26:[function(require,module,exports){
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
        throw new Error('Method not implemented DOWHILE.');
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":58,"../Transferencia/Break":54,"../Transferencia/Continuar":55,"../Transferencia/Return":56}],27:[function(require,module,exports){
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
        throw new Error('Method not implemented FOR.');
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":58,"../../TablaSimbolos/Tipo":59,"../Transferencia/Break":54,"./../Transferencia/Continuar":55,"./../Transferencia/Return":56}],28:[function(require,module,exports){
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
        throw new Error('Method not implemented FOR IN.');
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("FOR-IN", "");
        let iterador = new Nodo_1.Nodo("ITERADOR", "");
        iterador.addChildNode(new Nodo_1.Nodo(this.iterador, ""));
        let rango = new Nodo_1.Nodo("RANGO", "");
        // recorriendo rango
        if (this.rango.tipo == Tipo_1.TIPO.CADENA || this.rango instanceof Identificador_1.Identificador) {
            rango.addChildNode(this.rango.recorrer(table, tree));
        }
        else if (this.rango.tipo == Tipo_1.TIPO.ARREGLO || this.rango instanceof Array) {
            for (let r of this.rango) {
                rango.addChildNode(r.recorrer(table, tree));
            }
        }
        else if (this.rango instanceof AccesoArr_1.AccesoArr) {
            rango.addChildNode(this.rango.recorrer(table, tree));
        }
        // rango.addChildNode(this.rango.recorrer(table,tree));
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../Expresiones/Arreglos/AccesoArr":8,"../../TablaSimbolos/Simbolo":57,"../../TablaSimbolos/TablaSimbolos":58,"../../TablaSimbolos/Tipo":59,"../Transferencia/Break":54,"../Transferencia/Continuar":55,"../Transferencia/Return":56,"./../../Expresiones/Identificador":12}],29:[function(require,module,exports){
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
        let genc3d = tree.generadorC3d;
        let lbl = genc3d.newLabel();
        let entornoLocal = new TablaSimbolos_1.TablaSimbolos(table);
        genc3d.gen_Comment('------------ WHILE -----------');
        genc3d.gen_Label(lbl);
        genc3d.gen_Comment('-----Condicion');
        let condicion = this.condicion.translate3d(table, tree);
        if (condicion.tipo !== Tipo_1.TIPO.BOOLEANO) {
            let error = new Errores_1.Errores("c3d", "La condicion no  es boolean", this.fila, this.columna);
            tree.updateConsolaPrintln(error.toString());
        }
        entornoLocal.break = condicion.lblFalse;
        entornoLocal.continue = lbl;
        genc3d.gen_Label(condicion.lblTrue);
        genc3d.gen_Comment('-----End Condicion');
        for (let inst of this.lista_instrucciones) {
            inst.translate3d(entornoLocal, tree);
        }
        // this.sentencias.translate3d(entornoLocal);
        genc3d.gen_Goto(lbl);
        genc3d.gen_Label(condicion.lblFalse);
        genc3d.gen_Comment('-----------fin while -------');
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

},{"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":58,"../../TablaSimbolos/Tipo":59,"../Transferencia/Break":54,"../Transferencia/Continuar":55,"../Transferencia/Return":56,"./../../Ast/Errores":6}],30:[function(require,module,exports){
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
    /**
     *
     * @param condicion_case Condicion a evaluar en el case
     * @param lista_instrucciones Lista de instrucciones dentro del case
     * @param fila Numero de fila
     * @param columna Numero de columna
     */
    constructor(condicion_case, lista_instrucciones, fila, columna) {
        this.condicion_case = condicion_case;
        this.lista_instrucciones = lista_instrucciones;
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        // console.log("cs valcs: " + this.condicion_case);
        // console.log("cs valorsw: " + this.condicion_sw);
        if (this.condicion_sw == this.condicion_case.ejecutar(table, tree)) {
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
        // let genc3d = tree.generadorC3d;
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        if (this.condicion_sw == this.condicion_case.translate3d(table, tree)) {
            this.lista_instrucciones.forEach(instruccion => {
                let ins = instruccion.translate3d(ts_local, tree);
                if (ins instanceof Break_1.Detener || ins instanceof Return_1.Return || ins instanceof Continuar_1.Continuar) {
                    return ins;
                }
            });
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("CASE", "");
        let expresion = new Nodo_1.Nodo("EXPRESION", "");
        expresion.addChildNode(this.condicion_case.recorrer(table, tree));
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":58,"../Transferencia/Break":54,"../Transferencia/Continuar":55,"../Transferencia/Return":56}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.If = void 0;
const Retorno_1 = require("./../../G3D/Retorno");
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
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //      :::::::::::::::::::::    EJECUTAR      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::::::    C3D      :::::::::::::::::::::
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // cont = 0;
    translate3d(table, tree) {
        const genc3d = tree.generadorC3d;
        let valor_condicion = this.condicion.translate3d(table, tree);
        let lb_exit = genc3d.newLabel();
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (valor_condicion instanceof Retorno_1.Retorno) {
            // console.log("valor_condicion valor");
            // console.log(valor_condicion);
            // console.log("valor_condicion tipo");
            // console.log(valor_condicion.tipo);
            // console.log("valor_condicion istemp");
            // console.log(valor_condicion.istemp);
            if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                // if(valor_condicion.istemp){
                //     genc3d.gen_If(valor_condicion.valor, "1", "==", valor_condicion.lblTrue);
                //     genc3d.gen_Goto(valor_condicion.lblFalse);
                // }
                // console.log("ingreso a if.");
                genc3d.gen_Label(valor_condicion.lblTrue);
                this.lista_ifs.forEach(instruccion => {
                    instruccion.translate3d(ts_local, tree);
                });
                genc3d.gen_Goto(lb_exit);
                genc3d.gen_Label(valor_condicion.lblFalse);
                if (this.lista_ifelse != null) {
                    // console.log("ingreso a elseif.");
                    // let ts_local = new TablaSimbolos(table);
                    this.lista_ifelse.translate3d(table, tree);
                }
                if (this.lista_elses != null) {
                    // console.log("ingreso a else.");
                    // let ts_local = new TablaSimbolos(table);
                    // genc3d.gen_Goto(lb_exit);
                    // genc3d.gen_Label(valor_condicion.lblFalse);
                    this.lista_elses.forEach(instruccion => {
                        instruccion.translate3d(ts_local, tree);
                    });
                    genc3d.gen_Label(lb_exit);
                }
                else {
                    genc3d.gen_Label(lb_exit);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "Tipo de dato no booleano en IF", this.fila, this.columna);
            }
        }
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":58,"../Transferencia/Break":54,"../Transferencia/Continuar":55,"../Transferencia/Return":56,"./../../G3D/Retorno":22,"./../../TablaSimbolos/Tipo":59}],32:[function(require,module,exports){
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
const Retorno_1 = require("../../G3D/Retorno");
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
        const genc3d = tree.generadorC3d;
        let valor_condicion = this.condicion.translate3d(table, tree);
        let lb_exit = genc3d.newLabel();
        if (valor_condicion instanceof Errores_1.Errores) {
            tree.getErrores().push(valor_condicion);
            tree.updateConsolaPrintln(valor_condicion.toString());
        }
        if (valor_condicion instanceof Retorno_1.Retorno) {
            // console.log("valor_condicion valor");
            // console.log(valor_condicion);
            // console.log("valor_condicion tipo");
            // console.log(valor_condicion.tipo);
            // console.log("valor_condicion istemp");
            // console.log(valor_condicion.istemp);
            if (this.condicion.tipo == Tipo_1.TIPO.BOOLEANO) {
                let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
                // if(valor_condicion.istemp){
                //     genc3d.gen_If(valor_condicion.valor, "1", "==", valor_condicion.lblTrue);
                //     genc3d.gen_Goto(valor_condicion.lblFalse);
                // }
                // console.log("ingreso a if.");
                genc3d.gen_Label(valor_condicion.lblTrue);
                this.ins_ifs.translate3d(ts_local, tree);
                genc3d.gen_Goto(lb_exit);
                genc3d.gen_Label(valor_condicion.lblFalse);
                if (this.ins_elses != null) {
                    // console.log("ingreso a else.");
                    // let ts_local = new TablaSimbolos(table);
                    // genc3d.gen_Goto(lb_exit);
                    // genc3d.gen_Label(valor_condicion.lblFalse);
                    if (this.ins_elses instanceof Array) {
                        this.ins_elses.forEach(ins => {
                            ins.translate3d(ts_local, tree);
                        });
                    }
                    else {
                        this.ins_elses.translate3d(ts_local, tree);
                    }
                    genc3d.gen_Label(lb_exit);
                }
                else {
                    genc3d.gen_Label(lb_exit);
                }
            }
            else {
                return new Errores_1.Errores("Semantico", "Tipo de dato no booleano en IF", this.fila, this.columna);
            }
        }
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
        if (this.ins_elses != null && this.ins_elses instanceof Array) {
            for (let nodo of this.ins_elses) {
                padre.addChildNode(nodo.recorrer(table, tree));
            }
        }
        return padre;
    }
}
exports.Ifsinllave = Ifsinllave;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../G3D/Retorno":22,"../../TablaSimbolos/TablaSimbolos":58,"../Transferencia/Break":54,"../Transferencia/Continuar":55,"../Transferencia/Return":56,"./../../TablaSimbolos/Tipo":59}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Retorno_1 = require("./../../G3D/Retorno");
const Nodo_1 = require("../../Ast/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../Transferencia/Break");
const Return_1 = require("../Transferencia/Return");
const Errores_1 = require("../../Ast/Errores");
class Switch {
    /**
     *
     * @param condicion_sw Condicion del switch
     * @param lista_case Lista instrucciones de cases dentro del switch
     * @param lista_default Lista instrucciones en default
     * @param fila Numero de fila
     * @param columna Numero de columna
     */
    constructor(condicion_sw, lista_case, lista_default, fila, columna) {
        this.condicion_sw = condicion_sw;
        this.lista_case = lista_case;
        this.lista_default = lista_default;
        this.columna = columna;
        this.fila = fila;
    }
    ejecutar(table, tree) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        for (let case_temp of this.lista_case) {
            case_temp.condicion_sw = this.condicion_sw.ejecutar(ts_local, tree);
            if (case_temp.condicion_case instanceof Errores_1.Errores) {
                tree.getErrores().push(case_temp.condicion_case);
                tree.updateConsolaPrintln(case_temp.condicion_case.toString());
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
    /**
     * Traduce a codigo de tres direcciones
     * @param table
     * @param tree
     */
    translate3d(table, tree) {
        // console.log("this.lista_case");
        // console.log(this.lista_case);
        // console.log("this.lista_default");
        // console.log(this.lista_default);
        const genc3d = tree.generadorC3d;
        let ts_local = new TablaSimbolos_1.TablaSimbolos(table);
        const lb_exit = genc3d.newLabel();
        let tempBool = '';
        genc3d.gen_Comment('--------- INICIA SWITCH ---------');
        const condicion = this.condicion_sw.translate3d(table, tree);
        // console.log("condicion.tipo");
        // console.log(condicion.tipo);
        if (condicion.tipo === Tipo_1.TIPO.BOOLEANO) {
            // console.log("CONDICION BOOLEANA");
            const lbljump = genc3d.newLabel();
            const temp = genc3d.newTemp();
            genc3d.gen_Label(condicion.lblTrue);
            genc3d.genAsignaTemp(temp, '1');
            genc3d.gen_Goto(lbljump);
            genc3d.gen_Label(condicion.lblFalse);
            genc3d.genAsignaTemp(temp, '0');
            genc3d.gen_Label(lbljump);
            tempBool = temp;
        }
        // if(condicion.tipo !== TIPO.ENTERO && condicion.tipo !== TIPO.DECIMAL && condicion.tipo !== TIPO.BOOLEANO){
        //     return new Errores('Semantico', 'Tipo de condicion incorrecta.', this.fila, this.columna);
        // }
        genc3d.gen_Comment('--------- INICIAN CASES ');
        // this.lista_case.forEach(case_temp => {
        //     case_temp.condicion_sw = this.condicion_sw.translate3d(ts_local, tree);
        // });
        let num_default = false;
        let lb_case_true = genc3d.newLabel();
        let lb_case_false = genc3d.newLabel();
        let index_cases = 0;
        let index_default = 0;
        if (this.lista_case != null) {
            this.lista_case.forEach(ins_case => {
                ts_local.break = lb_exit;
                let res_case = ins_case.condicion_case.translate3d(ts_local, tree);
                if (res_case.tipo == Tipo_1.TIPO.BOOLEANO) {
                    genc3d.gen_Label(res_case.lblTrue);
                    genc3d.gen_If(tempBool, '1', '==', lb_case_true);
                    genc3d.gen_Goto(lb_case_false);
                    genc3d.gen_Label(res_case.lblFalse);
                    genc3d.gen_If(tempBool, '0', '==', lb_case_true);
                    genc3d.gen_Goto(lb_case_false);
                }
                else {
                    let valor_sw = condicion.translate3d();
                    let valor_cs = res_case.translate3d();
                    const temp = genc3d.newTemp();
                    if (condicion.tipo == Tipo_1.TIPO.CADENA) {
                        const tempAux = genc3d.newTemp();
                        genc3d.gen_Exp(tempAux, 'p', 1 + 1, '+');
                        genc3d.gen_SetStack(tempAux, valor_sw);
                        genc3d.gen_Exp(tempAux, tempAux, '1', '+');
                        genc3d.gen_SetStack(tempAux, valor_cs);
                        genc3d.gen_NextEnv(1);
                        genc3d.gen_Call('natCompararIgualStr');
                        genc3d.gen_GetStack(temp, 'p');
                        genc3d.gen_AntEnv(1);
                        lb_case_true = lb_case_true == '' ? genc3d.newLabel() : lb_case_true;
                        // console.log(this.lblTrue)
                        lb_case_false = lb_case_false == '' ? genc3d.newLabel() : lb_case_false;
                        // console.log(this.lblFalse)
                        genc3d.gen_If(temp, '1', '==', lb_case_true);
                        genc3d.gen_Goto(lb_case_false);
                        const retorno = new Retorno_1.Retorno(temp, true, Tipo_1.TIPO.BOOLEANO);
                        retorno.lblTrue = lb_case_true;
                        retorno.lblFalse = lb_case_false;
                    }
                    else if (condicion.tipo == Tipo_1.TIPO.CHARACTER) {
                        genc3d.gen_If(valor_sw, valor_cs, '==', lb_case_true);
                        genc3d.gen_Goto(lb_case_false);
                    }
                    else {
                        genc3d.gen_If(valor_sw, valor_cs, '==', lb_case_true);
                        genc3d.gen_Goto(lb_case_false);
                    }
                }
                genc3d.gen_Label(lb_case_true);
                ins_case.lista_instrucciones.forEach(ins_case => {
                    ins_case.translate3d(ts_local, tree);
                });
                // genc3d.gen_Goto(lb_exit);
                // console.log(Number(ins_case.lista_instrucciones));
                if (index_cases < this.lista_case.length) {
                    // console.log("Number(ins_case) < this.lista_case.length - 1")
                    lb_case_true = genc3d.newLabel();
                    genc3d.gen_Goto(lb_case_true);
                    genc3d.gen_Label(lb_case_false);
                    lb_case_false = genc3d.newLabel();
                }
                else {
                    // console.log("ELSE Number(ins_case) < this.lista_case.length - 1")
                    genc3d.gen_Label(lb_case_false);
                }
                // if(ins_case instanceof Detener || res_case instanceof Detener){
                //     x = 1;
                //     break;
                // }
                index_cases++;
            });
        }
        if (this.lista_default != null) {
            genc3d.gen_Comment('--------- INICIA DEFAULT ');
            if (num_default) {
                return new Errores_1.Errores('Semantico', 'Solamente se acepta una instruccion defaul.', this.fila, this.columna);
            }
            num_default = true;
            ts_local.break == lb_exit;
            genc3d.gen_Label(lb_case_true);
            // console.log("entro a else: ");
            // console.log(this.lista_default);
            this.lista_default.forEach(ins_default => {
                // console.log("recorriendo ins else: " + index_default);
                ins_default.translate3d(ts_local, tree);
                // if (index_default < this.lista_default.length) {
                //     lb_case_true = genc3d.newLabel();
                //     genc3d.gen_Goto(lb_case_true);
                //     lb_case_false = genc3d.newLabel();
                // }
                index_default++;
            });
        }
        genc3d.gen_Label(lb_exit);
        genc3d.gen_Comment('--------- FINALIZA SWITCH ---------');
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("SWITCH", "");
        let condicion = new Nodo_1.Nodo("CONDICION", "");
        condicion.addChildNode(this.condicion_sw.ejecutar(table, tree));
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":58,"../../TablaSimbolos/Tipo":59,"../Transferencia/Break":54,"../Transferencia/Return":56,"./../../G3D/Retorno":22}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
const Primitivo_1 = require("../Expresiones/Primitivo");
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
                if (tipo_valor == this.tipo || (this.tipo == Tipo_1.TIPO.DECIMAL && tipo_valor == Tipo_1.TIPO.ENTERO)) {
                    // console.log("entre tipo declaracion");
                    //--> Lo agregamos a la tabla de simbolos 
                    // console.log("SI tipo actual: " + tipo_valor + " tipo var es: " + this.tipo)
                    let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, valor);
                    table.setSymbolTabla(nuevo_simb);
                }
                else {
                    // console.log("errorrr tipo declaracion");
                    console.log("NO tipo actual: " + tipo_valor + " tipo var es: " + this.tipo);
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
        var _a;
        console.log("declaracion");
        const genc3d = tree.generadorC3d;
        for (let simbolo of this.simbolos) {
            let variable = simbolo;
            // console.log(variable.id)
            let valor = (_a = variable.valor) === null || _a === void 0 ? void 0 : _a.translate3d(table, tree);
            //1 Si se crea por primera vez
            if (valor == null) {
                genc3d.gen_Comment("------- Default primitivo Declaracion-------");
                if (this.tipo == Tipo_1.TIPO.DECIMAL) {
                    let primitivo = new Primitivo_1.Primitivo(0, Tipo_1.TIPO.DECIMAL, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                if (this.tipo == Tipo_1.TIPO.ENTERO) {
                    let primitivo = new Primitivo_1.Primitivo(0, Tipo_1.TIPO.ENTERO, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                if (this.tipo == Tipo_1.TIPO.CADENA) {
                    let primitivo = new Primitivo_1.Primitivo("null", Tipo_1.TIPO.CADENA, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                if (this.tipo == Tipo_1.TIPO.BOOLEANO) {
                    let primitivo = new Primitivo_1.Primitivo(false, Tipo_1.TIPO.BOOLEANO, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                if (this.tipo == Tipo_1.TIPO.CHARACTER) {
                    let primitivo = new Primitivo_1.Primitivo("0", Tipo_1.TIPO.CHARACTER, this.fila, this.columna);
                    valor = primitivo.translate3d(table, tree);
                }
                /// arreglos en clase arreglo
            }
            console.log(valor);
            console.log(this.tipo);
            if (this.tipo !== valor.tipo) {
                let error = new Errores_1.Errores("C3d ", "Declaracion " + variable.id + " -No coincide el tipo", simbolo.getFila(), simbolo.getColumna());
                tree.updateConsolaPrintln(error.toString());
                return error;
            }
            // Verificar si guardar
            let nuevo_simb = new Simbolo_1.Simbolo(variable.id, this.tipo, this.arreglo, variable.fila, variable.columna, "");
            nuevo_simb.posicion = table.size;
            console.log(nuevo_simb);
            // nuevo_simb.isRef=true;
            let res_simb = table.setSymbolTabla(nuevo_simb);
            if (res_simb instanceof Errores_1.Errores) {
                tree.updateConsolaPrintln(res_simb.toString());
                return;
            }
            genc3d.gen_Comment("------- Declarando-------");
            ///array en declaracion array
            if (nuevo_simb.isGlobal) {
                if (valor.tipo === Tipo_1.TIPO.BOOLEANO) {
                    genc3d.gen_Comment("------- is ref true-------");
                    const lbl = genc3d.newLabel();
                    genc3d.gen_Label(valor.lblTrue);
                    genc3d.gen_SetStack(nuevo_simb.posicion, '1');
                    genc3d.gen_Goto(lbl);
                    genc3d.gen_Label(valor.lblFalse);
                    genc3d.gen_SetStack(nuevo_simb.posicion, '0');
                    genc3d.gen_Label(lbl);
                }
                else
                    genc3d.gen_SetStack(nuevo_simb.posicion, valor.valor);
            }
            else {
                genc3d.gen_Comment("------- is ref false-------");
                const temp = genc3d.newTemp();
                genc3d.freeTemp(temp);
                genc3d.gen_Exp(temp, 'p', nuevo_simb.posicion, '+');
                if (valor.tipo === Tipo_1.TIPO.BOOLEANO) {
                    const lbl = genc3d.newLabel();
                    genc3d.gen_Label(valor.lblTrue);
                    genc3d.gen_SetStack(nuevo_simb.posicion, '1');
                    genc3d.gen_Goto(lbl);
                    genc3d.gen_Label(valor.lblFalse);
                    genc3d.gen_SetStack(nuevo_simb.posicion, '0');
                    genc3d.gen_Label(lbl);
                }
                else
                    genc3d.gen_SetStack(temp, valor.valor);
            }
        }
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("DECLARACION", "");
        for (let sim of this.simbolos) {
            padre.addChildNode(new Nodo_1.Nodo(sim.id, ""));
        }
        return padre;
    }
}
exports.Declaracion = Declaracion;

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../Expresiones/Primitivo":17,"../TablaSimbolos/Simbolo":57,"../TablaSimbolos/Tipo":59}],35:[function(require,module,exports){
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
        throw new Error("Method not implemented FUNCION.");
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":58,"../Transferencia/Break":54,"../Transferencia/Continuar":55,"../Transferencia/Return":56}],36:[function(require,module,exports){
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
        throw new Error("Method not implemented MAIN.");
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":58,"../Transferencia/Break":54,"../Transferencia/Continuar":55,"../Transferencia/Return":56}],37:[function(require,module,exports){
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
        throw new Error("Method not implemented POP.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("POP", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        return padre;
    }
}
exports.Pop = Pop;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7}],38:[function(require,module,exports){
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
        throw new Error("Method not implemented PUSH.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("PUSH", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(this.expresion.recorrer(table, tree));
        return padre;
    }
}
exports.Push = Push;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7}],39:[function(require,module,exports){
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
        throw new Error("Method not implemented CHAROFPOS.");
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

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":59}],40:[function(require,module,exports){
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
        throw new Error("Method not implemented SUBSTRING.");
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

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":59}],41:[function(require,module,exports){
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
        throw new Error("Method not implemented TOLOW.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("toLower", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.toLower = toLower;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":59}],42:[function(require,module,exports){
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
        throw new Error("Method not implemented TOUPP.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("toLower", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.toUpper = toUpper;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":59}],43:[function(require,module,exports){
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
        throw new Error("Method not implemented LENGTH.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Length", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        // padre.addChildNode(this.expresion.ejecutar(table,tree));
        return padre;
    }
}
exports.Length = Length;

},{"../../../Ast/Errores":6,"../../../Ast/Nodo":7,"../../../TablaSimbolos/Tipo":59}],44:[function(require,module,exports){
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
                        return Math.sin(valor * Math.PI / 180);
                    case "cos":
                        return Math.cos(valor * Math.PI / 180);
                    case "tan":
                        return Math.tan(valor * Math.PI / 180);
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

},{"../../../Ast/Errores":6,"../../../Ast/Nodo":7,"./../../../Expresiones/Identificador":12}],45:[function(require,module,exports){
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
        throw new Error("Method not implemented PARSE.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Parse", "");
        padre.addChildNode(new Nodo_1.Nodo(this.id, ""));
        padre.addChildNode(this.parameters.recorrer(table, tree));
        return padre;
    }
}
exports.Parse = Parse;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7,"../../../../TablaSimbolos/Tipo":59}],46:[function(require,module,exports){
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
        throw new Error("Method not implemented TO_CONV.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("toLower", "");
        padre.addChildNode(new Nodo_1.Nodo(this.tipo_conversion.toString(), ""));
        padre.addChildNode(this.parameters.recorrer(table, tree));
        return padre;
    }
}
exports.To = To;

},{"../../../../Ast/Errores":6,"../../../../Ast/Nodo":7}],47:[function(require,module,exports){
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
        throw new Error("Method not implemented STRING_NAT.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("StringN", "");
        // padre.addChildNode(new Nodo(this.id,""));
        padre.addChildNode(this.expresion.recorrer(table, tree));
        return padre;
    }
}
exports.StringN = StringN;

},{"../../../Ast/Errores":6,"../../../Ast/Nodo":7,"../../../TablaSimbolos/Tipo":59}],48:[function(require,module,exports){
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
        throw new Error("Method not implemented TYPEOF.");
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("TypeOfN", "");
        // padre.addChildNode(new Nodo(this.id,""));
        if (this.expresion instanceof Array) {
            padre.addChildNode(new Nodo_1.Nodo("array", ""));
        }
        else {
            padre.addChildNode(this.expresion.recorrer(table, tree));
        }
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

},{"../../../Ast/Errores":6,"../../../Ast/Nodo":7,"../../../TablaSimbolos/Tipo":59}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Errores_1 = require("../Ast/Errores");
const Nodo_1 = require("../Ast/Nodo");
const Retorno_1 = require("../G3D/Retorno");
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
        const genc3d = tree.generadorC3d;
        this.parametros.forEach(expresion => {
            let valor3d = expresion.translate3d(table, tree);
            if (valor3d instanceof Retorno_1.Retorno) {
                // console.log(valor3d)
                let temp = valor3d.translate3d();
                let t0 = genc3d.newTemp();
                if (valor3d.tipo == Tipo_1.TIPO.CADENA) {
                    genc3d.gen_Comment('--------- INICIA PRINT CADENA ---------');
                    genc3d.gen_SetStack(t0, temp);
                    genc3d.gen_Call('natPrintStr');
                    // genc3d.gen_Code('');
                    genc3d.gen_Comment('--------- FIN PRINT CADENA ---------');
                }
                if (valor3d.tipo == Tipo_1.TIPO.ENTERO) {
                    genc3d.gen_Comment('--------- INICIA PRINT INT ---------');
                    genc3d.gen_Print('i', temp);
                    genc3d.gen_Comment('--------- FIN PRINT INT ---------');
                }
                if (valor3d.tipo == Tipo_1.TIPO.CHARACTER) {
                    genc3d.gen_Comment('--------- INICIA PRINT CHAR ---------');
                    genc3d.gen_SetStack(t0, temp);
                    genc3d.gen_Call('natPrintStr');
                }
                if (valor3d.tipo == Tipo_1.TIPO.DECIMAL) {
                    genc3d.gen_Comment('--------- INICIA PRINT DOUBLE ---------');
                    genc3d.gen_Print('f', temp);
                    genc3d.gen_Comment('--------- FIN PRINT DOUBLE ---------');
                }
                if (valor3d.tipo == Tipo_1.TIPO.BOOLEANO) {
                    let salida = genc3d.newLabel();
                    genc3d.gen_Comment('--------- INICIA PRINT FALSE ---------');
                    genc3d.gen_Label(valor3d.lblFalse);
                    genc3d.gen_PrintFalse();
                    genc3d.gen_Goto(salida);
                    genc3d.gen_Comment('--------- INICIA PRINT TRUE ---------');
                    genc3d.gen_Label(valor3d.lblTrue);
                    genc3d.gen_PrintTrue();
                    genc3d.gen_Goto(salida);
                    genc3d.gen_Label(salida);
                }
            }
        });
        if (this.tipo) {
            genc3d.gen_Print('c', '10');
        }
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

},{"../Ast/Errores":6,"../Ast/Nodo":7,"../G3D/Retorno":22,"../TablaSimbolos/Simbolo":57,"../TablaSimbolos/Tipo":59,"./Transferencia/Return":56}],50:[function(require,module,exports){
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
        throw new Error("Method not implemented ASIGNVARSTRC.");
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Simbolo":57,"../../TablaSimbolos/Tipo":59,"../Asignacion":25}],51:[function(require,module,exports){
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
        throw new Error("Method not implemented DECLSTRC.");
    }
    translate3d(table, tree) {
        throw new Error("Method not implemented DECLSTRC.");
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../Expresiones/Llamada":13,"../../TablaSimbolos/Simbolo":57,"../../TablaSimbolos/TablaSimbolos":58,"../../TablaSimbolos/Tipo":59}],52:[function(require,module,exports){
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
        throw new Error("Method not implemented STRC.");
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/TablaSimbolos":58,"../../TablaSimbolos/Tipo":59,"../Arreglos/DeclaracionArr":23,"../Declaracion":34,"../Transferencia/Break":54,"../Transferencia/Continuar":55,"../Transferencia/Return":56,"./DeclararStruct":51,"./StructInStruct":53}],53:[function(require,module,exports){
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
        throw new Error("Method not implemented STRCINSTRC.");
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../TablaSimbolos/Simbolo":57,"../../TablaSimbolos/Tipo":59}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detener = void 0;
const Errores_1 = require("./../../Ast/Errores");
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
        const genc3d = tree.generadorC3d;
        if (table.break == null) {
            return new Errores_1.Errores('Semantico', 'No se permite el uso de break en la instrucción.', this.fila, this.columna);
        }
        genc3d.gen_Goto(table.break);
    }
    recorrer(table, tree) {
        let padre = new Nodo_1.Nodo("Break", "");
        return padre;
    }
}
exports.Detener = Detener;

},{"../../Ast/Nodo":7,"./../../Ast/Errores":6}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continuar = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Errores_1 = require("../../Ast/Errores");
class Continuar {
    constructor(fila, columna) {
        this.fila = fila;
        this.columna = columna;
    }
    ejecutar(table, tree) {
        return this;
    }
    translate3d(table, tree) {
        const genc3d = tree.generadorC3d;
        if (table.continue == null) {
            return new Errores_1.Errores('Semantico', 'No se permite el uso de continue en la instrucción.', this.fila, this.columna);
        }
        genc3d.gen_Goto(table.continue);
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("CONTINUE", "");
        return padre;
    }
}
exports.Continuar = Continuar;

},{"../../Ast/Errores":6,"../../Ast/Nodo":7}],56:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const Nodo_1 = require("../../Ast/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Errores_1 = require("../../Ast/Errores");
const Retorno_1 = require("../../G3D/Retorno");
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
        var _a;
        const genc3d = tree.generadorC3d;
        const valor = ((_a = this.expresion) === null || _a === void 0 ? void 0 : _a.translate3d(table, tree)) || new Retorno_1.Retorno('-1', false, Tipo_1.TIPO.VOID);
        let result_func = table.actual_funcion;
        if (valor == null) {
            return new Errores_1.Errores('Semantico', 'No se permite el uso de return en la instrucción.', this.fila, this.columna);
        }
        if (result_func.tipo == Tipo_1.TIPO.BOOLEANO) {
            const templabel = genc3d.newLabel();
            genc3d.gen_Label(valor.lblTrue);
            genc3d.gen_SetStack('p', '1');
            genc3d.gen_Goto(templabel);
            genc3d.gen_Label(valor.lblFalse);
            genc3d.gen_SetStack('p', '0');
            genc3d.gen_Label(templabel);
        }
        else if (result_func.tipo !== Tipo_1.TIPO.VOID) {
            genc3d.gen_SetStack('p', valor.getValor());
        }
        genc3d.gen_Goto(table.return || '');
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

},{"../../Ast/Errores":6,"../../Ast/Nodo":7,"../../G3D/Retorno":22,"../../TablaSimbolos/Tipo":59}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
class Simbolo {
    /**
     *
     * @param id Identificador del simbolos
     * @param tipo Tipo del simbolo
     * @param arreglo Booleano para verificar si es arreglo
     * @param fila Numero de fila
     * @param columna Numero de columna
     * @param valor Valor del simbolo
     * @param structEnv
     */
    constructor(id, tipo, arreglo, fila, columna, valor, structEnv = false) {
        this.id = id;
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
        this.valor = valor;
        this.arreglo = arreglo;
        this.structEnv = structEnv;
        this.isGlobal = false;
        this.inHeap = false;
        this.posicion = 0;
        // console.log("simbolor: "+this.valor);
    }
    setPosicion(posicion) {
        this.posicion = this.posicion;
    }
    /**
     *
     * @returns this.posicion
     */
    getPosicion() {
        return this.posicion;
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

},{}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSimbolos = void 0;
const Errores_1 = require("../Ast/Errores");
const Tipo_1 = require("./Tipo");
class TablaSimbolos {
    constructor(anterior) {
        this.anterior = anterior;
        this.tabla = new Map();
        this.size = (anterior === null || anterior === void 0 ? void 0 : anterior.size) || 0;
        this.break = (anterior === null || anterior === void 0 ? void 0 : anterior.break) || null;
        this.continue = (anterior === null || anterior === void 0 ? void 0 : anterior.continue) || null;
        this.return = (anterior === null || anterior === void 0 ? void 0 : anterior.return) || null;
        this.actual_funcion = (anterior === null || anterior === void 0 ? void 0 : anterior.actual_funcion) || null;
    }
    setSymbolTabla(simbolo) {
        if (this.existeEnActual(simbolo.id)) {
            // console.log("Entreeeeee")
            return new Errores_1.Errores("Semantico", "Variable " + simbolo.getId() + " Existe", simbolo.getFila(), simbolo.getColumna());
        }
        else {
            // this.tabla[simbolo.getId()] = simbolo;
            simbolo.setPosicion(this.size);
            this.tabla.set(simbolo.getId(), simbolo);
            this.size += 1;
            console.log("size: " + this.size);
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
     * @returns existe || null
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
    imprimirTabla() {
        let content = "";
        let cont = 1;
        // console.log("printtable");
        for (let [k, v] of this.tabla) {
            let symbol = v;
            /** DECLARACION */
            content += `
                <tr>
                <th scope="row">${cont}</th>
                <td>Declaracion</td>
                <td>Global</td>
                <td>${k}</td>
                <td>${symbol.fila}</td>
                <td>${symbol.columna}</td>
                </tr>
                `;
            cont++;
        }
        return content;
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
                    || (existe.getTipo() == Tipo_1.TIPO.STRUCT && simbolo.getTipo() == Tipo_1.TIPO.NULO)
                    || (existe.getTipo() == Tipo_1.TIPO.DECIMAL && simbolo.getTipo() == Tipo_1.TIPO.ENTERO)) //SI ENTERO VIENE A ASIGNARSE EN DECIMAL
                 {
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
    getTipoStr(tipo) {
        switch (tipo) {
            case Tipo_1.TIPO.ENTERO:
                return "int";
            case Tipo_1.TIPO.DECIMAL:
                return "double";
            case Tipo_1.TIPO.CADENA:
                return "String";
            case Tipo_1.TIPO.CHARACTER:
                return "char";
            case Tipo_1.TIPO.ARREGLO:
                return "array";
            case Tipo_1.TIPO.STRUCT:
                return "struct";
            case Tipo_1.TIPO.BOOLEANO:
                return "boolean";
            default:
                return "invalido";
        }
    }
}
exports.TablaSimbolos = TablaSimbolos;

},{"../Ast/Errores":6,"./Tipo":59}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
const { Ast } = require("./dist/Ast/Ast");
const gramatica = require("./Analizadores/gramatica");
const { Declaracion } = require("./dist/Instrucciones/Declaracion");
const { Funcion } = require("./dist/Instrucciones/Metodos/Funcion");
const { Main } = require("./dist/Instrucciones/Metodos/Main");
const { Asignacion } = require("./dist/Instrucciones/Asignacion");
const { DeclaracionArr } = require("./dist/Instrucciones/Arreglos/DeclaracionArr");
const { Struct } = require("./dist/Instrucciones/Struct/Struct");
const compilar = document.getElementById('compilarProyecto');
var myTab = document.getElementById('myTab');
var itemAbrir = document.getElementById('itemAbrir');
let result;
let entornoAnalizar;
let entornoTraducir;

var text2 = CodeMirror.fromTextArea(document.getElementById("textAreaC3d"),{
    mode: "text/x-csrc",
    theme: "night",
    lineNumbers:true,
    autoCloseBrackets: true,
    readOnly: false
});

var text = CodeMirror.fromTextArea(document.getElementById("textAreaEntrada"),{
    mode: "text/x-java",
    theme: "night",
    lineNumbers:true,
    autoCloseBrackets: true
});
text.setSize(null,520);

var cantTabs = 1;
var editor = new Editor(text);
var editor2 = new Editor(text2);
var editores = [];
editores.push(editor);
editores.push(editor2);

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
        // alert('Error al cargar Archivo.');
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al cargar Archivo.'
        });
    }

});

agregarNuevoTab.addEventListener('click', async () => {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementById('#myTab');
    tablinks = document.getElementById('#myTabContent');
    cantTabs = cantTabs + 1;

    $('#myTab').append('\
    <li class = "nav-item">\
    <a class="nav-link" bg-primary id="tab' + cantTabs + '" data-toggle="tab" href="#panel' + cantTabs + '" role="tab" aria-controls="panel' + cantTabs + '" aria-selected="false" >Tab ' + cantTabs + '</a>\
    </li>');
    $('#myTabContent').append('<div class="tab-pane fade" id="panel' + cantTabs + '" role="tabpanel" aria-labelledby="tab"' + cantTabs + '>  <div> <textarea class="form-control" rows="21" id="text' + cantTabs + '" > </textarea>  </div> </div>');

    var editorActual = CodeMirror.fromTextArea(document.getElementById('text' + cantTabs), {
        mode: "javascript",
        theme: "night",
        lineNumbers: true
    });
    editorActual.setSize(null, 520);
    var nuevoEditor = new Editor(editorActual);
    editores.push(nuevoEditor);
    
});

function addNuevoTab(){

    var i, tabcontent, tablinks;
    tabcontent = document.getElementById('#myTab');
    tablinks = document.getElementById('#myTabContent');
    cantTabs = cantTabs + 1;

    $('#myTab').append('\
    <li class = "nav-item">\
    <a class="nav-link" bg-primary id="tab' + cantTabs + '" data-toggle="tab" href="#panel' + cantTabs + '" role="tab" aria-controls="panel' + cantTabs + '" aria-selected="false" >Tab ' + cantTabs + '</a>\
    </li>');
    $('#myTabContent').append('<div class="tab-pane fade" id="panel' + cantTabs + '" role="tabpanel" aria-labelledby="tab"' + cantTabs + '>  <div> <textarea class="form-control" rows="21" id="text' + cantTabs + '" > </textarea>  </div> </div>');

    var editorActual = CodeMirror.fromTextArea(document.getElementById('text' + cantTabs), {
        mode: "javascript",
        theme: "night",
        lineNumbers: true
    });
    editorActual.setSize(null, 520);
    var nuevoEditor = new Editor(editorActual);
    editores.push(nuevoEditor);
    
};

eliminarTab.addEventListener('click', async () => {


    if( cantTabs == 1 ){
        // alert('No se puede eliminar todas las pestañas de trabajo.')
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se puede eliminar todas las pestañas de trabajo.'
        });
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
});

limpiarTab.addEventListener('click', async () => {

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
    
});

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
        entornoAnalizar = result.TSglobal;
        let texto = "::::::::::::::::::::::::::::::::::::::::::::::::    SALIDA CONSOLA  ::::::::::::::::::::::::::::::::::::::::::::::::\n";
        
        texto += result.getConsola();
        // $("#textAreaConsola").val(texto);
        // txtConsola.append(texto);
        Swal.fire(
            '¡Muy bien!',
            '¡Se completo la ejecución!',
            'success'
        )
    }catch(e){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Gramatica incorrecta\n:' + e
        });
        // alert(e);
    }


});
/**
 *  REPORTE DE AST
 * Graficando el ast
 */
reporteAST.addEventListener('click', () => {  

    // let arbol = new Arbol();
    var dot = result.graphAst();
    //parse(editores[indexTab].codeEditor.getValue());
    // let result = arbol.generarDot(result);
    // var parserDot = vis.network.convertDot(dot);
    //console.log(result);
    
    var clickedTab = document.getElementById("clickedTab");
    clickedTab.innerHTML = "";
    clickedTab.innerHTML = "<h3>Reporte AST</h3>"
    var viz = new Viz();
    viz.renderSVGElement(dot).then(function (element) {
        clickedTab.appendChild(element);
    })
    .catch((error) => {
        console.error(error);
    });
 
});



traducirProyecto.addEventListener('click', () => {
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

    var txtC3d = document.getElementById("textAreaC3d");
    $("#textAreaC3d").val("");

    try{
        result = gramatica.parse(editores[indexTab].codeEditor.getValue());
        // console.log(result_traduccion);
        entornoTraducir = result.TSglobal;
        let c3d = result.traducir();
        // let c3d = result_traduccion.generadorC3d.getCode();
        // result_traduccion.generadorC3d.clearCode();
        console.log(result);
        // addNuevoTab();
        // let tam =  editores.length;
        // editores[tam-1].codeEditor.setValue(c3d);
        // alert('Gramatica Correcta');
        // let textarea =  document.querySelector('#textAreaC3d');
        // let value = "";
        // value += c3d;
        // textarea.value = value;
        // $("#textAreaC3d").val(c3d);
        // txtC3d.append(c3d);
        text2.setValue(c3d);

        Swal.fire(
            '¡Muy bien!',
            '¡Se completo la traducción!',
            'success'
        )
    }catch(e){
        // alert('Grmatica Incorrecta');
        // alert(e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Gramatica incorrecta\n:' + e
        });
    }

});

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

reporteTablaSimbolos.addEventListener('click', () => {
    CuerpoTablaSimbolos.innerHTML = '';
    let content = "";
    let contador = 1;
    result.instrucciones.forEach(instruccion => {
        // :::::::::::::::::::  FUNCIONES    :::::::::::::::::::
        if(instruccion instanceof Funcion){
            content += `
            <tr>
            <th scope="row">${contador}</th>
            <td>Función</td>
            <td>Global</td>
            <td>${instruccion.id}</td>
            <td>${instruccion.fila}</td>
            <td>${instruccion.columna}</td>
            </tr>
            `
            contador++;
            // ________     Parametros main  ________
            if(instruccion.parameters != null){
                instruccion.parameters.forEach(parametros_funcion => {
                    // .........    Arreglo de parametros     .........
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Parametro</td>
                        <td>Funcion ${instruccion.id}</td>
                        <td>${parametros_funcion.id}</td>
                        <td>${instruccion.fila}</td>
                        <td>${instruccion.columna}</td>
                        </tr>
                        `
                        contador++;
                });
            }
            // ________     Instrucciones funciones  ________
            if(instruccion.instructions != null){
                instruccion.instructions.forEach(instrucciones_funcion => {
                    // .........    Declaracion     .........
                    if(instrucciones_funcion instanceof Declaracion){
                        instrucciones_funcion.simbolos.forEach(simbolo_decl =>{
                            content += `
                            <tr>
                            <th scope="row">${contador}</th>
                            <td>Declaracion</td>
                            <td>Funcion ${instruccion.id}</td>
                            <td>${simbolo_decl.id}</td>
                            <td>${simbolo_decl.fila}</td>
                            <td>${simbolo_decl.columna}</td>
                            </tr>
                            `
                            contador++;
                        });
                    } // .........    Asignacion     .........
                    else if(instrucciones_funcion instanceof Asignacion){
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Asignacion</td>
                        <td>Funcion ${instruccion.id}</td>
                        <td>${instrucciones_funcion.id}</td>
                        <td>${instrucciones_funcion.fila}</td>
                        <td>${instrucciones_funcion.columna}</td>
                        </tr>
                        `
                        contador++;
                    } // .........    Declaracion arreglo     .........
                    else if(instrucciones_funcion instanceof DeclaracionArr){
                            content += `
                            <tr>
                            <th scope="row">${contador}</th>
                            <td>Arreglo</td>
                            <td>Funcion ${instruccion.id}</td>
                            <td>${instrucciones_funcion.id}</td>
                            <td>${instrucciones_funcion.fila}</td>
                            <td>${instrucciones_funcion.columna}</td>
                            </tr>
                            `
                            contador++;
                    }
                });
            }
        }
        // :::::::::::::::::::      STRUCTS    :::::::::::::::::::
        else if(instruccion instanceof Struct){
            content += `
            <tr>
            <th scope="row">${contador}</th>
            <td>Struct</td>
            <td>Global</td>
            <td>${instruccion.id}</td>
            <td>${instruccion.fila}</td>
            <td>${instruccion.columna}</td>
            </tr>
            `
            contador++; 
            // ________     Instrucciones structs  ________
            if(instruccion.instructions != null){
                instruccion.instructions.forEach(instrucciones_struct => {
                    // .........    Declaracion     .........
                    if(instrucciones_struct instanceof Declaracion){
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Declaracion</td>
                        <td>Struct ${instruccion.id}</td>
                        <td>${instrucciones_struct.simbolos[0].id}</td>
                        <td>${instrucciones_struct.fila}</td>
                        <td>${instrucciones_struct.columna}</td>
                        </tr>
                        `
                        contador++;
                    } // .........    Declaracion arreglo     .........
                    else if(instrucciones_struct instanceof DeclaracionArr){
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Arreglo</td>
                        <td>Struct ${instruccion.id}</td>
                        <td>${instrucciones_struct.id}</td>
                        <td>${instrucciones_struct.fila}</td>
                        <td>${instrucciones_struct.columna}</td>
                        </tr>
                        `
                        contador++;
                }
                });
            }
        }
        // :::::::::::::::::::      MAIN    :::::::::::::::::::
        else if(instruccion instanceof  Main){
            // ________     Instrucciones main  ________
            instruccion.instructions.forEach(instruccion_main => {
                // .........    Declaracion     .........
                if(instruccion_main instanceof Declaracion){
                    instruccion_main.simbolos.forEach(simbolo_decl =>{
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Declaracion</td>
                        <td>Main</td>
                        <td>${simbolo_decl.id}</td>
                        <td>${simbolo_decl.fila}</td>
                        <td>${simbolo_decl.columna}</td>
                        </tr>
                        `
                        contador++;
                    });
                } // .........    Asignacion     .........
                else if(instruccion_main instanceof Asignacion){
                    content += `
                    <tr>
                    <th scope="row">${contador}</th>
                    <td>Asignacion</td>
                    <td>Main</td>
                    <td>${instruccion_main.id}</td>
                    <td>${instruccion_main.fila}</td>
                    <td>${instruccion_main.columna}</td>
                    </tr>
                    `
                    contador++;
                } // .........    Declaracion arreglo     .........
                else if(instruccion_main instanceof DeclaracionArr){
                        content += `
                        <tr>
                        <th scope="row">${contador}</th>
                        <td>Arreglo</td>
                        <td>Main</td>
                        <td>${instruccion_main.id}</td>
                        <td>${instruccion_main.fila}</td>
                        <td>${instruccion_main.columna}</td>
                        </tr>
                        `
                        contador++;
                }
            });
        }
    });
    content += entornoAnalizar.imprimirTabla();

    // let texto = entornoAnalizar.imprimirEntorno();
    CuerpoTablaSimbolos.innerHTML += content;
});

function reporteAST_Traduccion(){
    let arbol = new Arbol();
    
    //parse(editores[indexTab].codeEditor.getValue());
    let result = arbol.generarDot(result_traduccion);
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

},{"./Analizadores/gramatica":4,"./dist/Ast/Ast":5,"./dist/Instrucciones/Arreglos/DeclaracionArr":23,"./dist/Instrucciones/Asignacion":25,"./dist/Instrucciones/Declaracion":34,"./dist/Instrucciones/Metodos/Funcion":35,"./dist/Instrucciones/Metodos/Main":36,"./dist/Instrucciones/Struct/Struct":52}]},{},[60])(60)
});
