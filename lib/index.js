'use strict';

// node core modules

// 3rd party modules
const logger = require('oniyi-logger')('oniyi:utils');

// internal modules
const fs = require('./fs');

function safeRequire(what, loader = require) {
  try {
    return loader(what);
  } catch (safeRequireError) {
    logger.debug('failed to load "%s":', what, safeRequireError);
    return false;
  }
}

module.exports = Object.assign({ safeRequire }, fs);
