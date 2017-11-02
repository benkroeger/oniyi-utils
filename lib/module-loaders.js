'use strict';

// node core modules
const path = require('path');

// 3rd party modules
const union = require('lodash.union');
const debug = require('debug')('oniyi:utils:resolver');

// internal modules

function tryLoad(what, loader = require) {
  try {
    return loader(what);
  } catch (safeRequireError) {
    debug('tryLoad(): failed to load "%s"; reason:', what, safeRequireError.message);
    return undefined;
  }
}
Object.assign(exports, { tryLoad, safeRequire: tryLoad });

function resolve({
  name, prefixes = [], paths = [], loader = require,
} = {}) {
  if (!name) {
    throw new TypeError('{{ params.name }} must be a non-empty string');
  }

  debug('resolve(): invoked with params %j', { name, prefixes, paths });

  // compile list of name candidates from prefixes (if any)
  const nameCandidates = union([name], prefixes.map(prefix => `${prefix}${name}`));
  debug('resolve(): compiled {{ nameCandidates }} %j', nameCandidates);

  const resolveCandidates = paths.map(resolvePath =>
    nameCandidates.map(nameCandidate => path.resolve(resolvePath, nameCandidate)));
  debug('resolve(): compiled {{ resolveCandidates }} %j', resolveCandidates);

  const candidates = union(...resolveCandidates, nameCandidates);
  debug('resolve(): compiled {{ candidates }} %j', candidates);

  const resolved = candidates.find((candidate) => {
    debug('resolve(): trying loader with candidate "%s"', candidate);
    return tryLoad(candidate, loader) !== undefined;
  });

  if (!resolved) {
    throw new Error(`Failed to resolve module "${name}"`);
  }

  debug('resolve(): resolved "%s" to "%s", invoking loader...', name, resolved);
  return loader(resolved);
}
Object.assign(exports, { resolve });
