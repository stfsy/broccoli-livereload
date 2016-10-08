'use strict'

const BroccoliFilter = require('broccoli-filter')

const toBuffer = require('./toBuffer')
const Document = require('node-html-light').Document
const Node = require('node-html-light').Node
const Text = require('node-html-light').Text
const livereload = require('livereload')

class BroccoliLivereload extends BroccoliFilter {

    constructor(inputNodes, options) {
        options.inputEncoding = 'binary'
        options.outputEncoding = 'binary'

        super(inputNodes, options)

        this.options = options

        this._livereloadPort = options.options && options.options.port || 35729
        this._livereload = livereload.createServer(options.options)

        const textNode = Text.fromString([
            'document.write(\'', '<script ',
            'src="http://\' + (location.host || "localhost").split(":")[0] + \':',
            this._livereloadPort, '/livereload.js?snipver=1">',
            '<\\/script>\')'].join('')
        )

        this._scriptTag = Node.fromString('<script></script>').appendChild(textNode)
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