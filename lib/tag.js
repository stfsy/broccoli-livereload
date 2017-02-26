'use strict'

const Document = require('node-html-light').Document
const Node = require('node-html-light').Node
const Text = require('node-html-light').Text

module.exports = (port) => {

    const textNode = Text.fromString([
        'document.write(\'', '<script ',
        'src="http://\' + (location.host || "localhost").split(":")[0] + \':',
        port, '/livereload.js?snipver=1">',
        '<\\/script>\')'].join('')
    )

    return Node.fromString('<script></script>').appendChild(textNode)
}