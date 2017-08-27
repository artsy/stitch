'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _renderTemplate = require('./renderTemplate');

var _renderTemplate2 = _interopRequireDefault(_renderTemplate);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(block, options) {
    var html, css, _options$basePath, basePath, _options$data, data, _options$locals, locals, _options$templates, templates, config, props, isReact, Component, _require, ServerStyleSheet, sheet;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            html = '';
            css = '';

            if (block) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', { html: html, css: css });

          case 4:
            _options$basePath = options.basePath, basePath = _options$basePath === undefined ? process.cwd() : _options$basePath, _options$data = options.data, data = _options$data === undefined ? {} : _options$data, _options$locals = options.locals, locals = _options$locals === undefined ? {} : _options$locals, _options$templates = options.templates, templates = _options$templates === undefined ? {} : _options$templates;
            config = (0, _extends3.default)({
              componentRenderer: _server2.default.renderToString,
              styledComponents: false
            }, options.config);

            if (!(0, _utils.isTemplate)(block)) {
              _context.next = 12;
              break;
            }

            _context.next = 9;
            return (0, _renderTemplate2.default)(block, {
              basePath: basePath,
              locals: (0, _extends3.default)({}, locals, data, templates)
            });

          case 9:
            html = _context.sent;
            _context.next = 20;
            break;

          case 12:
            if (!(0, _utils.isComponent)(block)) {
              _context.next = 18;
              break;
            }

            props = (0, _extends3.default)({}, data, { locals: locals, templates: templates });
            isReact = config.componentRenderer === _server2.default.renderToString;


            if (isReact) {
              Component = block;


              if (config.styledComponents) {
                _require = require('styled-components'), ServerStyleSheet = _require.ServerStyleSheet;
                sheet = new ServerStyleSheet();


                html = config.componentRenderer(sheet.collectStyles(_react2.default.createElement(Component, props)));

                css = sheet.getStyleTags();
              } else {
                html = config.componentRenderer(_react2.default.createElement(Component, props));
              }
            } else {
              html = config.componentRenderer(block(props));
            }
            _context.next = 20;
            break;

          case 18:
            if (!(process.env.NODE_ENV === 'development')) {
              _context.next = 20;
              break;
            }

            throw new Error('@artsy/stitch: (lib/index) ' + 'Error rendering layout: `block` must be a template, React ' + 'component or string');

          case 20:
            return _context.abrupt('return', { html: html, css: css });

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function renderSwitch(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return renderSwitch;
}();