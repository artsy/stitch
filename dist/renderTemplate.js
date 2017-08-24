'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _consolidate = require('consolidate');

var _consolidate2 = _interopRequireDefault(_consolidate);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(template) {
    var compile = function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(file) {
        var extensionRe, ext, compileFn, filePath, html;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                extensionRe = /(?:\.([^.]+))?$/;
                ext = extensionRe.exec(file)[0].replace('.', '');
                compileFn = _consolidate2.default[ext];

                if ((0, _lodash.isFunction)(compileFn)) {
                  _context.next = 5;
                  break;
                }

                throw new Error('(@artsy/stitch: lib/renderTemplate) ' + ('Error rendering template with extension ' + ext + ': Can only render ') + 'templates supported by https://www.npmjs.com/package/consolidate.');

              case 5:
                filePath = _path2.default.join(basePath, file);
                _context.prev = 6;
                _context.next = 9;
                return compileFn(filePath, locals);

              case 9:
                html = _context.sent;


                // FIXME: Why does consolidate mutate locals?
                delete locals.filename;

                return _context.abrupt('return', html);

              case 14:
                _context.prev = 14;
                _context.t0 = _context['catch'](6);
                throw new Error(_context.t0.message);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 14]]);
      }));

      return function compile(_x3) {
        return _ref2.apply(this, arguments);
      };
    }();

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _options$basePath, basePath, _options$locals, locals, rendered;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _options$basePath = options.basePath, basePath = _options$basePath === undefined ? process.cwd() : _options$basePath, _options$locals = options.locals, locals = _options$locals === undefined ? {} : _options$locals;
            _context2.prev = 1;

            if (!(0, _lodash.isArray)(template)) {
              _context2.next = 8;
              break;
            }

            _context2.next = 5;
            return _promise2.default.all(template.map(compile));

          case 5:
            _context2.t0 = _context2.sent;
            _context2.next = 11;
            break;

          case 8:
            _context2.next = 10;
            return compile(template);

          case 10:
            _context2.t0 = _context2.sent;

          case 11:
            rendered = _context2.t0;
            return _context2.abrupt('return', rendered);

          case 15:
            _context2.prev = 15;
            _context2.t1 = _context2['catch'](1);
            throw new Error('(@artsy/stitch: lib/renderTemplate) ' + _context2.t1.message);

          case 18:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 15]]);
  }));

  function renderTemplate(_x) {
    return _ref.apply(this, arguments);
  }

  return renderTemplate;
}();