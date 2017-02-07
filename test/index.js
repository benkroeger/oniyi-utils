'use strict';

import test from 'ava';
import oniyiUtils from '../lib/index.js';

test('awesome:test', t => {
  const message = 'everything is awesome';
  t.is(oniyiUtils('awesome'), message, message);
});
