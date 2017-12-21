'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _renderSwitch = require('./renderSwitch');

var _renderSwitch2 = _interopRequireDefault(_renderSwitch);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(asset, options) {
    var _this = this;

    var isValid, _ref2, html, keys, renderedBlocks, blockMap, css;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            isValid = (0, _lodash.isString)(asset) || (0, _lodash.isObject)(asset);

            if (isValid) {
              _context2.next = 3;
              break;
            }

            throw new Error('(@artsy/stitch: lib/render) ' + 'Error rendering template: attempting to render something other than a ' + 'string or an object.');

          case 3:
            if (!(0, _lodash.isString)(asset)) {
              _context2.next = 17;
              break;
            }

            _context2.prev = 4;
            _context2.next = 7;
            return (0, _renderSwitch2.default)(asset, options);

          case 7:
            _ref2 = _context2.sent;
            html = _ref2.html;
            return _context2.abrupt('return', html);

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](4);

            throwError(_context2.t0);

          case 15:
            _context2.next = 30;
            break;

          case 17:
            keys = (0, _keys2.default)(asset);
            _context2.prev = 18;
            _context2.next = 21;
            return _promise2.default.all(keys.map(function () {
              var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(key) {
                var _ref4, html, css;

                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _renderSwitch2.default)(asset[key], options);

                      case 2:
                        _ref4 = _context.sent;
                        html = _ref4.html;
                        css = _ref4.css;
                        return _context.abrupt('return', {
                          key: key,
                          html: html,
                          css: css
                        });

                      case 6:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x3) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 21:
            renderedBlocks = _context2.sent;
            blockMap = renderedBlocks.reduce(function (blockMap, _ref5) {
              var key = _ref5.key,
                  html = _ref5.html;
              return (0, _extends4.default)({}, blockMap, (0, _defineProperty3.default)({}, key, html));
            }, {});
            css = renderedBlocks.filter(function (_ref6) {
              var css = _ref6.css;
              return !(0, _lodash.isEmpty)(css);
            }).map(function (_ref7) {
              var css = _ref7.css;
              return css;
            }).join('');
            return _context2.abrupt('return', [blockMap, css]);

          case 27:
            _context2.prev = 27;
            _context2.t1 = _context2['catch'](18);

            throwError(_context2.t1);

          case 30:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[4, 12], [18, 27]]);
  }));

  function render(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return render;
}();

var throwError = function throwError(error) {
  console.error(error);
  throw new Error(error);
};