"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderSwitch;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _renderTemplate = _interopRequireDefault(require("./renderTemplate"));

var _utils = require("./utils");

function renderSwitch(_x, _x2) {
  return _renderSwitch.apply(this, arguments);
}

function _renderSwitch() {
  _renderSwitch = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(block, options) {
    var html, css, _options$basePath, basePath, _options$data, data, _options$locals, locals, _options$templates, templates, config, props, isReact, Component, _require, ServerStyleSheet, sheet;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            html = '';
            css = '';

            if (block) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", {
              html: html,
              css: css
            });

          case 4:
            _options$basePath = options.basePath, basePath = _options$basePath === void 0 ? process.cwd() : _options$basePath, _options$data = options.data, data = _options$data === void 0 ? {} : _options$data, _options$locals = options.locals, locals = _options$locals === void 0 ? {} : _options$locals, _options$templates = options.templates, templates = _options$templates === void 0 ? {} : _options$templates;
            config = (0, _extends2.default)({
              componentRenderer: _server.default.renderToString,
              styledComponents: false
            }, options.config);

            if (!(0, _utils.isTemplate)(block)) {
              _context.next = 12;
              break;
            }

            _context.next = 9;
            return (0, _renderTemplate.default)(block, {
              basePath: basePath,
              locals: (0, _extends2.default)({}, locals, data, templates)
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

            props = (0, _extends2.default)({}, data, {
              locals: locals,
              templates: templates
            });
            isReact = config.componentRenderer === _server.default.renderToString;

            if (isReact) {
              Component = block;

              if (config.styledComponents) {
                _require = require('styled-components'), ServerStyleSheet = _require.ServerStyleSheet;
                sheet = new ServerStyleSheet();
                html = config.componentRenderer(sheet.collectStyles(_react.default.createElement(Component, props)));
                css = sheet.getStyleTags();
              } else {
                html = config.componentRenderer(_react.default.createElement(Component, props));
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
            return _context.abrupt("return", {
              html: html,
              css: css
            });

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _renderSwitch.apply(this, arguments);
}