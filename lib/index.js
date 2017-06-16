'use strict'

const BroccoliFilter = require('broccoli-filter')

const tag = require('./tag')
const Injector = require('./injector')
const Document = require('node-html-light').Document
const livereload = require('livereload')

class BroccoliLivereload extends BroccoliFilter {

    constructor(inputNodes, options) {

        super(inputNodes, options)

        this._building = process.argv.indexOf('build') > 0
        this._serving = process.argv.indexOf('serve') > 0

        this._livereloadPort = options.options && options.options.port || 35729
        this._injector = new Injector(options.target, tag(this._livereloadPort))

        if (this._serving) {
            this._livereload = livereload.createServer(options.options)
        }
    }

    processString(contents, path) {

        if (this._building) {
            return contents
        }

        this._lastRefreshed = path

        const inject = this._injector.matches(path)

        if (inject) {
            return this._injector.inject(contents)
        } else {
            return contents
        }
    }

    build() {

        return super.build().then(() => {

            this._serving && this._livereload.filterRefresh(this._lastRefreshed)
        })
    }
}

module.exports = BroccoliLivereload
