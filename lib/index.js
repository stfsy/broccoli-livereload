'use strict'

const BroccoliFilter = require('broccoli-filter')

const tag = require('./tag')
const Injector = require('./injector')
const livereload = require('livereload')

class BroccoliLivereload extends BroccoliFilter {

    constructor(inputNodes, options) {
        super(inputNodes, options)

        this.inputEncoding = null
        this.outputEncoding = null

        this._building = process.argv.indexOf('build') > 0
        this._serving = process.argv.indexOf('serve') > 0
        this._processedFiles = {},
        this._changedFiles = [],

        options.options = options.options || {}
        options.options.port = options.options.port || 35729
        options.options.delay = options.options.delay || 100 // debounce changes

        this._livereloadPort = options.options.port
        this._injector = new Injector(options.target, tag(this._livereloadPort))

        if (this._serving) {
            this._livereload = livereload.createServer(options.options)
        }
    }

    processString(contents, path) {

        if (this._building) {
            return contents
        }

        // Check if file contents has changed from previous build
        if (this._serving) {
            if (this._processedFiles[path] && !this._processedFiles[path].equals(contents)) {
                this._changedFiles.push(path)
            }
            
            // Cache content
            this._processedFiles[path] = contents
        }

        const inject = this._injector.matches(path)

        if (inject) {
            return this._injector.inject(contents)
        } else {
            return contents
        }
    }

    build() {
        return super.build().then(() => {
            if (!this._serving || !this._livereload) {
                return
            }

            this._changedFiles.forEach(file => {
                this._livereload.filterRefresh(file)
            })

            this._changedFiles = [];
        })
    }
}

module.exports = BroccoliLivereload
