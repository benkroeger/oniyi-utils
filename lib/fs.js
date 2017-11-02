'use strict';

// node core modules
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// 3rd party modules
const debug = require('debug')('oniyi:utils:fs');

// internal modules

const excludedExtensions = ['.json', '.node'];

function isPreferredExtension(filename) {
  const includeExtensions = Object.keys(require.extensions);

  const ext = path.extname(filename);
  return includeExtensions.includes(ext) && !excludedExtensions.includes(ext);
}

// directory operations
function isDirectory(checkPath) {
  try {
    const stats = fs.statSync(checkPath);
    return stats && stats.isDirectory();
  } catch (isDirectoryError) {
    debug('got an exception when checking if "%s" is a directory', checkPath, isDirectoryError);
    return false;
  }
}

function safeReaddir(...args) {
  try {
    return fs.readdirSync(...args);
  } catch (tryReadDirError) {
    debug('failed to `fs.readdirSync()` with args %j', args, tryReadDirError);
    return [];
  }
}

function firstExistingDir(directories) {
  if (!Array.isArray(directories)) {
    throw new TypeError('"directories" must be of type "array"');
  }

  const existingDirectories = directories.filter(isDirectory);

  if (existingDirectories.length < 1) {
    throw new Error('none of the provided directories actually exists %j', directories);
  }

  return existingDirectories[0];
}

function findScripts(dir) {
  assert(dir, 'cannot require directory contents without directory name');

  const files = safeReaddir(dir)
    // sort files in lowercase alpha for linux
    .sort((A, B) => {
      const a = A.toLowerCase();
      const b = B.toLowerCase();

      if (a < b) {
        return -1;
      } else if (b < a) {
        return 1;
      }
      return 0;
    })
    // ignore index.js and files prefixed with underscore
    .filter(filename => filename !== 'index.js' && filename[0] !== '_')
    // ignore sub-directories
    .filter(filename => isDirectory(path.resolve(path.join(dir, filename))))
    // ignore unpreferred extensions
    .filter((filename) => {
      const filepath = path.resolve(path.join(dir, filename));
      const stats = fs.statSync(filepath);

      return stats.isFile() && isPreferredExtension(filename);
    });

  return files;
}

module.exports = {
  isDirectory,
  safeReaddir,
  findScripts,
  firstExistingDir,
};
