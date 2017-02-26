'use strict'

const Document = require('node-html-light').Document
const toBuffer = require('./toBuffer')

class Injector {

    constructor(targets, tag) {
        this._targets = targets
        this._tag = tag
    }

    matches(path) {
        return path.match(this._targets)
    }

    inject(contents) {
        const document = Document.fromString(contents.toString('utf-8'))
        document.head().appendChild(this._tag)

        return toBuffer(document.toHtml() + '')
    }
}

module.exports = Injector