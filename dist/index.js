'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderLayout = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var renderLayout = exports.renderLayout = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
    var layout, _options$blocks, blocks, _options$config, config, _options$data, data, _options$locals, locals, _options$templates, templates, _ref2, _ref3, renderedTemplates, _ref4, _ref5, renderedBlocks, css, renderedHtml;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            layout = options.layout, _options$blocks = options.blocks, blocks = _options$blocks === undefined ? {} : _options$blocks, _options$config = options.config, config = _options$config === undefined ? { // eslint-disable-line
              componentRenderer: _server2.default.renderToString,
              engines: {},
              styledComponents: false
            } : _options$config, _options$data = options.data, data = _options$data === undefined ? {} : _options$data, _options$locals = options.locals, locals = _options$locals === undefined ? {} : _options$locals, _options$templates = options.templates, templates = _options$templates === undefined ? {} : _options$templates;

            if (layout) {
              _context.next = 3;
              break;
            }

            throw new Error('(@artsy/stitch: lib/index) ' + 'Error rendering layout: A `layout` file is required.');

          case 3:
            _context.next = 5;
            return (0, _render2.default)(templates, options);

          case 5:
            _ref2 = _context.sent;
            _ref3 = (0, _slicedToArray3.default)(_ref2, 1);
            renderedTemplates = _ref3[0];
            _context.next = 10;
            return (0, _render2.default)(blocks, (0, _extends3.default)({}, options, { templates: renderedTemplates }));

          case 10:
            _ref4 = _context.sent;
            _ref5 = (0, _slicedToArray3.default)(_ref4, 2);
            renderedBlocks = _ref5[0];
            css = _ref5[1];
            _context.next = 16;
            return (0, _render2.default)(layout, (0, _extends3.default)({}, options, {
              locals: (0, _extends3.default)({}, locals, renderedBlocks, {
                css: css,
                data: (0, _extends3.default)({}, data, {
                  templates: renderedTemplates
                })
              })
            }));

          case 16:
            renderedHtml = _context.sent;
            return _context.abrupt('return', renderedHtml);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function renderLayout(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }