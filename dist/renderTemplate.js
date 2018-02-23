"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderTemplate;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _consolidate = _interopRequireDefault(require("consolidate"));

var _path = _interopRequireDefault(require("path"));

var _lodash = require("lodash");

function renderTemplate(_x) {
  return _renderTemplate.apply(this, arguments);
}

function _renderTemplate() {
  _renderTemplate = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(template) {
    var options,
        _options$basePath,
        basePath,
        _options$locals,
        locals,
        _options$config,
        config,
        rendered,
        compile,
        _compile,
        _args2 = arguments;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _compile = function _ref2() {
              _compile = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(file) {
                var ext, compileFn, filePath, html;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        ext = _path.default.extname(file).replace('.', '');
                        compileFn = config.engines[ext] || _consolidate.default[ext];

                        if ((0, _lodash.isFunction)(compileFn)) {
                          _context.next = 4;
                          break;
                        }

                        throw new Error('(@artsy/stitch: lib/renderTemplate) ' + "Error rendering template with extension ".concat(ext, ": Can only render ") + 'templates supported by https://www.npmjs.com/package/consolidate.');

                      case 4:
                        filePath = _path.default.join(basePath, file);
                        _context.prev = 5;
                        _context.next = 8;
                        return compileFn(filePath, locals);

                      case 8:
                        html = _context.sent;
                        // FIXME: Why does consolidate mutate locals?
                        delete locals.filename;
                        return _context.abrupt("return", html);

                      case 13:
                        _context.prev = 13;
                        _context.t0 = _context["catch"](5);
                        throw new Error(_context.t0.message);

                      case 16:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this, [[5, 13]]);
              }));
              return _compile.apply(this, arguments);
            };

            compile = function _ref(_x2) {
              return _compile.apply(this, arguments);
            };

            options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            _options$basePath = options.basePath, basePath = _options$basePath === void 0 ? process.cwd() : _options$basePath, _options$locals = options.locals, locals = _options$locals === void 0 ? {} : _options$locals, _options$config = options.config, config = _options$config === void 0 ? {
              engines: {}
            } : _options$config;
            _context2.prev = 4;

            if (!(0, _lodash.isArray)(template)) {
              _context2.next = 11;
              break;
            }

            _context2.next = 8;
            return _promise.default.all(template.map(compile));

          case 8:
            _context2.t0 = _context2.sent;
            _context2.next = 14;
            break;

          case 11:
            _context2.next = 13;
            return compile(template);

          case 13:
            _context2.t0 = _context2.sent;

          case 14:
            rendered = _context2.t0;
            return _context2.abrupt("return", rendered);

          case 18:
            _context2.prev = 18;
            _context2.t1 = _context2["catch"](4);
            throw new Error("(@artsy/stitch: lib/renderTemplate) ".concat(_context2.t1.message));

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[4, 18]]);
  }));
  return _renderTemplate.apply(this, arguments);
}