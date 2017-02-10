'use strict';

// node core modules

// 3rd party modules

// internal modules
const fs = require('./fs');
const moduleLoaders = require('./module-loaders');

function splitString(val, by = /[\s,]{1}/) {
  if (typeof val !== 'string') {
    return val;
  }
  return val.split(by);
}

module.exports = Object.assign({ splitString }, fs, moduleLoaders);
