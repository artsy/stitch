"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderLayout = renderLayout;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _render = _interopRequireDefault(require("./render"));

function renderLayout(_x) {
  return _renderLayout.apply(this, arguments);
}

function _renderLayout() {
  _renderLayout = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(options) {
    var layout, _options$blocks, blocks, _options$config, config, _options$data, data, _options$locals, locals, _options$templates, templates, _ref, _ref2, renderedTemplates, _ref3, _ref4, renderedBlocks, css, renderedHtml;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            layout = options.layout, _options$blocks = options.blocks, blocks = _options$blocks === void 0 ? {} : _options$blocks, _options$config = options.config, config = _options$config === void 0 ? {
              componentRenderer: _server.default.renderToString,
              engines: {},
              styledComponents: false
            } : _options$config, _options$data = options.data, data = _options$data === void 0 ? {} : _options$data, _options$locals = options.locals, locals = _options$locals === void 0 ? {} : _options$locals, _options$templates = options.templates, templates = _options$templates === void 0 ? {} : _options$templates;

            if (layout) {
              _context.next = 3;
              break;
            }

            throw new Error('(@artsy/stitch: lib/renderLayout) ' + 'Error rendering layout: A `layout` file is required.');

          case 3:
            _context.next = 5;
            return (0, _render.default)(templates, options);

          case 5:
            _ref = _context.sent;
            _ref2 = (0, _slicedToArray2.default)(_ref, 1);
            renderedTemplates = _ref2[0];
            _context.next = 10;
            return (0, _render.default)(blocks, (0, _objectSpread2.default)({}, options, {
              templates: renderedTemplates
            }));

          case 10:
            _ref3 = _context.sent;
            _ref4 = (0, _slicedToArray2.default)(_ref3, 2);
            renderedBlocks = _ref4[0];
            css = _ref4[1];
            _context.next = 16;
            return (0, _render.default)(layout, (0, _objectSpread2.default)({}, options, {
              locals: (0, _objectSpread2.default)({}, locals, renderedBlocks, {
                css: css,
                data: (0, _objectSpread2.default)({}, data, {
                  templates: renderedTemplates
                })
              })
            }));

          case 16:
            renderedHtml = _context.sent;
            return _context.abrupt("return", renderedHtml);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _renderLayout.apply(this, arguments);
}