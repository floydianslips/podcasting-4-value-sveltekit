var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// .netlify/multipart-parser-52bc5518.js
var require_multipart_parser_52bc5518 = __commonJS({
  ".netlify/multipart-parser-52bc5518.js"(exports2) {
    "use strict";
    require("fs");
    require("path");
    var node_worker_threads = require("worker_threads");
    var shims = require_shims_24e5b259();
    require("http");
    require("https");
    require("zlib");
    require("stream");
    require("util");
    require("url");
    require("net");
    globalThis.DOMException || (() => {
      const port = new node_worker_threads.MessageChannel().port1;
      const ab = new ArrayBuffer(0);
      try {
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        return err.constructor;
      }
    })();
    var s = 0;
    var S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    var f = 1;
    var F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    var LF = 10;
    var CR = 13;
    var SPACE = 32;
    var HYPHEN = 45;
    var COLON = 58;
    var A = 97;
    var Z = 122;
    var lower = (c) => c | 32;
    var noop = () => {
    };
    var MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i = 0; i < boundary.length; i++) {
          ui8a[i] = boundary.charCodeAt(i);
          this.boundaryChars[ui8a[i]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i = 0; i < length_; i++) {
          c = data[i];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i += boundaryEnd;
                while (i < bufferLength && !(data[i] in boundaryChars)) {
                  i += boundaryLength;
                }
                i -= boundaryEnd;
                c = data[i];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
    function _fileName(headerValue) {
      const m = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
      if (!m) {
        return;
      }
      const match = m[2] || m[3] || "";
      let filename = match.slice(match.lastIndexOf("\\") + 1);
      filename = filename.replace(/%22/g, '"');
      filename = filename.replace(/&#(\d{4});/g, (m2, code) => {
        return String.fromCharCode(code);
      });
      return filename;
    }
    async function toFormData(Body, ct) {
      if (!/multipart/i.test(ct)) {
        throw new TypeError("Failed to fetch");
      }
      const m = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
      if (!m) {
        throw new TypeError("no or bad content-type header, no multipart boundary");
      }
      const parser = new MultipartParser(m[1] || m[2]);
      let headerField;
      let headerValue;
      let entryValue;
      let entryName;
      let contentType;
      let filename;
      const entryChunks = [];
      const formData = new shims.FormData();
      const onPartData = (ui8a) => {
        entryValue += decoder.decode(ui8a, { stream: true });
      };
      const appendToFile = (ui8a) => {
        entryChunks.push(ui8a);
      };
      const appendFileToFormData = () => {
        const file = new shims.File(entryChunks, filename, { type: contentType });
        formData.append(entryName, file);
      };
      const appendEntryToFormData = () => {
        formData.append(entryName, entryValue);
      };
      const decoder = new TextDecoder("utf-8");
      decoder.decode();
      parser.onPartBegin = function() {
        parser.onPartData = onPartData;
        parser.onPartEnd = appendEntryToFormData;
        headerField = "";
        headerValue = "";
        entryValue = "";
        entryName = "";
        contentType = "";
        filename = null;
        entryChunks.length = 0;
      };
      parser.onHeaderField = function(ui8a) {
        headerField += decoder.decode(ui8a, { stream: true });
      };
      parser.onHeaderValue = function(ui8a) {
        headerValue += decoder.decode(ui8a, { stream: true });
      };
      parser.onHeaderEnd = function() {
        headerValue += decoder.decode();
        headerField = headerField.toLowerCase();
        if (headerField === "content-disposition") {
          const m2 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
          if (m2) {
            entryName = m2[2] || m2[3] || "";
          }
          filename = _fileName(headerValue);
          if (filename) {
            parser.onPartData = appendToFile;
            parser.onPartEnd = appendFileToFormData;
          }
        } else if (headerField === "content-type") {
          contentType = headerValue;
        }
        headerValue = "";
        headerField = "";
      };
      for await (const chunk of Body) {
        parser.write(chunk);
      }
      parser.end();
      return formData;
    }
    exports2.toFormData = toFormData;
  }
});

// .netlify/shims-24e5b259.js
var require_shims_24e5b259 = __commonJS({
  ".netlify/shims-24e5b259.js"(exports2) {
    "use strict";
    var http = require("http");
    var https = require("https");
    var zlib = require("zlib");
    var Stream = require("stream");
    var node_util = require("util");
    var node_url = require("url");
    var net = require("net");
    function _interopDefaultLegacy(e2) {
      return e2 && typeof e2 === "object" && "default" in e2 ? e2 : { "default": e2 };
    }
    var http__default = /* @__PURE__ */ _interopDefaultLegacy(http);
    var https__default = /* @__PURE__ */ _interopDefaultLegacy(https);
    var zlib__default = /* @__PURE__ */ _interopDefaultLegacy(zlib);
    var Stream__default = /* @__PURE__ */ _interopDefaultLegacy(Stream);
    function dataUriToBuffer(uri) {
      if (!/^data:/i.test(uri)) {
        throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
      }
      uri = uri.replace(/\r?\n/g, "");
      const firstComma = uri.indexOf(",");
      if (firstComma === -1 || firstComma <= 4) {
        throw new TypeError("malformed data: URI");
      }
      const meta = uri.substring(5, firstComma).split(";");
      let charset = "";
      let base64 = false;
      const type = meta[0] || "text/plain";
      let typeFull = type;
      for (let i2 = 1; i2 < meta.length; i2++) {
        if (meta[i2] === "base64") {
          base64 = true;
        } else {
          typeFull += `;${meta[i2]}`;
          if (meta[i2].indexOf("charset=") === 0) {
            charset = meta[i2].substring(8);
          }
        }
      }
      if (!meta[0] && !charset.length) {
        typeFull += ";charset=US-ASCII";
        charset = "US-ASCII";
      }
      const encoding = base64 ? "base64" : "ascii";
      const data = unescape(uri.substring(firstComma + 1));
      const buffer = Buffer.from(data, encoding);
      buffer.type = type;
      buffer.typeFull = typeFull;
      buffer.charset = charset;
      return buffer;
    }
    var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    var ponyfill_es2018 = { exports: {} };
    (function(module3, exports3) {
      (function(global2, factory) {
        factory(exports3);
      })(commonjsGlobal, function(exports4) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals = getGlobals();
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask2 = (() => {
          const globalQueueMicrotask = globals && globals.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F, V, args) {
          if (typeof F !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F, V, args);
        }
        function promiseCall(F, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve, reject) => {
            reader._closedPromise_resolve = resolve;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve, reject) => {
              resolvePromise = resolve;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve, reject) => {
              resolvePromise = resolve;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask2(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a4) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry = this._queue.shift();
              this._queueTotalSize -= entry.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve, reject) => {
              resolvePromise = resolve;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e2) => rejectPromise(e2)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a4) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a4;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a4 = stream._writableStreamController._abortController) === null || _a4 === void 0 ? void 0 : _a4.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve, reject) => {
            const closeRequest = {
              _resolve: resolve,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve, reject) => {
            const writeRequest = {
              _resolve: resolve,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error) {
          stream._inFlightWriteRequest._reject(error);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error) {
          stream._inFlightCloseRequest._reject(error);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve, reject) => {
            writer._closedPromise_resolve = resolve;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve, reject) => {
            writer._readyPromise_resolve = resolve;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a4) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
              } else {
                finalize(isError, error);
              }
            }
            function finalize(isError, error) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error);
              } else {
                resolve(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgain = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve) => {
            resolveCancelPromise = resolve;
          });
          function pullAlgorithm() {
            if (reading) {
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask2(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve) => {
            resolveCancelPromise = resolve;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask2(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask2(() => {
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              readAgainForBranch1 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              readAgainForBranch2 = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options, context) {
          assertDictionary(options, context);
          const mode = options === null || options === void 0 ? void 0 : options.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options, context) {
          assertDictionary(options, context);
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options, context) {
          assertDictionary(options, context);
          const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
          const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
          const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
          const signal = options === null || options === void 0 ? void 0 : options.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable, "readable", "ReadableWritablePair");
          assertReadableStream(readable, `${context} has member 'readable' that`);
          const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable, "writable", "ReadableWritablePair");
          assertWritableStream(writable, `${context} has member 'writable' that`);
          return { readable, writable };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options = convertReaderOptions(rawOptions, "First parameter");
            if (options.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options;
            try {
              options = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e2) {
              return promiseRejectedWith(e2);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        Object.defineProperty(byteLengthSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class ByteLengthQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class CountQueuingStrategy {
          constructor(options) {
            assertRequiredArgument(options, 1, "CountQueuingStrategy");
            options = convertQueuingStrategyInit(options, "First parameter");
            this._countQueuingStrategyHighWaterMark = options.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve) => {
              startPromise_resolve = resolve;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve) => {
            stream._backpressureChangePromise_resolve = resolve;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable = stream._writable;
              const state = writable._state;
              if (state === "erroring") {
                throw writable._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable._state === "errored") {
              throw readable._storedError;
            }
            ReadableStreamDefaultControllerClose(readable._readableStreamController);
          }, (r2) => {
            TransformStreamError(stream, r2);
            throw readable._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports4.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports4.CountQueuingStrategy = CountQueuingStrategy;
        exports4.ReadableByteStreamController = ReadableByteStreamController;
        exports4.ReadableStream = ReadableStream2;
        exports4.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports4.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports4.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports4.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports4.TransformStream = TransformStream;
        exports4.TransformStreamDefaultController = TransformStreamDefaultController;
        exports4.WritableStream = WritableStream;
        exports4.WritableStreamDefaultController = WritableStreamDefaultController;
        exports4.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports4, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    var POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error) {
          process2.emitWarning = emitWarning;
          throw error;
        }
      } catch (error) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob2 } = require("buffer");
      if (Blob2 && !Blob2.prototype.stream) {
        Blob2.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error) {
    }
    var POOL_SIZE = 65536;
    async function* toIterator(parts, clone2 = true) {
      for (const part of parts) {
        if ("stream" in part) {
          yield* part.stream();
        } else if (ArrayBuffer.isView(part)) {
          if (clone2) {
            let position = part.byteOffset;
            const end = part.byteOffset + part.byteLength;
            while (position !== end) {
              const size = Math.min(end - position, POOL_SIZE);
              const chunk = part.buffer.slice(position, position + size);
              position += chunk.byteLength;
              yield new Uint8Array(chunk);
            }
          } else {
            yield part;
          }
        } else {
          let position = 0;
          while (position !== part.size) {
            const chunk = part.slice(position, Math.min(part.size, position + POOL_SIZE));
            const buffer = await chunk.arrayBuffer();
            position += buffer.byteLength;
            yield new Uint8Array(buffer);
          }
        }
      }
    }
    var _parts, _type, _size, _a;
    var _Blob = (_a = class {
      constructor(blobParts = [], options = {}) {
        __privateAdd(this, _parts, []);
        __privateAdd(this, _type, "");
        __privateAdd(this, _size, 0);
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof _a) {
            part = element;
          } else {
            part = encoder.encode(element);
          }
          __privateSet(this, _size, __privateGet(this, _size) + (ArrayBuffer.isView(part) ? part.byteLength : part.size));
          __privateGet(this, _parts).push(part);
        }
        const type = options.type === void 0 ? "" : String(options.type);
        __privateSet(this, _type, /^[\x20-\x7E]*$/.test(type) ? type : "");
      }
      get size() {
        return __privateGet(this, _size);
      }
      get type() {
        return __privateGet(this, _type);
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(__privateGet(this, _parts), false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(__privateGet(this, _parts), false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(__privateGet(this, _parts), true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = __privateGet(this, _parts);
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new _a([], { type: String(type).toLowerCase() });
        __privateSet(blob, _size, span);
        __privateSet(blob, _parts, blobParts);
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    }, _parts = new WeakMap(), _type = new WeakMap(), _size = new WeakMap(), _a);
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    var Blob = _Blob;
    var Blob$1 = Blob;
    var _lastModified, _name, _a2;
    var _File = (_a2 = class extends Blob$1 {
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        __privateAdd(this, _lastModified, 0);
        __privateAdd(this, _name, "");
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          __privateSet(this, _lastModified, lastModified);
        }
        __privateSet(this, _name, String(fileName));
      }
      get name() {
        return __privateGet(this, _name);
      }
      get lastModified() {
        return __privateGet(this, _lastModified);
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
    }, _lastModified = new WeakMap(), _name = new WeakMap(), _a2);
    var File = _File;
    var { toStringTag: t, iterator: i, hasInstance: h } = Symbol;
    var r = Math.random;
    var m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    var f = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    var e = (c, f2) => (f2 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    var x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    var _d, _a3;
    var FormData = (_a3 = class {
      constructor(...a) {
        __privateAdd(this, _d, []);
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        __privateGet(this, _d).push(f(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        __privateSet(this, _d, __privateGet(this, _d).filter(([b]) => b !== a));
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = __privateGet(this, _d), l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        __privateGet(this, _d).forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return __privateGet(this, _d).some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f(...a);
        __privateGet(this, _d).forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        __privateSet(this, _d, b);
      }
      *entries() {
        yield* __privateGet(this, _d);
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    }, _d = new WeakMap(), _a3);
    function formDataToBlob(F, B = Blob$1) {
      var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
      F.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
      c.push(`--${b}--`);
      return new B(c, { type: "multipart/form-data; boundary=" + b });
    }
    var FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    var FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    var NAME = Symbol.toStringTag;
    var isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    var isBlob = (object) => {
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    var isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    var INTERNALS$2 = Symbol("Body internals");
    var Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (node_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof Stream__default["default"])
          ;
        else if (body instanceof FormData) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = Buffer.from(String(body));
        }
        let stream = body;
        if (Buffer.isBuffer(body)) {
          stream = Stream__default["default"].Readable.from(body);
        } else if (isBlob(body)) {
          stream = Stream__default["default"].Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof Stream__default["default"]) {
          body.on("error", (error_) => {
            const error = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData } = await Promise.resolve().then(function() {
          return require_multipart_parser_52bc5518();
        });
        return toFormData(this.body, ct);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Body.prototype.buffer = node_util.deprecate(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    async function consumeBody(data) {
      if (data[INTERNALS$2].disturbed) {
        throw new TypeError(`body used already for: ${data.url}`);
      }
      data[INTERNALS$2].disturbed = true;
      if (data[INTERNALS$2].error) {
        throw data[INTERNALS$2].error;
      }
      const { body } = data;
      if (body === null) {
        return Buffer.alloc(0);
      }
      if (!(body instanceof Stream__default["default"])) {
        return Buffer.alloc(0);
      }
      const accum = [];
      let accumBytes = 0;
      try {
        for await (const chunk of body) {
          if (data.size > 0 && accumBytes + chunk.length > data.size) {
            const error = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
            body.destroy(error);
            throw error;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        }
      } catch (error) {
        const error_ = error instanceof FetchBaseError ? error : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error.message}`, "system", error);
        throw error_;
      }
      if (body.readableEnded === true || body._readableState.ended === true) {
        try {
          if (accum.every((c) => typeof c === "string")) {
            return Buffer.from(accum.join(""));
          }
          return Buffer.concat(accum, accumBytes);
        } catch (error) {
          throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error.message}`, "system", error);
        }
      } else {
        throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
      }
    }
    var clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream__default["default"] && typeof body.getBoundary !== "function") {
        p1 = new Stream.PassThrough({ highWaterMark });
        p2 = new Stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    var getNonSpecFormDataBoundary = node_util.deprecate((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
    var extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof Stream__default["default"]) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    var getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      return null;
    };
    var writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    var validateHeaderName = typeof http__default["default"].validateHeaderName === "function" ? http__default["default"].validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error;
      }
    };
    var validateHeaderValue = typeof http__default["default"].validateHeaderValue === "function" ? http__default["default"].validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error, "code", { value: "ERR_INVALID_CHAR" });
        throw error;
      }
    };
    var Headers2 = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers2) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !node_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || node_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers2.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    function fromRawHeaders(headers = []) {
      return new Headers2(headers.reduce((result, value, index, array) => {
        if (index % 2 === 0) {
          result.push(array.slice(index, index + 2));
        }
        return result;
      }, []).filter(([name, value]) => {
        try {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return true;
        } catch {
          return false;
        }
      }));
    }
    var redirectStatus = new Set([301, 302, 303, 307, 308]);
    var isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    var INTERNALS$1 = Symbol("Response internals");
    var Response2 = class extends Body {
      constructor(body = null, options = {}) {
        super(body, options);
        const status = options.status != null ? options.status : 200;
        const headers = new Headers2(options.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options.url,
          status,
          statusText: options.statusText || "",
          headers,
          counter: options.counter,
          highWaterMark: options.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response2(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size,
          highWaterMark: this.highWaterMark
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response2(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response2(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response2.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    var getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
    };
    function stripURLForUseAsAReferrer(url, originOnly = false) {
      if (url == null) {
        return "no-referrer";
      }
      url = new URL(url);
      if (/^(about|blob|data):$/.test(url.protocol)) {
        return "no-referrer";
      }
      url.username = "";
      url.password = "";
      url.hash = "";
      if (originOnly) {
        url.pathname = "";
        url.search = "";
      }
      return url;
    }
    var ReferrerPolicy = new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    var DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
    function validateReferrerPolicy(referrerPolicy) {
      if (!ReferrerPolicy.has(referrerPolicy)) {
        throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
      }
      return referrerPolicy;
    }
    function isOriginPotentiallyTrustworthy(url) {
      if (/^(http|ws)s:$/.test(url.protocol)) {
        return true;
      }
      const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
      const hostIPVersion = net.isIP(hostIp);
      if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
        return true;
      }
      if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
        return true;
      }
      if (/^(.+\.)*localhost$/.test(url.host)) {
        return false;
      }
      if (url.protocol === "file:") {
        return true;
      }
      return false;
    }
    function isUrlPotentiallyTrustworthy(url) {
      if (/^about:(blank|srcdoc)$/.test(url)) {
        return true;
      }
      if (url.protocol === "data:") {
        return true;
      }
      if (/^(blob|filesystem):$/.test(url.protocol)) {
        return true;
      }
      return isOriginPotentiallyTrustworthy(url);
    }
    function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
      if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
        return null;
      }
      const policy = request.referrerPolicy;
      if (request.referrer === "about:client") {
        return "no-referrer";
      }
      const referrerSource = request.referrer;
      let referrerURL = stripURLForUseAsAReferrer(referrerSource);
      let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
      if (referrerURL.toString().length > 4096) {
        referrerURL = referrerOrigin;
      }
      if (referrerURLCallback) {
        referrerURL = referrerURLCallback(referrerURL);
      }
      if (referrerOriginCallback) {
        referrerOrigin = referrerOriginCallback(referrerOrigin);
      }
      const currentURL = new URL(request.url);
      switch (policy) {
        case "no-referrer":
          return "no-referrer";
        case "origin":
          return referrerOrigin;
        case "unsafe-url":
          return referrerURL;
        case "strict-origin":
          if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerOrigin.toString();
        case "strict-origin-when-cross-origin":
          if (referrerURL.origin === currentURL.origin) {
            return referrerURL;
          }
          if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerOrigin;
        case "same-origin":
          if (referrerURL.origin === currentURL.origin) {
            return referrerURL;
          }
          return "no-referrer";
        case "origin-when-cross-origin":
          if (referrerURL.origin === currentURL.origin) {
            return referrerURL;
          }
          return referrerOrigin;
        case "no-referrer-when-downgrade":
          if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
            return "no-referrer";
          }
          return referrerURL;
        default:
          throw new TypeError(`Invalid referrerPolicy: ${policy}`);
      }
    }
    function parseReferrerPolicyFromHeader(headers) {
      const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
      let policy = "";
      for (const token of policyTokens) {
        if (token && ReferrerPolicy.has(token)) {
          policy = token;
        }
      }
      return policy;
    }
    var INTERNALS = Symbol("Request internals");
    var isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    var Request2 = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentails.`);
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers2(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return node_url.format(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
      }
      clone() {
        return new Request2(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request2.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
    });
    var getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers2(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const options = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options
      };
    };
    var AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    var supportedSchemas = new Set(["data:", "http:", "https:"]);
    async function fetch2(url, options_) {
      return new Promise((resolve, reject) => {
        const request = new Request2(url, options_);
        const { parsedURL, options } = getNodeRequestOptions(request);
        if (!supportedSchemas.has(parsedURL.protocol)) {
          throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
        }
        if (parsedURL.protocol === "data:") {
          const data = dataUriToBuffer(request.url);
          const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
          resolve(response2);
          return;
        }
        const send = (parsedURL.protocol === "https:" ? https__default["default"] : http__default["default"]).request;
        const { signal } = request;
        let response = null;
        const abort = () => {
          const error = new AbortError("The operation was aborted.");
          reject(error);
          if (request.body && request.body instanceof Stream__default["default"].Readable) {
            request.body.destroy(error);
          }
          if (!response || !response.body) {
            return;
          }
          response.body.emit("error", error);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = () => {
          abort();
          finalize();
        };
        const request_ = send(parsedURL, options);
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        const finalize = () => {
          request_.abort();
          if (signal) {
            signal.removeEventListener("abort", abortAndFinalize);
          }
        };
        request_.on("error", (error) => {
          reject(new FetchError(`request to ${request.url} failed, reason: ${error.message}`, "system", error));
          finalize();
        });
        fixResponseChunkedTransferBadEnding(request_, (error) => {
          response.body.destroy(error);
        });
        if (process.version < "v14") {
          request_.on("socket", (s) => {
            let endedWithEventsCount;
            s.prependListener("end", () => {
              endedWithEventsCount = s._eventsCount;
            });
            s.prependListener("close", (hadError) => {
              if (response && endedWithEventsCount < s._eventsCount && !hadError) {
                const error = new Error("Premature close");
                error.code = "ERR_STREAM_PREMATURE_CLOSE";
                response.body.emit("error", error);
              }
            });
          });
        }
        request_.on("response", (response_) => {
          request_.setTimeout(0);
          const headers = fromRawHeaders(response_.rawHeaders);
          if (isRedirect(response_.statusCode)) {
            const location = headers.get("Location");
            const locationURL = location === null ? null : new URL(location, request.url);
            switch (request.redirect) {
              case "error":
                reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  headers.set("Location", locationURL);
                }
                break;
              case "follow": {
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOptions = {
                  headers: new Headers2(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: clone(request),
                  signal: request.signal,
                  size: request.size,
                  referrer: request.referrer,
                  referrerPolicy: request.referrerPolicy
                };
                if (response_.statusCode !== 303 && request.body && options_.body instanceof Stream__default["default"].Readable) {
                  reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
                  requestOptions.method = "GET";
                  requestOptions.body = void 0;
                  requestOptions.headers.delete("content-length");
                }
                const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
                if (responseReferrerPolicy) {
                  requestOptions.referrerPolicy = responseReferrerPolicy;
                }
                resolve(fetch2(new Request2(locationURL, requestOptions)));
                finalize();
                return;
              }
              default:
                return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
            }
          }
          if (signal) {
            response_.once("end", () => {
              signal.removeEventListener("abort", abortAndFinalize);
            });
          }
          let body = Stream.pipeline(response_, new Stream.PassThrough(), reject);
          if (process.version < "v12.10") {
            response_.on("aborted", abortAndFinalize);
          }
          const responseOptions = {
            url: request.url,
            status: response_.statusCode,
            statusText: response_.statusMessage,
            headers,
            size: request.size,
            counter: request.counter,
            highWaterMark: request.highWaterMark
          };
          const codings = headers.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
            response = new Response2(body, responseOptions);
            resolve(response);
            return;
          }
          const zlibOptions = {
            flush: zlib__default["default"].Z_SYNC_FLUSH,
            finishFlush: zlib__default["default"].Z_SYNC_FLUSH
          };
          if (codings === "gzip" || codings === "x-gzip") {
            body = Stream.pipeline(body, zlib__default["default"].createGunzip(zlibOptions), reject);
            response = new Response2(body, responseOptions);
            resolve(response);
            return;
          }
          if (codings === "deflate" || codings === "x-deflate") {
            const raw = Stream.pipeline(response_, new Stream.PassThrough(), reject);
            raw.once("data", (chunk) => {
              body = (chunk[0] & 15) === 8 ? Stream.pipeline(body, zlib__default["default"].createInflate(), reject) : Stream.pipeline(body, zlib__default["default"].createInflateRaw(), reject);
              response = new Response2(body, responseOptions);
              resolve(response);
            });
            return;
          }
          if (codings === "br") {
            body = Stream.pipeline(body, zlib__default["default"].createBrotliDecompress(), reject);
            response = new Response2(body, responseOptions);
            resolve(response);
            return;
          }
          response = new Response2(body, responseOptions);
          resolve(response);
        });
        writeToStream(request_, request);
      });
    }
    function fixResponseChunkedTransferBadEnding(request, errorCallback) {
      const LAST_CHUNK = Buffer.from("0\r\n\r\n");
      let isChunkedTransfer = false;
      let properLastChunkReceived = false;
      let previousChunk;
      request.on("response", (response) => {
        const { headers } = response;
        isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
      });
      request.on("socket", (socket) => {
        const onSocketClose = () => {
          if (isChunkedTransfer && !properLastChunkReceived) {
            const error = new Error("Premature close");
            error.code = "ERR_STREAM_PREMATURE_CLOSE";
            errorCallback(error);
          }
        };
        socket.prependListener("close", onSocketClose);
        request.on("abort", () => {
          socket.removeListener("close", onSocketClose);
        });
        socket.on("data", (buf) => {
          properLastChunkReceived = Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
          if (!properLastChunkReceived && previousChunk) {
            properLastChunkReceived = Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
          }
          previousChunk = buf;
        });
      });
    }
    function __fetch_polyfill() {
      Object.defineProperties(globalThis, {
        fetch: {
          enumerable: true,
          configurable: true,
          value: fetch2
        },
        Response: {
          enumerable: true,
          configurable: true,
          value: Response2
        },
        Request: {
          enumerable: true,
          configurable: true,
          value: Request2
        },
        Headers: {
          enumerable: true,
          configurable: true,
          value: Headers2
        }
      });
    }
    __fetch_polyfill();
    exports2.File = File;
    exports2.FormData = FormData;
  }
});

// .netlify/server/chunks/index-44b51311.js
var require_index_44b51311 = __commonJS({
  ".netlify/server/chunks/index-44b51311.js"(exports2) {
    var __defProp2 = Object.defineProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    __export(exports2, {
      a: () => safe_not_equal,
      b: () => subscribe,
      c: () => create_ssr_component,
      d: () => add_attribute,
      e: () => add_classes,
      f: () => each,
      g: () => escape,
      m: () => missing_component,
      n: () => noop,
      s: () => setContext,
      v: () => validate_component
    });
    function noop() {
    }
    function run(fn) {
      return fn();
    }
    function blank_object() {
      return Object.create(null);
    }
    function run_all(fns) {
      fns.forEach(run);
    }
    function safe_not_equal(a, b) {
      return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
    }
    function subscribe(store, ...callbacks) {
      if (store == null) {
        return noop;
      }
      const unsub = store.subscribe(...callbacks);
      return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    var current_component;
    function set_current_component(component) {
      current_component = component;
    }
    function get_current_component() {
      if (!current_component)
        throw new Error("Function called outside component initialization");
      return current_component;
    }
    function setContext(key, context) {
      get_current_component().$$.context.set(key, context);
    }
    Promise.resolve();
    var boolean_attributes = new Set([
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "hidden",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected"
    ]);
    var escaped = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    function escape(html) {
      return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
    }
    function each(items, fn) {
      let str = "";
      for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
      }
      return str;
    }
    var missing_component = {
      $$render: () => ""
    };
    function validate_component(component, name) {
      if (!component || !component.$$render) {
        if (name === "svelte:component")
          name += " this={...}";
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
      }
      return component;
    }
    var on_destroy;
    function create_ssr_component(fn) {
      function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
          on_destroy,
          context: new Map(context || (parent_component ? parent_component.$$.context : [])),
          on_mount: [],
          before_update: [],
          after_update: [],
          callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
      }
      return {
        render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
          on_destroy = [];
          const result = { title: "", head: "", css: new Set() };
          const html = $$render(result, props, {}, $$slots, context);
          run_all(on_destroy);
          return {
            html,
            css: {
              code: Array.from(result.css).map((css) => css.code).join("\n"),
              map: null
            },
            head: result.title + result.head
          };
        },
        $$render
      };
    }
    function add_attribute(name, value, boolean) {
      if (value == null || boolean && !value)
        return "";
      return ` ${name}${value === true && boolean_attributes.has(name) ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
    }
    function add_classes(classes) {
      return classes ? ` class="${classes}"` : "";
    }
  }
});

// .netlify/server/app.js
var require_app = __commonJS({
  ".netlify/server/app.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __defProps2 = Object.defineProperties;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues2 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp2.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      if (__getOwnPropSymbols2)
        for (var prop of __getOwnPropSymbols2(b)) {
          if (__propIsEnum2.call(b, prop))
            __defNormalProp2(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      App: () => App,
      override: () => override
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    function afterUpdate() {
    }
    var Root = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let { stores } = $$props;
      let { page } = $$props;
      let { components } = $$props;
      let { props_0 = null } = $$props;
      let { props_1 = null } = $$props;
      let { props_2 = null } = $$props;
      (0, import_index_44b51311.s)("__svelte__", stores);
      afterUpdate(stores.page.notify);
      if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
        $$bindings.stores(stores);
      if ($$props.page === void 0 && $$bindings.page && page !== void 0)
        $$bindings.page(page);
      if ($$props.components === void 0 && $$bindings.components && components !== void 0)
        $$bindings.components(components);
      if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
        $$bindings.props_0(props_0);
      if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
        $$bindings.props_1(props_1);
      if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
        $$bindings.props_2(props_2);
      {
        stores.page.set(page);
      }
      return `


${components[1] ? `${(0, import_index_44b51311.v)(components[0] || import_index_44b51311.m, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
        default: () => {
          return `${components[2] ? `${(0, import_index_44b51311.v)(components[1] || import_index_44b51311.m, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
            default: () => {
              return `${(0, import_index_44b51311.v)(components[2] || import_index_44b51311.m, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`;
            }
          })}` : `${(0, import_index_44b51311.v)(components[1] || import_index_44b51311.m, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
        }
      })}` : `${(0, import_index_44b51311.v)(components[0] || import_index_44b51311.m, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
    });
    function to_headers(object) {
      const headers = new Headers();
      if (object) {
        for (const key in object) {
          const value = object[key];
          if (!value)
            continue;
          if (typeof value === "string") {
            headers.set(key, value);
          } else {
            value.forEach((value2) => {
              headers.append(key, value2);
            });
          }
        }
      }
      return headers;
    }
    function hash(value) {
      let hash2 = 5381;
      let i = value.length;
      if (typeof value === "string") {
        while (i)
          hash2 = hash2 * 33 ^ value.charCodeAt(--i);
      } else {
        while (i)
          hash2 = hash2 * 33 ^ value[--i];
      }
      return (hash2 >>> 0).toString(36);
    }
    function decode_params(params) {
      for (const key in params) {
        params[key] = params[key].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
      }
      return params;
    }
    function error(body) {
      return new Response(body, {
        status: 500
      });
    }
    function is_string(s2) {
      return typeof s2 === "string" || s2 instanceof String;
    }
    var text_types = new Set([
      "application/xml",
      "application/json",
      "application/x-www-form-urlencoded",
      "multipart/form-data"
    ]);
    function is_text(content_type) {
      if (!content_type)
        return true;
      const type = content_type.split(";")[0].toLowerCase();
      return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
    }
    async function render_endpoint(event, route, match) {
      const mod = await route.load();
      const handler = mod[event.request.method.toLowerCase().replace("delete", "del")];
      if (!handler) {
        return;
      }
      event.params = route.params ? decode_params(route.params(match)) : {};
      const response = await handler(event);
      const preface = `Invalid response from route ${event.url.pathname}`;
      if (typeof response !== "object") {
        return error(`${preface}: expected an object, got ${typeof response}`);
      }
      if (response.fallthrough) {
        return;
      }
      const { status = 200, body = {} } = response;
      const headers = response.headers instanceof Headers ? response.headers : to_headers(response.headers);
      const type = headers.get("content-type");
      if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
        return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
      }
      let normalized_body;
      if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
        headers.set("content-type", "application/json; charset=utf-8");
        normalized_body = JSON.stringify(body);
      } else {
        normalized_body = body;
      }
      if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
        const cache_control = headers.get("cache-control");
        if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
          headers.set("etag", `"${hash(normalized_body)}"`);
        }
      }
      return new Response(normalized_body, {
        status,
        headers
      });
    }
    function is_pojo(body) {
      if (typeof body !== "object")
        return false;
      if (body) {
        if (body instanceof Uint8Array)
          return false;
        if (body._readableState && body._writableState && body._events)
          return false;
        if (body[Symbol.toStringTag] === "ReadableStream")
          return false;
      }
      return true;
    }
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
    var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
    var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
    var escaped = {
      "<": "\\u003C",
      ">": "\\u003E",
      "/": "\\u002F",
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
      "\0": "\\0",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
    function devalue(value) {
      var counts = new Map();
      function walk(thing) {
        if (typeof thing === "function") {
          throw new Error("Cannot stringify a function");
        }
        if (counts.has(thing)) {
          counts.set(thing, counts.get(thing) + 1);
          return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
          var type = getType(thing);
          switch (type) {
            case "Number":
            case "String":
            case "Boolean":
            case "Date":
            case "RegExp":
              return;
            case "Array":
              thing.forEach(walk);
              break;
            case "Set":
            case "Map":
              Array.from(thing).forEach(walk);
              break;
            default:
              var proto = Object.getPrototypeOf(thing);
              if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
                throw new Error("Cannot stringify arbitrary non-POJOs");
              }
              if (Object.getOwnPropertySymbols(thing).length > 0) {
                throw new Error("Cannot stringify POJOs with symbolic keys");
              }
              Object.keys(thing).forEach(function(key) {
                return walk(thing[key]);
              });
          }
        }
      }
      walk(value);
      var names = new Map();
      Array.from(counts).filter(function(entry) {
        return entry[1] > 1;
      }).sort(function(a, b) {
        return b[1] - a[1];
      }).forEach(function(entry, i) {
        names.set(entry[0], getName(i));
      });
      function stringify(thing) {
        if (names.has(thing)) {
          return names.get(thing);
        }
        if (isPrimitive(thing)) {
          return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
          case "Number":
          case "String":
          case "Boolean":
            return "Object(" + stringify(thing.valueOf()) + ")";
          case "RegExp":
            return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
          case "Date":
            return "new Date(" + thing.getTime() + ")";
          case "Array":
            var members = thing.map(function(v, i) {
              return i in thing ? stringify(v) : "";
            });
            var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
            return "[" + members.join(",") + tail + "]";
          case "Set":
          case "Map":
            return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
          default:
            var obj = "{" + Object.keys(thing).map(function(key) {
              return safeKey(key) + ":" + stringify(thing[key]);
            }).join(",") + "}";
            var proto = Object.getPrototypeOf(thing);
            if (proto === null) {
              return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
            }
            return obj;
        }
      }
      var str = stringify(value);
      if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function(name, thing) {
          params_1.push(name);
          if (isPrimitive(thing)) {
            values_1.push(stringifyPrimitive(thing));
            return;
          }
          var type = getType(thing);
          switch (type) {
            case "Number":
            case "String":
            case "Boolean":
              values_1.push("Object(" + stringify(thing.valueOf()) + ")");
              break;
            case "RegExp":
              values_1.push(thing.toString());
              break;
            case "Date":
              values_1.push("new Date(" + thing.getTime() + ")");
              break;
            case "Array":
              values_1.push("Array(" + thing.length + ")");
              thing.forEach(function(v, i) {
                statements_1.push(name + "[" + i + "]=" + stringify(v));
              });
              break;
            case "Set":
              values_1.push("new Set");
              statements_1.push(name + "." + Array.from(thing).map(function(v) {
                return "add(" + stringify(v) + ")";
              }).join("."));
              break;
            case "Map":
              values_1.push("new Map");
              statements_1.push(name + "." + Array.from(thing).map(function(_a) {
                var k = _a[0], v = _a[1];
                return "set(" + stringify(k) + ", " + stringify(v) + ")";
              }).join("."));
              break;
            default:
              values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
              Object.keys(thing).forEach(function(key) {
                statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
              });
          }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
      } else {
        return str;
      }
    }
    function getName(num) {
      var name = "";
      do {
        name = chars[num % chars.length] + name;
        num = ~~(num / chars.length) - 1;
      } while (num >= 0);
      return reserved.test(name) ? name + "_" : name;
    }
    function isPrimitive(thing) {
      return Object(thing) !== thing;
    }
    function stringifyPrimitive(thing) {
      if (typeof thing === "string")
        return stringifyString(thing);
      if (thing === void 0)
        return "void 0";
      if (thing === 0 && 1 / thing < 0)
        return "-0";
      var str = String(thing);
      if (typeof thing === "number")
        return str.replace(/^(-)?0\./, "$1.");
      return str;
    }
    function getType(thing) {
      return Object.prototype.toString.call(thing).slice(8, -1);
    }
    function escapeUnsafeChar(c) {
      return escaped[c] || c;
    }
    function escapeUnsafeChars(str) {
      return str.replace(unsafeChars, escapeUnsafeChar);
    }
    function safeKey(key) {
      return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
    }
    function safeProp(key) {
      return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
    }
    function stringifyString(str) {
      var result = '"';
      for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
          result += '\\"';
        } else if (char in escaped) {
          result += escaped[char];
        } else if (code >= 55296 && code <= 57343) {
          var next = str.charCodeAt(i + 1);
          if (code <= 56319 && (next >= 56320 && next <= 57343)) {
            result += char + str[++i];
          } else {
            result += "\\u" + code.toString(16).toUpperCase();
          }
        } else {
          result += char;
        }
      }
      result += '"';
      return result;
    }
    function noop() {
    }
    function safe_not_equal(a, b) {
      return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
    }
    Promise.resolve();
    var subscriber_queue = [];
    function writable(value, start = noop) {
      let stop;
      const subscribers = new Set();
      function set(new_value) {
        if (safe_not_equal(value, new_value)) {
          value = new_value;
          if (stop) {
            const run_queue = !subscriber_queue.length;
            for (const subscriber of subscribers) {
              subscriber[1]();
              subscriber_queue.push(subscriber, value);
            }
            if (run_queue) {
              for (let i = 0; i < subscriber_queue.length; i += 2) {
                subscriber_queue[i][0](subscriber_queue[i + 1]);
              }
              subscriber_queue.length = 0;
            }
          }
        }
      }
      function update(fn) {
        set(fn(value));
      }
      function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
          stop = start(set) || noop;
        }
        run(value);
        return () => {
          subscribers.delete(subscriber);
          if (subscribers.size === 0) {
            stop();
            stop = null;
          }
        };
      }
      return { set, update, subscribe };
    }
    function coalesce_to_error(err) {
      return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
    }
    var escape_json_string_in_html_dict = {
      '"': '\\"',
      "<": "\\u003C",
      ">": "\\u003E",
      "/": "\\u002F",
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
      "\0": "\\0",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    function escape_json_string_in_html(str) {
      return escape(str, escape_json_string_in_html_dict, (code) => `\\u${code.toString(16).toUpperCase()}`);
    }
    var escape_html_attr_dict = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    };
    function escape_html_attr(str) {
      return '"' + escape(str, escape_html_attr_dict, (code) => `&#${code};`) + '"';
    }
    function escape(str, dict, unicode_encoder) {
      let result = "";
      for (let i = 0; i < str.length; i += 1) {
        const char = str.charAt(i);
        const code = char.charCodeAt(0);
        if (char in dict) {
          result += dict[char];
        } else if (code >= 55296 && code <= 57343) {
          const next = str.charCodeAt(i + 1);
          if (code <= 56319 && next >= 56320 && next <= 57343) {
            result += char + str[++i];
          } else {
            result += unicode_encoder(code);
          }
        } else {
          result += char;
        }
      }
      return result;
    }
    var s = JSON.stringify;
    function create_prerendering_url_proxy(url) {
      return new Proxy(url, {
        get: (target, prop, receiver) => {
          if (prop === "search" || prop === "searchParams") {
            throw new Error(`Cannot access url.${prop} on a page with prerendering enabled`);
          }
          return Reflect.get(target, prop, receiver);
        }
      });
    }
    async function render_response({
      branch,
      options,
      state,
      $session,
      page_config,
      status,
      error: error2,
      url,
      params,
      ssr,
      stuff
    }) {
      const css = new Set(options.manifest._.entry.css);
      const js = new Set(options.manifest._.entry.js);
      const styles = new Map();
      const serialized_data = [];
      let rendered;
      let is_private = false;
      let maxage;
      if (error2) {
        error2.stack = options.get_stack(error2);
      }
      if (ssr) {
        branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
          if (node.css)
            node.css.forEach((url2) => css.add(url2));
          if (node.js)
            node.js.forEach((url2) => js.add(url2));
          if (node.styles)
            Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
          if (fetched && page_config.hydrate)
            serialized_data.push(...fetched);
          if (uses_credentials)
            is_private = true;
          maxage = loaded.maxage;
        });
        const session = writable($session);
        const props = {
          stores: {
            page: writable(null),
            navigating: writable(null),
            session
          },
          page: {
            url: state.prerender ? create_prerendering_url_proxy(url) : url,
            params,
            status,
            error: error2,
            stuff
          },
          components: branch.map(({ node }) => node.module.default)
        };
        const print_error = (property, replacement) => {
          Object.defineProperty(props.page, property, {
            get: () => {
              throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
            }
          });
        };
        print_error("origin", "origin");
        print_error("path", "pathname");
        print_error("query", "searchParams");
        for (let i = 0; i < branch.length; i += 1) {
          props[`props_${i}`] = await branch[i].loaded.props;
        }
        let session_tracking_active = false;
        const unsubscribe = session.subscribe(() => {
          if (session_tracking_active)
            is_private = true;
        });
        session_tracking_active = true;
        try {
          rendered = options.root.render(props);
        } finally {
          unsubscribe();
        }
      } else {
        rendered = { head: "", html: "", css: { code: "", map: null } };
      }
      let { head, html: body } = rendered;
      const inlined_style = Array.from(styles.values()).join("\n");
      if (state.prerender) {
        if (maxage) {
          head += `<meta http-equiv="cache-control" content="max-age=${maxage}">`;
        }
      }
      if (options.amp) {
        head += `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>

		<style amp-custom>${inlined_style}
${rendered.css.code}</style>`;
        if (options.service_worker) {
          head += '<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"><\/script>';
          body += `<amp-install-serviceworker src="${options.service_worker}" layout="nodisplay"></amp-install-serviceworker>`;
        }
      } else {
        if (inlined_style) {
          head += `
	<style${options.dev ? " data-svelte" : ""}>${inlined_style}</style>`;
        }
        head += Array.from(css).map((dep) => `
	<link${styles.has(dep) ? ' disabled media="(max-width: 0)"' : ""} rel="stylesheet" href="${options.prefix + dep}">`).join("");
        if (page_config.router || page_config.hydrate) {
          head += Array.from(js).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
          head += `
			<script type="module">
				import { start } from ${s(options.prefix + options.manifest._.entry.file)};
				start({
					target: ${options.target ? `document.querySelector(${s(options.target)})` : "document.body"},
					paths: ${s(options.paths)},
					session: ${try_serialize($session, (error3) => {
            throw new Error(`Failed to serialize session data: ${error3.message}`);
          })},
					route: ${!!page_config.router},
					spa: ${!ssr},
					trailing_slash: ${s(options.trailing_slash)},
					hydrate: ${ssr && page_config.hydrate ? `{
						status: ${status},
						error: ${serialize_error(error2)},
						nodes: [
							${(branch || []).map(({ node }) => `import(${s(options.prefix + node.entry)})`).join(",\n						")}
						],
						url: new URL(${s(url.href)}),
						params: ${devalue(params)}
					}` : "null"}
				});
			<\/script>`;
          body += serialized_data.map(({ url: url2, body: body2, json }) => {
            let attributes = `type="application/json" data-type="svelte-data" data-url=${escape_html_attr(url2)}`;
            if (body2)
              attributes += ` data-body="${hash(body2)}"`;
            return `<script ${attributes}>${json}<\/script>`;
          }).join("\n\n	");
        }
        if (options.service_worker) {
          head += `
			<script>
				if ('serviceWorker' in navigator) {
					navigator.serviceWorker.register('${options.service_worker}');
				}
			<\/script>`;
        }
      }
      const segments = url.pathname.slice(options.paths.base.length).split("/").slice(2);
      const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
      const html = options.template({ head, body, assets: assets2 });
      const headers = new Headers({
        "content-type": "text/html",
        etag: `"${hash(html)}"`
      });
      if (maxage) {
        headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${maxage}`);
      }
      if (!options.floc) {
        headers.set("permissions-policy", "interest-cohort=()");
      }
      return new Response(html, {
        status,
        headers
      });
    }
    function try_serialize(data, fail) {
      try {
        return devalue(data);
      } catch (err) {
        if (fail)
          fail(coalesce_to_error(err));
        return null;
      }
    }
    function serialize_error(error2) {
      if (!error2)
        return null;
      let serialized = try_serialize(error2);
      if (!serialized) {
        const { name, message, stack } = error2;
        serialized = try_serialize(__spreadProps2(__spreadValues2({}, error2), { name, message, stack }));
      }
      if (!serialized) {
        serialized = "{}";
      }
      return serialized;
    }
    function normalize(loaded) {
      const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
      if (loaded.error || has_error_status) {
        const status = loaded.status;
        if (!loaded.error && has_error_status) {
          return {
            status: status || 500,
            error: new Error()
          };
        }
        const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
        if (!(error2 instanceof Error)) {
          return {
            status: 500,
            error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
          };
        }
        if (!status || status < 400 || status > 599) {
          console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
          return { status: 500, error: error2 };
        }
        return { status, error: error2 };
      }
      if (loaded.redirect) {
        if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
          return {
            status: 500,
            error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
          };
        }
        if (typeof loaded.redirect !== "string") {
          return {
            status: 500,
            error: new Error('"redirect" property returned from load() must be a string')
          };
        }
      }
      if (loaded.context) {
        throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
      }
      return loaded;
    }
    var absolute = /^([a-z]+:)?\/?\//;
    var scheme = /^[a-z]+:/;
    function resolve(base2, path) {
      if (scheme.test(path))
        return path;
      const base_match = absolute.exec(base2);
      const path_match = absolute.exec(path);
      if (!base_match) {
        throw new Error(`bad base path: "${base2}"`);
      }
      const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
      const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
      baseparts.pop();
      for (let i = 0; i < pathparts.length; i += 1) {
        const part = pathparts[i];
        if (part === ".")
          continue;
        else if (part === "..")
          baseparts.pop();
        else
          baseparts.push(part);
      }
      const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
      return `${prefix}${baseparts.join("/")}`;
    }
    function is_root_relative(path) {
      return path[0] === "/" && path[1] !== "/";
    }
    async function load_node({
      event,
      options,
      state,
      route,
      url,
      params,
      node,
      $session,
      stuff,
      is_error,
      status,
      error: error2
    }) {
      const { module: module22 } = node;
      let uses_credentials = false;
      const fetched = [];
      let set_cookie_headers = [];
      let loaded;
      if (module22.load) {
        const load_input = {
          url: state.prerender ? create_prerendering_url_proxy(url) : url,
          params,
          get session() {
            uses_credentials = true;
            return $session;
          },
          fetch: async (resource, opts = {}) => {
            let requested;
            if (typeof resource === "string") {
              requested = resource;
            } else {
              requested = resource.url;
              opts = __spreadValues2({
                method: resource.method,
                headers: resource.headers,
                body: resource.body,
                mode: resource.mode,
                credentials: resource.credentials,
                cache: resource.cache,
                redirect: resource.redirect,
                referrer: resource.referrer,
                integrity: resource.integrity
              }, opts);
            }
            opts.headers = new Headers(opts.headers);
            const resolved = resolve(event.url.pathname, requested.split("?")[0]);
            let response;
            const prefix = options.paths.assets || options.paths.base;
            const filename = (resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
            const filename_html = `${filename}/index.html`;
            const is_asset = options.manifest.assets.has(filename);
            const is_asset_html = options.manifest.assets.has(filename_html);
            if (is_asset || is_asset_html) {
              const file = is_asset ? filename : filename_html;
              if (options.read) {
                const type = is_asset ? options.manifest._.mime[filename.slice(filename.lastIndexOf("."))] : "text/html";
                response = new Response(options.read(file), {
                  headers: type ? { "content-type": type } : {}
                });
              } else {
                response = await fetch(`${url.origin}/${file}`, opts);
              }
            } else if (is_root_relative(resolved)) {
              const relative = resolved;
              if (opts.credentials !== "omit") {
                uses_credentials = true;
                const cookie = event.request.headers.get("cookie");
                const authorization = event.request.headers.get("authorization");
                if (cookie) {
                  opts.headers.set("cookie", cookie);
                }
                if (authorization && !opts.headers.has("authorization")) {
                  opts.headers.set("authorization", authorization);
                }
              }
              if (opts.body && typeof opts.body !== "string") {
                throw new Error("Request body must be a string");
              }
              const rendered = await respond(new Request(new URL(requested, event.url).href, opts), options, {
                fetched: requested,
                initiator: route
              });
              if (rendered) {
                if (state.prerender) {
                  state.prerender.dependencies.set(relative, rendered);
                }
                response = rendered;
              } else {
                return fetch(new URL(requested, event.url).href, {
                  method: opts.method || "GET",
                  headers: opts.headers
                });
              }
            } else {
              if (resolved.startsWith("//")) {
                throw new Error(`Cannot request protocol-relative URL (${requested}) in server-side fetch`);
              }
              if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
                uses_credentials = true;
                const cookie = event.request.headers.get("cookie");
                if (cookie)
                  opts.headers.set("cookie", cookie);
              }
              const external_request = new Request(requested, opts);
              response = await options.hooks.externalFetch.call(null, external_request);
            }
            if (response) {
              const proxy = new Proxy(response, {
                get(response2, key, _receiver) {
                  async function text() {
                    const body = await response2.text();
                    const headers = {};
                    for (const [key2, value] of response2.headers) {
                      if (key2 === "set-cookie") {
                        set_cookie_headers = set_cookie_headers.concat(value);
                      } else if (key2 !== "etag") {
                        headers[key2] = value;
                      }
                    }
                    if (!opts.body || typeof opts.body === "string") {
                      fetched.push({
                        url: requested,
                        body: opts.body,
                        json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":"${escape_json_string_in_html(body)}"}`
                      });
                    }
                    return body;
                  }
                  if (key === "text") {
                    return text;
                  }
                  if (key === "json") {
                    return async () => {
                      return JSON.parse(await text());
                    };
                  }
                  return Reflect.get(response2, key, response2);
                }
              });
              return proxy;
            }
            return response || new Response("Not found", {
              status: 404
            });
          },
          stuff: __spreadValues2({}, stuff)
        };
        if (options.dev) {
          Object.defineProperty(load_input, "page", {
            get: () => {
              throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
            }
          });
        }
        if (is_error) {
          load_input.status = status;
          load_input.error = error2;
        }
        loaded = await module22.load.call(null, load_input);
        if (!loaded) {
          throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
        }
      } else {
        loaded = {};
      }
      if (loaded.fallthrough && !is_error) {
        return;
      }
      return {
        node,
        loaded: normalize(loaded),
        stuff: loaded.stuff || stuff,
        fetched,
        set_cookie_headers,
        uses_credentials
      };
    }
    async function respond_with_error({ event, options, state, $session, status, error: error2, ssr }) {
      try {
        const default_layout = await options.manifest._.nodes[0]();
        const default_error = await options.manifest._.nodes[1]();
        const params = {};
        const layout_loaded = await load_node({
          event,
          options,
          state,
          route: null,
          url: event.url,
          params,
          node: default_layout,
          $session,
          stuff: {},
          is_error: false
        });
        const error_loaded = await load_node({
          event,
          options,
          state,
          route: null,
          url: event.url,
          params,
          node: default_error,
          $session,
          stuff: layout_loaded ? layout_loaded.stuff : {},
          is_error: true,
          status,
          error: error2
        });
        return await render_response({
          options,
          state,
          $session,
          page_config: {
            hydrate: options.hydrate,
            router: options.router
          },
          stuff: error_loaded.stuff,
          status,
          error: error2,
          branch: [layout_loaded, error_loaded],
          url: event.url,
          params,
          ssr
        });
      } catch (err) {
        const error3 = coalesce_to_error(err);
        options.handle_error(error3, event);
        return new Response(error3.stack, {
          status: 500
        });
      }
    }
    async function respond$1(opts) {
      const { event, options, state, $session, route, ssr } = opts;
      let nodes;
      if (!ssr) {
        return await render_response(__spreadProps2(__spreadValues2({}, opts), {
          branch: [],
          page_config: {
            hydrate: true,
            router: true
          },
          status: 200,
          url: event.url,
          stuff: {}
        }));
      }
      try {
        nodes = await Promise.all(route.a.map((n) => options.manifest._.nodes[n] && options.manifest._.nodes[n]()));
      } catch (err) {
        const error3 = coalesce_to_error(err);
        options.handle_error(error3, event);
        return await respond_with_error({
          event,
          options,
          state,
          $session,
          status: 500,
          error: error3,
          ssr
        });
      }
      const leaf = nodes[nodes.length - 1].module;
      let page_config = get_page_config(leaf, options);
      if (!leaf.prerender && state.prerender && !state.prerender.all) {
        return new Response(void 0, {
          status: 204
        });
      }
      let branch = [];
      let status = 200;
      let error2;
      let set_cookie_headers = [];
      let stuff = {};
      ssr:
        if (ssr) {
          for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            let loaded;
            if (node) {
              try {
                loaded = await load_node(__spreadProps2(__spreadValues2({}, opts), {
                  url: event.url,
                  node,
                  stuff,
                  is_error: false
                }));
                if (!loaded)
                  return;
                set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
                if (loaded.loaded.redirect) {
                  return with_cookies(new Response(void 0, {
                    status: loaded.loaded.status,
                    headers: {
                      location: loaded.loaded.redirect
                    }
                  }), set_cookie_headers);
                }
                if (loaded.loaded.error) {
                  ({ status, error: error2 } = loaded.loaded);
                }
              } catch (err) {
                const e = coalesce_to_error(err);
                options.handle_error(e, event);
                status = 500;
                error2 = e;
              }
              if (loaded && !error2) {
                branch.push(loaded);
              }
              if (error2) {
                while (i--) {
                  if (route.b[i]) {
                    const error_node = await options.manifest._.nodes[route.b[i]]();
                    let node_loaded;
                    let j = i;
                    while (!(node_loaded = branch[j])) {
                      j -= 1;
                    }
                    try {
                      const error_loaded = await load_node(__spreadProps2(__spreadValues2({}, opts), {
                        url: event.url,
                        node: error_node,
                        stuff: node_loaded.stuff,
                        is_error: true,
                        status,
                        error: error2
                      }));
                      if (error_loaded.loaded.error) {
                        continue;
                      }
                      page_config = get_page_config(error_node.module, options);
                      branch = branch.slice(0, j + 1).concat(error_loaded);
                      stuff = __spreadValues2(__spreadValues2({}, node_loaded.stuff), error_loaded.stuff);
                      break ssr;
                    } catch (err) {
                      const e = coalesce_to_error(err);
                      options.handle_error(e, event);
                      continue;
                    }
                  }
                }
                return with_cookies(await respond_with_error({
                  event,
                  options,
                  state,
                  $session,
                  status,
                  error: error2,
                  ssr
                }), set_cookie_headers);
              }
            }
            if (loaded && loaded.loaded.stuff) {
              stuff = __spreadValues2(__spreadValues2({}, stuff), loaded.loaded.stuff);
            }
          }
        }
      try {
        return with_cookies(await render_response(__spreadProps2(__spreadValues2({}, opts), {
          stuff,
          url: event.url,
          page_config,
          status,
          error: error2,
          branch: branch.filter(Boolean)
        })), set_cookie_headers);
      } catch (err) {
        const error3 = coalesce_to_error(err);
        options.handle_error(error3, event);
        return with_cookies(await respond_with_error(__spreadProps2(__spreadValues2({}, opts), {
          status: 500,
          error: error3
        })), set_cookie_headers);
      }
    }
    function get_page_config(leaf, options) {
      if ("ssr" in leaf) {
        throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs#hooks-handle");
      }
      return {
        router: "router" in leaf ? !!leaf.router : options.router,
        hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
      };
    }
    function with_cookies(response, set_cookie_headers) {
      if (set_cookie_headers.length) {
        set_cookie_headers.forEach((value) => {
          response.headers.append("set-cookie", value);
        });
      }
      return response;
    }
    async function render_page(event, route, match, options, state, ssr) {
      if (state.initiator === route) {
        return new Response(`Not found: ${event.url.pathname}`, {
          status: 404
        });
      }
      const params = route.params ? decode_params(route.params(match)) : {};
      const $session = await options.hooks.getSession(event);
      const response = await respond$1({
        event,
        options,
        state,
        $session,
        route,
        params,
        ssr
      });
      if (response) {
        return response;
      }
      if (state.fetched) {
        return new Response(`Bad request in load function: failed to fetch ${state.fetched}`, {
          status: 500
        });
      }
    }
    async function respond(request, options, state = {}) {
      var _a;
      const url = new URL(request.url);
      if (url.pathname !== "/" && options.trailing_slash !== "ignore") {
        const has_trailing_slash = url.pathname.endsWith("/");
        if (has_trailing_slash && options.trailing_slash === "never" || !has_trailing_slash && options.trailing_slash === "always" && !(url.pathname.split("/").pop() || "").includes(".")) {
          url.pathname = has_trailing_slash ? url.pathname.slice(0, -1) : url.pathname + "/";
          if (url.search === "?")
            url.search = "";
          return new Response(void 0, {
            status: 301,
            headers: {
              location: url.pathname + url.search
            }
          });
        }
      }
      const { parameter, allowed } = options.method_override;
      const method_override = (_a = url.searchParams.get(parameter)) == null ? void 0 : _a.toUpperCase();
      if (method_override) {
        if (request.method === "POST") {
          if (allowed.includes(method_override)) {
            request = new Proxy(request, {
              get: (target, property, _receiver) => {
                if (property === "method")
                  return method_override;
                return Reflect.get(target, property, target);
              }
            });
          } else {
            const verb = allowed.length === 0 ? "enabled" : "allowed";
            const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs#configuration-methodoverride`;
            return new Response(body, {
              status: 400
            });
          }
        } else {
          throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
        }
      }
      const event = {
        request,
        url,
        params: {},
        locals: {}
      };
      const removed = (property, replacement, suffix = "") => ({
        get: () => {
          throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
        }
      });
      const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
      const body_getter = {
        get: () => {
          throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
        }
      };
      Object.defineProperties(event, {
        method: removed("method", "request.method", details),
        headers: removed("headers", "request.headers", details),
        origin: removed("origin", "url.origin"),
        path: removed("path", "url.pathname"),
        query: removed("query", "url.searchParams"),
        body: body_getter,
        rawBody: body_getter
      });
      let ssr = true;
      try {
        const response = await options.hooks.handle({
          event,
          resolve: async (event2, opts) => {
            if (opts && "ssr" in opts)
              ssr = opts.ssr;
            if (state.prerender && state.prerender.fallback) {
              return await render_response({
                url: event2.url,
                params: event2.params,
                options,
                state,
                $session: await options.hooks.getSession(event2),
                page_config: { router: true, hydrate: true },
                stuff: {},
                status: 200,
                branch: [],
                ssr: false
              });
            }
            let decoded = decodeURI(event2.url.pathname);
            if (options.paths.base) {
              if (!decoded.startsWith(options.paths.base))
                return;
              decoded = decoded.slice(options.paths.base.length) || "/";
            }
            for (const route of options.manifest._.routes) {
              const match = route.pattern.exec(decoded);
              if (!match)
                continue;
              const response2 = route.type === "endpoint" ? await render_endpoint(event2, route, match) : await render_page(event2, route, match, options, state, ssr);
              if (response2) {
                if (response2.status === 200 && response2.headers.has("etag")) {
                  let if_none_match_value = request.headers.get("if-none-match");
                  if (if_none_match_value == null ? void 0 : if_none_match_value.startsWith('W/"')) {
                    if_none_match_value = if_none_match_value.substring(2);
                  }
                  const etag = response2.headers.get("etag");
                  if (if_none_match_value === etag) {
                    const headers = new Headers({ etag });
                    for (const key of [
                      "cache-control",
                      "content-location",
                      "date",
                      "expires",
                      "vary"
                    ]) {
                      const value = response2.headers.get(key);
                      if (value)
                        headers.set(key, value);
                    }
                    return new Response(void 0, {
                      status: 304,
                      headers
                    });
                  }
                }
                return response2;
              }
            }
            if (!state.initiator) {
              const $session = await options.hooks.getSession(event2);
              return await respond_with_error({
                event: event2,
                options,
                state,
                $session,
                status: 404,
                error: new Error(`Not found: ${event2.url.pathname}`),
                ssr
              });
            }
          },
          get request() {
            throw new Error("request in handle has been replaced with event" + details);
          }
        });
        if (response && !(response instanceof Response)) {
          throw new Error("handle must return a Response object" + details);
        }
        return response;
      } catch (e) {
        const error2 = coalesce_to_error(e);
        options.handle_error(error2, event);
        try {
          const $session = await options.hooks.getSession(event);
          return await respond_with_error({
            event,
            options,
            state,
            $session,
            status: 500,
            error: error2,
            ssr
          });
        } catch (e2) {
          const error3 = coalesce_to_error(e2);
          return new Response(options.dev ? error3.stack : error3.message, {
            status: 500
          });
        }
      }
    }
    var base = "";
    var assets = "";
    function set_paths(paths) {
      base = paths.base;
      assets = paths.assets || base;
    }
    function set_prerendering(value) {
    }
    var user_hooks = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      [Symbol.toStringTag]: "Module"
    });
    var template = ({ head, body, assets: assets2 }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		\n		' + head + '\n		<!-- You can replace this block to update the Google fonts used in the project -->\n		<link rel="preconnect" href="https://fonts.googleapis.com">\n		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n		<link href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Source+Sans+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+Pro:ital,wght@0,600;1,600&display=swap" rel="stylesheet">  		\n		<!-- End Google Fonts block -->\n\n		<!-- You can add global <meta> tags here, but anything not global or dynamic should be a `<svelte:head>` tag on the proper page(s) instead. -->\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
    var read = null;
    set_paths({ "base": "", "assets": "" });
    var get_hooks = (hooks) => ({
      getSession: hooks.getSession || (() => ({})),
      handle: hooks.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
      handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
      externalFetch: hooks.externalFetch || fetch
    });
    var default_protocol = "https";
    function override(settings) {
      default_protocol = settings.protocol || default_protocol;
      set_paths(settings.paths);
      set_prerendering(settings.prerendering);
      read = settings.read;
    }
    var App = class {
      constructor(manifest) {
        const hooks = get_hooks(user_hooks);
        this.options = {
          amp: false,
          dev: false,
          floc: false,
          get_stack: (error2) => String(error2),
          handle_error: (error2, event) => {
            hooks.handleError({
              error: error2,
              event,
              get request() {
                throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
              }
            });
            error2.stack = this.options.get_stack(error2);
          },
          hooks,
          hydrate: true,
          manifest,
          method_override: { "parameter": "_method", "allowed": [] },
          paths: { base, assets },
          prefix: assets + "/_app/",
          prerender: true,
          read,
          root: Root,
          service_worker: null,
          router: true,
          target: "#svelte",
          template,
          trailing_slash: "never"
        };
      }
      render(request, {
        prerender
      } = {}) {
        if (!(request instanceof Request)) {
          throw new Error("The first argument to app.render must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
        }
        return respond(request, this.options, { prerender });
      }
    };
  }
});

// .netlify/handler.js
var require_handler = __commonJS({
  ".netlify/handler.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    require_shims_24e5b259();
    var server = require_app();
    require("http");
    require("https");
    require("zlib");
    require("stream");
    require("util");
    require("url");
    require("net");
    function init2(manifest) {
      const app = new server.App(manifest);
      return async (event) => {
        const rendered = await app.render(to_request(event));
        const partial_response = __spreadValues({
          statusCode: rendered.status
        }, split_headers(rendered.headers));
        if (rendered.body instanceof Uint8Array) {
          return __spreadProps(__spreadValues({}, partial_response), {
            isBase64Encoded: true,
            body: Buffer.from(rendered.body).toString("base64")
          });
        }
        return __spreadProps(__spreadValues({}, partial_response), {
          body: await rendered.text()
        });
      };
    }
    function to_request(event) {
      const { httpMethod, headers, rawUrl, body, isBase64Encoded } = event;
      const init3 = {
        method: httpMethod,
        headers: new Headers(headers)
      };
      if (httpMethod !== "GET" && httpMethod !== "HEAD") {
        const encoding = isBase64Encoded ? "base64" : "utf-8";
        init3.body = typeof body === "string" ? Buffer.from(body, encoding) : body;
      }
      return new Request(rawUrl, init3);
    }
    function split_headers(headers) {
      const h = {};
      const m = {};
      headers.forEach((value, key) => {
        if (key === "set-cookie") {
          m[key] = value.split(", ");
        } else {
          h[key] = value;
        }
      });
      return {
        headers: h,
        multiValueHeaders: m
      };
    }
    exports2.init = init2;
  }
});

// .netlify/server/chunks/config-51b2cd5b.js
var require_config_51b2cd5b = __commonJS({
  ".netlify/server/chunks/config-51b2cd5b.js"(exports2) {
    var __defProp2 = Object.defineProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    __export(exports2, {
      a: () => siteDescription,
      b: () => siteLink,
      c: () => siteURL,
      d: () => siteAuthor,
      n: () => navItems,
      p: () => postsPerPage,
      s: () => siteTitle
    });
    var siteTitle = "Podcasting 4 Value";
    var siteDescription = "Podcasting 4 beginners from a beginner.";
    var siteURL = "podcasting4value.com";
    var siteLink = "https://github.com/floydianslips/podcasting-4-value-sveltekit";
    var siteAuthor = "Joshua Dennis";
    var postsPerPage = 10;
    var navItems = [];
  }
});

// .netlify/server/entries/pages/__layout.svelte.js
var require_layout_svelte = __commonJS({
  ".netlify/server/entries/pages/__layout.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => _layout,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var subscriber_queue = [];
    function writable(value, start = import_index_44b51311.n) {
      let stop;
      const subscribers = new Set();
      function set(new_value) {
        if ((0, import_index_44b51311.a)(value, new_value)) {
          value = new_value;
          if (stop) {
            const run_queue = !subscriber_queue.length;
            for (const subscriber of subscribers) {
              subscriber[1]();
              subscriber_queue.push(subscriber, value);
            }
            if (run_queue) {
              for (let i = 0; i < subscriber_queue.length; i += 2) {
                subscriber_queue[i][0](subscriber_queue[i + 1]);
              }
              subscriber_queue.length = 0;
            }
          }
        }
      }
      function update(fn) {
        set(fn(value));
      }
      function subscribe2(run, invalidate = import_index_44b51311.n) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
          stop = start(set) || import_index_44b51311.n;
        }
        run(value);
        return () => {
          subscribers.delete(subscriber);
          if (subscribers.size === 0) {
            stop();
            stop = null;
          }
        };
      }
      return { set, update, subscribe: subscribe2 };
    }
    var currentPage = writable("");
    var isMenuOpen = writable(false);
    var NavItem = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let isCurrentPage;
      let $currentPage, $$unsubscribe_currentPage;
      $$unsubscribe_currentPage = (0, import_index_44b51311.b)(currentPage, (value) => $currentPage = value);
      let { href } = $$props;
      if ($$props.href === void 0 && $$bindings.href && href !== void 0)
        $$bindings.href(href);
      isCurrentPage = $currentPage.startsWith(href);
      $$unsubscribe_currentPage();
      return `<li><a${(0, import_index_44b51311.d)("href", href, 0)}${(0, import_index_44b51311.d)("aria-current", isCurrentPage ? "page" : false, 0)}${(0, import_index_44b51311.e)((isCurrentPage ? "active" : "").trim())}>${slots.default ? slots.default({}) : ``}</a></li>`;
    });
    var HamburgerSVG = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<svg viewBox="${"0 0 128 128"}" version="${"1.1"}" style="${"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"}"><g><rect x="${"0"}" y="${"12.48"}" width="${"128"}" height="${"18.688"}"></rect></g><g><rect x="${"0"}" y="${"96.832"}" width="${"128"}" height="${"18.688"}"></rect></g><g><rect x="${"0"}" y="${"54.656"}" width="${"128"}" height="${"18.688"}"></rect></g></svg>`;
    });
    var XSVG = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<svg viewBox="${"0 0 128 128"}" version="${"1.1"}" style="${"fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"}"><path d="${"M64,48.496l-48.496,-48.496l-15.504,15.504l48.496,48.496l-48.496,48.496l15.504,15.504l48.496,-48.496l48.496,48.496l15.504,-15.504l-48.496,-48.496l48.496,-48.496l-15.504,-15.504l-48.496,48.496Z"}"></path></svg>`;
    });
    var HamburgerMenuButton = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let $isMenuOpen, $$unsubscribe_isMenuOpen;
      $$unsubscribe_isMenuOpen = (0, import_index_44b51311.b)(isMenuOpen, (value) => $isMenuOpen = value);
      let { closeOnly } = $$props;
      if ($$props.closeOnly === void 0 && $$bindings.closeOnly && closeOnly !== void 0)
        $$bindings.closeOnly(closeOnly);
      $$unsubscribe_isMenuOpen();
      return `<button${(0, import_index_44b51311.d)("aria-pressed", $isMenuOpen, 0)} class="${"menu-button"}"${(0, import_index_44b51311.d)("tabindex", $isMenuOpen || !closeOnly ? "0" : "-1", 0)}><span class="${"sr-only"}">Toggle hamburger menu</span>
  ${closeOnly ? `${(0, import_index_44b51311.v)(XSVG, "XSVG").$$render($$result, {}, {}, {})}` : `${(0, import_index_44b51311.v)(HamburgerSVG, "HamburgerSVG").$$render($$result, {}, {}, {})}`}</button>`;
    });
    var MainNav = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let $isMenuOpen, $$unsubscribe_isMenuOpen;
      $$unsubscribe_isMenuOpen = (0, import_index_44b51311.b)(isMenuOpen, (value) => $isMenuOpen = value);
      $$unsubscribe_isMenuOpen();
      return `
<nav class="${["main-nav", $isMenuOpen ? "open" : ""].join(" ").trim()}"><ul>${(0, import_index_44b51311.f)(import_config_51b2cd5b.n, (page) => {
        return `${(0, import_index_44b51311.v)(NavItem, "NavItem").$$render($$result, { href: page.route }, {}, {
          default: () => {
            return `${(0, import_index_44b51311.g)(page.title)}
    `;
          }
        })}`;
      })}</ul>
  ${(0, import_index_44b51311.v)(HamburgerMenuButton, "HamburgerMenuButton").$$render($$result, { closeOnly: "true" }, {}, {})}</nav>`;
    });
    var Header = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<header><a class="${"skip-to-content-link"}" href="${"#main"}">Skip to main content
  </a>
  
  <a href="${"/"}" class="${"site-title"}">${(0, import_index_44b51311.g)(import_config_51b2cd5b.s)}</a>
  
  ${(0, import_index_44b51311.v)(HamburgerMenuButton, "HamburgerMenuButton").$$render($$result, {}, {}, {})}
  ${(0, import_index_44b51311.v)(MainNav, "MainNav").$$render($$result, {}, {}, {})}</header>`;
    });
    var Footer = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<footer>${(0, import_index_44b51311.v)(MainNav, "MainNav").$$render($$result, {}, {}, {})}

  <nav><ul><li><a href="${"/api/rss.xml"}" rel="${"external"}">RSS</a></li>
      <li><a href="${"/"}">Home</a></li></ul></nav>

  <p>\xA9${(0, import_index_44b51311.g)(new Date().getFullYear())} ${(0, import_index_44b51311.g)(import_config_51b2cd5b.d)}</p></footer>`;
    });
    var load = async ({ url, fetch: fetch2 }) => {
      await fetch2(`/api/rss.xml`);
      return { props: { path: url.pathname } };
    };
    var _layout = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let $isMenuOpen, $$unsubscribe_isMenuOpen;
      $$unsubscribe_isMenuOpen = (0, import_index_44b51311.b)(isMenuOpen, (value) => $isMenuOpen = value);
      let { path } = $$props;
      if ($$props.path === void 0 && $$bindings.path && path !== void 0)
        $$bindings.path(path);
      {
        currentPage.set(path);
      }
      $$unsubscribe_isMenuOpen();
      return `






<div class="${["layout", $isMenuOpen ? "open" : ""].join(" ").trim()}">${(0, import_index_44b51311.v)(Header, "Header").$$render($$result, {}, {}, {})}
  <main id="${"main"}" tabindex="${"-1"}">${slots.default ? slots.default({}) : ``}</main>
  ${(0, import_index_44b51311.v)(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
    });
  }
});

// .netlify/server/nodes/0.js
var require__ = __commonJS({
  ".netlify/server/nodes/0.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_layout_svelte());
    var entry = "pages/__layout.svelte-bd151461.js";
    var js = ["pages/__layout.svelte-bd151461.js", "chunks/vendor-916d40fb.js", "chunks/config-6e48f758.js", "chunks/singletons-d19c42e4.js"];
    var css = ["assets/pages/__layout.svelte-20a5d105.css"];
  }
});

// .netlify/server/entries/pages/__error.svelte.js
var require_error_svelte = __commonJS({
  ".netlify/server/entries/pages/__error.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => _error,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var load = ({ error, status }) => {
      return { props: { error, status } };
    };
    var _error = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error !== void 0)
        $$bindings.error(error);
      return `







<h2>${(0, import_index_44b51311.g)(status)}</h2>

<p class="${"subhead"}">${(0, import_index_44b51311.g)(error.message)}</p>

<p><strong>Sorry!</strong> Maybe try one of these links?</p>
<ul><li><a href="${"/"}">Home</a></li></ul>`;
    });
  }
});

// .netlify/server/nodes/1.js
var require__2 = __commonJS({
  ".netlify/server/nodes/1.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_error_svelte());
    var entry = "pages/__error.svelte-eb27bbf1.js";
    var js = ["pages/__error.svelte-eb27bbf1.js", "chunks/vendor-916d40fb.js"];
    var css = [];
  }
});

// .netlify/server/chunks/README-25b4f6bf.js
var require_README_25b4f6bf = __commonJS({
  ".netlify/server/chunks/README-25b4f6bf.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => README
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var README = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<h1 id="${"sveltekit-static-blog-starter"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#sveltekit-static-blog-starter"}"><span class="${"icon icon-link"}"></span></a>SvelteKit static blog starter</h1>
<p>This starter contains everything you need to get up and running with <a href="${"https://kit.svelte.dev/"}" rel="${"nofollow"}">SvelteKit</a> as a static site generator for your Markdown (and Svelte)-powered blog. <a href="${"https://sveltekit-static-starter.netlify.app/"}" rel="${"nofollow"}">Check out the demo here</a>, or view the <a href="${"https://github.com/josh-collinsworth/sveltekit-blog-starter"}" rel="${"nofollow"}">GitHub repo here</a>.</p>
<h2 id="${"features"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#features"}"><span class="${"icon icon-link"}"></span></a>Features</h2>
<ul><li>\u26A1\uFE0F <strong>Super fast static site generation with hydration</strong>. Every route is compiled down to static HTML and routed with (optional) JavaScript, thanks to the SvelteKit static adapter (pre-installed)</li>
<li>\u{1F4E6} <strong>Zero-config prefetching</strong> for automatic, fast background preloading of all top-level pages</li>
<li>\u270D\uFE0F <strong>Markdown support</strong> with a pre-configured blog<ul><li>\u{1F4D1} <strong>Pagination</strong> included (can also customize posts per page)</li>
<li>\u2705 <strong>Category pages</strong> included</li>
<li>\u{1F4AC} <strong>Posts JSON API</strong></li></ul></li>
<li>\u{1F485} <strong>Sass</strong> pre-installed and -configured</li>
<li>\u{1F4DD} <strong>mdsvex</strong> pre-installed\u2014use Svelte components inside Markdown!<ul><li>\u{1F517} <strong>Rehype</strong> plugins are included to generate unique heading IDs, for direct linking</li></ul></li>
<li>\u{1F4F1} <strong>Responsive and accessible defaults</strong>; includes a \u201Cskip to content\u201D link and accessible mobile nav menu</li>
<li>\u{1F504} <strong>Page transitions</strong> (<em>fancy!</em>)</li>
<li>\u{1F50E} <strong>Basic SEO</strong> for blog posts (<em>strongly recommend checking that out for yourself, though</em>)</li>
<li>\u{1F4F0} <strong>RSS feed</strong> set up and ready to go (<em>though it could also likely benefit from some optimization</em>); just update <code>src/lib/config.js</code></li></ul>
<h2 id="${"installation"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#installation"}"><span class="${"icon icon-link"}"></span></a>Installation</h2>
<p>Clone or download <a href="${"https://github.com/josh-collinsworth/sveltekit-blog-starter"}" rel="${"nofollow"}">this repo</a>, then install the dependencies and run the dev server.</p>
<p>I recommend using these commands:</p>
<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">npx degit https://github.com/josh-collinsworth/sveltekit-blog-starter my-sveltekit-blog
cd my-sveltekit-blog
npm install
npm run dev -- --open</code>`}<!-- HTML_TAG_END --></pre>
<p>That should get a dev server up and running (assuming you have npm and Node installed already). Any saved changes to components and styles should auto-refresh blazingly fast.</p>
<h2 id="${"customization"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#customization"}"><span class="${"icon icon-link"}"></span></a>Customization</h2>
<p>Be sure to update <code>src/lib/config.js</code> to reflect your site\u2019s domain, preferences, etc. This is where the nav menu can be updated, as well as where details for the RSS feed will be pulled in.</p>
<h2 id="${"adding-new-posts"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#adding-new-posts"}"><span class="${"icon icon-link"}"></span></a>Adding new posts</h2>
<p>Adding new posts is as simple as dropping a new <code>.md</code> file into <code>src/lib/posts</code>. It will automatically show up on the site, be added to the posts API, and any category pages.</p>
<p>A few demo Markdown posts are included, and highlight some of the features of this starter. These posts can be updated or removed, but it may be best to use one as a starting point, just for the frontmatter properties.</p>
<p>If you want to use other frontmatter properties in the template (or just modify the layout), make changes in <code>src/routes/blog/[post].svelte</code>.</p>
<p><strong>Note: posts should have a <code>date</code> frontmatter property.</strong> This is how they\u2019re sorted by default. There are also other frontmatter properties used to enhance the site experience (like the <code>coverWidth</code> and <code>coverHeight</code>, which are used in the template to reserve space for the image, minimizing cumulative layout shift).</p>
<p>The starter will still work without <code>date</code> properties in your posts, but the sorting won\u2019t be right.</p>
<h3 id="${"pagination"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#pagination"}"><span class="${"icon icon-link"}"></span></a>Pagination</h3>
<p>Pagination automatically kicks in once you have more posts than the <code>postsPerPage</code> option in <code>src/lib/config.js</code>. This means you won\u2019t see the pagination right away unless you either change <code>postsPerPage</code> to a very low number, or add several more Markdown files to the <code>src/lib/posts</code> folder.</p>
<h3 id="${"rss"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#rss"}"><span class="${"icon icon-link"}"></span></a>RSS</h3>
<p>This starter also includes a basic RSS feed. It\u2019s very minimal, so you may want to tweak it depending on your XML feed needs, but it <em>does</em> work out of the box.</p>
<p>Update the <code>config</code> details in <code>src/lib/config.js</code> to get your site\u2019s unique info correct. (You could also pull this info in other places, or add to it, to keep things consistent, but that\u2019s up to you.)</p>
<h2 id="${"sass"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#sass"}"><span class="${"icon icon-link"}"></span></a>Sass</h2>
<p><strong>By default, all CSS in this starter is global.</strong> It\u2019s located in <code>src/lib/assets/scss</code>, and all compiled into the <code>global.scss</code> file (which is then loaded into the global <code>__layout.svelte</code> file) automatically.</p>
<p>I didn\u2019t use component <code>&lt;style&gt;</code> blocks because, while component-based scoped CSS is very nice, it can also be hard to track down and update. Since this is a starter, I felt it was best to keep all the styles together in one place, and let you, the author, decide whether you want to keep them as they are, move to scoped CSS instead, or use a mixture.</p>
<h2 id="${"site-navigation-menus"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#site-navigation-menus"}"><span class="${"icon icon-link"}"></span></a>Site navigation menus</h2>
<p>To add or remove pages from the site\u2019s navigation menu (in both the header and footer), edit the <code>navItems</code> array in <code>src/lib/config.js</code>. Items there will be automatically added to the main menu in the header and footer, and the mobile nav menu. They\u2019ll also have proper classes and ARIA attributes to show when they\u2019re the current page.</p>
<h2 id="${"colors-and-fonts"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#colors-and-fonts"}"><span class="${"icon icon-link"}"></span></a>Colors and Fonts</h2>
<p>This starter has a default color palette (Credit to <a href="${"https://coolors.co/palettes/trending"}" rel="${"nofollow"}">coolors.co</a>) and fonts, but you can easily override those here:</p>
<p><strong>Colors:</strong> <code>src/lib/assets/scss/_vars.scss</code></p>
<p><strong>Fonts:</strong> <code>src/app.html</code> for the links, <code>_vars.scss</code> for the font names.</p>
<h2 id="${"components"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#components"}"><span class="${"icon icon-link"}"></span></a>Components</h2>
<p>This starter includes only a handful of structural components, for the header, footer, site nav, posts lists (since lists of posts are repeated in several locations), and pagination (plus a couple that are actually just SVG icons).</p>
<p>You\u2019re welcome and encouraged to create your own (using them in Markdown is fun!); I just didn\u2019t want to push authors too far in any component direction right off the bat.</p>
<h2 id="${"static-files"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#static-files"}"><span class="${"icon icon-link"}"></span></a>Static files</h2>
<p>Things that should just live in the site root of the finished site (like a <code>robots.txt</code> file, favicon, or maybe images) should go in the <code>static</code> folder. If you link to them, use the root path (e.g., <code>/images/my.png</code>, not <code>../static/images/my.png</code>).</p>
<p>(Placeholder images credit <a href="${"https://unsplash.com"}" rel="${"nofollow"}">Unsplash</a>; photographer names are in the file names.)</p>
<h2 id="${"building-and-deploying"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#building-and-deploying"}"><span class="${"icon icon-link"}"></span></a>Building and deploying</h2>
<p>The build command (from package.json) is simply:</p>
<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">npm run build</code>`}<!-- HTML_TAG_END --></pre>
<p>That should do it on a host like Netlify or Vercel. Or, if you prefer, you can run <code>npm run build</code> to generate the static files, then upload those (they\u2019ll be generated into a <code>build</code> folder).</p>
<p>Use <code>npm run preview</code> <em>after</em> a build to preview the built site.</p>
<h2 id="${"further-documentation"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#further-documentation"}"><span class="${"icon icon-link"}"></span></a>Further documentation</h2>
<p>I assume at least a little bit of knowledge of SvelteKit and/or similar static site generators here, but be sure to read <a href="${"https://kit.svelte.dev/docs"}" rel="${"nofollow"}">the SvelteKit docs</a> for more info.</p>`;
    });
  }
});

// .netlify/server/entries/pages/index.svelte.js
var require_index_svelte = __commonJS({
  ".netlify/server/entries/pages/index.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => Routes,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var css = {
      code: "iframe.svelte-1wln2cm{display:block;opacity:80%;border:none;height:20vh;width:72vw;margin:25px}",
      map: null
    };
    var PodcastPlayer = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `<iframe src="${"https://widget.justcast.com/widget?rss=https://filedn.com/l0rngxCNDKAhHBs9WFEP7Dj/rss/p4vrss.xml&primaryBackgroundColor=0c1824&primaryButtonColor=f7f8f9&primaryTextColor=f7f8f9&progressBarFilledColor=f7f8f9&progressBarBackgroundColor=8A8175&playlistBackgroundColor=30343c&playlistTextColor=f7f8f9&chapterBackgroundColor=30343c&chapterTextColor=f7f8f9"}" title="${"Podcasting 4 Value"}" width="${"100vw"}" height="${"100vh"}" frameborder="${"0"}" scrolling="${"yes"}"${(0, import_index_44b51311.d)("seamless", true, 0)} class="${"rounded-lg svelte-1wln2cm"}"></iframe>

`;
    });
    var load = async () => {
      const ReadMeFile = await Promise.resolve().then(() => __toModule(require_README_25b4f6bf()));
      const ReadMe = ReadMeFile.default;
      return { props: { ReadMe } };
    };
    var Routes = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `${$$result.title = `<title>Podcasting 4 Value</title>`, ""}`, ""}

${(0, import_index_44b51311.v)(PodcastPlayer, "PodcastPlayer").$$render($$result, {}, {}, {})}




`;
    });
  }
});

// .netlify/server/nodes/2.js
var require__3 = __commonJS({
  ".netlify/server/nodes/2.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_index_svelte());
    var entry = "pages/index.svelte-e54d96f9.js";
    var js = ["pages/index.svelte-e54d96f9.js", "chunks/preload-helper-ec9aa979.js", "chunks/vendor-916d40fb.js"];
    var css = ["assets/pages/index.svelte-8cd311be.css"];
  }
});

// .netlify/server/chunks/Callout-fbec77d0.js
var require_Callout_fbec77d0 = __commonJS({
  ".netlify/server/chunks/Callout-fbec77d0.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      C: () => Callout
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var Callout = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<div class="${"callout"}">${slots.default ? slots.default({}) : ``}</div>`;
    });
  }
});

// .netlify/server/entries/pages/contact.svelte.js
var require_contact_svelte = __commonJS({
  ".netlify/server/entries/pages/contact.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => Contact
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var import_Callout_fbec77d0 = __toModule(require_Callout_fbec77d0());
    var Contact = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `${$$result.head += `${$$result.title = `<title>Contact</title>`, ""}`, ""}


<h1>Contact</h1>

This starter was made by Josh Collinsworth. You can <a rel="${"external"}" href="${"https://joshcollinsworth.com/contact"}">get in touch with Josh here</a>.

If you&#39;re using this starter for your own site, feel free to delete this page, or replace it with a contact page of your own. (I&#39;m a big fan of <a href="${"https://docs.netlify.com/forms/setup/"}">Netlify forms</a>, personally.)

${(0, import_index_44b51311.v)(import_Callout_fbec77d0.C, "Callout").$$render($$result, {}, {}, {
        default: () => {
          return `This form does nothing! It&#39;s just here to show default styling.`;
        }
      })}

<form><div class="${"form-section"}"><label for="${"name"}">Name</label>
    <input type="${"text"}" id="${"name"}" placeholder="${"First name"}"></div>
  
  <div class="${"form-section"}"><label for="${"email"}">Email</label>
    <input type="${"email"}" id="${"email"}" placeholder="${"Email address"}"></div>

  <fieldset><legend>Which option?
    </legend>

    <div><input type="${"radio"}" name="${"s"}" id="${"s1"}" value="${"s1"}">
      <label for="${"s1"}">Option 1</label></div>
    <div><input type="${"radio"}" name="${"s"}" id="${"s2"}" value="${"s2"}">
      <label for="${"s2"}">Option 2</label></div>
    <div><input type="${"radio"}" name="${"s"}" id="${"s3"}" value="${"s3"}">
      <label for="${"s3"}">Option 3</label></div></fieldset>

  <div class="${"form-section"}"><input type="${"checkbox"}" id="${"c1"}">
    <label for="${"c1"}">Sign me up for something!</label></div>

  <input type="${"submit"}" value="${"Do nothing!"}"></form>`;
    });
  }
});

// .netlify/server/nodes/3.js
var require__4 = __commonJS({
  ".netlify/server/nodes/3.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_contact_svelte());
    var entry = "pages/contact.svelte-28ed1806.js";
    var js = ["pages/contact.svelte-28ed1806.js", "chunks/vendor-916d40fb.js", "chunks/Callout-a53effcc.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/about.md.js
var require_about_md = __commonJS({
  ".netlify/server/entries/pages/about.md.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => About
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var About = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<h1 id="${"about"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#about"}"><span class="${"icon icon-link"}"></span></a>About</h1>
<p>This is an example of how you can have <em>markdown</em> in page content!</p>
<ul><li>How</li>
<li><strong>Cool</strong></li>
<li>Is <em>that</em>!?</li></ul>
<p>If you like, you can also import markdown into any Svelte page.</p>
<p>Anyway, you can find this file here:</p>
<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">src/routes/about.md</code>`}<!-- HTML_TAG_END --></pre>
<p>Here\u2019s the <a href="${"/"}">home link</a> if you wanna go back.</p>`;
    });
  }
});

// .netlify/server/nodes/4.js
var require__5 = __commonJS({
  ".netlify/server/nodes/4.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_about_md());
    var entry = "pages/about.md-76ba0442.js";
    var js = ["pages/about.md-76ba0442.js", "chunks/vendor-916d40fb.js"];
    var css = [];
  }
});

// .netlify/server/chunks/Pagination-a710c3a2.js
var require_Pagination_a710c3a2 = __commonJS({
  ".netlify/server/chunks/Pagination-a710c3a2.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      P: () => PostsList,
      a: () => Pagination
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var PostsList = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let { posts = [] } = $$props;
      if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
        $$bindings.posts(posts);
      return `<ul class="${"posts-list"}">${(0, import_index_44b51311.f)(posts, (post) => {
        return `<li><article><a href="${"/blog/" + (0, import_index_44b51311.g)(post.slug)}"><img${(0, import_index_44b51311.d)("src", post.coverImage, 0)} alt="${""}"${(0, import_index_44b51311.d)("width", post.coverWidth, 0)}${(0, import_index_44b51311.d)("height", post.coverHeight, 0)} style="${"ratio: " + (0, import_index_44b51311.g)(post.coverWidth) + " / " + (0, import_index_44b51311.g)(post.coverHeight)}">
          <h2>${(0, import_index_44b51311.g)(post.title)}</h2>
        </a></article>

      <p>${(0, import_index_44b51311.g)(post.excerpt)}</p>
    </li>`;
      })}</ul>`;
    });
    var Pagination = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let { currentPage } = $$props;
      let { totalPosts } = $$props;
      let { path = "/blog/page" } = $$props;
      let pagesAvailable;
      const isCurrentPage = (page) => page == currentPage;
      if ($$props.currentPage === void 0 && $$bindings.currentPage && currentPage !== void 0)
        $$bindings.currentPage(currentPage);
      if ($$props.totalPosts === void 0 && $$bindings.totalPosts && totalPosts !== void 0)
        $$bindings.totalPosts(totalPosts);
      if ($$props.path === void 0 && $$bindings.path && path !== void 0)
        $$bindings.path(path);
      pagesAvailable = Math.ceil(totalPosts / import_config_51b2cd5b.p);
      return `
${pagesAvailable > 1 ? `<nav aria-label="${"Pagination navigation"}" class="${"pagination"}"><ul>${(0, import_index_44b51311.f)(Array.from({ length: pagesAvailable }, (_, i) => i + 1), (page) => {
        return `<li><a href="${(0, import_index_44b51311.g)(path) + "/" + (0, import_index_44b51311.g)(page)}"${(0, import_index_44b51311.d)("aria-current", isCurrentPage(page), 0)}><span class="${"sr-only"}">${isCurrentPage(page) ? `Current page:` : `Go to page`}</span>
              ${(0, import_index_44b51311.g)(page)}</a>
          </li>`;
      })}</ul></nav>` : ``}`;
    });
  }
});

// .netlify/server/entries/pages/blog/index.svelte.js
var require_index_svelte2 = __commonJS({
  ".netlify/server/entries/pages/blog/index.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => Blog,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var import_Pagination_a710c3a2 = __toModule(require_Pagination_a710c3a2());
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var load = async ({ fetch: fetch2 }) => {
      const postRes = await fetch2(`/api/posts.json`);
      const { posts } = await postRes.json();
      const totalRes = await fetch2(`/api/posts/count.json`);
      const { total } = await totalRes.json();
      return { props: { posts, total } };
    };
    var Blog = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let { posts } = $$props;
      let { total } = $$props;
      if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
        $$bindings.posts(posts);
      if ($$props.total === void 0 && $$bindings.total && total !== void 0)
        $$bindings.total(total);
      return `${$$result.head += `${$$result.title = `<title>Blog</title>`, ""}<meta data-key="${"description"}" name="${"description"}"${(0, import_index_44b51311.d)("content", import_config_51b2cd5b.a, 0)} data-svelte="svelte-a95988">`, ""}


<h1>Blog</h1>

${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.P, "PostsList").$$render($$result, { posts }, {}, {})}

${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, { currentPage: 1, totalPosts: total }, {}, {})}`;
    });
  }
});

// .netlify/server/nodes/5.js
var require__6 = __commonJS({
  ".netlify/server/nodes/5.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_index_svelte2());
    var entry = "pages/blog/index.svelte-8fa30345.js";
    var js = ["pages/blog/index.svelte-8fa30345.js", "chunks/vendor-916d40fb.js", "chunks/Pagination-8b44c160.js", "chunks/config-6e48f758.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/blog/category/index.svelte.js
var require_index_svelte3 = __commonJS({
  ".netlify/server/entries/pages/blog/category/index.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => Category,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var load = async ({ fetch: fetch2 }) => {
      const res = await fetch2(`/api/posts.json`);
      let { posts } = await res.json();
      let uniqueCategories = {};
      posts.forEach((post) => {
        post.categories.forEach((category) => {
          if (uniqueCategories.hasOwnProperty(category)) {
            uniqueCategories[category].count += 1;
          } else {
            uniqueCategories[category] = { title: category, count: 1 };
          }
        });
      });
      const sortedUniqueCategories = Object.values(uniqueCategories).sort((a, b) => a.title > b.title);
      return {
        props: { uniqueCategories: sortedUniqueCategories }
      };
    };
    var Category = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let { uniqueCategories } = $$props;
      if ($$props.uniqueCategories === void 0 && $$bindings.uniqueCategories && uniqueCategories !== void 0)
        $$bindings.uniqueCategories(uniqueCategories);
      return `${$$result.head += `${$$result.title = `<title>Blog | Categories</title>`, ""}`, ""}


<div class="${"compressed-content"}"><h1 class="${"h2"}">All blog categories</h1>
  
  <ul>${(0, import_index_44b51311.f)(uniqueCategories, (category) => {
        return `<li><a href="${"/blog/category/" + (0, import_index_44b51311.g)(category.title)}">${(0, import_index_44b51311.g)(category.title)}</a>
      (${(0, import_index_44b51311.g)(category.count)})
    </li>`;
      })}</ul></div>`;
    });
  }
});

// .netlify/server/nodes/6.js
var require__7 = __commonJS({
  ".netlify/server/nodes/6.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_index_svelte3());
    var entry = "pages/blog/category/index.svelte-0dff96c1.js";
    var js = ["pages/blog/category/index.svelte-0dff96c1.js", "chunks/vendor-916d40fb.js"];
    var css = [];
  }
});

// .netlify/server/chunks/heading-links-example-0aa2c4f0.js
var require_heading_links_example_0aa2c4f0 = __commonJS({
  ".netlify/server/chunks/heading-links-example-0aa2c4f0.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => Heading_links_example,
      metadata: () => metadata
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var metadata = {
      "title": "Automatic heading links in mdsvex",
      "date": "2021-10-26",
      "updated": "2021-11-01",
      "categories": ["sveltekit", "markdown"],
      "coverImage": "/images/jefferson-santos-fCEJGBzAkrU-unsplash.jpg",
      "coverWidth": 16,
      "coverHeight": 9,
      "excerpt": "Check out how heading links work with this starter in this post."
    };
    var Heading_links_example = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<p>Here are some headings:</p>
<h2 id="${"heres-an-h2"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#heres-an-h2"}"><span class="${"icon icon-link"}"></span></a>Here\u2019s an h2</h2>
<p>Lorem ipsum dolor sit amet</p>
<h3 id="${"this-is-an-h3"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#this-is-an-h3"}"><span class="${"icon icon-link"}"></span></a>This is an h3</h3>
<p>Lorem ipsum dolor sit amet</p>
<h4 id="${"as-youve-probably-guessed-this-is-an-h4"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#as-youve-probably-guessed-this-is-an-h4"}"><span class="${"icon icon-link"}"></span></a>As you\u2019ve probably guessed, this is an h4</h4>
<p>Lorem ipsum dolor sit amet</p>
<h5 id="${"this-of-course-is-an-h5"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#this-of-course-is-an-h5"}"><span class="${"icon icon-link"}"></span></a>This, of course, is an h5</h5>
<p>Lorem ipsum dolor sit amet</p>
<h6 id="${"were-deep-in-h6-territory-now"}"><a aria-hidden="${"true"}" tabindex="${"-1"}" href="${"#were-deep-in-h6-territory-now"}"><span class="${"icon icon-link"}"></span></a>We\u2019re deep in h6 territory now</h6>
<p>Lorem ipsum dolor sit amet</p>`;
    });
  }
});

// .netlify/server/chunks/mdsvex-component-example-ce2c5870.js
var require_mdsvex_component_example_ce2c5870 = __commonJS({
  ".netlify/server/chunks/mdsvex-component-example-ce2c5870.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => Mdsvex_component_example,
      metadata: () => metadata
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var import_Callout_fbec77d0 = __toModule(require_Callout_fbec77d0());
    var metadata = {
      "title": "A Markdown post with a Svelte component",
      "date": "2021-12-01",
      "updated": "2021-12-01",
      "categories": ["sveltekit", "markdown", "svelte"],
      "coverImage": "/images/jerry-zhang-ePpaQC2c1xA-unsplash.jpg",
      "coverWidth": 16,
      "coverHeight": 9,
      "excerpt": "This post demonstrates how to include a Svelte component in a Markdown post."
    };
    var Mdsvex_component_example = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<p>This starter includes an <code>Callout.svelte</code> component. It\u2019s not particularly useful on its own, but here\u2019s how you might use it inside of a Markdown post, thanks to mdsvex.</p>
${(0, import_index_44b51311.v)(import_Callout_fbec77d0.C, "Callout").$$render($$result, {}, {}, {
        default: () => {
          return `This is an example of the Callout.svelte component! Find it in <code>src/lib/components/Callout.svelte</code>.
`;
        }
      })}
<p>You can inject any Svelte components you want into Markdown! Just import them in a <code>&lt;script&gt;</code> tag and then use them wherever you like. </p>
<p>For that matter, you can inject any HTML anywhere! (Note that you cannot use Markdown <em>inside</em> Svelte components or HTML, however. Any opened tag must be closed before returning to Markdown.)</p>`;
    });
  }
});

// .netlify/server/chunks/syntax-highlighting-example-6a085818.js
var require_syntax_highlighting_example_6a085818 = __commonJS({
  ".netlify/server/chunks/syntax-highlighting-example-6a085818.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => Syntax_highlighting_example,
      metadata: () => metadata
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var metadata = {
      "title": "Syntax highlighting with mdsvex",
      "date": "2021-12-01",
      "updated": "2021-12-01",
      "categories": ["sveltekit", "web", "css", "markdown"],
      "coverImage": "/images/linus-nylund-Q5QspluNZmM-unsplash.jpg",
      "coverWidth": 16,
      "coverHeight": 9,
      "excerpt": "This post shows you how syntax highlighting works here."
    };
    var Syntax_highlighting_example = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return `<p>mdsvex has automatic, built-in syntax highlighting with <a href="${"https://prismjs.com/"}" rel="${"nofollow"}">Prism.js</a>; just include the language name after the triple backticks, like so:</p>
<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">&#96;&#96;&#96;css
/* Your CSS here */
&#96;&#96;&#96;</code>`}<!-- HTML_TAG_END --></pre>
<p>And that will render just like so:</p>
<pre class="${"language-css"}"><!-- HTML_TAG_START -->${`<code class="language-css"><span class="token selector">.my-css-class</span> <span class="token punctuation">&#123;</span> 
  <span class="token property">color</span><span class="token punctuation">:</span> #ffd100<span class="token punctuation">;</span>
  <span class="token property">box-sizing</span><span class="token punctuation">:</span> border-box<span class="token punctuation">;</span>
  <span class="token comment">/* etc... */</span>
<span class="token punctuation">&#125;</span></code>`}<!-- HTML_TAG_END --></pre>
<p>Here\u2019s how you\u2019d do JavaScript:</p>
<pre class="${"language-undefined"}"><!-- HTML_TAG_START -->${`<code class="language-undefined">&#96;&#96;&#96;js
// You can use js or javascript for the language
&#96;&#96;&#96;</code>`}<!-- HTML_TAG_END --></pre>
<p>Highlighted code sample:</p>
<pre class="${"language-js"}"><!-- HTML_TAG_START -->${`<code class="language-js"><span class="token keyword">const</span> <span class="token function-variable function">invertNumberInRange</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">num<span class="token punctuation">,</span> range</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">&#123;</span>
  <span class="token keyword">return</span> range <span class="token operator">-</span> num<span class="token punctuation">;</span>
<span class="token punctuation">&#125;</span>

<span class="token function">invertNumberInRange</span><span class="token punctuation">(</span><span class="token number">25</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 75</span></code>`}<!-- HTML_TAG_END --></pre>
<p>Of course, mdsvex supports Svelte highlighting, too:</p>
<pre class="${"language-svelte"}"><!-- HTML_TAG_START -->${`<code class="language-svelte"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">import</span> myComponent <span class="token keyword">from</span> <span class="token string">'$lib/components/myComponent.svelte'</span><span class="token punctuation">;</span>

  <span class="token keyword">export</span> <span class="token keyword">let</span> myProp <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>MyComponent</span> <span class="token attr-name">prop=</span><span class="token language-javascript"><span class="token punctuation">&#123;</span>myProp<span class="token punctuation">&#125;</span></span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></code>`}<!-- HTML_TAG_END --></pre>
<p>All these colors are in the <code>_prism.scss</code> file inside <code>src/lib/assets/scss</code>, if you\u2019d like to change them.</p>`;
    });
  }
});

// .netlify/server/chunks/fetchPosts-e339a40a.js
var require_fetchPosts_e339a40a = __commonJS({
  ".netlify/server/chunks/fetchPosts-e339a40a.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __defProps2 = Object.defineProperties;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues2 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp2.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      if (__getOwnPropSymbols2)
        for (var prop of __getOwnPropSymbols2(b)) {
          if (__propIsEnum2.call(b, prop))
            __defNormalProp2(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      f: () => fetchPosts
    });
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var fetchPosts = async ({ offset = 0, limit = import_config_51b2cd5b.p, category = "" } = {}) => {
      const posts = await Promise.all(Object.entries({ "../../posts/heading-links-example.md": () => Promise.resolve().then(() => __toModule(require_heading_links_example_0aa2c4f0())), "../../posts/mdsvex-component-example.md": () => Promise.resolve().then(() => __toModule(require_mdsvex_component_example_ce2c5870())), "../../posts/syntax-highlighting-example.md": () => Promise.resolve().then(() => __toModule(require_syntax_highlighting_example_6a085818())) }).map(async ([path, resolver]) => {
        const { metadata } = await resolver();
        const slug = path.split("/").pop().slice(0, -3);
        return __spreadProps2(__spreadValues2({}, metadata), { slug });
      }));
      let sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (category) {
        sortedPosts = sortedPosts.filter((post) => post.categories.includes(category));
      }
      if (offset) {
        sortedPosts = sortedPosts.slice(offset);
      }
      if (limit && limit < sortedPosts.length && limit != -1) {
        sortedPosts = sortedPosts.slice(0, limit);
      }
      sortedPosts = sortedPosts.map((post) => ({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        coverWidth: post.coverWidth,
        coverHeight: post.coverHeight,
        date: post.date,
        categories: post.categories
      }));
      return {
        posts: sortedPosts
      };
    };
  }
});

// .netlify/server/entries/pages/blog/category/page/_page_.svelte.js
var require_page_svelte = __commonJS({
  ".netlify/server/entries/pages/blog/category/page/_page_.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => U5Bpageu5D,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var import_fetchPosts_e339a40a = __toModule(require_fetchPosts_e339a40a());
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var import_Pagination_a710c3a2 = __toModule(require_Pagination_a710c3a2());
    var load = async ({ fetch: fetch2, params }) => {
      try {
        const page = params.page ? params.page : 1;
        if (page <= 1) {
          return { status: 301, redirect: "/blog" };
        }
        let offset = page * import_config_51b2cd5b.p - import_config_51b2cd5b.p;
        const totalPostsRes = await fetch2("/api/posts/count.json");
        const { total } = await totalPostsRes.json();
        const { posts } = await (0, import_fetchPosts_e339a40a.f)({ offset, page });
        return {
          status: 200,
          props: { posts, page, totalPosts: total }
        };
      } catch (error) {
        return { status: 404, error: error.message };
      }
    };
    var U5Bpageu5D = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let lowerBound;
      let upperBound;
      let { page } = $$props;
      let { totalPosts } = $$props;
      let { posts = [] } = $$props;
      if ($$props.page === void 0 && $$bindings.page && page !== void 0)
        $$bindings.page(page);
      if ($$props.totalPosts === void 0 && $$bindings.totalPosts && totalPosts !== void 0)
        $$bindings.totalPosts(totalPosts);
      if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
        $$bindings.posts(posts);
      lowerBound = page * import_config_51b2cd5b.p - (import_config_51b2cd5b.p - 1) || 1;
      upperBound = Math.min(page * import_config_51b2cd5b.p, totalPosts);
      return `







${$$result.head += `${$$result.title = `<title>Blog - page ${(0, import_index_44b51311.g)(page)}</title>`, ""}<meta data-key="${"description"}"${(0, import_index_44b51311.d)("name", import_config_51b2cd5b.a, 0)} data-svelte="svelte-1qczpud">`, ""}



${posts.length ? `<h1>Posts ${(0, import_index_44b51311.g)(lowerBound)}\u2013${(0, import_index_44b51311.g)(upperBound)} of ${(0, import_index_44b51311.g)(totalPosts)}</h1>
  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, { currentPage: page, totalPosts }, {}, {})}

  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.P, "PostsList").$$render($$result, { posts }, {}, {})}

  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, { currentPage: page, totalPosts }, {}, {})}` : `<h1>Oops!</h1>

  <p>Sorry, no posts to show here.</p>

  <a href="${"/blog"}">Back to blog</a>`}`;
    });
  }
});

// .netlify/server/nodes/7.js
var require__8 = __commonJS({
  ".netlify/server/nodes/7.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_page_svelte());
    var entry = "pages/blog/category/page/_page_.svelte-ba16229e.js";
    var js = ["pages/blog/category/page/_page_.svelte-ba16229e.js", "chunks/vendor-916d40fb.js", "chunks/fetchPosts-7fd73555.js", "chunks/preload-helper-ec9aa979.js", "chunks/config-6e48f758.js", "chunks/Pagination-8b44c160.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/blog/category/_category_/index.svelte.js
var require_index_svelte4 = __commonJS({
  ".netlify/server/entries/pages/blog/category/_category_/index.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => U5Bcategoryu5D,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var import_fetchPosts_e339a40a = __toModule(require_fetchPosts_e339a40a());
    var import_Pagination_a710c3a2 = __toModule(require_Pagination_a710c3a2());
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var load = async ({ params, fetch: fetch2 }) => {
      const category = params.category;
      const options = { category };
      const { posts } = await (0, import_fetchPosts_e339a40a.f)(options);
      const res = await fetch2(`/api/posts/category/${category}/count.json`);
      const { total } = await res.json();
      return { props: { posts, category, total } };
    };
    var U5Bcategoryu5D = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let { posts } = $$props;
      let { category } = $$props;
      let { total } = $$props;
      if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
        $$bindings.posts(posts);
      if ($$props.category === void 0 && $$bindings.category && category !== void 0)
        $$bindings.category(category);
      if ($$props.total === void 0 && $$bindings.total && total !== void 0)
        $$bindings.total(total);
      return `






${$$result.head += `${$$result.title = `<title>Category: ${(0, import_index_44b51311.g)(category)}</title>`, ""}`, ""}


<h1>Blog category: ${(0, import_index_44b51311.g)(category)}</h1>

${posts.length ? `${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.P, "PostsList").$$render($$result, { posts }, {}, {})}
  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, {
        currentPage: "1",
        totalPosts: total,
        path: "/blog/category/" + category + "/page"
      }, {}, {})}` : `<p><strong>Ope!</strong> Sorry, couldn&#39;t find any posts in the category &quot;${(0, import_index_44b51311.g)(category)}&quot;.</p>

  <p><a href="${"/blog"}">Back to blog</a></p>`}`;
    });
  }
});

// .netlify/server/nodes/8.js
var require__9 = __commonJS({
  ".netlify/server/nodes/8.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_index_svelte4());
    var entry = "pages/blog/category/_category_/index.svelte-504e2f71.js";
    var js = ["pages/blog/category/_category_/index.svelte-504e2f71.js", "chunks/vendor-916d40fb.js", "chunks/fetchPosts-7fd73555.js", "chunks/preload-helper-ec9aa979.js", "chunks/config-6e48f758.js", "chunks/Pagination-8b44c160.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/blog/category/_category_/page/index.svelte.js
var require_index_svelte5 = __commonJS({
  ".netlify/server/entries/pages/blog/category/_category_/page/index.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => Page,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var load = async () => {
      return { status: 301, redirect: `/blog/category` };
    };
    var Page = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return ``;
    });
  }
});

// .netlify/server/nodes/9.js
var require__10 = __commonJS({
  ".netlify/server/nodes/9.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_index_svelte5());
    var entry = "pages/blog/category/_category_/page/index.svelte-55c0fcc2.js";
    var js = ["pages/blog/category/_category_/page/index.svelte-55c0fcc2.js", "chunks/vendor-916d40fb.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/blog/category/_category_/page/_page_.svelte.js
var require_page_svelte2 = __commonJS({
  ".netlify/server/entries/pages/blog/category/_category_/page/_page_.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => U5Bpageu5D,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var import_fetchPosts_e339a40a = __toModule(require_fetchPosts_e339a40a());
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var import_Pagination_a710c3a2 = __toModule(require_Pagination_a710c3a2());
    var load = async ({ fetch: fetch2, params }) => {
      try {
        const page = params.page ? params.page : 1;
        const { category } = params;
        if (page <= 1) {
          return {
            status: 301,
            redirect: `/blog/category/${category}`
          };
        }
        let offset = page * import_config_51b2cd5b.p - import_config_51b2cd5b.p;
        const totalPostsRes = await fetch2("/api/posts/count.json");
        const { total } = await totalPostsRes.json();
        const { posts } = await (0, import_fetchPosts_e339a40a.f)({ offset, page });
        return {
          status: 200,
          props: { posts, page, category, totalPosts: total }
        };
      } catch (error) {
        return { status: 404, error: error.message };
      }
    };
    var U5Bpageu5D = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let lowerBound;
      let upperBound;
      let { page } = $$props;
      let { category } = $$props;
      let { totalPosts } = $$props;
      let { posts = [] } = $$props;
      if ($$props.page === void 0 && $$bindings.page && page !== void 0)
        $$bindings.page(page);
      if ($$props.category === void 0 && $$bindings.category && category !== void 0)
        $$bindings.category(category);
      if ($$props.totalPosts === void 0 && $$bindings.totalPosts && totalPosts !== void 0)
        $$bindings.totalPosts(totalPosts);
      if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
        $$bindings.posts(posts);
      lowerBound = page * import_config_51b2cd5b.p - (import_config_51b2cd5b.p - 1) || 1;
      upperBound = Math.min(page * import_config_51b2cd5b.p, totalPosts);
      return `







${$$result.head += `${$$result.title = `<title>Blog - page ${(0, import_index_44b51311.g)(page)}</title>`, ""}<meta data-key="${"description"}"${(0, import_index_44b51311.d)("name", import_config_51b2cd5b.a, 0)} data-svelte="svelte-1qczpud">`, ""}



${posts.length ? `<h1>Category: ${(0, import_index_44b51311.g)(category)}
    <br>
    <small>Posts ${(0, import_index_44b51311.g)(lowerBound)}\u2013${(0, import_index_44b51311.g)(upperBound)} of ${(0, import_index_44b51311.g)(totalPosts)}</small></h1>
  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, {
        currentPage: page,
        totalPosts,
        path: "/blog/category/" + category + "/page"
      }, {}, {})}

  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.P, "PostsList").$$render($$result, { posts }, {}, {})}

  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, {
        currentPage: page,
        totalPosts,
        path: "/blog/category/" + category + "/page"
      }, {}, {})}` : `<h1>Oops!</h1>

  <p>Sorry, no posts to show here.</p>

  <a href="${"/blog"}">Back to blog</a>`}`;
    });
  }
});

// .netlify/server/nodes/10.js
var require__11 = __commonJS({
  ".netlify/server/nodes/10.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_page_svelte2());
    var entry = "pages/blog/category/_category_/page/_page_.svelte-5e75afd2.js";
    var js = ["pages/blog/category/_category_/page/_page_.svelte-5e75afd2.js", "chunks/vendor-916d40fb.js", "chunks/fetchPosts-7fd73555.js", "chunks/preload-helper-ec9aa979.js", "chunks/config-6e48f758.js", "chunks/Pagination-8b44c160.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/blog/page/index.svelte.js
var require_index_svelte6 = __commonJS({
  ".netlify/server/entries/pages/blog/page/index.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => Page,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var load = () => {
      return { status: 301, redirect: "/blog" };
    };
    var Page = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      return ``;
    });
  }
});

// .netlify/server/nodes/11.js
var require__12 = __commonJS({
  ".netlify/server/nodes/11.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_index_svelte6());
    var entry = "pages/blog/page/index.svelte-bd1f1020.js";
    var js = ["pages/blog/page/index.svelte-bd1f1020.js", "chunks/vendor-916d40fb.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/blog/page/_page_.svelte.js
var require_page_svelte3 = __commonJS({
  ".netlify/server/entries/pages/blog/page/_page_.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => U5Bpageu5D,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    var import_fetchPosts_e339a40a = __toModule(require_fetchPosts_e339a40a());
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var import_Pagination_a710c3a2 = __toModule(require_Pagination_a710c3a2());
    var load = async ({ fetch: fetch2, params }) => {
      try {
        const page = params.page ? params.page : 1;
        if (page <= 1) {
          return { status: 301, redirect: "/blog" };
        }
        let offset = page * import_config_51b2cd5b.p - import_config_51b2cd5b.p;
        const totalPostsRes = await fetch2("/api/posts/count.json");
        const { total } = await totalPostsRes.json();
        const { posts } = await (0, import_fetchPosts_e339a40a.f)({ offset, page });
        return {
          status: 200,
          props: { posts, page, totalPosts: total }
        };
      } catch (error) {
        return { status: 404, error: error.message };
      }
    };
    var U5Bpageu5D = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let lowerBound;
      let upperBound;
      let { page } = $$props;
      let { totalPosts } = $$props;
      let { posts = [] } = $$props;
      if ($$props.page === void 0 && $$bindings.page && page !== void 0)
        $$bindings.page(page);
      if ($$props.totalPosts === void 0 && $$bindings.totalPosts && totalPosts !== void 0)
        $$bindings.totalPosts(totalPosts);
      if ($$props.posts === void 0 && $$bindings.posts && posts !== void 0)
        $$bindings.posts(posts);
      lowerBound = page * import_config_51b2cd5b.p - (import_config_51b2cd5b.p - 1) || 1;
      upperBound = Math.min(page * import_config_51b2cd5b.p, totalPosts);
      return `







${$$result.head += `${$$result.title = `<title>Blog - page ${(0, import_index_44b51311.g)(page)}</title>`, ""}<meta data-key="${"description"}" name="${"description"}"${(0, import_index_44b51311.d)("content", import_config_51b2cd5b.a, 0)} data-svelte="svelte-laszff">`, ""}



${posts.length ? `<h1>Posts ${(0, import_index_44b51311.g)(lowerBound)}\u2013${(0, import_index_44b51311.g)(upperBound)} of ${(0, import_index_44b51311.g)(totalPosts)}</h1>
  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, { currentPage: page, totalPosts }, {}, {})}

  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.P, "PostsList").$$render($$result, { posts }, {}, {})}

  ${(0, import_index_44b51311.v)(import_Pagination_a710c3a2.a, "Pagination").$$render($$result, { currentPage: page, totalPosts }, {}, {})}` : `<h1>Oops!</h1>

  <p>Sorry, no posts to show here.</p>

  <a href="${"/blog"}">Back to blog</a>`}`;
    });
  }
});

// .netlify/server/nodes/12.js
var require__13 = __commonJS({
  ".netlify/server/nodes/12.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_page_svelte3());
    var entry = "pages/blog/page/_page_.svelte-fe7c8170.js";
    var js = ["pages/blog/page/_page_.svelte-fe7c8170.js", "chunks/vendor-916d40fb.js", "chunks/fetchPosts-7fd73555.js", "chunks/preload-helper-ec9aa979.js", "chunks/config-6e48f758.js", "chunks/Pagination-8b44c160.js"];
    var css = [];
  }
});

// .netlify/server/entries/pages/blog/_post_.svelte.js
var require_post_svelte = __commonJS({
  ".netlify/server/entries/pages/blog/_post_.svelte.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __defProps2 = Object.defineProperties;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues2 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp2.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      if (__getOwnPropSymbols2)
        for (var prop of __getOwnPropSymbols2(b)) {
          if (__propIsEnum2.call(b, prop))
            __defNormalProp2(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      default: () => U5Bpostu5D,
      load: () => load
    });
    var import_index_44b51311 = __toModule(require_index_44b51311());
    function __variableDynamicImportRuntime0__(path) {
      switch (path) {
        case "../../lib/posts/heading-links-example.md":
          return Promise.resolve().then(() => __toModule(require_heading_links_example_0aa2c4f0()));
        case "../../lib/posts/mdsvex-component-example.md":
          return Promise.resolve().then(() => __toModule(require_mdsvex_component_example_ce2c5870()));
        case "../../lib/posts/syntax-highlighting-example.md":
          return Promise.resolve().then(() => __toModule(require_syntax_highlighting_example_6a085818()));
        default:
          return new Promise(function(resolve, reject) {
            (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
          });
      }
    }
    var load = async ({ params }) => {
      try {
        const post = await __variableDynamicImportRuntime0__(`../../lib/posts/${params.post}.md`);
        return {
          props: {
            PostContent: post.default,
            meta: __spreadProps2(__spreadValues2({}, post.metadata), { slug: params.post })
          }
        };
      } catch (error) {
        return { status: 404, error: error.message };
      }
    };
    var U5Bpostu5D = (0, import_index_44b51311.c)(($$result, $$props, $$bindings, slots) => {
      let { PostContent } = $$props;
      let { meta } = $$props;
      const { title, excerpt, date, updated, coverImage, coverWidth, coverHeight, categories } = meta;
      if ($$props.PostContent === void 0 && $$bindings.PostContent && PostContent !== void 0)
        $$bindings.PostContent(PostContent);
      if ($$props.meta === void 0 && $$bindings.meta && meta !== void 0)
        $$bindings.meta(meta);
      return `







${$$result.head += `${$$result.title = `<title>${(0, import_index_44b51311.g)(title)}</title>`, ""}<meta data-key="${"description"}" name="${"description"}"${(0, import_index_44b51311.d)("content", excerpt, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:type"}" content="${"article"}" data-svelte="svelte-fsc2lq"><meta property="${"og:title"}"${(0, import_index_44b51311.d)("content", title, 0)} data-svelte="svelte-fsc2lq"><meta name="${"twitter:title"}"${(0, import_index_44b51311.d)("content", title, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:description"}"${(0, import_index_44b51311.d)("content", excerpt, 0)} data-svelte="svelte-fsc2lq"><meta name="${"twitter:description"}"${(0, import_index_44b51311.d)("content", excerpt, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:image:width"}"${(0, import_index_44b51311.d)("content", coverWidth, 0)} data-svelte="svelte-fsc2lq"><meta property="${"og:image:height"}"${(0, import_index_44b51311.d)("content", coverHeight, 0)} data-svelte="svelte-fsc2lq">`, ""}


<article class="${"post"}">
  <img class="${"cover-image"}"${(0, import_index_44b51311.d)("src", coverImage, 0)} alt="${""}" style="${"aspect-ratio: " + (0, import_index_44b51311.g)(coverWidth) + " / " + (0, import_index_44b51311.g)(coverHeight) + ";"}"${(0, import_index_44b51311.d)("width", coverWidth, 0)}${(0, import_index_44b51311.d)("height", coverHeight, 0)}>

  <h1>${(0, import_index_44b51311.g)(title)}</h1>
  
  <div class="${"meta"}"><b>Published:</b> ${(0, import_index_44b51311.g)(date)}
    <br>
    <b>Updated:</b> ${(0, import_index_44b51311.g)(updated)}</div>
  
  ${(0, import_index_44b51311.v)(PostContent || import_index_44b51311.m, "svelte:component").$$render($$result, {}, {}, {})}

  ${categories ? `<aside class="${"post-footer"}"><h2>Posted in: </h2>
      <ul>${(0, import_index_44b51311.f)(categories, (category) => {
        return `<li><a href="${"/blog/category/" + (0, import_index_44b51311.g)(category) + "/"}">${(0, import_index_44b51311.g)(category)}</a>
          </li>`;
      })}</ul></aside>` : ``}</article>`;
    });
  }
});

// .netlify/server/nodes/13.js
var require__14 = __commonJS({
  ".netlify/server/nodes/13.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module32, desc) => {
      if (module32 && typeof module32 === "object" || typeof module32 === "function") {
        for (let key of __getOwnPropNames(module32))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module32[key], enumerable: !(desc = __getOwnPropDesc(module32, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module32) => {
      return __reExport(__markAsModule(__defProp2(module32 != null ? __create(__getProtoOf(module32)) : {}, "default", module32 && module32.__esModule && "default" in module32 ? { get: () => module32.default, enumerable: true } : { value: module32, enumerable: true })), module32);
    };
    __export(exports2, {
      css: () => css,
      entry: () => entry,
      js: () => js,
      module: () => module2
    });
    var module2 = __toModule(require_post_svelte());
    var entry = "pages/blog/_post_.svelte-a1f36658.js";
    var js = ["pages/blog/_post_.svelte-a1f36658.js", "chunks/preload-helper-ec9aa979.js", "chunks/vendor-916d40fb.js"];
    var css = [];
  }
});

// .netlify/server/entries/endpoints/api/rss.xml.js
var require_rss_xml = __commonJS({
  ".netlify/server/entries/endpoints/api/rss.xml.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __defProps2 = Object.defineProperties;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
    var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues2 = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp2.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      if (__getOwnPropSymbols2)
        for (var prop of __getOwnPropSymbols2(b)) {
          if (__propIsEnum2.call(b, prop))
            __defNormalProp2(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      get: () => get
    });
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var get = async () => {
      const data = await Promise.all(Object.entries({ "../../lib/posts/heading-links-example.md": () => Promise.resolve().then(() => __toModule(require_heading_links_example_0aa2c4f0())), "../../lib/posts/mdsvex-component-example.md": () => Promise.resolve().then(() => __toModule(require_mdsvex_component_example_ce2c5870())), "../../lib/posts/syntax-highlighting-example.md": () => Promise.resolve().then(() => __toModule(require_syntax_highlighting_example_6a085818())) }).map(async ([path, page]) => {
        const { metadata } = await page();
        const slug = path.split("/").pop().split(".").shift();
        return __spreadProps2(__spreadValues2({}, metadata), { slug });
      })).then((posts) => {
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
      const body = render(data);
      const headers = {
        "Cache-Control": `max-age=0, s-max-age=${600}`,
        "Content-Type": "application/xml"
      };
      return {
        body,
        headers
      };
    };
    var render = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${import_config_51b2cd5b.s}</title>
<description>${import_config_51b2cd5b.a}</description>
<link>${import_config_51b2cd5b.b}</link>
<atom:link href="https://${import_config_51b2cd5b.c}/rss.xml" rel="self" type="application/rss+xml"/>
${posts.map((post) => `<item>
<guid isPermaLink="true">https://${import_config_51b2cd5b.c}/blog/${post.slug}</guid>
<title>${post.title}</title>
<link>https://${import_config_51b2cd5b.c}/blog/${post.slug}</link>
<description>${post.excerpt}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`).join("")}
</channel>
</rss>
`;
  }
});

// .netlify/server/entries/endpoints/api/posts/index.json.js
var require_index_json = __commonJS({
  ".netlify/server/entries/endpoints/api/posts/index.json.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      get: () => get
    });
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var import_fetchPosts_e339a40a = __toModule(require_fetchPosts_e339a40a());
    var get = async ({ url }) => {
      try {
        const params = new URLSearchParams(url.search);
        const options = {
          offset: parseInt(params.get("offset")) || null,
          limit: parseInt(params.get("limit")) || import_config_51b2cd5b.p
        };
        const { posts } = await (0, import_fetchPosts_e339a40a.f)(options);
        return {
          status: 200,
          body: {
            posts
          }
        };
      } catch (error) {
        return {
          status: 500,
          body: {
            error: "Could not fetch posts. " + error
          }
        };
      }
    };
  }
});

// .netlify/server/entries/endpoints/api/posts/count.json.js
var require_count_json = __commonJS({
  ".netlify/server/entries/endpoints/api/posts/count.json.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      get: () => get
    });
    var get = async () => {
      try {
        const posts = { "../../../lib/posts/heading-links-example.md": () => Promise.resolve().then(() => __toModule(require_heading_links_example_0aa2c4f0())), "../../../lib/posts/mdsvex-component-example.md": () => Promise.resolve().then(() => __toModule(require_mdsvex_component_example_ce2c5870())), "../../../lib/posts/syntax-highlighting-example.md": () => Promise.resolve().then(() => __toModule(require_syntax_highlighting_example_6a085818())) };
        return {
          status: 200,
          body: {
            total: Object.keys(posts).length
          }
        };
      } catch {
        return {
          status: 500,
          body: {
            error: "Could not retrieve total number of posts."
          }
        };
      }
    };
  }
});

// .netlify/server/entries/endpoints/api/posts/category/_category_.json.js
var require_category_json = __commonJS({
  ".netlify/server/entries/endpoints/api/posts/category/_category_.json.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      get: () => get
    });
    var import_fetchPosts_e339a40a = __toModule(require_fetchPosts_e339a40a());
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var get = async ({ params }) => {
      const { category } = params;
      try {
        const { posts } = await (0, import_fetchPosts_e339a40a.f)({ category });
        return {
          status: 200,
          body: {
            posts
          }
        };
      } catch {
        return {
          status: 500,
          body: {
            error: `Could not retrieve total number of ${category} posts.`
          }
        };
      }
    };
  }
});

// .netlify/server/entries/endpoints/api/posts/category/_category_/count.json.js
var require_count_json2 = __commonJS({
  ".netlify/server/entries/endpoints/api/posts/category/_category_/count.json.js"(exports2) {
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport = (target, module22, desc) => {
      if (module22 && typeof module22 === "object" || typeof module22 === "function") {
        for (let key of __getOwnPropNames(module22))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module22[key], enumerable: !(desc = __getOwnPropDesc(module22, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule = (module22) => {
      return __reExport(__markAsModule(__defProp2(module22 != null ? __create(__getProtoOf(module22)) : {}, "default", module22 && module22.__esModule && "default" in module22 ? { get: () => module22.default, enumerable: true } : { value: module22, enumerable: true })), module22);
    };
    __export(exports2, {
      get: () => get
    });
    var import_fetchPosts_e339a40a = __toModule(require_fetchPosts_e339a40a());
    var import_config_51b2cd5b = __toModule(require_config_51b2cd5b());
    var get = async ({ params }) => {
      const { category } = params;
      const options = { category, limit: -1 };
      try {
        const { posts } = await (0, import_fetchPosts_e339a40a.f)(options);
        return {
          status: 200,
          body: {
            total: posts.length
          }
        };
      } catch {
        return {
          status: 500,
          body: {
            error: `Could not retrieve total number of ${category} posts.`
          }
        };
      }
    };
  }
});

// .netlify/functions-internal/render.js
var { init } = require_handler();
exports.handler = init({
  appDir: "_app",
  assets: new Set(["favicon.png", "images/jefferson-santos-fCEJGBzAkrU-unsplash.jpg", "images/jerry-zhang-ePpaQC2c1xA-unsplash.jpg", "images/linus-nylund-Q5QspluNZmM-unsplash.jpg", "link.svg"]),
  _: {
    mime: { ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" },
    entry: { "file": "start-a91e5362.js", "js": ["start-a91e5362.js", "chunks/vendor-916d40fb.js", "chunks/preload-helper-ec9aa979.js", "chunks/singletons-d19c42e4.js"], "css": [] },
    nodes: [
      () => Promise.resolve().then(() => require__()),
      () => Promise.resolve().then(() => require__2()),
      () => Promise.resolve().then(() => require__3()),
      () => Promise.resolve().then(() => require__4()),
      () => Promise.resolve().then(() => require__5()),
      () => Promise.resolve().then(() => require__6()),
      () => Promise.resolve().then(() => require__7()),
      () => Promise.resolve().then(() => require__8()),
      () => Promise.resolve().then(() => require__9()),
      () => Promise.resolve().then(() => require__10()),
      () => Promise.resolve().then(() => require__11()),
      () => Promise.resolve().then(() => require__12()),
      () => Promise.resolve().then(() => require__13()),
      () => Promise.resolve().then(() => require__14())
    ],
    routes: [
      {
        type: "page",
        pattern: /^\/$/,
        params: null,
        path: "/",
        a: [0, 2],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/contact\/?$/,
        params: null,
        path: "/contact",
        a: [0, 3],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/about\/?$/,
        params: null,
        path: "/about",
        a: [0, 4],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/blog\/?$/,
        params: null,
        path: "/blog",
        a: [0, 5],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/blog\/category\/?$/,
        params: null,
        path: "/blog/category",
        a: [0, 6],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/blog\/category\/page\/([^/]+?)\/?$/,
        params: (m) => ({ page: m[1] }),
        path: null,
        a: [0, 7],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/blog\/category\/([^/]+?)\/?$/,
        params: (m) => ({ category: m[1] }),
        path: null,
        a: [0, 8],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/blog\/category\/([^/]+?)\/page\/?$/,
        params: (m) => ({ category: m[1] }),
        path: null,
        a: [0, 9],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/blog\/category\/([^/]+?)\/page\/([^/]+?)\/?$/,
        params: (m) => ({ category: m[1], page: m[2] }),
        path: null,
        a: [0, 10],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/blog\/page\/?$/,
        params: null,
        path: "/blog/page",
        a: [0, 11],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/blog\/page\/([^/]+?)\/?$/,
        params: (m) => ({ page: m[1] }),
        path: null,
        a: [0, 12],
        b: [1]
      },
      {
        type: "page",
        pattern: /^\/blog\/([^/]+?)\/?$/,
        params: (m) => ({ post: m[1] }),
        path: null,
        a: [0, 13],
        b: [1]
      },
      {
        type: "endpoint",
        pattern: /^\/api\/rss\.xml$/,
        params: null,
        load: () => Promise.resolve().then(() => require_rss_xml())
      },
      {
        type: "endpoint",
        pattern: /^\/api\/posts\.json$/,
        params: null,
        load: () => Promise.resolve().then(() => require_index_json())
      },
      {
        type: "endpoint",
        pattern: /^\/api\/posts\/count\.json$/,
        params: null,
        load: () => Promise.resolve().then(() => require_count_json())
      },
      {
        type: "endpoint",
        pattern: /^\/api\/posts\/category\/([^/]+?)\.json$/,
        params: (m) => ({ category: m[1] }),
        load: () => Promise.resolve().then(() => require_category_json())
      },
      {
        type: "endpoint",
        pattern: /^\/api\/posts\/category\/([^/]+?)\/count\.json$/,
        params: (m) => ({ category: m[1] }),
        load: () => Promise.resolve().then(() => require_count_json2())
      }
    ]
  }
});
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
//# sourceMappingURL=render.js.map
