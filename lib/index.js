'use strict'

const BroccoliFilter = require('broccoli-filter')

const toBuffer = require('./toBuffer')
const tag = require('./tag')
const Document = require('node-html-light').Document
const livereload = require('livereload')

class BroccoliLivereload extends BroccoliFilter {

    constructor(inputNodes, options) {
        options.inputEncoding = 'binary'
        options.outputEncoding = 'binary'

        super(inputNodes, options)

        this.options = options

        this._livereloadPort = options.options && options.options.port || 35729
        this._livereload = livereload.createServer(options.options)
        this._scriptTag = tag(this._livereloadPort)
    }

    processString(contents, path) {
        this._lastRefreshed = path

        const found = path.match(this.options.target)

        if (found) {

            const document = Document.fromString(contents.toString('utf-8'))
            document.head().appendChild(this._scriptTag)

            return toBuffer(document.toHtml() + '')

        } else {

            return contents
        }
    }

    build() {

        return super.build().then(() => {

            this._livereload.filterRefresh(this._lastRefreshed)
        })
    }
}

module.exports = BroccoliLivereload