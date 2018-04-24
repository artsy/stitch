"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.middleware = middleware;

var _componentRenderer2 = require("./componentRenderer");

function middleware(modules) {
  return function (_req, res, next) {
    var renderQueue = [];

    var _componentRenderer = (0, _componentRenderer2.componentRenderer)({
      mode: 'server',
      modules: modules,
      serialize: function serialize(component) {
        renderQueue.push(component);
      }
    }),
        components = _componentRenderer.components;

    res.locals.stitch = {
      components: components
    };
    res.locals.sharify.data.stitch = {
      renderQueue: renderQueue
    };
    next();
  };
}