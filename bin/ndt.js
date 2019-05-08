#!/usr/bin/env node

if (process.env.NODE_ENV === 'develop') {
  require('../src/index.js');
} else {
  require('../lib/index.js');
}
