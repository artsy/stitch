"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTemplate = isTemplate;
exports.isComponent = isComponent;

var _lodash = require("lodash");

function isTemplate(template) {
  if (!(0, _lodash.isString)(template)) {
    return false;
  }

  var BLACKLIST = ['.js', '.jsx', '.ts', '.tsx'];
  var found = BLACKLIST.some(function (extension) {
    return template.includes(extension);
  });
  return !found;
}

function isComponent(Component) {
  if ((0, _lodash.isFunction)(Component)) {
    return true;
  } else {
    throw new Error('(@artsy/stitch: lib/utils) ' + 'Error rendering layout: Invalid component.');
  }
}