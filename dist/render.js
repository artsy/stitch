"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _renderSwitch = _interopRequireDefault(require("./renderSwitch"));

var _lodash = require("lodash");

function render(_x, _x2) {
  return _render.apply(this, arguments);
}

function _render() {
  _render = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(asset, options) {
    var isValid, _ref, html, keys, renderedBlocks, blockMap, css;

    return _regenerator.default.wrap(function _callee2$(_context2) {
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
            return (0, _renderSwitch.default)(asset, options);

          case 7:
            _ref = _context2.sent;
            html = _ref.html;
            return _context2.abrupt("return", html);

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](4);
            throwError(_context2.t0);

          case 15:
            _context2.next = 30;
            break;

          case 17:
            keys = (0, _keys.default)(asset);
            _context2.prev = 18;
            _context2.next = 21;
            return _promise.default.all(keys.map(
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(key) {
                var _ref3, html, css;

                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _renderSwitch.default)(asset[key], options);

                      case 2:
                        _ref3 = _context.sent;
                        html = _ref3.html;
                        css = _ref3.css;
                        return _context.abrupt("return", {
                          key: key,
                          html: html,
                          css: css
                        });

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 21:
            renderedBlocks = _context2.sent;
            blockMap = renderedBlocks.reduce(function (blockMap, _ref4) {
              var key = _ref4.key,
                  html = _ref4.html;
              return (0, _objectSpread3.default)({}, blockMap, (0, _defineProperty2.default)({}, key, html));
            }, {});
            css = renderedBlocks.filter(function (_ref5) {
              var css = _ref5.css;
              return !(0, _lodash.isEmpty)(css);
            }).map(function (_ref6) {
              var css = _ref6.css;
              return css;
            }).join('');
            return _context2.abrupt("return", [blockMap, css]);

          case 27:
            _context2.prev = 27;
            _context2.t1 = _context2["catch"](18);
            throwError(_context2.t1);

          case 30:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[4, 12], [18, 27]]);
  }));
  return _render.apply(this, arguments);
}

var throwError = function throwError(error) {
  console.error(error);
  throw new Error(error);
};