# bpack-debug

A [browserify](https://github.com/substack/node-browserify) helper to save the export value of a module for easier debugging.

It doesn't require changing your build - it works at runtime by simply requiring bpack-debug and running it. It scans the raw source of modules in the module cache for the _alias_ name to export as a docblock directive.

[![Build Status](https://travis-ci.org/zertosh/bpack-debug.svg)](https://travis-ci.org/zertosh/bpack-debug)

## example

```js
// in main.js
require('bpack-debug')(window);
```

```js
/**
 * This is my my-module.js
 * @debugKey app.myModule
 */
module.exports = function(name) {
  console.log('hello ' + name);
}
```

```js
// in the console
app.myModule('andres');
// hello andres
```

## usage

### `bpackRequire(targetObj[, debugKey])`

* `targetObj` is the object to which you want to save the exported modules.
* `debugKey` _(optional)_ the docblock directive for the alias of the module. It can contain periods to denote a deep object.

### `targetObj.bpackDebug(alias)`

bpack-debug lazily loads modules so it doesn't disturb the natural order of your dependency loading. However, if you need to access a module that hasn't been loaded yet, it can be forcefully loaded with this function.

## caveats

* bpack-debug is meant for development use only. The comment directives must exist for it to work. So if you minify the bundle, and remove the comments, it naturally won't work.
* bpack-debug doesn't work across split bundles. Each bundle must load bpack-debug on its own.
