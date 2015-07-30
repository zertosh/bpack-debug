'use strict';

var browserify = require('browserify');
var vm = require('vm');
var test = require('tap').test;

test('bpack-debug', function(t) {

  t.test('default key', function(t) {
    t.plan(2);
    var b = browserify({
      entries: __dirname + '/default/main.js'
    });
    b.bundle(function(err, src) {
      var c = {
        window: {}
      };
      vm.runInNewContext(src, c);
      t.equal(c.window.cat, 'cat');
      t.equal(c.window.dog, 'dog');
    });
  });

  t.test('custom key', function(t) {
    t.plan(2);
    var b = browserify({
      entries: __dirname + '/custom/main.js'
    });
    b.bundle(function(err, src) {
      var c = {
        window: {}
      };
      vm.runInNewContext(src, c);
      t.equal(c.window.cat, 'cat');
      t.equal(c.window.dog, 'dog');
    });
  });

  t.end();
});
