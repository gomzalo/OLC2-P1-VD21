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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[5,37],$V2=[1,16],$V3=[1,19],$V4=[1,12],$V5=[1,11],$V6=[1,10],$V7=[1,13],$V8=[1,14],$V9=[1,15],$Va=[1,17],$Vb=[1,18],$Vc=[1,20],$Vd=[1,22],$Ve=[1,23],$Vf=[1,24],$Vg=[1,25],$Vh=[1,26],$Vi=[1,27],$Vj=[1,28],$Vk=[1,29],$Vl=[1,30],$Vm=[1,31],$Vn=[1,32],$Vo=[1,33],$Vp=[1,34],$Vq=[1,35],$Vr=[25,43,44,45,46,47,48,49,50,52,53,54,55,56,57],$Vs=[25,49,50],$Vt=[25,43,44,49,50,52,53,54,55,56,57],$Vu=[25,43,44,45,46,48,49,50,52,53,54,55,56,57],$Vv=[25,49,50,52,53,54,55,56,57];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"inicio":3,"instrucciones":4,"EOF":5,"instruccion":6,"print":7,"declaracion":8,"tipo":9,"lista_simbolos":10,"PUNTOCOMA":11,"INT":12,"DOUBLE":13,"STRING":14,"CHAR":15,"BOOLEAN":16,"COMA":17,"ID":18,"IGUAL":19,"e":20,"asignacion":21,"sent_if":22,"IF":23,"PARA":24,"PARC":25,"LLAVA":26,"LLAVC":27,"ELSE":28,"sent_while":29,"WHILE":30,"dowhile_statement":31,"DO":32,"LLAVEIZQ":33,"LLAVEDER":34,"PARIZQ":35,"expresion":36,"PRINT":37,"funciones":38,"VOID":39,"lista_parametros":40,"llamada":41,"lista_exp":42,"MAS":43,"MENOS":44,"MULTI":45,"DIV":46,"POTENCIA":47,"PORCENTAJE":48,"AND":49,"OR":50,"NOT":51,"MAYORQUE":52,"MAYORIGUAL":53,"MENORIGUAL":54,"MENORQUE":55,"IGUALIGUAL":56,"DIFERENTE":57,"DECIMAL":58,"ENTERO":59,"CADENA":60,"TRUE":61,"FALSE":62,"NULO":63,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",11:"PUNTOCOMA",12:"INT",13:"DOUBLE",14:"STRING",15:"CHAR",16:"BOOLEAN",17:"COMA",18:"ID",19:"IGUAL",23:"IF",24:"PARA",25:"PARC",26:"LLAVA",27:"LLAVC",28:"ELSE",30:"WHILE",32:"DO",33:"LLAVEIZQ",34:"LLAVEDER",35:"PARIZQ",36:"expresion",37:"PRINT",39:"VOID",43:"MAS",44:"MENOS",45:"MULTI",46:"DIV",47:"POTENCIA",48:"PORCENTAJE",49:"AND",50:"OR",51:"NOT",52:"MAYORQUE",53:"MAYORIGUAL",54:"MENORIGUAL",55:"MENORQUE",56:"IGUALIGUAL",57:"DIFERENTE",58:"DECIMAL",59:"ENTERO",60:"CADENA",61:"TRUE",62:"FALSE",63:"NULO"},
productions_: [0,[3,2],[4,2],[4,1],[6,1],[8,3],[9,1],[9,1],[9,1],[9,1],[9,1],[10,3],[10,5],[10,1],[10,3],[21,4],[22,7],[22,11],[22,9],[29,7],[31,8],[7,5],[38,7],[38,8],[40,4],[40,2],[41,3],[41,4],[42,3],[42,1],[20,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,2],[20,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,2],[20,3],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 console.log($$[$0-1]); this.$= new ast.default($$[$0-1]);  return this.$; 
break;
case 2:
 this.$ = $$[$0-1]; this.$.push($$[$0]); 
break;
case 3:
this.$= new Array(); this.$.push($$[$0]); 
break;
case 4:
 this.$ = $$[$0]; 
break;
case 5:
 this.$ = new declaracion.default($$[$0-2], $$[$0-1], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 6:
 this.$ = new tipo.default('ENTERO'); 
break;
case 7:
 this.$ = new tipo.default('DOBLE'); 
break;
case 8:
 this.$ = new tipo.default('STRING'); 
break;
case 9:
 this.$ = new tipo.default('CHAR'); 
break;
case 10:
 this.$ = new tipo.default('BOOLEAN'); 
break;
case 11:
 this.$ = $$[$0-2]; this.$.push(new simbolo.default(1,null,$$[$0], null)); 
break;
case 12:
 this.$ = $$[$0-4]; this.$.push(new simbolo.default(1,null,$$[$0-2], $$[$0])); 
break;
case 13:
 this.$ = new Array(); this.$.push(new simbolo.default(1,null,$$[$0], null)); 
break;
case 14:
 this.$ = new Array(); this.$.push(new simbolo.default(1,null,$$[$0-2], $$[$0])); 
break;
case 15:
 this.$ = new Asignacion($$[$0-3],$$[$0-1], _$[$0-3].first_line, _$[$0-3].last_column); 
break;
case 16:
 this.$ = new If($$[$0-4], $$[$0-1], [], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 17:
 this.$ = new If($$[$0-8], $$[$0-5], $$[$0-1], _$[$0-10].first_line, _$[$0-10].last_column); 
break;
case 18:
 this.$ = new If($$[$0-6], $$[$0-3], [$$[$0]], _$[$0-8].first_line, _$[$0-8].last_column); 
break;
case 19:
 this.$ = new While($$[$0-4], $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 21:
this.$ = new Print($$[$0-2], _$[$0-4].first_line, _$[$0-4].last_column); 
break;
case 22:
 this.$ = new funcion.default(3, new tipo.default('VOID'), $$[$0-5], [], true, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column ); 
break;
case 23:
 this.$ = new funcion.default(3, new tipo.default('VOID'), $$[$0-6], $$[$0-4], true, $$[$0-1], _$[$0-7].first_line, _$[$0-7].last_column ); 
break;
case 24:
 this.$ = $$[$0-3]; this.$.push(new simbolo.default(6,$$[$0-1], $$[$0], null)); 
break;
case 25:
 this.$ = new Array(); this.$.push(new simbolo.default(6,$$[$0-1],$$[$0], null)); 
break;
case 26:
 this.$ = new llamada.default($$[$0-2], [],_$[$0-2].first_line, _$[$0-2].last_column ); 
break;
case 27:
 this.$ = new llamada.default($$[$0-3], $$[$0-1] ,_$[$0-3].first_line, _$[$0-3].last_column ); 
break;
case 28:
 this.$ = $$[$0-2]; this.$.push($$[$0]); 
break;
case 29:
 this.$ = new Array(); this.$.push($$[$0]); 
break;
case 30:
this.$ = new Aritmetica($$[$0-2], Tipo.OperadorAritmetico.MAS, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 31:
this.$ = new Aritmetica($$[$0-2], Tipo.OperadorAritmetico.MENOS, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 32:
this.$ = new Aritmetica($$[$0-2], Tipo.OperadorAritmetico.POR, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 33:
this.$ = new Aritmetica($$[$0-2], Tipo.OperadorAritmetico.DIV, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 34:
this.$ = new Aritmetica($$[$0-2], Tipo.OperadorAritmetico.POT, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 35:
this.$ = new Aritmetica($$[$0-2], Tipo.OperadorAritmetico.MOD, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 36:
this.$ = new Logica($$[$0-2], Tipo.OperadorLogico.AND, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 37:
this.$ = new Logica($$[$0-2], Tipo.OperadorLogico.OR, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 38:
this.$ = new Logica($$[$0], Tipo.OperadorLogico.NOT, null, $$[$0-1].first_line, $$[$0-1].last_column, true);
break;
case 39:
this.$ = new Relacionales($$[$0-2], Tipo.OperadorRelacional.MAYORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 40:
this.$ = new Relacionales($$[$0-2], Tipo.OperadorRelacional.MAYORIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 41:
this.$ = new Relacionales($$[$0-2], '<=', $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 42:
this.$ = new Relacionales($$[$0-2], Tipo.OperadorRelacional.MENORQUE, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 43:
this.$ = new Relacionales($$[$0-2], Tipo.OperadorRelacional.IGUALIGUAL, $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 44:
this.$ = new Relacionales($$[$0-2], '!=', $$[$0], $$[$0-2].first_line, $$[$0-2].last_column, false);
break;
case 45:
this.$ = new Aritmetica($$[$0], Tipo.OperadorAritmetico.UMENOS, null, $$[$0-1].first_line, $$[$0-1].last_column, true);
break;
case 46:
this.$ = $$[$0-1];
break;
case 47:
this.$ = new Primitivo(Number(yytext),Tipo.TIPO.DECIMAL, $$[$0].first_line, $$[$0].last_column);
break;
case 48:
this.$ = new Primitivo(Number(yytext),Tipo.TIPO.ENTERO, $$[$0].first_line, $$[$0].last_column);
break;
case 49:
$$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0],Tipo.TIPO.CADENA, $$[$0].first_line, $$[$0].last_column);
break;
case 50:
$$[$0] = $$[$0].slice(1, $$[$0].length-1); this.$ = new Primitivo($$[$0],Tipo.TIPO.CHARACTER, $$[$0].first_line, $$[$0].last_column);
break;
case 51:
this.$ = new Primitivo(true,Tipo.TIPO.BOOLEANO, $$[$0].first_line, $$[$0].last_column);
break;
case 52:
this.$ = new Primitivo(false,Tipo.TIPO.BOOLEANO, $$[$0].first_line, $$[$0].last_column);
break;
case 53:
this.$ = new Identificador($$[$0], _$[$0].first_line, _$[$0].last_column); 
break;
case 54:
this.$ = new Primitivo($$[$0],Tipo.TIPO.NULO,_$[$0].first_line,_$[$0].last_column)
break;
}
},
table: [{3:1,4:2,6:3,7:4,37:$V0},{1:[3]},{5:[1,6],6:7,7:4,37:$V0},o($V1,[2,3]),o($V1,[2,4]),{24:[1,8]},{1:[2,1]},o($V1,[2,2]),{15:$V2,18:$V3,20:9,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{25:[1,21],43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi,49:$Vj,50:$Vk,52:$Vl,53:$Vm,54:$Vn,55:$Vo,56:$Vp,57:$Vq},{15:$V2,18:$V3,20:36,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:37,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:38,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},o($Vr,[2,47]),o($Vr,[2,48]),o($Vr,[2,49]),o($Vr,[2,50]),o($Vr,[2,51]),o($Vr,[2,52]),o($Vr,[2,53]),o($Vr,[2,54]),{11:[1,39]},{15:$V2,18:$V3,20:40,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:41,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:42,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:43,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:44,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:45,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:46,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:47,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:48,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:49,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:50,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:51,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:52,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},{15:$V2,18:$V3,20:53,24:$V4,44:$V5,51:$V6,58:$V7,59:$V8,60:$V9,61:$Va,62:$Vb,63:$Vc},o($Vs,[2,38],{43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi,52:$Vl,53:$Vm,54:$Vn,55:$Vo,56:$Vp,57:$Vq}),o($Vr,[2,45]),{25:[1,54],43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi,49:$Vj,50:$Vk,52:$Vl,53:$Vm,54:$Vn,55:$Vo,56:$Vp,57:$Vq},o($V1,[2,21]),o($Vt,[2,30],{45:$Vf,46:$Vg,47:$Vh,48:$Vi}),o($Vt,[2,31],{45:$Vf,46:$Vg,47:$Vh,48:$Vi}),o($Vu,[2,32],{47:$Vh}),o($Vu,[2,33],{47:$Vh}),o($Vu,[2,34]),o($Vu,[2,35],{47:$Vh}),o($Vs,[2,36],{43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi,52:$Vl,53:$Vm,54:$Vn,55:$Vo,56:$Vp,57:$Vq}),o([25,50],[2,37],{43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi,49:$Vj,52:$Vl,53:$Vm,54:$Vn,55:$Vo,56:$Vp,57:$Vq}),o($Vv,[2,39],{43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi}),o($Vv,[2,40],{43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi}),o($Vv,[2,41],{43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi}),o($Vv,[2,42],{43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi}),o($Vv,[2,43],{43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi}),o($Vv,[2,44],{43:$Vd,44:$Ve,45:$Vf,46:$Vg,47:$Vh,48:$Vi}),o($Vr,[2,46])],
defaultActions: {6:[2,1]},
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

    // const aritmetica = require('../dist/Expresiones/Operaciones/Aritmetica.js');
    // const aritmetica = require('../dist/Expresiones/Operaciones/Aritmetica');
    // const logica = require('../dist/Expresiones/Operaciones/Logica');
    // const relacional = require('../dist/Expresiones/Operaciones/Relacionales');
    // const primitivo = require('../dist/Expresiones/Primitivo');


    // // const ast = require('../Clases/Ast/Ast');
    // // const declaracion = require('../Clases/Instrucciones/Declaracion');
    // // const asignacion = require('../Clases/Instrucciones/Asignacion');
    // // const simbolo = require('../Clases/TablaSimbolos/Simbolos');
    // const tipo = require('../dist/TablaSimbolos/Tipo');
    // // const tipoAritm = require('../dist/TablaSimbolos/OperadorAritmetico')

    // const identificador = require('../dist/Expresiones/Identificador');
    // // const ternario = require('../Clases/Expresiones/Ternario');

    // const Print = require('../dist/Instrucciones/Print');
    // const Ifs = require('../Clases/Instrucciones/SentenciaControl/Ifs');
    // const While = require('../Clases/Instrucciones/SentenciaCiclica/While');

    // const funcion = require('../Clases/Instrucciones/Funcion');
    // const llamada = require('../Clases/Instrucciones/Llamada');

    // const ejecutar = require('../Clases/Instrucciones/Ejecutar');

    // const detener = require('../Clases/Instrucciones/SentenciaTransferencia/Break');
    // const errores = require('../Clases/Ast/Errores');

    // let lista =[];

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
case 0:/* Ignoro los comentarios simples */
break;
case 1:/*Ignorar comentarios con multiples lneas*/
break;
case 2: console.log("Reconocio : "+ yy_.yytext); return 'INCRE'
break;
case 3: console.log("Reconocio : "+ yy_.yytext); return 'DECRE'
break;
case 4: console.log("Reconocio : "+ yy_.yytext); return 24
break;
case 5: console.log("Reconocio : "+ yy_.yytext); return 25
break;
case 6: console.log("Reconocio : "+ yy_.yytext); return 'CORA'
break;
case 7: console.log("Reconocio : "+ yy_.yytext); return 'CORC'
break;
case 8: console.log("Reconocio : "+ yy_.yytext); return 'PUNTO'
break;
case 9: console.log("Reconocio : "+ yy_.yytext); return 11
break;
case 10: console.log("Reconocio : "+ yy_.yytext); return 17
break;
case 11: console.log("Reconocio : "+ yy_.yytext); return 56
break;
case 12: console.log("Reconocio : "+ yy_.yytext); return 19
break;
case 13: console.log("Reconocio : "+ yy_.yytext); return 'INTERROGACION'
break;
case 14: console.log("Reconocio : "+ yy_.yytext); return 'DOSPUNTOS'
break;
case 15: console.log("Reconocio : "+ yy_.yytext); return 26
break;
case 16: console.log("Reconocio : "+ yy_.yytext); return 27
break;
case 17: console.log("Reconocio : "+ yy_.yytext); return 48
break;
case 18: console.log("Reconocio : "+ yy_.yytext); return 43
break;
case 19: console.log("Reconocio : "+ yy_.yytext); return 44
break;
case 20: console.log("Reconocio : "+ yy_.yytext); return 45
break;
case 21: console.log("Reconocio : "+ yy_.yytext); return 46
break;
case 22: console.log("Reconocio : "+ yy_.yytext); return 55
break;
case 23: console.log("Reconocio : "+ yy_.yytext); return 53
break;
case 24: console.log("Reconocio : "+ yy_.yytext); return 52
break;
case 25: lista.push({F: yy_.yylloc.first_line, C: yy_.yylloc.first_column,T: 'DIFERENTE', L: yy_.yytext}); return 57; 
break;
case 26: lista.push({F: yy_.yylloc.first_line, C: yy_.yylloc.first_column,T: 'MENORIGUAL', L: yy_.yytext}); return 54; 
break;
case 27: console.log("Reconocio : "+ yy_.yytext); return 49
break;
case 28: lista.push({F: yy_.yylloc.first_line, C: yy_.yylloc.first_column,T: 'OR', L: yy_.yytext}); console.log("Reconocio : "+ yy_.yytext); return 50; 
break;
case 29: lista.push({F: yy_.yylloc.first_line, C: yy_.yylloc.first_column,T: 'NEGACION', L: yy_.yytext}); console.log("Reconocio : "+ yy_.yytext);return 'NEGACION'; 
break;
case 30: lista.push({F: yy_.yylloc.first_line, C: yy_.yylloc.first_column,T: 'POTENCIA', L: yy_.yytext}); console.log("Reconocio : "+ yy_.yytext); return 47; 
break;
case 31://..............      Primitivos      ...............
break;
case 32: console.log("Reconocio : "+ yy_.yytext); return 12
break;
case 33: console.log("Reconocio : "+ yy_.yytext); return 13
break;
case 34: console.log("Reconocio : "+ yy_.yytext); return 14
break;
case 35: console.log("Reconocio : "+ yy_.yytext); return 15
break;
case 36: console.log("Reconocio : "+ yy_.yytext); return 16
break;
case 37: console.log("Reconocio : "+ yy_.yytext); return 63
break;
case 38: console.log("Reconocio : "+ yy_.yytext); return 'STRUCT'
break;
case 39: console.log("Reconocio : "+ yy_.yytext); return 23
break;
case 40: console.log("Reconocio : "+ yy_.yytext); return 28
break;
case 41: console.log("Reconocio : "+ yy_.yytext); return 'ELSEIF'
break;
case 42: console.log("Reconocio : "+ yy_.yytext); return 'SWITCH'
break;
case 43: console.log("Reconocio : "+ yy_.yytext); return 'CASE'
break;
case 44: console.log("Reconocio : "+ yy_.yytext); return 'DEFAULT'
break;
case 45: console.log("Reconocio : "+ yy_.yytext); return 30
break;
case 46: console.log("Reconocio : "+ yy_.yytext); return 32
break;
case 47: console.log("Reconocio : "+ yy_.yytext); return 'FOR'
break;
case 48: console.log("Reconocio : "+ yy_.yytext); return 'BREAK'
break;
case 49: console.log("Reconocio : "+ yy_.yytext); return 'CONTINUE'
break;
case 50: console.log("Reconocio : "+ yy_.yytext); return 'RETURN'
break;
case 51: console.log("Reconocio : "+ yy_.yytext); return 37
break;
case 52: console.log("Reconocio : "+ yy_.yytext); return 'PRINTLN'
break;
case 53: console.log("Reconocio : "+ yy_.yytext); return 39
break;
case 54: console.log("Reconocio : "+ yy_.yytext); return 'SIN'
break;
case 55: console.log("Reconocio : "+ yy_.yytext); return 'COS'
break;
case 56: console.log("Reconocio : "+ yy_.yytext); return 'TAN'
break;
case 57: console.log("Reconocio : "+ yy_.yytext); return 'LOG10'
break;
case 58: console.log("Reconocio : "+ yy_.yytext); return 'SQRT'
break;
case 59: console.log("Reconocio : "+ yy_.yytext); return 'PARSE'
break;
case 60: console.log("Reconocio : "+ yy_.yytext); return 'TOINT'
break;
case 61: console.log("Reconocio : "+ yy_.yytext); return 'TODOUBLE'
break;
case 62: console.log("Reconocio : "+ yy_.yytext); return 'TYPEOF'
break;
case 63: console.log("Reconocio : "+ yy_.yytext); return 'PUSH'
break;
case 64: console.log("Reconocio : "+ yy_.yytext); return 'POP'
break;
case 65: console.log("Reconocio : "+ yy_.yytext); return 'CHAROFPOS'
break;
case 66: console.log("Reconocio : "+ yy_.yytext); return 'SUBSTRING'
break;
case 67: console.log("Reconocio : "+ yy_.yytext); return 'LENGTH'
break;
case 68: console.log("Reconocio : "+ yy_.yytext); return 'TOLOWERCASE'
break;
case 69: console.log("Reconocio : "+ yy_.yytext); return 'TOUPPERCASE'
break;
case 70: console.log("Reconocio : "+ yy_.yytext); return 61
break;
case 71: console.log("Reconocio : "+ yy_.yytext); return 62
break;
case 72: console.log("Reconocio : "+ yy_.yytext); return 58
break;
case 73: console.log("Reconocio : "+ yy_.yytext); return 59
break;
case 74: console.log("Reconocio : "+ yy_.yytext); return 18
break;
case 75: console.log("Reconocio : "+ yy_.yytext); return 60
break;
case 76: console.log("Reconocio : "+ yy_.yytext); return 15
break;
case 77:/* skip whitespace */
break;
case 78:return 5
break;
case 79: console.log("Error Lexico "+yy_.yytext
                        +" linea "+yy_.yylineno
                        +" columna "+(yy_.yylloc.last_column+1));

                        new errores.default('Lexico', 'El caracter ' + yy_.yytext 
                                + ' no forma parte del lenguaje', 
                                yy_.yylineno+1, 
                                yy_.yylloc.last_column+1); 
                        
break;
}
},
rules: [/^(?:\/\/.*)/i,/^(?:\/\*((\*+[^/*])|([^*]))*\**\*\/)/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\.)/i,/^(?:;)/i,/^(?:,)/i,/^(?:==)/i,/^(?:=)/i,/^(?:\?)/i,/^(?::)/i,/^(?:\{)/i,/^(?:\})/i,/^(?:%)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:<)/i,/^(?:>=)/i,/^(?:>)/i,/^(?:!=)/i,/^(?:<=)/i,/^(?:&&)/i,/^(?:\|\|)/i,/^(?:!)/i,/^(?:\^)/i,/^(?:)/i,/^(?:int\b)/i,/^(?:double\b)/i,/^(?:String\b)/i,/^(?:char\b)/i,/^(?:boolean\b)/i,/^(?:null\b)/i,/^(?:struct\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:elseif\b)/i,/^(?:switch\b)/i,/^(?:case\b)/i,/^(?:default\b)/i,/^(?:while\b)/i,/^(?:do\b)/i,/^(?:for\b)/i,/^(?:break\b)/i,/^(?:continue\b)/i,/^(?:return\b)/i,/^(?:print\b)/i,/^(?:println\b)/i,/^(?:void\b)/i,/^(?:sin\b)/i,/^(?:cos\b)/i,/^(?:tan\b)/i,/^(?:log10\b)/i,/^(?:sqrt\b)/i,/^(?:parse\b)/i,/^(?:toInt\b)/i,/^(?:toDouble\b)/i,/^(?:typeof\b)/i,/^(?:push\b)/i,/^(?:pop\b)/i,/^(?:caracterOfPosition\b)/i,/^(?:subString\b)/i,/^(?:length\b)/i,/^(?:toLowercase\b)/i,/^(?:toUppercase\b)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:[0-9]+(\.[0-9]+)?\b)/i,/^(?:([0-9]+))/i,/^(?:([a-zñA-ZÑ_][a-zñA-ZÑ0-9_]*))/i,/^(?:(("((\\([\'\"\\ntr]))|([^\"\\]+))*")))/i,/^(?:(('((\\([\\ntr]))|([^\'\\]))')))/i,/^(?:[\s\r\n\t])/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79],"inclusive":true}}
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
},{"_process":3,"fs":1,"path":2}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    ejecutar(table, tree) {
        // 1ERA PASADA: 
        // GUARDAR FUNCIONES  Y METODOS
        // for( let instr of this.instrucciones){
        // }
        // 2DA PASADA
        // EJECUTAMOS TODAS LAS FUNCIONES
        for (let instr of this.instrucciones) {
            instr.ejecutar(table, tree);
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
        this.consola += cadena + '\n';
    }
    updateConsolaPrint(cadena) {
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
    getDot(raiz) {
    }
}
exports.default = Ast;

},{}],6:[function(require,module,exports){
// const { TablaSimbolos } = require("./Clases/TablaSimbolos/TablaSimbolos");

// import Nodo from "../../Ast/Nodo";

var myTab = document.getElementById('myTab');
var itemAbrir = document.getElementById('item1');
let astGenerado;
let astTraduccion;
let entornoAnalizar;
// let listaErrores = Lista_Error.getInstancia();
const Ast = require("./dist/Ast/Ast");
const gramatica = require("./Analizadores/gramatica");
// const Lista_Imprimir = require("./dist/Lista_imprimir");

const compilar = document.getElementById('compilarProyecto');

var text = CodeMirror.fromTextArea(document.getElementById("textInitial"),{
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
    
    var textArea2 = document.getElementById("exampleFormControlTextarea1");
    $("#exampleFormControlTextarea1").val("");

    try{
        // listaImprimir.length = 0;
        // listaErrores.length = 0;
        astGenerado = gramatica.parse(editores[indexTab].codeEditor.getValue());
        let tablaSimbolos = new TablaSimbolos();
        let astEjecucion = new Ast();
        astEjecucion.ejecutar(tablaSimbolos, astEjecucion);
        let output = astEjecucion.getConsola()

        // console.log("astgenerado: " + astGenerado)
        // let entorno = new Entorno(null);
        // entorno.setGlobal(entorno);
        // entorno.setPadre(null);
        // entornoAnalizar = entorno;
        // astGenerado.entornoGlobal.setGlobal(astGenerado.entornoGlobal);
        // astGenerado.entornoGlobal.setPadre(null);
        // astGenerado.ejecutar(entorno);
    
        let texto = "***************************************** SALIDA *****************************************";
        
        // listaImprimir.forEach(
        //     element =>{
        //         texto += ("\n"+element);
        //     }
        // );
        
        $("#exampleFormControlTextarea1").val(output);
        //textArea2.append(texto);
        //listaImprimir = [];
        

        

        alert('Gramatica Correcta');
    }catch(e){
        alert('Gramatica Incorrecta');
        alert(e);
    }


});

function reporteAST(){  

    let arbol = new Arbol();
    
    //parse(editores[indexTab].codeEditor.getValue());
    let result = arbol.generarDot(astGenerado);
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
        //astTraduccion.entornoGlobal.setGlobal(astGenerado.entornoGlobal);
        //astTraduccion.entornoGlobal.setPadre(null);
        let textoTraduccion = astTraduccion.traducir(entorno);
    
        agregarNuevoTab();
        let tam =  editores.length;
        editores[tam-1].codeEditor.setValue(textoTraduccion);
        //textArea2.append(texto);
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
},{"./Analizadores/gramatica":4,"./dist/Ast/Ast":5}]},{},[6])(6)
});
