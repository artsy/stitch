'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

    var isValid, html, keys, renderedBlocks, blockMap;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            isValid = (0, _lodash.isString)(asset) || (0, _lodash.isObject)(asset);

            if (isValid) {
              _context2.next = 3;
              break;
            }

            throw new Error('(@artsy/stitch: lib/render) ' + 'Error rendering template: `asset` must be a string or an object.');

          case 3:
            if (!(0, _lodash.isString)(asset)) {
              _context2.next = 16;
              break;
            }

            _context2.prev = 4;
            _context2.next = 7;
            return (0, _renderSwitch2.default)(asset, options);

          case 7:
            html = _context2.sent;
            return _context2.abrupt('return', html);

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](4);

            throwError(_context2.t0);

          case 14:
            _context2.next = 28;
            break;

          case 16:
            keys = (0, _keys2.default)(asset);
            _context2.prev = 17;
            _context2.next = 20;
            return _promise2.default.all(keys.map(function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(key) {
                var html;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _renderSwitch2.default)(asset[key], options);

                      case 2:
                        html = _context.sent;
                        return _context.abrupt('return', [key, html]);

                      case 4:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 20:
            renderedBlocks = _context2.sent;
            blockMap = renderedBlocks.reduce(function (blockMap, _ref3) {
              var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
                  key = _ref4[0],
                  html = _ref4[1];

              return (0, _extends4.default)({}, blockMap, (0, _defineProperty3.default)({}, key, html));
            }, {});
            return _context2.abrupt('return', blockMap);

          case 25:
            _context2.prev = 25;
            _context2.t1 = _context2['catch'](17);

            throwError(_context2.t1);

          case 28:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[4, 11], [17, 25]]);
  }));

  function render(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return render;
}();

var throwError = function throwError(error) {
  throw new Error(error);
};