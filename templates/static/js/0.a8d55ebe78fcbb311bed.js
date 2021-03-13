webpackJsonp([0,1],{

/***/ "1Vt0":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (!_vm.login)?_c('div',{staticClass:"back"},[_c('div',{staticClass:"front"},[_c('div',[_c('label',[_vm._v("Username")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.username),expression:"username"}],attrs:{"type":"text"},domProps:{"value":(_vm.username)},on:{"input":function($event){if($event.target.composing){ return; }_vm.username=$event.target.value}}})]),_vm._v(" "),_c('div',[_c('label',[_vm._v("Password")]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.password),expression:"password"}],attrs:{"type":"text"},domProps:{"value":(_vm.password)},on:{"input":function($event){if($event.target.composing){ return; }_vm.password=$event.target.value}}})]),_vm._v(" "),_c('div',[_c('button',{on:{"click":function($event){$event.preventDefault();return _vm.loginFunc($event)}}},[_vm._v("Login")]),_vm._v(" "),_c('button',{on:{"click":function($event){$event.preventDefault();return _vm.registerFunc($event)}}},[_vm._v("Register")])])])]):_vm._e()}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "21It":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__("FtD3");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "4GGw":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("pxSE");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("rjj0")("2065f833", content, true, {});

/***/ }),

/***/ "5VQ+":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "7GwW":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");
var settle = __webpack_require__("21It");
var cookies = __webpack_require__("p1b6");
var buildURL = __webpack_require__("DQCr");
var buildFullPath = __webpack_require__("Oi+a");
var parseHeaders = __webpack_require__("oJlt");
var isURLSameOrigin = __webpack_require__("GHBc");
var createError = __webpack_require__("FtD3");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "9UzI":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("FZ+f")(true);
// imports


// module
exports.push([module.i, ".back[data-v-780628d0]{top:0;position:fixed;width:100%;height:100%;background:rgba(0,0,0,.5)}.front[data-v-780628d0]{width:400px;padding:20px;margin:100px auto;border-radius:10px;background-color:#fff}", "", {"version":3,"sources":["C:/Users/USER/pingProjects/Research/flask-vue-spa-master/frontend/src/components/Login.vue"],"names":[],"mappings":"AACA,uBACI,MAAO,AACP,eAAgB,AAChB,WAAY,AACZ,YAAa,AACb,yBAA6B,CAChC,AACD,wBACI,YAAa,AACb,aAAc,AACd,kBAAmB,AACnB,mBAAoB,AACpB,qBAAwB,CAC3B","file":"Login.vue","sourcesContent":["\n.back[data-v-780628d0]{\n    top: 0;\n    position: fixed;\n    width: 100%;\n    height: 100%;\n    background: rgb(0, 0, 0,0.5);\n}\n.front[data-v-780628d0]{\n    width: 400px;\n    padding: 20px;\n    margin: 100px auto;\n    border-radius: 10px;\n    background-color: white;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "DQCr":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "DUeU":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "F9ct":
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),

/***/ "Fs8J":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_signature_pad__ = __webpack_require__("hJLJ");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Login_vue__ = __webpack_require__("xJsL");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return {
            word: null,
            word_count: 0,
            canvas: null,
            signaturePad: null,
            login: false,
            username: null,
            password: null,
            picture: null,
            webURl: 'https://flask-vue-handwrite.herokuapp.com'
        };
    },

    components: { Login: __WEBPACK_IMPORTED_MODULE_2__Login_vue__["default"] },
    methods: {
        savePNGButton: function savePNGButton() {
            if (this.signaturePad.isEmpty()) {
                alert("Please provide a signature first.");
            } else {
                var path = this.webURl + '/api/getdata';
                var dataURL = this.signaturePad.toDataURL("image/jpeg");
                __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get(path, { params: { data: dataURL, username: this.username, count: this.word_count } }).then(function (response) {
                    console.log(response.data);
                }).catch(function (error) {
                    console.log(error);
                });
                this.word_count++;
            }
            this.signaturePad.clear();
        },
        clearButton: function clearButton() {
            this.signaturePad.clear();
        },
        undoButton: function undoButton() {
            var data = this.signaturePad.toData();

            if (data) {
                data.pop(); // remove the last dot or line
                this.signaturePad.fromData(data);
            }
        },
        login_check: function login_check(param) {
            this.username = param[0];
            this.password = param[1];
            this.login = param[2];
        },
        showPic: function showPic() {
            var _this = this;

            __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get(this.webURl + 'api/getpic', { params: { username: this.username } }).then(function (response) {
                var pics = response.data;
                _this.picture = pics.split(',');
            }).catch(function (error) {
                console.log(error);
            });
        },
        getImgUrl: function getImgUrl(pic) {
            return __webpack_require__("l2tl")("./" + pic);
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        this.canvas = this.$refs.canvas;
        this.signaturePad = new __WEBPACK_IMPORTED_MODULE_0_signature_pad__["a" /* default */](this.canvas, {
            backgroundColor: 'rgb(255, 255, 255)'
        });
        var ratio = Math.max(window.devicePixelRatio || 1, 1);

        // This part causes the canvas to be cleared
        this.canvas.width = this.canvas.offsetWidth * ratio;
        this.canvas.height = this.canvas.offsetHeight * ratio;
        this.canvas.getContext("2d").scale(ratio, ratio);

        this.signaturePad.clear();

        //get list
        __WEBPACK_IMPORTED_MODULE_1_axios___default.a.get(this.webURl + "/api/sendword").then(function (response) {
            console.log(response.data.list);
            _this2.word = response.data.list;
        }).catch(function (error) {
            console.log(error);
        });
    }
});

/***/ }),

/***/ "FtD3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__("t8qj");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "GHBc":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "IFYE":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/0.c9161c6.jpeg";

/***/ }),

/***/ "JP+z":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "KCLY":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__("cGG2");
var normalizeHeaderName = __webpack_require__("5VQ+");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__("7GwW");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__("7GwW");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("W2nU")))

/***/ }),

/***/ "NT0A":
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAH6AfoDASIAAhEBAxEB/8QAHAABAQADAQEBAQAAAAAAAAAAAAgFBgcJBAMC/8QASBABAAEDBAECBQEEBAoGCwAAAAECAwQFBgcRCBIhCRMiMUFRFCMycRVCYYEWFyQzUmJyd5GhNjdDY7Kzc3SCg5KTo7G0wfD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A9UwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHJeYefaePtUsbF2DsjUeReQ8zHnOsbX0rIos12cOmfqycvIr7t4lr2mmiq573K+qKIme+sBuDmTd/Lur5fH3jJdxLlrDv14Wv8gZVj5+laNXTPVyxh09xGoZse/00z8m3PXzK5nq3PQeKOHtocP6PlYG3KczN1HVr/7ZrWuane/aNS1jL66m/lX5iJrq69opiIooj6aKaY9gfnxDzZsLm7QsnWdk52XF/TL8Yer6ZqGHdw8/Ssv0RVVj5Ni7TFVu5TFXv7TE9T1Mt8SH4P6/O6eZfKXWvnfNpjkqvAoq+bFfdGNamxTMdTPt1bjr+z2/HtXgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANF5X5a0fi3TsG3Vp2Xru5dfv1YW3duafEVZurZUU+qaaIn2t2qI+q7fr6t2qPqqn3piQynIXJGyuK9t3d2b816xpenW66bNE1RVXdyL1U9UWbNqiJrvXap9qbdFNVVU/aJcmjaPKXkjFWTyfa1LYHGmRExa2dYv/K1nXLFX51XItVd4tqqn2nDs1eqYqmLt33m1Gwcc8M6zd3LY5e5w1TG3Hv6LVVGBj2Iq/orbNm5714+n2qvvXMdU3MquPm3fT/2dHVuOvg+HQ9C0XbGj4W3tuaTiaXpenWKMbEw8SzTas49qmOqaKKKYiKaYj7REMfv3dmFsLY24t86jNEYm3dJzNWvzXPVMW8ezVdq7n8R1RLPJZ+Jvv6dg+GO/K7F/5WXuCjF0DH9+vX+036IvU/8AyIv/APAGq/CZ2lqGk+K9W/db9VzU+Q9yanuC/fuf5y7HzIx4mf7Jqx7lUf7ff5Wg5x44bE/xY8A8ebBrsxav6JtrT8XKpiOu8mLFM3quv7bs1z/e6OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADSOUOV9E4zwsPGqw8nW9y63XVjaBt3A6qzdVyIpmfTRE+1u1THvcv19W7dPvVVHtEh+fLHKuFxppuFjYWk39w7r1+9OFtzbuJdpoyNTyvTM/wAVXtasUR9d2/V9NuiJme5mmmrH8TcTZ21M3P5C5D1ezuLkbcFqLeqarbpmnHwsaKvVRp2Bbq97OJbnr2/ju1x8y5NVUx6f04t4z1PQ9SzuSeQ8+1q2/twWKbOdkWvfF0zEiqarenYVMx3RYomYmqqfqu3O7lX3ppo6OAAAhT4m0Rv3dHjt48zEXbO+OQbOZm2o9/8AJsb5dm5NX59Pozbk9fn0T+ntdaGd5Wf8anxZNl6PambmDxJsK/rGVR17RlZM3Lcdz/LLxKoj790fmAXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADhW+uZN2773ZncMeOE4eXrmn3Ixtz7uyLfztM2rFUR3REdxGXn+me6cemeqJ6qvTTH01BsXKnNF/beuY/F3Gmi2t1clatYi/iaVNyaMXTMaavT/SGpXaYmcfFpmJ6jqbl2qn0W4me5p+virhvH2LmZm9d161XurkHXLMWtY3HkWYt1VWoq9cYmLa7mMbDoqn6LNMz/AKVdVdczXOR4o4h2lw/oV/Stuxl5mfqV+c3Wda1G98/UdYzJj6snKvT711z9oiOqaKeqaKaaYimN3AAAAARV4LYs8j+QPkt5JX6fnWNZ3fTtHSMievqxNNo9EzT+tNVH7J/Z9HX4lSHkVyXb4d4K33ybVdpt3tv6Fl5WJ6p6irL+XNOPR3/rXqrdP97R/BHim7w74pcf7Vz8WbOq5enRrWqeuP3k5eZVORVTcn81URcpt/ytxHc9dg76AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/i9etY9qu/fu0W7Vuma6666oimmmI7mZmftEQxe7N3bY2JtzP3dvLXsLRtF0uzVkZmdmXotWbNEfmap/4RH3mZiI7mU4WNK335pZNnU904Wr7M4It3JuYuh3oqxNV3vTE/TdzIifXjadV13TYn03L0T6q+qZogH35/Ie+PKvUsnaPBWtZG3eL8a/Xia7yHjz6cjVpp7pu4eidx9omJorzZ+mmfVFr1VU+qO7bB4/2bxftPA2PsHb+Lo2i6bR6MfFx6Z67n3qrrqnuquuqe6qq6pmqqqZmqZmZll9K0rTND0zE0XRdPxsDT8CxRjYuLjWqbdqxaopimiiiimIimmIiIiIjqIh9QAAAAAAJU868eOTMjiXxdsTNccn7wsZGs2Yn+LQtLiMvN76+0902Op/VVNFFFuim3bpimmmIimmI6iI/SE1bKop5G88OQt2V914PFG0NL2hh+/qt1Z2o11Z2Vcon7RXTapxrdX5iKoj9VLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANK5c5i2FwhtC7vLf8Aq042N8ynGw8Sxbm9mall1z1axcWxT9V69XV1FNNP85mKYmqMJzXz1oPEFrTtDw9HzN1753HVVZ25tHS6onO1K5ET3XMz3FjHo67uZFzqiiIn7z1TOscScA7gq3fb528htWw9z8l3LVVvTsfGpn+idqY1cfVi6dbq95rmJ6uZNX7y59vpp7iQwO0eIt/eQG48Lljyg0qjTtE0+9Tl7S40+ZF3G0+Y96M3VZj6crN6mPTa6+VY69oqrmZppUAAAAAAAH5ZWVj4WNezMy/RZsWLdV27crq9NNFFMdzVMz9oiIme36uGebu9NQ2T4u78ydDmqdZ1vBp23pVFE9XK8vUbtGHb9H+tHz5qj9PT3+AYHwLx7+tcO6xzJqFmu3nct7u1neddFyPrtY17JmziW+59/RGPYszTEzPUVfzUi1vjbZWn8bcebY490r0/se2dIw9JszTHUVUWLNNuKv5z6e/f392yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIg4X84+TvILzW1riXjHaGkZ3EG16Muxq2u/JuftMVW7ddNvIpu/Mij03MmiKKKPRMzbmur+rM05j4jnkruDjHZGl8FcSRkZXKPK1yNI0q1iVVRfxMW7V8qu/RMfw3K6qvlW57iYmaq4n926r4ceMWg+KnC2mcf4f7Pla7k9Z+4tTt0dTmZ1cfVETPvNu3HVuiPb6afV1FVVXYdyAAAAAAAAAAAAcS5i5+1bRtzW+FuDdBxt4cqZ9qi7ViXq640zb2NX31nareo/zVuIiZpsxPzbs9U0RHqiph+Q+X99cobx1TgnxozcbH1PS6qcfdu+71mnJwNs+qO5x7FHfpytQ69/lTPotdxNyf6sdL4e4Y2PwhtWdsbLxL9VeVeqzdV1TOvTkahq+bX73MvLv1fVevVz7zM+0R1FMU0xEQGC4T4C03iy5nbw3Nr2TvLkfcNun/AAg3bqFERfyeveMfHojunFxKJ/gsW+oiIiapqqj1OrgAAAAAAAAAmjyYpnf3kB4+8LW6pqxadw5e/wDV6aff0WNIsd40Vx+aa8rItx1Pt3R3+IUumvi+n/GD5scuciTVFzB4/wBA0nj3TblM901XrveoZ0R+lVNdzGon8/T1+IBSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOTeWHJ2Zw3438h8k6Zd+VqGj6HfnAudz+7y7vVmxV7fpduUT/AHAkfxewcPyd+IZzB5IanR+2aJxlVRtfa3riZtRd6uY/zrff3+i1k3OvxOXE+3s9EUm/C94stcaeIO18+9T3qe9rt/dGdcmJ7qm/MU2PeYiZ/wAntWJ/TuapjuJ7msgAAAAAAAAAfxevWse1Xfv3aLdq3TNddddURTTTEdzMzP2iIB/aW+SOZt7c97/1Pxx8ZdYr0+xpVU42/eQ7Nv5lnQaJ9qsHBqn6bufXHdMzE9Wfef44+jUt5c0cheZ+7dR4S8WtZyND460y9OFvfk6x7euJ6mvA0irv67tVM9VXo9qYq7jqPRNyouKOJ9h8J7F03jnjfQrWlaJplHVu3T9Vy7cn+O9drn3uXK596qp95n+yIiA/vi7i/ZfDmydO4/2DpNOBpOnUz1E1eu7kXave5fvXJ97l2uruqqufeZltgAAAAAAAAAAA+XU9SwtG03L1fUr8WcTBsXMm/cn7UW6KZqqqn+URMuA+B+lZtfAdvkrWMWvH1flXXtV39n0VfeJ1DJqqx/7v2WjGiIj2iIiI9oZDze3Bqml+OG5dtbcr617flzE2RpNEd915OqX6MSeuvfum3du1+3v9Dsm19u6ZtDbOkbS0SzFnTtEwMfTsS3EdeizZt026Kfb9KaYgGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARN8X7ddW3fDnM0iLk0xujcemaTMRE/VFFVeX1PX/AKp37/p+vS2UB/GXsWqPH3Ymr5s13MHD5AwoyseKPVTcoqwsyZqn369oomn3/wBP7x+QtDiTalOw+KtmbHpt/Ljb239O0v09ddfIx6Lf2/8AZbYAAAAAAAAODeT/AJica+M2n42m6jbydy741mPRoW0dJibufn3ap9NHqimKptW5q6j1TEzPvFFNcxMA6nyPyVsTiPZ+fv3kfc2FoOhabbmu/l5VfUd9TMUUUx3Vcrq66pooiaqp9oiZRXGXzX8SbPmxiW9a4y8aqLsfMvz+41rekUzMTRT13FvFmYmJ+9P/AKSr2tZjjbxM5Z8k924HOvnjm2sm1i1/tW2uMcSqqNL0imfTNNeVTFUxcuz19VuZqmfaLlUx+6ot6xYsYti3jY1mi1ZtURRbt0UxTTRTEdRERHtERH4Bhdi7E2fxltPTdi7C29iaJoOkWYx8PCxaeqLdEfmZnuaqpnuaqqpmqqZmZmZmZZ4AAAAAAAAAAAAAT5zDbjkDyi4a4xp/e4W1Lep8j6vanuIice3GFp8z+Jn5+ZdriPv+4n8d9UG4LwVco39zfzJzDNybuNiapjceaPVV3HpxtKoqry5p9ojqrOy8qnv3/wAxH9/egAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEY/Fx0qxqPhhreZdpia9L1vSsu1M/iqb/AMn/AMN6pZyYviV7Oz96+FXJGFpdiu7labi4usxTTP2tYmXZvX6p/sizRdq/uB3rjbUMvVuOtrarnzTOTmaLg5F70zMx8yuxRVV137/eZbG5F4jcgabyf4y8abx0zLpyIydt4ONlVRMT6cuxaixk0T1+ab1u5H4+32h10AAAAAYbd28tp7A2/l7r3vuTTdB0fBo9eRnahk0WLNuP7aqpiO5/EfeZ9oRDu3nfl7z13Fn8Q+JOfm7U4swrn7Lurk29ZuWbuVExEzi6fRPpriZp+8+1cxVHqm3RMfNDcefvNHdGtb4r8bPDLRMXfHJt+a7Gqav36tJ2xRE+mu7eufwV3KO59u5ppqiKZiuv91O4+L3hVtjg7UMrk/f+t3+QOXNd7vavuvVJm7VauVR9VvEiv3tUf1fV/HVHt9NPVEdI8fvHXi3xo2JY2FxdoNOJY6przs691XmalfiOpvZF3qJrq956iOqaYnqmmmPZ00AAAAAAAAAAAAAABqXLfIukcR8Ybq5N127aow9s6Tk6lXTcuRRF2q3bmaLUTP8AWrr9NFMfeaqoiPeW2oM+MNydnbb8edG4k0bGuX8/krXLOJVRTb9U1Y2JXbv1U0z+K5v/ALLERH3j1AnfhH4s21OC9nbe4wo4nztyabp2HVf1bXLepxYyM3Vsm/VkZt6izXa6m3N29d9PqqpqnqO4pieo9U+LuRNB5b4523ybtiL9Ol7n0zH1PGov0xF21Tdoir5dyImYiumZmmrqZjumepmPd58eV3iVt3hD4YNO1dP0DTv8INr5Gk65rmfj4sReys+7kU2ci5VX71VxT+0zREzMxFu3EdREREUD8LrdMbn8JthUXL83cjRq9R0u/wBz36fl5t6bdP3n7Wq7X/69ugVcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+XU9MwNa03L0fVcS3lYWfYuY2TYuR3RdtV0zTXRVH5iaZmJ/m+oB5r+DXIkeIvkNvvwV5Szc3B0zP1y5qGwM/UI9NvKouTMUURX9u79um1VT1Pp+bbu0fx1RE+lCdPMvwz2h5bbRwrN7VJ25vPb9c3tB3DZs+uuxMzE1WbsRNNVdqqYifaqJoqiKqf61NUpZnKPxVPEC1bo5D2Zp3M+zdOp9NzVMO3VmX/AJNMdzM3rMUZNExHXd3Is1x9/efuD04HmXqHxttrXMC1Y21467hztcrp6u4eRrNu1at1x36opros111xERM+9umfaft92EteVvxU/IymKeFeB7eytJyoibGpV6RFru3V/WjJ1OqLNyOp+9u33+kdg9Qdb13RNs6Vk67uPWcHStNw7c3cnMzsiixYs0R96q7lcxTTEfrMoW5++LBx9tvV6OO/GXbN/lXeWbe/Y8a7j27s6dTkVT1TTbiiPm5lUz7em16aZ/Fyfs5ppnwufJfnTVMbXvMDydzc2xbri9GmYGVe1K5b/E0W6r3osY09TPvbt10+8+09ytvx98P+AvGbApt8X7IsWtVqtfKyNdz5jJ1PIifv6r9UfRTPt3Rbiiieu/SCU+L/AAS5t8ldw4fMfxBt86jnxbuRkaZsHDyYtYuNR+IvxZn5dqJj727X7yqPTNd31eqh6A7c21t7Z+iYe2tqaJg6PpOn2os4uFhWKbNmzRH2ppopiIiGSAAAAAAAAAAAAAAAAAHk98WvV83k7yf4V4A0G/MZtqi1VbqszPrt5OqZtuxTHce8TEYtuqP0ivv8vWF5Dce348i/jE6luSa6MrStparm36Y96qaLWlY84lmqn7dd5NFu5H+33+QekHlnsuOQvGXlDaNNim9fzdrajVi0Vfacm1Zqu2P/AKtuhIPwTt4ValwbvnY9y7669C3PTn0RPfdFrLxqKYp/Tr1Ytyf5zP6w9FL1m1kWq7F+1RctXKZororpiaaqZjqYmJ+8TDy1+DXpuTtLlLnvY811xb067p+Ncpqo+9eNkZtqJmZiJiY9VXt7d9z7e3sHqaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD57Onafj5N3Mx8HHtZF//ADt2i1TTXc/2qojuf730AAAAAAAAAAAAAAAAAAAAADTuZOQcTijibeHJWbXbpt7Z0TM1OmK56i5ctWqqrdv+2aq4ppiPzNUQ83/gvcfZefuvlXmnWLNNeRboxttWMqn6ovXa6vn5k+r9ZqtYtU9ff1/j27rT4lO9I2P4ab91GijGuZOb/R+n49rIs2rtFyu7m2YqiaLtNVNXVuLlXXpmfp7jqY9UfB8MLjX/ABb+G2zKr+NNnN3VVkblyu6Yj1/tNfVir2+/eNbx/uCrHnR8NbR5wPLLy6os1TVY0/d1WH6pj796lqfp/wCVuXouiD4d+j/I5n8ttf8ATT/lvLGoYfq6jufk5eZX139/+3/5z/aC3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAc28heBdmeSvFupcS78zNUxNK1K9j5FWRpl23bybVyzcpuUTRVcorp+9PU90z7TP2n3jdNqba0nZe19H2doFibOmaFgY+mYVuau5osWLdNu3TM/nqmmIZUAR/wDD8/6VeT3+/Dcf/mQsBH/w/P8ApV5Pf78Nx/8AmQCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEd/D6v26t5eUOLFX7y3zbuC5VH6RVdmI/8MrERv4FYdvB5e8q7Fue4q5Wzb0/zuVXa5/51SCyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEieEWLew+afKi1fo9NVXJly7Ef6tduqumf/AIaolXaVPD7/AK9vKP8A3gWP/wAOkFVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJe8QsKq3zF5N6jNVPpv8jxYiPfuJowbMzM/jr95H/CVQpz8SsT0748i9Rjvq9yxmWPf/u9NwJ+3/vAUYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn3xCoom7zhmUzE1ZXMO4aq6oq77m3Ri2Y/l1FqI6/sUEn7w1p62/yrX6pma+Yd6TPc/pqdyP/ALRAKBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT54Z37V3b/K9u3XFVVnmLetFcf6NX9J3Kuv+FUT/AHqDTr4d/wCTalz5pNVuxbqxOZNduRRb6iZov4+HkRXVEfmZu1e/5mJ/PYKKAABoXH/N3HvJ+8t8bF2bql7N1PjzOs6brk/s9VNm1k3Ka5+XRcn6blVM266a4ie6aqep/AN9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATp43U3NP5/8l9BqptU0Wt46TqEU0/xd5Oi4lczPv8An0xP8/UotOXB9zHt+Ynkzh2uvmVf4GZd33n716Xdtx7fysx//QCjQAc08kuadJ8e+EN28t6rNqurQ8CurBx7k+2VnV9W8az7e/VV2qiJmPtT6qvw498NPjHV9i+Mmn7w3dVdvbp5Nz8nemr5F+J+beqy5ibNVUzET9Vmm3c6+0VXav17mdvNTeGV5l+W+xfB7Y2RORtnbOq06pvTLx6p9NN23RM36fXHtE2Mequ3H/fX/RPU0w9LsHCw9MwsfTdPxrePi4lqixYs26fTRbt0xEU00x+IiIiIgH7gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJu4/wAmdG89eXdDvxFurcexdsa1Yp9PXzbeNezcaqvv89VXPT37/p37KRSF5t5Gt8D732B5rbX06/m4+za6tr73w7HXqytuZt2nqv8Atmzkemqmn813KZnqmmZBXqZfP3yywvFXhXJ1HSMu1O+Nyxc07bWNVEVTRd6/eZdVM/1LNNUT9pia6rdMx1VMxQOLvLa2bs6zyDja9h17bv6ZTrNvU/mdY84NVr5sX/VP2o+XPq7n8PK3hbb+ofEz82dY5w3vp96vibjuu1a03T8ij93kW7dcziYlVM9xM3KvXkX4+r2n5c9RVR0FF/C58WdV4d40zuZuR8e/O/eSopzL37XM1ZGJp01fMt0VzV7xcu1T8653PfvaieqqZXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADFbq2tt3fG29T2fu3SMbVdG1jGuYedhZFPqt37NcdVUzH8p+8e8T7x1MMqA87dzfC25Jy8jN4t2Z5T67oHBuXlVaja2zXReysjGu1R1Vjx3cpouWZ7qnuqrruY7t1VR65r/wAafHjZfjBxPp3FOya7uTYxrtzLzs+/RTTe1DLudeu/cin2ieqaKIj8UW6I7nrt1MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//9k="

/***/ }),

/***/ "Oi+a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__("dIwP");
var combineURLs = __webpack_require__("qRfI");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "OjNw":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',[_c('div',{staticClass:"text-center signaturepad-outer"},[_c('div',{ref:"signaturepad",staticClass:"signature-pad",attrs:{"id":"signature-pad"}},[_c('div',{staticClass:"signature-pad--body"},[_c('canvas',{ref:"canvas"})])])]),_vm._v(" "),(_vm.word)?_c('div',{staticClass:"word"},[_vm._v(" "+_vm._s(_vm.word[_vm.word_count])+" ")]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"footer text-center"},[_c('div',{staticStyle:{"margin":"5px"}},[_c('button',{ref:"png",staticClass:"btn-info btn btn-lg",on:{"click":function($event){$event.preventDefault();return _vm.savePNGButton($event)}}},[_vm._v("Save as PNG")])]),_vm._v(" "),_c('button',{ref:"clear",staticClass:"btn-info btn btn-lg",on:{"click":function($event){$event.preventDefault();return _vm.clearButton($event)}}},[_vm._v("Clear")]),_vm._v(" "),_c('button',{ref:"undo",staticClass:"btn-info btn btn-lg",on:{"click":function($event){$event.preventDefault();return _vm.undoButton($event)}}},[_vm._v("Undo")]),_vm._v(" "),_c('div',{staticStyle:{"margin":"5px"}},[_c('button',{staticClass:"btn-info btn btn-lg",on:{"click":function($event){$event.preventDefault();return _vm.showPic($event)}}},[_vm._v("Show I have drawn")]),_vm._v(" "),(_vm.picture)?_c('div',_vm._l((_vm.picture),function(pic){return _c('div',{key:pic},[_c('img',{attrs:{"src":_vm.getImgUrl(pic)}})])}),0):_vm._e()])]),_vm._v(" "),_c('div')]),_vm._v(" "),_c('login',{on:{"login_check":_vm.login_check}})],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ "QQMu":
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),

/***/ "QboG":
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),

/***/ "SLDG":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "TNV1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "XH3W":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("9UzI");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__("rjj0")("27b061ea", content, true, {});

/***/ }),

/***/ "XmWM":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");
var buildURL = __webpack_require__("DQCr");
var InterceptorManager = __webpack_require__("fuGk");
var dispatchRequest = __webpack_require__("xLtR");
var mergeConfig = __webpack_require__("DUeU");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "atID":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/1.bac58fe.jpeg";

/***/ }),

/***/ "bJji":
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),

/***/ "cGG2":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__("JP+z");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "cWxy":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__("dVOP");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "dIwP":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "dVOP":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "fuGk":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "hJLJ":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*!
 * Signature Pad v3.0.0-beta.4 | https://github.com/szimek/signature_pad
 * (c) 2020 Szymon Nowak | Released under the MIT license
 */

class Point {
    constructor(x, y, time) {
        this.x = x;
        this.y = y;
        this.time = time || Date.now();
    }
    distanceTo(start) {
        return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
    }
    equals(other) {
        return this.x === other.x && this.y === other.y && this.time === other.time;
    }
    velocityFrom(start) {
        return this.time !== start.time
            ? this.distanceTo(start) / (this.time - start.time)
            : 0;
    }
}

class Bezier {
    constructor(startPoint, control2, control1, endPoint, startWidth, endWidth) {
        this.startPoint = startPoint;
        this.control2 = control2;
        this.control1 = control1;
        this.endPoint = endPoint;
        this.startWidth = startWidth;
        this.endWidth = endWidth;
    }
    static fromPoints(points, widths) {
        const c2 = this.calculateControlPoints(points[0], points[1], points[2]).c2;
        const c3 = this.calculateControlPoints(points[1], points[2], points[3]).c1;
        return new Bezier(points[1], c2, c3, points[2], widths.start, widths.end);
    }
    static calculateControlPoints(s1, s2, s3) {
        const dx1 = s1.x - s2.x;
        const dy1 = s1.y - s2.y;
        const dx2 = s2.x - s3.x;
        const dy2 = s2.y - s3.y;
        const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
        const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };
        const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const dxm = m1.x - m2.x;
        const dym = m1.y - m2.y;
        const k = l2 / (l1 + l2);
        const cm = { x: m2.x + dxm * k, y: m2.y + dym * k };
        const tx = s2.x - cm.x;
        const ty = s2.y - cm.y;
        return {
            c1: new Point(m1.x + tx, m1.y + ty),
            c2: new Point(m2.x + tx, m2.y + ty),
        };
    }
    length() {
        const steps = 10;
        let length = 0;
        let px;
        let py;
        for (let i = 0; i <= steps; i += 1) {
            const t = i / steps;
            const cx = this.point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
            const cy = this.point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
            if (i > 0) {
                const xdiff = cx - px;
                const ydiff = cy - py;
                length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            }
            px = cx;
            py = cy;
        }
        return length;
    }
    point(t, start, c1, c2, end) {
        return (start * (1.0 - t) * (1.0 - t) * (1.0 - t))
            + (3.0 * c1 * (1.0 - t) * (1.0 - t) * t)
            + (3.0 * c2 * (1.0 - t) * t * t)
            + (end * t * t * t);
    }
}

function throttle(fn, wait = 250) {
    let previous = 0;
    let timeout = null;
    let result;
    let storedContext;
    let storedArgs;
    const later = () => {
        previous = Date.now();
        timeout = null;
        result = fn.apply(storedContext, storedArgs);
        if (!timeout) {
            storedContext = null;
            storedArgs = [];
        }
    };
    return function wrapper(...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        storedContext = this;
        storedArgs = args;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = fn.apply(storedContext, storedArgs);
            if (!timeout) {
                storedContext = null;
                storedArgs = [];
            }
        }
        else if (!timeout) {
            timeout = window.setTimeout(later, remaining);
        }
        return result;
    };
}

class SignaturePad {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.options = options;
        this._handleMouseDown = (event) => {
            if (event.which === 1) {
                this._mouseButtonDown = true;
                this._strokeBegin(event);
            }
        };
        this._handleMouseMove = (event) => {
            if (this._mouseButtonDown) {
                this._strokeMoveUpdate(event);
            }
        };
        this._handleMouseUp = (event) => {
            if (event.which === 1 && this._mouseButtonDown) {
                this._mouseButtonDown = false;
                this._strokeEnd(event);
            }
        };
        this._handleTouchStart = (event) => {
            event.preventDefault();
            if (event.targetTouches.length === 1) {
                const touch = event.changedTouches[0];
                this._strokeBegin(touch);
            }
        };
        this._handleTouchMove = (event) => {
            event.preventDefault();
            const touch = event.targetTouches[0];
            this._strokeMoveUpdate(touch);
        };
        this._handleTouchEnd = (event) => {
            const wasCanvasTouched = event.target === this.canvas;
            if (wasCanvasTouched) {
                event.preventDefault();
                const touch = event.changedTouches[0];
                this._strokeEnd(touch);
            }
        };
        this.velocityFilterWeight = options.velocityFilterWeight || 0.7;
        this.minWidth = options.minWidth || 0.5;
        this.maxWidth = options.maxWidth || 2.5;
        this.throttle = ('throttle' in options ? options.throttle : 16);
        this.minDistance = ('minDistance' in options
            ? options.minDistance
            : 5);
        this.dotSize =
            options.dotSize ||
                function dotSize() {
                    return (this.minWidth + this.maxWidth) / 2;
                };
        this.penColor = options.penColor || 'black';
        this.backgroundColor = options.backgroundColor || 'rgba(0,0,0,0)';
        this.onBegin = options.onBegin;
        this.onEnd = options.onEnd;
        this._strokeMoveUpdate = this.throttle
            ? throttle(SignaturePad.prototype._strokeUpdate, this.throttle)
            : SignaturePad.prototype._strokeUpdate;
        this._ctx = canvas.getContext('2d');
        this.clear();
        this.on();
    }
    clear() {
        const { _ctx: ctx, canvas } = this;
        ctx.fillStyle = this.backgroundColor;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this._data = [];
        this._reset();
        this._isEmpty = true;
    }
    fromDataURL(dataUrl, options = {}, callback) {
        const image = new Image();
        const ratio = options.ratio || window.devicePixelRatio || 1;
        const width = options.width || this.canvas.width / ratio;
        const height = options.height || this.canvas.height / ratio;
        this._reset();
        image.onload = () => {
            this._ctx.drawImage(image, 0, 0, width, height);
            if (callback) {
                callback();
            }
        };
        image.onerror = (error) => {
            if (callback) {
                callback(error);
            }
        };
        image.src = dataUrl;
        this._isEmpty = false;
    }
    toDataURL(type = 'image/png', encoderOptions) {
        switch (type) {
            case 'image/svg+xml':
                return this._toSVG();
            default:
                return this.canvas.toDataURL(type, encoderOptions);
        }
    }
    on() {
        this.canvas.style.touchAction = 'none';
        this.canvas.style.msTouchAction = 'none';
        if (window.PointerEvent) {
            this._handlePointerEvents();
        }
        else {
            this._handleMouseEvents();
            if ('ontouchstart' in window) {
                this._handleTouchEvents();
            }
        }
    }
    off() {
        this.canvas.style.touchAction = 'auto';
        this.canvas.style.msTouchAction = 'auto';
        this.canvas.removeEventListener('pointerdown', this._handleMouseDown);
        this.canvas.removeEventListener('pointermove', this._handleMouseMove);
        document.removeEventListener('pointerup', this._handleMouseUp);
        this.canvas.removeEventListener('mousedown', this._handleMouseDown);
        this.canvas.removeEventListener('mousemove', this._handleMouseMove);
        document.removeEventListener('mouseup', this._handleMouseUp);
        this.canvas.removeEventListener('touchstart', this._handleTouchStart);
        this.canvas.removeEventListener('touchmove', this._handleTouchMove);
        this.canvas.removeEventListener('touchend', this._handleTouchEnd);
    }
    isEmpty() {
        return this._isEmpty;
    }
    fromData(pointGroups) {
        this.clear();
        this._fromData(pointGroups, ({ color, curve }) => this._drawCurve({ color, curve }), ({ color, point }) => this._drawDot({ color, point }));
        this._data = pointGroups;
    }
    toData() {
        return this._data;
    }
    _strokeBegin(event) {
        const newPointGroup = {
            color: this.penColor,
            points: [],
        };
        if (typeof this.onBegin === 'function') {
            this.onBegin(event);
        }
        this._data.push(newPointGroup);
        this._reset();
        this._strokeUpdate(event);
    }
    _strokeUpdate(event) {
        if (this._data.length === 0) {
            this._strokeBegin(event);
            return;
        }
        const x = event.clientX;
        const y = event.clientY;
        const point = this._createPoint(x, y);
        const lastPointGroup = this._data[this._data.length - 1];
        const lastPoints = lastPointGroup.points;
        const lastPoint = lastPoints.length > 0 && lastPoints[lastPoints.length - 1];
        const isLastPointTooClose = lastPoint
            ? point.distanceTo(lastPoint) <= this.minDistance
            : false;
        const color = lastPointGroup.color;
        if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
            const curve = this._addPoint(point);
            if (!lastPoint) {
                this._drawDot({ color, point });
            }
            else if (curve) {
                this._drawCurve({ color, curve });
            }
            lastPoints.push({
                time: point.time,
                x: point.x,
                y: point.y,
            });
        }
    }
    _strokeEnd(event) {
        this._strokeUpdate(event);
        if (typeof this.onEnd === 'function') {
            this.onEnd(event);
        }
    }
    _handlePointerEvents() {
        this._mouseButtonDown = false;
        this.canvas.addEventListener('pointerdown', this._handleMouseDown);
        this.canvas.addEventListener('pointermove', this._handleMouseMove);
        document.addEventListener('pointerup', this._handleMouseUp);
    }
    _handleMouseEvents() {
        this._mouseButtonDown = false;
        this.canvas.addEventListener('mousedown', this._handleMouseDown);
        this.canvas.addEventListener('mousemove', this._handleMouseMove);
        document.addEventListener('mouseup', this._handleMouseUp);
    }
    _handleTouchEvents() {
        this.canvas.addEventListener('touchstart', this._handleTouchStart);
        this.canvas.addEventListener('touchmove', this._handleTouchMove);
        this.canvas.addEventListener('touchend', this._handleTouchEnd);
    }
    _reset() {
        this._lastPoints = [];
        this._lastVelocity = 0;
        this._lastWidth = (this.minWidth + this.maxWidth) / 2;
        this._ctx.fillStyle = this.penColor;
    }
    _createPoint(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        return new Point(x - rect.left, y - rect.top, new Date().getTime());
    }
    _addPoint(point) {
        const { _lastPoints } = this;
        _lastPoints.push(point);
        if (_lastPoints.length > 2) {
            if (_lastPoints.length === 3) {
                _lastPoints.unshift(_lastPoints[0]);
            }
            const widths = this._calculateCurveWidths(_lastPoints[1], _lastPoints[2]);
            const curve = Bezier.fromPoints(_lastPoints, widths);
            _lastPoints.shift();
            return curve;
        }
        return null;
    }
    _calculateCurveWidths(startPoint, endPoint) {
        const velocity = this.velocityFilterWeight * endPoint.velocityFrom(startPoint) +
            (1 - this.velocityFilterWeight) * this._lastVelocity;
        const newWidth = this._strokeWidth(velocity);
        const widths = {
            end: newWidth,
            start: this._lastWidth,
        };
        this._lastVelocity = velocity;
        this._lastWidth = newWidth;
        return widths;
    }
    _strokeWidth(velocity) {
        return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
    }
    _drawCurveSegment(x, y, width) {
        const ctx = this._ctx;
        ctx.moveTo(x, y);
        ctx.arc(x, y, width, 0, 2 * Math.PI, false);
        this._isEmpty = false;
    }
    _drawCurve({ color, curve }) {
        const ctx = this._ctx;
        const widthDelta = curve.endWidth - curve.startWidth;
        const drawSteps = Math.floor(curve.length()) * 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        for (let i = 0; i < drawSteps; i += 1) {
            const t = i / drawSteps;
            const tt = t * t;
            const ttt = tt * t;
            const u = 1 - t;
            const uu = u * u;
            const uuu = uu * u;
            let x = uuu * curve.startPoint.x;
            x += 3 * uu * t * curve.control1.x;
            x += 3 * u * tt * curve.control2.x;
            x += ttt * curve.endPoint.x;
            let y = uuu * curve.startPoint.y;
            y += 3 * uu * t * curve.control1.y;
            y += 3 * u * tt * curve.control2.y;
            y += ttt * curve.endPoint.y;
            const width = Math.min(curve.startWidth + ttt * widthDelta, this.maxWidth);
            this._drawCurveSegment(x, y, width);
        }
        ctx.closePath();
        ctx.fill();
    }
    _drawDot({ color, point, }) {
        const ctx = this._ctx;
        const width = typeof this.dotSize === 'function' ? this.dotSize() : this.dotSize;
        ctx.beginPath();
        this._drawCurveSegment(point.x, point.y, width);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    _fromData(pointGroups, drawCurve, drawDot) {
        for (const group of pointGroups) {
            const { color, points } = group;
            if (points.length > 1) {
                for (let j = 0; j < points.length; j += 1) {
                    const basicPoint = points[j];
                    const point = new Point(basicPoint.x, basicPoint.y, basicPoint.time);
                    this.penColor = color;
                    if (j === 0) {
                        this._reset();
                    }
                    const curve = this._addPoint(point);
                    if (curve) {
                        drawCurve({ color, curve });
                    }
                }
            }
            else {
                this._reset();
                drawDot({
                    color,
                    point: points[0],
                });
            }
        }
    }
    _toSVG() {
        const pointGroups = this._data;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const minX = 0;
        const minY = 0;
        const maxX = this.canvas.width / ratio;
        const maxY = this.canvas.height / ratio;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.canvas.width.toString());
        svg.setAttribute('height', this.canvas.height.toString());
        this._fromData(pointGroups, ({ color, curve }) => {
            const path = document.createElement('path');
            if (!isNaN(curve.control1.x) &&
                !isNaN(curve.control1.y) &&
                !isNaN(curve.control2.x) &&
                !isNaN(curve.control2.y)) {
                const attr = `M ${curve.startPoint.x.toFixed(3)},${curve.startPoint.y.toFixed(3)} ` +
                    `C ${curve.control1.x.toFixed(3)},${curve.control1.y.toFixed(3)} ` +
                    `${curve.control2.x.toFixed(3)},${curve.control2.y.toFixed(3)} ` +
                    `${curve.endPoint.x.toFixed(3)},${curve.endPoint.y.toFixed(3)}`;
                path.setAttribute('d', attr);
                path.setAttribute('stroke-width', (curve.endWidth * 2.25).toFixed(3));
                path.setAttribute('stroke', color);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');
                svg.appendChild(path);
            }
        }, ({ color, point }) => {
            const circle = document.createElement('circle');
            const dotSize = typeof this.dotSize === 'function' ? this.dotSize() : this.dotSize;
            circle.setAttribute('r', dotSize.toString());
            circle.setAttribute('cx', point.x.toString());
            circle.setAttribute('cy', point.y.toString());
            circle.setAttribute('fill', color);
            svg.appendChild(circle);
        });
        const prefix = 'data:image/svg+xml;base64,';
        const header = '<svg' +
            ' xmlns="http://www.w3.org/2000/svg"' +
            ' xmlns:xlink="http://www.w3.org/1999/xlink"' +
            ` viewBox="${minX} ${minY} ${maxX} ${maxY}"` +
            ` width="${maxX}"` +
            ` height="${maxY}"` +
            '>';
        let body = svg.innerHTML;
        if (body === undefined) {
            const dummy = document.createElement('dummy');
            const nodes = svg.childNodes;
            dummy.innerHTML = '';
            for (let i = 0; i < nodes.length; i += 1) {
                dummy.appendChild(nodes[i].cloneNode(true));
            }
            body = dummy.innerHTML;
        }
        const footer = '</svg>';
        const data = header + body + footer;
        return prefix + btoa(data);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (SignaturePad);
//# sourceMappingURL=signature_pad.js.map


/***/ }),

/***/ "l2tl":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./ian/0.jpeg": "IFYE",
	"./ian/1.jpeg": "atID",
	"./ian/2.jpeg": "QQMu",
	"./ian/3.jpeg": "QboG",
	"./patrick/0.jpeg": "bJji",
	"./patrick/1.jpeg": "NT0A",
	"./patrick/2.jpeg": "F9ct"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "l2tl";

/***/ }),

/***/ "lO7g":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__ = __webpack_require__("Fs8J");
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59fac46a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__ = __webpack_require__("OjNw");
function injectStyle (ssrContext) {
  __webpack_require__("4GGw")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-59fac46a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59fac46a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ "mtWM":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("tIFN");

/***/ }),

/***/ "nKb+":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__("mtWM");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return {
            username: '',
            password: '',
            login: false,
            login_msg: ''
        };
    },

    methods: {
        loginFunc: function loginFunc() {
            var _this = this;

            __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://localhost:5000/api/login', { params: { username: this.username, password: this.password } }).then(function (response) {
                if (response.data == "success") {
                    alert('Login success!');
                    _this.login = true;
                } else {
                    _this.username = '';
                    _this.password = '';
                    alert('Incorrect username or password');
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        registerFunc: function registerFunc() {
            var _this2 = this;

            __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://localhost:5000/api/register', { params: { username: this.username, password: this.password } }).then(function (response) {
                if (response.data == "success") {
                    _this2.username = '';
                    _this2.password = '';
                    alert('register success, please log in');
                } else {
                    _this2.username = '';
                    _this2.password = '';
                    alert('username had been used');
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    },
    watch: {
        login: function login() {
            // Emit this information to the parents component
            this.$emit("login_check", [this.username, this.password, this.login]);
        }
    }
});

/***/ }),

/***/ "oJlt":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "p1b6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "pBtG":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "pxG4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "pxSE":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("FZ+f")(true);
// imports


// module
exports.push([module.i, ".signaturepad-outer[data-v-59fac46a]{width:70vw;height:70vw;margin:3vw auto}.signature-pad[data-v-59fac46a]{position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;font-size:10px;width:100%;height:100%;border:1px solid #e8e8e8;background-color:#fff;-webkit-box-shadow:0 1px 4px rgba(0,0,0,.27),0 0 40px rgba(0,0,0,.08) inset;box-shadow:0 1px 4px rgba(0,0,0,.27),inset 0 0 40px rgba(0,0,0,.08);border-radius:4px;padding:5%;margin:auto}.signature-pad[data-v-59fac46a]:after,.signature-pad[data-v-59fac46a]:before{position:absolute;z-index:-1;content:\"\";width:40%;height:10px;bottom:10px;background:transparent;-webkit-box-shadow:0 8px 12px rgba(0,0,0,.4);box-shadow:0 8px 12px rgba(0,0,0,.4)}.signature-pad[data-v-59fac46a]:before{left:20px;-webkit-transform:skew(-3deg) rotate(-3deg);transform:skew(-3deg) rotate(-3deg)}.signature-pad[data-v-59fac46a]:after{right:20px;-webkit-transform:skew(3deg) rotate(3deg);transform:skew(3deg) rotate(3deg)}.signature-pad--body[data-v-59fac46a]{position:relative;-webkit-box-flex:1;-ms-flex:1;flex:1;border:1px solid #f4f4f4}.signature-pad--body canvas[data-v-59fac46a]{position:absolute;left:0;top:0;width:100%;height:100%;border-radius:4px;-webkit-box-shadow:0 0 5px rgba(0,0,0,.02) inset;box-shadow:inset 0 0 5px rgba(0,0,0,.02)}.footer[data-v-59fac46a]{height:300px;width:100%}.word[data-v-59fac46a]{font-size:3.5em;font-weight:500}", "", {"version":3,"sources":["C:/Users/USER/pingProjects/Research/flask-vue-spa-master/frontend/src/components/Home.vue"],"names":[],"mappings":"AACA,qCACI,WAAY,AACZ,YAAa,AACb,eAAiB,CACpB,AACD,gCACI,kBAAmB,AACnB,oBAAqB,AACrB,oBAAqB,AACrB,aAAc,AACd,4BAA6B,AAC7B,6BAA8B,AAC9B,0BAA2B,AAC3B,sBAAuB,AACvB,eAAgB,AAChB,WAAY,AACZ,YAAa,AAGb,yBAA0B,AAC1B,sBAAuB,AACvB,4EAAsF,AAC9E,oEAA8E,AACtF,kBAAmB,AACnB,WAAY,AACZ,WAAa,CAChB,AACD,6EAEI,kBAAmB,AACnB,WAAY,AACZ,WAAY,AACZ,UAAW,AACX,YAAa,AACb,YAAa,AACb,uBAAwB,AACxB,6CAAkD,AAC1C,oCAA0C,CACrD,AACD,uCACI,UAAW,AACX,4CAA6C,AAC7C,mCAAqC,CACxC,AACD,sCACI,WAAY,AACZ,0CAA2C,AAC3C,iCAAmC,CACtC,AACD,sCACI,kBAAmB,AACnB,mBAAoB,AACpB,WAAY,AACZ,OAAQ,AACR,wBAA0B,CAC7B,AACD,6CACI,kBAAmB,AACnB,OAAQ,AACR,MAAO,AACP,WAAY,AACZ,YAAa,AACb,kBAAmB,AACnB,iDAAsD,AAC9C,wCAA8C,CACzD,AACD,yBACI,aAAc,AACd,UAAY,CAEf,AACD,uBACI,gBAAiB,AACjB,eAAiB,CACpB","file":"Home.vue","sourcesContent":["\n.signaturepad-outer[data-v-59fac46a]{\n    width: 70vw;\n    height: 70vw;\n    margin: 3vw auto;\n}\n.signature-pad[data-v-59fac46a] {\n    position: relative;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n    -ms-flex-direction: column;\n    flex-direction: column;\n    font-size: 10px;\n    width: 100%;\n    height: 100%;\n    /* max-width: 360px;\n    max-height: 360px; */\n    border: 1px solid #e8e8e8;\n    background-color: #fff;\n    -webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;\n            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;\n    border-radius: 4px;\n    padding: 5%;\n    margin: auto;\n}\n.signature-pad[data-v-59fac46a]::before,\n.signature-pad[data-v-59fac46a]::after {\n    position: absolute;\n    z-index: -1;\n    content: \"\";\n    width: 40%;\n    height: 10px;\n    bottom: 10px;\n    background: transparent;\n    -webkit-box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);\n            box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);\n}\n.signature-pad[data-v-59fac46a]::before {\n    left: 20px;\n    -webkit-transform: skew(-3deg) rotate(-3deg);\n    transform: skew(-3deg) rotate(-3deg);\n}\n.signature-pad[data-v-59fac46a]::after {\n    right: 20px;\n    -webkit-transform: skew(3deg) rotate(3deg);\n    transform: skew(3deg) rotate(3deg);\n}\n.signature-pad--body[data-v-59fac46a] {\n    position: relative;\n    -webkit-box-flex: 1;\n    -ms-flex: 1;\n    flex: 1;\n    border: 1px solid #f4f4f4;\n}\n.signature-pad--body canvas[data-v-59fac46a] {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    border-radius: 4px;\n    -webkit-box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;\n            box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;\n}\n.footer[data-v-59fac46a] {\n    height: 300px;\n    width: 100%;\n    /* background-color: aliceblue; */\n}\n.word[data-v-59fac46a]{\n    font-size: 3.5em;\n    font-weight: 500;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "qRfI":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "t8qj":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "tIFN":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");
var bind = __webpack_require__("JP+z");
var Axios = __webpack_require__("XmWM");
var mergeConfig = __webpack_require__("DUeU");
var defaults = __webpack_require__("KCLY");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__("dVOP");
axios.CancelToken = __webpack_require__("cWxy");
axios.isCancel = __webpack_require__("pBtG");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__("pxG4");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__("SLDG");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "xJsL":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Login_vue__ = __webpack_require__("nKb+");
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_780628d0_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Login_vue__ = __webpack_require__("1Vt0");
function injectStyle (ssrContext) {
  __webpack_require__("XH3W")
}
var normalizeComponent = __webpack_require__("VU/8")
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-780628d0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Login_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_780628d0_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Login_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ "xLtR":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__("cGG2");
var transformData = __webpack_require__("TNV1");
var isCancel = __webpack_require__("pBtG");
var defaults = __webpack_require__("KCLY");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ })

});
//# sourceMappingURL=0.a8d55ebe78fcbb311bed.js.map