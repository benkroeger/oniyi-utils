import path from 'path';
import test from 'ava';
import { resolve } from '..';

test('fails if "name" is empty', (t) => {
  const fn = () => {
    resolve({});
  };
  t.throws(fn, TypeError, 'should fail when invoked without name parameter');
});

test('fails if "name" can not be resolved', (t) => {
  const fn = () => {
    resolve({ name: 'does-not-exist' });
  };
  t.throws(fn, Error, 'should fail when invoked without name parameter');
});

test('resolves "debug" module from node_modules', (t) => {
  // eslint-disable-next-line global-require
  const expected = require('debug');

  const result = resolve({ name: 'debug', prefixes: ['prefix-1-'] });
  t.is(result, expected);
});

test('resolves "foo" module from src-dir1', (t) => {
  // eslint-disable-next-line global-require
  const expected = require('./fixtures/src-dir1/foo');

  const paths = ['fixtures/src-dir1', 'fixtures/src-dir2'].map(dir => path.resolve(__dirname, dir));

  const result = resolve({ name: 'foo', paths, prefixes: ['prefix-1-'] });
  t.is(result, expected);
});

test('resolves "bar" module from src-dir2', (t) => {
  // eslint-disable-next-line global-require
  const expected = require('./fixtures/src-dir2/bar');

  const paths = ['fixtures/src-dir1', 'fixtures/src-dir2'].map(dir => path.resolve(__dirname, dir));

  const result = resolve({ name: 'bar', paths, prefixes: ['prefix-1-'] });
  t.is(result, expected);
});

test('resolves "oniyi-logger" module from src-dir1', (t) => {
  // eslint-disable-next-line global-require
  const expected = require('./fixtures/src-dir1/oniyi-logger');

  const paths = ['fixtures/src-dir1', 'fixtures/src-dir2'].map(dir => path.resolve(__dirname, dir));

  const result = resolve({ name: 'oniyi-logger', paths, prefixes: ['prefix-1-'] });
  t.is(result, expected);
});
