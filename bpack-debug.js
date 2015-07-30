/**
 * This heavily abuses the implementation of browser-pack's prelude.js
 * https://github.com/substack/browser-pack/blob/977dc08/prelude.js
 */
'use strict';

var modules = arguments[4];
var cache = arguments[5];

var docblock = require('./docblock');

module.exports = function(targetObj, debugKey) {
  if (!debugKey) debugKey = 'bpackDebug';

  var debugKeyRe = new RegExp('@' + debugKey);

  // create "id2alias" mapping
  var id2alias = {};
  Object.keys(modules).forEach(function(id) {
    var factoryBody = modules[id][0].toString();

    if (!debugKeyRe.test(factoryBody)) return;

    var docblockStr = docblock.extract(factoryBody);
    var docblockObj = docblock.parseAsObject(docblockStr);
    if (docblockObj[debugKey]) {
      id2alias[docblockObj[debugKey]] = id;
    }
  });

  // add properties to export targetObj
  Object.keys(id2alias).forEach(function(alias) {
    var parts = alias.split('.');

    var initial = parts.slice(0, -1);
    var last = parts.slice(-1);

    var branch = initial.reduce(function(acc, key) {
      acc[key] = acc[key] || {};
      return acc[key];
    }, targetObj);

    var id = id2alias[alias];
    Object.defineProperty(branch, last, {
      get: function() {
        if (cache[id]) {
          return cache[id].exports;
        } else {
          console.info('"%s" has not been loaded yet. try: bpackDebug(\'%s\')', alias, alias);
        }
      }
    });
  });

  // add "bpackDebug" to export targetObj
  Object.defineProperty(targetObj, 'bpackDebug', {
    value: function(alias) {
      var id = id2alias[alias];
      if (id) {
        return cache[id] ? cache[id].exports : require(id);
      } else {
        console.error('No module with "@%s %s" found', debugKey, alias);
      }
    }
  });
};
