# Broccoli Livereload Plugin

[![Build Status](https://travis-ci.org/stfsy/broccoli-livereload.svg)](https://travis-ci.org/stfsy/broccoli-livereload)
[![Dependency Status](https://img.shields.io/david/stfsy/broccoli-livereload.svg)](https://github.com/stfsy/broccoli-livereload/blob/master/package.json)
[![DevDependency Status](https://img.shields.io/david/dev/stfsy/broccoli-livereload.svg)](https://github.com/stfsy/broccoli-livereload/blob/master/package.json)
[![Npm downloads](https://img.shields.io/npm/dm/broccoli-livereload.svg)](https://www.npmjs.com/package/broccoli-livereload)
[![Npm Version](https://img.shields.io/npm/v/broccoli-livereload.svg)](https://www.npmjs.com/package/broccoli-livereload)
[![Git tag](https://img.shields.io/github/tag/stfsy/broccoli-livereload.svg)](https://github.com/stfsy/broccoli-livereload/releases)
[![Github issues](https://img.shields.io/github/issues/stfsy/broccoli-livereload.svg)](https://github.com/stfsy/broccoli-livereload/issues)
[![License](https://img.shields.io/npm/l/broccoli-livereload.svg)](https://github.com/stfsy/broccoli-livereload/blob/master/LICENSE)

Broccoli plugin for adding livereload capabilities.

This plugin will inject the livereload script into the target html file and open a port to notify the script about changes. The plugin will **not** create a separate watcher. It relies on BroccoliJs's built in watcher and BroccoliFilter's caching functionality.

In case you only want to inject a livereload script you could use [Dremora's](https://github.com/Dremora) [broccoli-inject-livereload](https://github.com/Dremora/broccoli-inject-livereload) 

## Example using a single html target 
```js
const BroccoliLivereload = require('broccoli-livereload')

const reloadable = new BroccoliLivereload('app', {
    target: 'index.html'
})

module.exports = reloadable
```

## Example using a regular expression to target multiple html files
```js
const BroccoliLivereload = require('broccoli-livereload')

const reloadable = new BroccoliLivereload('app', {
    target: /^[a-zA-Z._-]+.html$/
})

module.exports = reloadable
```

## Example using a costum port

```js
const BroccoliLivereload = require('broccoli-livereload')

const reloadable = new BroccoliLivereload('app', {
    target: 'index.html', 
    options: {
        port: 12345
    }
})

module.exports = reloadable
```

## Installation

```js
npm install broccoli-livereload --save-dev
```

## License

This project is distributed under the MIT license.